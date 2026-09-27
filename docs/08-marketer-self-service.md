# Marketer Self-Service & Maintenance Model

| | |
|---|---|
| **Status** | DRAFT v0.1 |
| **Date** | 2026-09-27 |
| **Requirements** | `MKT-01…21`, `NFR-11` in [05-prd.md](./05-prd.md) |
| **Decisions** | ADR-010…015 in [06-architecture.md](./06-architecture.md#13-architecture-decision-records) |

---

## 1. Summary (SCQA)

**Situation.** A non-technical marketer will run the website day to day. They may also handle bookings.

**Complication.** Headless stacks spread control across five tools (Sanity, Shopify, Stripe, Vercel, GitHub). In most headless builds, marketers end up filing developer tickets for routine work: a new landing page, a promo code, a redirect, a tracking pixel, a blackout date. The site then stalls, or it breaks when someone improvises.

**Question.** How does one non-technical person manage *and* keep the platform healthy without a developer on call?

**Answer.** Four design rules:

1. **One workspace.** Sanity Studio is the marketer's home for all content, campaigns, availability, promotions, SEO and settings, plus a Bookings view. Shopify admin covers shop products and orders only.
2. **Guardrails, not permissions to break things.** Structured blocks instead of HTML. Validation, previews, scheduled releases, restore buttons and booking-safe rules.
3. **Technical maintenance runs itself.** Automated updates, tests, monitoring, backups and one-click rollback. Anything beyond that goes through a plain-language change-request pipeline and a support retainer.
4. **Proof before launch.** The marketer passes a 20-task **autonomy test** unaided at UAT (§9). It is a launch gate.

> **Rule of thumb:** if the marketer can see it on the website, the marketer can change it safely, without a developer and without a deploy.

---

## 2. Who does what

| Role | Who | Works in | Can | Cannot |
|---|---|---|---|---|
| **Marketer** (primary) | Client, non-technical | Sanity Studio, Shopify admin, GTM, GA4 | All content, pages, campaigns, promotions, SEO, redirects, navigation, email copy, availability & prices, tracking tags | Change schemas/code, payment settings, delete items with bookings |
| **Operations** (may be the same person) | Client | Studio → Bookings | View bookings and manifests, manual bookings, cancel/refund within policy | Change prices or schedules (unless also Marketer) |
| **Translator** | Client or freelancer | Studio | Edit translations only | Publish base-language changes |
| **Admin / finance** | Client owner | Studio, Shopify, Stripe | Manage users/roles, payment and tax settings, payouts | n/a |
| **Maintainer** | Agency / developer (retainer) | GitHub, Vercel, Claude Code | New blocks, integrations, schema changes, incidents | Content decisions |

---

## 3. The marketer's workspace (Sanity Studio)

The Studio is at `/studio`, with Google or Microsoft single sign-on. Menus are organised by **task**, not by data type:

```
🏠 Dashboard          KPIs (bookings, revenue, inquiries, top pages), to-do list (missing translations, SEO warnings)
🌐 Website
   ├─ Home page
   ├─ Landing pages        (page builder: campaigns, SEO pages)
   ├─ Destinations & places
   ├─ Guides (blog)
   └─ Other pages          (About, FAQ, Legal)
🧭 Experiences
   ├─ Experiences          (content, options, prices)
   ├─ Availability         (schedules, capacity, blackout dates, seasonal prices)
   └─ Cancellation policies
📣 Campaigns
   ├─ Releases             (bundle & schedule changes, e.g. "Summer 2027")
   ├─ Promo codes
   ├─ Announcement bar
   └─ Forms                (newsletter, lead forms)
🛍️ Shop merchandising     (Shopify products synced read-only + story fields)
📧 Emails                 (confirmation, reminder, cancellation, inquiry copy per language)
🔎 SEO & redirects        (redirects, default SEO, sitemap exclusions)
⚙️ Settings               (navigation, footer, contact details, social, cookie banner text, UI labels)
📋 Bookings               (custom tool: bookings list, today's manifest, inquiries)
❓ Help                   (how-to guides, videos, "Request a change", support contact)
```

**Visual editing (Presentation tool):** the marketer browses the real site inside the Studio, clicks any text or image to edit it, and previews on mobile, tablet and desktop before publishing.

---

## 4. Task matrix: routine work, where it happens, what protects it

| # | Task | Where | Guardrails |
|---|---|---|---|
| T1 | Change home page hero / sections | Studio → Presentation | Block variants limited to the design system; image size and alt text required |
| T2 | Build a campaign landing page | Studio → Landing pages → "New from template" | Templates pre-filled; SEO fields required; preview link |
| T3 | Publish a guide / blog post | Studio → Guides | Required fields, reading-time and SEO checks |
| T4 | Add a new experience | Studio → Experiences | Can't publish without price, meeting point, policy and images |
| T5 | Change a price | Studio → Experiences → Options | Existing bookings keep their price (snapshot); change log |
| T6 | Add dates / change capacity | Studio → Availability | Can't reduce capacity below seats already booked; warning on conflicts |
| T7 | Block a date (holiday, weather) | Studio → Availability → Blackout | Existing bookings on that date are listed with a "notify & refund" option |
| T8 | Create a promo code | Studio → Promo codes | Validity window, usage limit, scope; server validates at checkout |
| T9 | Schedule a seasonal campaign | Studio → Releases | Preview the whole release; scheduled go-live and roll-back |
| T10 | Show an announcement bar | Studio → Announcement bar | Start/end dates; max length |
| T11 | Edit menu / footer | Studio → Settings | Link picker (no broken internal links) |
| T12 | Add a redirect | Studio → SEO & redirects | Loop and duplicate detection; slug changes auto-create redirects |
| T13 | Edit SEO title / description / social image | Any document → SEO tab | Character counters; Google and social preview |
| T14 | Translate a page | Studio → document → Translate (AI Assist) → review | Missing-translation warnings; translator role |
| T15 | Edit booking confirmation email text | Studio → Emails | Layout locked; merge tags picked from a list; send-test button |
| T16 | Add a tracking pixel (Meta, LinkedIn, TikTok) | Google Tag Manager | Consent Mode v2 enforced; performance budget; quarterly tag audit |
| T17 | Feature shop products in a guide | Studio → guide → Product rail block | Product picker from synced Shopify catalogue |
| T18 | Add or edit a shop product | Shopify admin | Standard Shopify validation; auto-syncs to the site |
| T19 | View today's bookings / print manifest | Studio → Bookings | Read-only for the Marketer role unless Ops |
| T20 | Cancel & refund a booking | Studio → Bookings | Policy-based refund suggested; confirmation step; audit log |
| T21 | Undo a mistake | Any document → History → Restore | Full revision history |
| T22 | Check performance | Studio → Dashboard (or GA4 / Looker Studio link) | Read-only |
| T23 | Request a new feature or fix | Studio → Help → "Request a change" | Goes to the maintainer pipeline (§7) |

---

## 5. Page builder: block library

Pages are built from a curated set of blocks. Each block has a thumbnail, a one-line description, sensible defaults and design-system-locked variants (no free colours, fonts or HTML).

| Block | Variants | Typical use |
|---|---|---|
| Hero | image · video · split · minimal | Top of any page |
| Rich text | 1 col · 2 col | Body copy |
| Experience grid / carousel | manual pick · auto by region/type/tag | Merchandising |
| Destination cards | grid · map | Regions & places |
| Product rail | manual · Shopify collection | Shop cross-sell |
| Call-to-action band | booking · tailor-made · newsletter | Conversion |
| Image gallery | grid · slider | Storytelling |
| Quote / testimonial | single · carousel | Trust |
| FAQ | accordion | SEO + support |
| Stats / USPs | 3 · 4 items | Trust |
| Map | places · route | Trips, destinations |
| Form | newsletter · lead · tailor-made | Lead capture |
| Video | embedded (consent-aware) | Storytelling |
| Countdown / deal | date-bound | Campaigns |
| Spacer / divider | small · medium · large | Layout rhythm |

**Templates** (pre-filled block stacks): Campaign landing, Seasonal guide, Region landing, Partner page, Event page.

---

## 6. Guardrails: how we stop the site from breaking

| Risk | Guardrail |
|---|---|
| Off-brand or broken layouts | Blocks and variants only; no raw HTML/CSS; tokens locked in code |
| Publishing mistakes | Draft → preview → publish; Releases for multi-page changes; revision restore |
| Missing / poor SEO | Required meta fields; counters; warnings in the Dashboard to-do list |
| Broken links | Internal link picker (references, not URLs); slug change → automatic 301 |
| Heavy images | Sanity image pipeline auto-resizes and converts to modern formats; min/max dimension validation |
| Accessibility | Alt text required; heading-level validation; contrast-safe variants only |
| Overbooking / angry customers | Capacity can't go below booked seats; blackout shows affected bookings; prices snapshotted per booking |
| Promo abuse | Usage limits, date windows, server-side validation |
| Tracking scripts slowing the site | GTM only; Consent Mode v2; tag performance budget monitored in Speed Insights; quarterly audit by maintainer |
| Deleting something important | Delete blocked when referenced or with future bookings; soft-unpublish instead |
| Wrong person changes prices / refunds | Roles (§2); audit log |

---

## 7. Technical maintenance without an in-house developer

| Area | How it's handled | Marketer action |
|---|---|---|
| Hosting, scaling, SSL, CDN | Vercel (managed) | None |
| Dependency & security updates | Renovate opens PRs weekly → CI + E2E on preview → patch updates auto-merge; minor/major reviewed by maintainer | None |
| Studio updates | Sanity Studio version bumped with the dependency flow | None |
| Uptime & errors | Uptime checks + Sentry alerts go to the **maintainer**, not the marketer | None |
| Backups | Postgres point-in-time recovery; weekly Sanity dataset export (scheduled GitHub Action) | None |
| Bad deploy | Vercel instant rollback by maintainer; content rollback via Studio history | Report via Help |
| **Change requests** | Studio → Help → "Request a change" opens a plain-language GitHub issue form → **Claude Code (GitHub Action)** drafts the change as a PR with a preview link → marketer checks the preview → maintainer reviews & merges | Describe the need; check preview |
| Incidents & questions | Support retainer with SLA (e.g. P1 4 h, P2 next business day) | Contact via Help |

Anything that changes **code, schemas, payments, tax or integrations** stays with the maintainer. That is deliberate: it keeps the marketer's workspace safe.

---

## 8. Enablement

1. **Marketer handbook**: task-based how-to guides (one per task in §4), inside the Studio Help tab.
2. **Short videos** (2–4 min each) for the top 10 tasks.
3. **Field-level help**: every non-obvious field has a plain-language description and an example.
4. **Training**: two 2-hour sessions (content & campaigns; availability, promotions & bookings) plus a recorded walkthrough.
5. **Hyper-care office hours**: weekly 30 min for 4 weeks after launch.

---

## 9. Autonomy test (UAT gate M5)

The marketer performs these tasks **unaided** on the staging environment, using only the handbook. The test passes when ≥ 18/20 are completed correctly within the target time, and neither of the two booking-safety tasks is failed.

| # | Task | Target time |
|---|---|---|
| 1 | Change the home hero image and headline, publish | 5 min |
| 2 | Create a landing page from the Campaign template with 4 blocks | 20 min |
| 3 | Publish a guide with images, an embedded experience and SEO fields | 20 min |
| 4 | Create a new experience with one option and two rate categories | 20 min |
| 5 | Change the adult price of an experience | 3 min |
| 6 | Add a recurring schedule (Tue/Thu/Sat 10:00, capacity 12) | 10 min |
| 7 | Block next Monday and review affected bookings ⚠️ booking-safety | 5 min |
| 8 | Create a 10 % promo code valid for one month, max 100 uses | 5 min |
| 9 | Prepare a release with 3 changes and schedule it | 10 min |
| 10 | Show an announcement bar for one week | 3 min |
| 11 | Add a menu item to the main navigation | 3 min |
| 12 | Add a redirect from an old URL | 3 min |
| 13 | Translate a page to German with AI Assist and review | 10 min |
| 14 | Edit the booking confirmation email intro and send a test | 5 min |
| 15 | Feature 3 shop products in a guide | 5 min |
| 16 | Add a product in Shopify and see it on the site | 10 min |
| 17 | Find today's bookings and export the manifest | 3 min |
| 18 | Cancel and refund a test booking per policy ⚠️ booking-safety | 5 min |
| 19 | Restore a previous version of a page | 3 min |
| 20 | Submit a change request via Help | 5 min |
