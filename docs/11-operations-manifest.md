# Operations: the journey manifest (OPS-03, re-scoped)

**Status:** design accepted 2026-10-30 (ADR-019). Implementation plan in §9.
**Owner:** Operations (today: Fabienne, the single admin). Built so a later Ops role can use it unchanged.

---

## 1. Summary (SCQA)

**Situation.** The PRD specifies OPS-03 as a *daily manifest per slot* (participants, contact details, notes; CSV/PDF) inside a custom Studio "Bookings" tool (OPS-01, ADR-010) that reads Postgres bookings written by Stripe webhooks. It sits in Phase 4.

**Complication.**
1. Nothing of it exists. There is no Bookings tool, no `/api/studio/*`, no Postgres, and the ADR-010 identity spike has not run.
2. ADR-016 changed the client. Baltique is one person selling bespoke multi-day journeys and hunting trips through personal enquiry. There are no slots, no capacity and no online payments, so "today's slot list" answers a question this business never asks.
3. Phase 4 is gated by Q-B6 (🔴 P1, "to confirm"). CLAUDE.md forbids building on it.

**Question.** What does Operations actually need from a manifest, and how do we ship it now, without the booking engine, in a way that stays valid whichever way Q-B6 is answered?

**Answer.** Treat the manifest as a **per-journey operations sheet**, not a per-slot list. A `trip` document in Sanity (same pattern as enquiries, ADR-017) holds who, when, where, with whom and which paperwork. The Studio gets an **Operations** menu (Departing soon, Upcoming, Past), a one-click **Create journey from this enquiry** action, and a **Manifest** tab on every journey that is print-ready (PDF through the browser) and exports travellers to CSV. The sheet renders a plain `Manifest` model, so a future slot-based manifest over Postgres bookings reuses the same sheet with a different source.

---

## 2. Review of the current setup

| Aspect | As specified today (05 §6.9, 06 §4/§6, 08 §3) | Assessment |
|---|---|---|
| Unit of work | One manifest per **slot** per day | Wrong unit for Baltique. The operator's unit is a **journey**: 3 to 10 days, one party, several suppliers. |
| Data source | Postgres `booking` rows created by Stripe webhooks | Does not exist and is blocked by Q-B6. Also forces a second system of record for a business that keeps everything in one head. |
| Where it lives | Custom Studio tool calling `/api/studio/*` with server-side role checks | Needs the ADR-010 spike, route handlers, auth middleware. Heavy for a solo operator; nothing here needs a server. |
| Content | Participants, contact details, notes | Too thin for multi-day travel: no itinerary, no supplier contacts, no paperwork status (hunting licences, insurance), no "is it ready?" signal. |
| Export | CSV / PDF | Keep both. Server-rendered PDF is unnecessary: a print-styled sheet and the browser's "Save as PDF" cost nothing and work offline. |
| Guardrails | Role-based; Ops cancels and refunds | Refunds do not apply (no payments). What matters here is **PII containment** (nothing from a journey may reach the website) and a **delete guard** on upcoming journeys. |
| Intuitiveness | "Manifest" assumed to mean "today's list" | The operator's real question is *"what departs next, and is it ready?"*. The design starts from that question. |
| Mobile (Q-D2) | Open question | The sheet is responsive and shares as PDF or plain text over WhatsApp, the agency's channel (Q-D5). No app needed. |

---

## 3. Jobs to be done

| # | The operator wants to… | So the Studio must… |
|---|---|---|
| J1 | See what departs in the coming weeks and whether each journey is ready | Show **Departing soon** with a readiness summary per journey |
| J2 | Turn a won enquiry into a journey without retyping | Offer **Create journey** on the enquiry, prefilled |
| J3 | Keep everything about one journey in one place | Give the `trip` document travellers, itinerary, suppliers, checklist, notes |
| J4 | Hand the lodge, guide or driver a clean sheet | Render a **Manifest** tab: print / PDF, CSV, WhatsApp text, with internal notes switchable off |
| J5 | Never lose the trail | Link back to the enquiry; Sanity history covers undo |

---

## 4. Required key features (MECE)

**A. Journey record** (data, §5)
A1 One `trip` document per journey with lead contact, travellers, day-by-day itinerary, supplier contacts, checklist, internal notes.
A2 Plain-language titles and descriptions on every field; validation on dates and required fields.
A3 Hunting trips show paperwork fields (licence, insurance) per traveller; other journeys don't.

**B. Operations lists** (find, §6.1)
B1 Menu **Operations** with: Departing soon (next 30 days), Upcoming journeys, Past journeys, All journeys.
B2 Lists sorted by departure date; each row shows title, dates, status.

**C. Manifest sheet** (output, §7)
C1 A **Manifest** tab on every journey, next to the edit form.
C2 Print / Save as PDF (A4, clean, no Studio chrome).
C3 Download travellers as CSV (opens cleanly in Excel).
C4 Copy a plain-text summary for WhatsApp.
C5 Toggle "Include internal notes" (default on in the Studio; the operator turns it off before printing a copy for a supplier).

**D. Readiness checks** (confidence, §8)
D1 A computed list of issues at the top of the sheet, with a one-line "Ready" state when empty.
D2 Rules are pure functions, unit-tested, no network.

**E. Flow from enquiry** (speed, §6.2)
E1 "Create journey" on an enquiry creates a draft journey prefilled from the enquiry and opens it.
E2 When a journey already exists for the enquiry, the action becomes "Open journey".

**F. Guardrails** (safety, §6.3)
F1 Deleting a journey that departs in the future asks for confirmation and shows the impact (dates, number of travellers), suggesting "Cancelled" status instead.
F2 Journey and enquiry data are never queried by the website.
F3 PII kept to what a supplier needs: no passport numbers, no dates of birth. Document status is a yes/no.

**G. Help** (adoption, §10)
G1 Handbook guides: "Create a journey from an enquiry" and "Prepare and print a journey manifest".

---

## 5. Data model: `trip` ("Journey")

Document type `trip`, Studio title **Journey**, icon `ClipboardIcon`. Creatable from "+". Never rendered on the site.

| Field | Type | Title / description (as shown) | Validation |
|---|---|---|---|
| `title` | string | **Journey name**. "A name you'll recognise, e.g. *Jansen family — autumn in Vidzeme*." | required, ≤ 80 |
| `status` | string, radio | **Status**: Planned · Confirmed · Completed · Cancelled | required, initial `planned` |
| `kind` | string, radio | **Kind of journey**: Bespoke journey · Hunting trip. "Hunting trips show licence and insurance fields for each traveller." | required, initial `journey` |
| `tripType` | string | **Trip type (from the enquiry)**, e.g. "Nature & hiking" | ≤ 60 |
| `startDate` | date | **First day** | required |
| `endDate` | date | **Last day** | required; must be on or after First day |
| `enquiry` | reference → `enquiry`, weak | **Enquiry**. "The enquiry this journey came from." | |
| `lead` | object | **Lead traveller / contact**: `name` (required), `email`, `phone` | |
| `travellers` | array of `traveller` | **Travellers** | ≥ 1 when status is Confirmed |
| `itinerary` | array of `itineraryDay` | **Day by day** | |
| `checklist` | array of `checkItem` | **Checklist** | initial items, see below |
| `internalNotes` | text | **Internal notes**. "For you only. Never shown to travellers; left out of the supplier version of the manifest." | |

Objects:

- `traveller`: `fullName` (required, ≤ 80) · `ageGroup` (Adult · Child, initial Adult) · `dietary` (string, "Vegetarian, allergies…") · `medical` (string, "Only what a guide must know") · `notes` (string) · `huntingLicence` (boolean, "Licence received", hidden unless the journey kind is Hunting trip) · `insurance` (boolean, "Hunting insurance received", same). Preview: name · age group · flags.
- `itineraryDay`: `date` (date, required) · `location` (string, required, ≤ 80) · `programme` (text, 3 rows) · `contactName` (string, "Lodge, guide, driver…") · `contactPhone` (string). Preview: date · location.
- `checkItem`: `label` (string, required, ≤ 80) · `done` (boolean). Preview: ✓/○ label.

Initial checklist: Deposit received · Balance received · Accommodation confirmed · Transport confirmed · Travel insurance confirmed.

Preview: title; subtitle `14 Oct – 19 Oct 2027 · Confirmed`. Orderings: First day (soonest first), First day (latest first).

Dates are **calendar dates** (`YYYY-MM-DD`), not instants. "Today" is the Riga calendar day from `rigaDateKey()` in `src/lib/dates.ts`.

---

## 6. Studio

### 6.1 Menu

`sanity/structure.ts`, after **Enquiries**:

```
📋 Operations
   ├─ Departing soon        startDate in [today, today+30], status ≠ cancelled, soonest first
   ├─ Upcoming journeys     startDate ≥ today, soonest first
   ├─ Past journeys         endDate < today, latest first
   └─ All journeys
```

`today` is computed once when the structure resolves (a Studio tab open across midnight shows yesterday's lists until reload; acceptable, documented in the help guide).

The `trip` document node has two views: **Edit** (form) and **Manifest** (`S.view.component(ManifestView)`), via `defaultDocumentNode`.

### 6.2 Enquiry → journey

Document action **Create journey** on `enquiry` (`sanity/actions/createJourney.tsx`):

- Looks up `*[_type == "trip" && enquiry._ref == $id][0]._id` (published or draft).
- If found: label **Open journey**, navigates to it.
- Else: creates `drafts.<uuid>` of type `trip` with: `title` = `"<name> — <tripType or 'journey'>"`, `kind` = `hunting` when the trip type contains "hunt" (case-insensitive) else `journey`, `tripType`, `lead` from name/email/phone, `travellers` = `[lead as Adult]`, `enquiry` = weak reference, `internalNotes` = `"Travel period: <period>\n\nWishes:\n<wishes>"`, `status` = `planned`, default checklist. Then navigates to the new draft with the edit intent.
- The enquiry's status is **not** changed (Booked is the operator's call).

### 6.3 Delete guard

For `trip`, wrap the delete action: when `status ≠ cancelled` and `startDate ≥ today`, `onHandle` opens a confirm dialog: *"This journey departs on 14 Oct 2027 with 4 travellers. Delete it anyway? Setting the status to Cancelled keeps the record."* with **Delete** and **Keep**. Otherwise delete behaves as usual.

---

## 7. Manifest sheet

`sanity/tools/operations/ManifestView.tsx` (Studio view pane, uses `@sanity/ui` for the toolbar only) renders `ManifestSheet` (`sanity/tools/operations/ManifestSheet.tsx`, **plain React, no Studio dependencies**, styles in a CSS string so it works inside the Studio and in a standalone print window).

Toolbar: **Print / Save as PDF** · **Download travellers (CSV)** · **Copy for WhatsApp** · switch **Include internal notes** (default on).

Sheet, top to bottom:

1. **Header**: journey name · kind badge · `Mon 14 Oct – Sat 19 Oct 2027 (6 days)` · status.
2. **Readiness**: green "Ready to go" or an amber list of issues (hidden when internal notes are off, since suppliers don't need it).
3. **Lead contact**: name · phone · email.
4. **Travellers** table: #, Name, Adult/Child, Dietary, Medical, Notes, and for hunting trips Licence ✓/–, Insurance ✓/–. Empty state: "No travellers yet. Add them in the Edit tab."
5. **Day by day** table: Date (weekday + date), Location, Programme, Contact (name, phone). Days are sorted by date. Dates inside the journey without an itinerary entry are listed as "(no plan yet)" rows.
6. **Checklist**: done and open items.
7. **Internal notes** (only when the switch is on).
8. Footer: "Printed <date> · <site name> · page N" (print only).

Print: `@page { size: A4; margin: 14mm }`, no colours needed to read, tables don't split rows across pages (`break-inside: avoid`). Print opens a new window with the static markup of `ManifestSheet` and calls `print()`; the Studio itself is never printed.

The view renders `props.displayed` (the draft when there is one). When draft and published differ it shows a muted line "Showing unsaved changes".

---

## 8. Domain module `src/modules/operations/manifest.ts`

Pure TypeScript, unit-tested in `tests/unit/manifest.test.ts`. No Sanity, React or network imports.

```ts
export type TripKind = "journey" | "hunting";
export type TripStatus = "planned" | "confirmed" | "completed" | "cancelled";
export type Traveller = { fullName: string; ageGroup: "adult" | "child"; dietary?: string; medical?: string; notes?: string; huntingLicence?: boolean; insurance?: boolean };
export type ItineraryDay = { date: string; location: string; programme?: string; contactName?: string; contactPhone?: string };
export type CheckItem = { label: string; done: boolean };
export type Manifest = { id: string; title: string; kind: TripKind; status: TripStatus; tripType?: string; startDate: string; endDate: string; lead: { name: string; email?: string; phone?: string }; travellers: Traveller[]; itinerary: ItineraryDay[]; checklist: CheckItem[]; internalNotes?: string };
export type ReadinessIssue = { code: string; message: string };

export function toManifest(doc: unknown): Manifest            // tolerant of partial Sanity docs; sorts itinerary; defaults arrays
export function tripDays(startDate: string, endDate: string): string[]
export function formatDateRange(startDate: string, endDate: string, locale?: string): string   // "Mon 14 Oct – Sat 19 Oct 2027 (6 days)"
export function readiness(m: Manifest, today: string): ReadinessIssue[]
export function travellersCsv(m: Manifest): string             // UTF-8 BOM, RFC 4180 quoting, CRLF
export function whatsappSummary(m: Manifest): string
```

Readiness rules (each one a test):

| code | when | message |
|---|---|---|
| `no-travellers` | travellers empty | "No travellers added" |
| `no-lead-phone` | lead.phone empty | "No phone number for the lead traveller" |
| `still-planned` | status planned and startDate ≤ today+14 | "Departs within two weeks but is still marked Planned" |
| `itinerary-gaps` | days in range without an itinerary entry | "No plan yet for: 15 Oct, 16 Oct" |
| `open-checklist` | any checklist item not done | "3 checklist items open: Deposit received, …" |
| `hunting-licence` | kind hunting and a traveller without `huntingLicence` | "Hunting licence missing for: Jan Jansen" |
| `hunting-insurance` | kind hunting and a traveller without `insurance` | "Hunting insurance missing for: …" |
| `mark-completed` | status confirmed and endDate < today | "Journey is over: mark it Completed" |

Cancelled journeys return no issues. Order: as listed.

---

## 9. Implementation plan (one PR, atomic commits, requirement IDs in messages)

1. `OPS-03` Domain module + tests: `src/modules/operations/manifest.ts`, `tests/unit/manifest.test.ts`.
2. `OPS-03` Schema: `sanity/schemaTypes/documents/trip.ts` (+ objects), register in `schemaTypes/index.ts`; regenerate `sanity/schema.json` (`pnpm sanity:typegen`).
3. `OPS-03` Sheet + view: `sanity/tools/operations/ManifestSheet.tsx`, `ManifestView.tsx`, print/CSV/WhatsApp helpers; render test `tests/unit/manifest-sheet.test.tsx` (`renderToStaticMarkup`).
4. `OPS-03` Structure: Operations menu, `defaultDocumentNode` with the Manifest view; `sanity.config.ts` wiring.
5. `OPS-03` Actions: `createJourney` on enquiry; delete guard on trip.
6. `OPS-03, MKT-18` Help guides T19 (add the Create journey step), T24; docs: 05 (OPS-03 note), 06 (ADR-019), 08 (§3 menu, §4 T24, §9 test 17), `.planning/REQUIREMENTS.md`, `.planning/STATE.md`.

Definition of done: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm format:check`, `pnpm sanity:validate` all pass; no `any`; every new field has title, description where not obvious, and validation; nothing from `trip` or `enquiry` is fetched by site queries.

---

## 10. Handbook (sanity/help/guides.ts)

- **T19 Handle a new enquiry**: add step "When the trip is going ahead, click *Create journey* in the document menu (⋮). The journey opens prefilled."
- **T24 Prepare and print a journey manifest**: Open Operations → Departing soon → the journey. Fill in Travellers, Day by day and the Checklist; the Manifest tab shows what is still missing. Switch off *Include internal notes* before printing for a lodge or guide. Click *Print / Save as PDF*; *Copy for WhatsApp* gives a text version. Tip: lists refresh when you reload the Studio.

---

## 11. Later, not now

- **Slot manifests** if Q-B6 brings a booking engine: new `toManifest` source over Postgres bookings; same sheet, same readiness contract.
- **Email the sheet from the Studio** and a dashboard widget "Departing soon" (MKT-15): both wait for the ADR-010 identity spike.
- **Ops role** separation (Q-F1): grant `trip` and `enquiry` to Ops, nothing else.
- **Retention** job for past journeys (NFR-05).
