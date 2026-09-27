# Architecture

| | |
|---|---|
| **Version** | 0.1 (DRAFT) |
| **Date** | 2026-09-27 |
| **Scope** | v1 platform per [PRD](./05-prd.md) |

---

## 1. Summary

A **headless, composable** platform:

- **Next.js (App Router, TypeScript) on Vercel** renders the site. It also hosts the API routes, webhooks, cron jobs and the embedded Sanity Studio (`/studio`). The Studio is the marketer's single workspace, including the Bookings tool.
- **Sanity** owns editorial content and experience *definitions*.
- **Shopify** (Storefront API + hosted checkout) owns the shop.
- **Stripe** (Checkout, Payment Links, Refunds) owns booking and deposit payments.
- **Postgres** (Neon, provisioned through the Vercel Marketplace) owns *operational* data: inventory, holds, bookings and inquiries.

Two rules govern the design:

1. **Every data type has exactly one system of record** (see [Services §2.1](./03-services.md#21-system-of-record-matrix)).
2. **A non-technical marketer runs the site from one workspace.** Sanity Studio holds content, campaigns, availability, promotions, SEO, redirects, email copy and a Bookings tool. Postgres is invisible to them. Routine work never needs code, a deploy, Vercel or GitHub (see [08-marketer-self-service.md](./08-marketer-self-service.md), ADR-010…015).

---

## 2. System context

```mermaid
C4Context
  title System context — Travel Latvia
  Person(traveller, "Traveller", "Browses, books, buys")
  Person(editor, "Marketer", "Runs site, campaigns, availability")
  Person(ops, "Operations", "Manages bookings")
  System(web, "Travel Latvia web app", "Next.js on Vercel")
  System_Ext(sanity, "Sanity", "Content Lake + Studio")
  System_Ext(shopify, "Shopify", "Storefront API, Checkout")
  System_Ext(stripe, "Stripe", "Payments")
  SystemDb_Ext(pg, "Postgres (Neon)", "Operational data")
  System_Ext(resend, "Resend", "Email")
  Rel(traveller, web, "HTTPS")
  Rel(editor, sanity, "Studio at /studio")
  Rel(ops, sanity, "Studio Bookings tool → /api/studio")
  Rel(web, sanity, "GROQ / Live API")
  Rel(web, shopify, "Storefront GraphQL")
  Rel(web, stripe, "API + webhooks")
  Rel(web, pg, "SQL (Drizzle)")
  Rel(web, resend, "Send email")
```

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js** (latest stable, App Router, React Server Components) | SSR/ISR, first-class on Vercel, Sanity & Shopify reference implementations |
| Language | **TypeScript** (strict) | Type safety across CMS/commerce boundaries |
| Styling / UI | **Tailwind CSS** + **shadcn/ui** (Radix) | Accessible primitives, fast iteration, token-driven |
| CMS | **Sanity** (Studio embedded, `next-sanity`, Presentation/Visual Editing, Live Content API, TypeGen) | Structured content, great editor UX, real-time preview |
| Shop | **Shopify** Storefront API (`@shopify/storefront-api-client`) + hosted checkout; **Sanity Connect** for product sync | Mature commerce and checkout without rebuilding it |
| Booking payments | **Stripe** Checkout Sessions, Payment Links / Invoices, Refunds, webhooks | Flexible and date-specific; supports deposits |
| Operational DB | **Postgres (Neon)** + **Drizzle ORM** + drizzle-kit migrations | Transactions and row locks for inventory; Vercel-native provisioning, branching per preview |
| Auth (back-office) | **Better Auth** (email magic link, roles), stored in Postgres | Self-hosted, no per-seat cost; Clerk is the alternative |
| Email | **Resend** + **React Email** | Typed, versioned templates in repo |
| i18n | **next-intl** (routing + system strings) + Sanity document-level i18n; marketing UI labels in a Sanity `uiStrings` singleton; **Sanity AI Assist** for translation drafts | Localised routing, hreflang, marketer-editable labels |
| Validation | **Zod** | All API input/output and env validation |
| Rate limit / bot | Vercel Firewall rules + **BotID** on checkout/inquiry; Upstash Ratelimit if needed | Abuse protection |
| Monitoring | **Sentry**, Vercel Observability, Speed Insights, Web Analytics, uptime checks | Errors, logs, CWV; alerts to maintainer |
| Tag management | **Google Tag Manager** + Consent Mode v2 | Marketer adds pixels without a deploy (ADR-013) |
| Edge config | **Vercel Edge Config** | Redirects & announcement bar served at the edge, updated on publish (ADR-012) |
| Maintenance | **Renovate** + GitHub Actions; **Claude Code GitHub Action** for change requests | Self-updating, low-touch upkeep (ADR-014) |
| Testing | **Vitest** (unit), **Playwright** (E2E), Stripe CLI for webhook tests | |
| Tooling | **pnpm**, ESLint, Prettier, Husky + lint-staged, GitHub Actions | |
| AI dev | **Claude Code** with GSD workflow; MCP servers: Sanity, Vercel, Stripe, Shopify Dev, GitHub | See `CLAUDE.md`, `.mcp.json` |

---

## 4. Repository structure (target)

```
travel-latvia/
├── CLAUDE.md                     # Claude Code project memory & rules
├── .mcp.json                     # MCP servers for Claude Code
├── .planning/                    # GSD: PROJECT, REQUIREMENTS, ROADMAP, STATE
├── docs/                         # Charter, PRD, architecture, design, questions
├── src/
│   ├── app/
│   │   ├── [locale]/(site)/      # Public pages (home, destinations, experiences, guides, shop…)
│   │   ├── [locale]/booking/     # Confirmation + manage booking
│   │   ├── admin/                # Fallback back-office only if ADR-010 spike fails
│   │   ├── studio/[[...tool]]/   # Embedded Sanity Studio
│   │   └── api/
│   │       ├── availability/     # GET slots for experience option + date range
│   │       ├── checkout/booking/ # POST → create hold + Stripe Checkout Session
│   │       ├── inquiries/        # POST tailor-made inquiry
│   │       ├── webhooks/stripe/  # Stripe events
│   │       ├── webhooks/shopify/ # Product/collection/inventory updates
│   │       ├── webhooks/sanity/  # Publish → revalidateTag, schedule sync, redirects → Edge Config
│   │       ├── studio/           # APIs for Studio tools (bookings, availability checks), Sanity-user auth
│   │       ├── draft-mode/       # Sanity Presentation enable/disable
│   │       └── cron/             # release-holds, reminders
│   ├── modules/                  # Domain logic, framework-agnostic, unit-tested
│   │   ├── booking/              # pricing, inventory, holds, references, policies
│   │   ├── payments/             # Stripe client, session builder, webhook handlers
│   │   ├── shop/                 # Shopify client, queries, cart
│   │   ├── content/              # Sanity client, GROQ queries, typed results
│   │   ├── inquiries/
│   │   └── email/                # React Email templates + send()
│   ├── components/               # ui/ (shadcn), blocks/ (page sections), booking/, shop/
│   ├── lib/                      # env (zod), logger, money, dates (Europe/Riga), auth
│   └── styles/tokens.css
├── sanity/
│   ├── sanity.config.ts
│   ├── schemaTypes/              # documents/, objects/, singletons/, blocks/
│   ├── structure.ts              # task-based desk structure (08 §3)
│   ├── templates/                # "New from template" initial values
│   ├── tools/bookings/           # custom Studio tool: bookings, manifests, inquiries
│   ├── tools/dashboard/          # KPIs + to-do widgets
│   ├── actions/                  # guarded publish/delete actions (booking-safe)
│   └── help/                     # in-Studio handbook content
├── db/
│   ├── schema.ts                 # Drizzle schema
│   └── migrations/
├── messages/                     # next-intl UI strings: en.json, lv.json, de.json…
├── tests/
│   ├── unit/
│   └── e2e/
├── .github/ISSUE_TEMPLATE/change-request.yml   # plain-language change requests
├── .github/workflows/        # ci.yml, claude.yml (change requests), sanity-backup.yml
└── renovate.json
```

---

## 5. Data models

### 5.1 Sanity content model

| Type | Kind | Key fields |
|---|---|---|
| `siteSettings` | singleton | name, logo, nav, footer, social, legal entity details, default SEO |
| `homePage` | singleton | `sections[]` (modular blocks) |
| `region` | document | name, slug, intro, hero, geo (polygon/centre), places[] |
| `place` | document | name, slug, region→, intro, quickFacts{}, geo point, POIs[], hero, gallery |
| `experience` | document | title, slug, place→/region→, type (tour, activity, transfer…), summary, highlights[], description (PT), itinerary[], inclusions[], exclusions[], meetingPoint{name, geo, instructions}, durationMinutes, languages[], images[], cancellationPolicy→, faq[], **options[]** (see below), relatedExperiences[], relatedProducts[] (Shopify refs), seo |
| `experienceOption` (object) | object | `optionKey` (stable ID used by Postgres), name, private?, minPax, maxPax, minAge, cutoffHours, **rateCategories[]** {key, label, ageMin, ageMax, priceCents} |
| `trip` | document | title, slug, days[] {title, places[], description, overnight}, departures (from Postgres), deposit %, priceFromCents |
| `cancellationPolicy` | document | name, rules[] {hoursBefore, refundPercent}, legal text |
| `guide` | document | title, slug, category→, author→, hero, body (PT with embeds), related[] |
| `category`, `author` | document | |
| `page` | document | title, slug, sections[] (About, Contact, Legal…) |
| `faq` | document | question, answer, tags |
| `redirect` | document | from, to, permanent (auto-created on slug change) |
| `schedule` | document | experience→, optionKey, rrule (days + start times), capacity, validFrom/To, seasonalPrices[] {from, to, rateKey, priceCents}, blackoutDates[], overrides[] {date, capacity/closed} |
| `promotion` | document | code, type (percent/fixed), value, validFrom/To, maxRedemptions, scope (experiences[], regions[]), minPax, active |
| `announcement` | singleton | message, link, startsAt, endsAt, variant |
| `emailTemplate` | document | key (booking_confirmation, reminder, cancellation, inquiry_received, quote), language, subject, preheader, intro (PT), sections[] with allowed merge tags |
| `form` | document | key, fields[], successMessage, destination (newsletter list / ops email) |
| `uiStrings` | singleton (per language) | marketing-facing labels: CTAs, badges, empty states |
| `helpArticle` | document | task, steps (PT), video URL |
| `shopify.product` / `shopify.collection` | document (Sanity Connect, read-only core fields) | + editorial fields: story, pairings |
| Blocks | object | hero, experienceGrid, regionMap, ctaBand, guideList, productRail, richText, gallery, testimonial, faqBlock |

All localisable documents carry a `language` field (Sanity document-internationalization plugin) and are linked as translations.

### 5.2 Postgres operational model (Drizzle)

```mermaid
erDiagram
  schedule ||--o{ slot : generates
  slot ||--o{ hold : reserves
  slot ||--o{ booking : contains
  booking ||--o{ booking_line : has
  booking ||--o{ payment : has
  booking ||--o{ audit_log : logs
  inquiry ||--o{ quote : has
  quote ||--o{ payment : has

  schedule {
    uuid id PK
    text sanity_schedule_id "mirror of Sanity schedule doc (read-only here)"
    text experience_id "Sanity _id (base language)"
    text option_key
    text sanity_rev "last synced revision"
  }
  slot {
    uuid id PK
    uuid schedule_id FK
    text experience_id
    text option_key
    timestamptz starts_at "UTC"
    int capacity
    int booked "confirmed pax"
    text status "open|closed|cancelled"
  }
  hold {
    uuid id PK
    uuid slot_id FK
    int pax
    timestamptz expires_at
    text stripe_session_id
    text status "active|converted|expired"
  }
  booking {
    uuid id PK
    text reference "TL-XXXXXX unique"
    uuid slot_id FK
    text status "pending|confirmed|cancelled|refunded"
    text source "web|manual"
    text locale
    text lead_name
    text lead_email
    text lead_phone
    int total_cents
    text currency "EUR"
    jsonb price_snapshot "rates at time of booking"
    text stripe_session_id
    text stripe_payment_intent_id
    text manage_token_hash
    timestamptz created_at
  }
  booking_line {
    uuid id PK
    uuid booking_id FK
    text rate_key
    int quantity
    int unit_cents
  }
  payment {
    uuid id PK
    uuid booking_id FK "nullable"
    uuid quote_id FK "nullable"
    text kind "charge|refund|deposit|balance"
    int amount_cents
    text stripe_object_id
    text status
  }
  inquiry {
    uuid id PK
    text status "new|qualified|quoted|deposit_paid|confirmed|lost"
    jsonb answers
    text contact_email
    text locale
    timestamptz created_at
  }
  quote {
    uuid id PK
    uuid inquiry_id FK
    jsonb lines
    int total_cents
    int deposit_cents
    text stripe_payment_link_id
    text status
  }
  audit_log {
    uuid id PK
    uuid booking_id FK
    text actor
    text action
    jsonb data
    timestamptz at
  }
```

Schedules are **authored in Sanity** and mirrored here only to generate slots (ADR-011). There are also a `promotion_redemption` table (`promotion_id`, `booking_id`, UNIQUE) that enforces usage limits, and a `webhook_event` table (`provider`, `event_id` UNIQUE, `processed_at`) for idempotency, plus the Better Auth tables for staff users.

**Capacity invariant:** `slot.booked + SUM(active holds.pax) ≤ slot.capacity`. It is enforced inside a transaction with `SELECT … FOR UPDATE` on the slot row.

---

## 6. Key flows

### 6.1 Booking checkout

```mermaid
sequenceDiagram
  autonumber
  participant U as Traveller
  participant W as Next.js (Vercel)
  participant DB as Postgres
  participant CMS as Sanity
  participant S as Stripe
  U->>W: GET /api/availability?experience&option&from&to
  W->>DB: slots + remaining capacity
  W-->>U: dates/slots
  U->>W: POST /api/checkout/booking {slotId, rates[], lead, consent}
  W->>CMS: fetch option & rates (published perspective)
  W->>W: validate (zod), compute price server-side, check cutoff/min/max
  W->>DB: BEGIN; SELECT slot FOR UPDATE; check capacity; INSERT hold (30 min) + booking(pending); COMMIT
  W->>S: checkout.sessions.create(line_items, metadata{bookingId, holdId}, expires_at=+30m, idempotency key)
  W-->>U: redirect to Stripe Checkout
  U->>S: pays (SCA)
  S-->>W: webhook checkout.session.completed
  W->>DB: dedupe event; BEGIN; hold→converted; slot.booked += pax; booking→confirmed; payment row; COMMIT
  W->>U: confirmation email (Resend) + ops alert
  S-->>W: webhook checkout.session.expired (if abandoned)
  W->>DB: hold→expired; booking→cancelled(expired)
```

Safety nets:

- The Vercel Cron job `release-holds` runs every 5 min and expires stale holds.
- The confirmation page polls the booking status and never trusts query params.
- A reconciliation job compares Stripe payments against bookings daily and alerts on mismatches.

### 6.2 Shop checkout

1. The browser calls a Server Action → Storefront `cartCreate` / `cartLinesAdd`. The cart ID is stored in an HTTP-only cookie.
2. The cart drawer reads the cart server-side.
3. "Checkout" redirects to `cart.checkoutUrl` (Shopify-hosted, branded).
4. Shopify handles payment, tax, shipping and order emails.
5. Shopify webhooks (`products/update`, `collections/update`, `inventory_levels/update`) → `/api/webhooks/shopify` (HMAC verified) → `revalidateTag('shopify:…')`.

### 6.3 Content publishing

Editor publishes in Studio → Sanity webhook (GROQ-filtered, signed) → `/api/webhooks/sanity` → `revalidateTag(<type>:<slug>)`. Preview deployments use Draft Mode + Visual Editing and the Live Content API.

### 6.4 Availability sync (Sanity → Postgres)

1. The marketer publishes a `schedule` in Studio.
2. A signed Sanity webhook calls `/api/webhooks/sanity`, which regenerates future slots for the next 18 months in one transaction:
   - Slots that have bookings are **never deleted**. Their capacity is set to `max(new capacity, booked)`, and a conflict is recorded.
   - Blackout dates close their slots. Affected bookings are listed in the Studio Bookings tool with a "notify & refund" action.
3. Guarded Studio document actions call `/api/studio/availability-check` **before** publish. The marketer sees conflicts ("3 bookings on 14 July") and must confirm.
4. A nightly cron extends the rolling window.

### 6.5 Promotions

At checkout the server validates the code against Sanity (published): window, scope, `minPax`, and active flag. It computes the discount server-side. Usage limits are enforced by inserting `promotion_redemption` in the booking transaction and checking the count under the slot lock. The Stripe Checkout line items carry the discounted price, and the promotion code is stored in `booking.price_snapshot`.

### 6.6 Redirects & announcement bar

On publish, the Sanity webhook writes the full redirect map and the active announcement to **Vercel Edge Config**. Middleware reads the redirects with sub-millisecond lookups, with no deploy and no database. A `slug` change triggers a Studio document action that creates a `redirect` from the old path automatically.

### 6.7 Tailor-made quote

1. Inquiry POST (BotID + rate limit) → `inquiry` row → emails to the ops team and the traveller.
2. Ops builds a quote in the Studio Bookings tool. The server creates a **Stripe Payment Link** (or Invoice) for the deposit, with `metadata.quoteId`.
3. Webhook → `payment` row → inquiry status becomes `deposit_paid`.

---

## 7. Caching & rendering strategy

| Route | Rendering | Invalidation |
|---|---|---|
| Content pages (home, regions, guides) | Static / cached (`use cache` + `cacheTag`) | Sanity webhook → tag revalidation |
| Experience detail | Cached shell; booking widget is a client component that fetches availability | Content: Sanity tag; availability: `no-store` or 60 s |
| Shop PLP/PDP | Cached | Shopify webhooks → tags; stock re-checked in cart |
| Cart, checkout API, admin, manage-booking | Dynamic, `no-store` | n/a |
| Images | Sanity image CDN (`@sanity/image-url`) + `next/image`; Shopify CDN for products | |

---

## 8. Environments & deployment

| Env | Git | Vercel | Sanity dataset | Postgres | Stripe | Shopify |
|---|---|---|---|---|---|---|
| Local | any branch | `vercel env pull` | `staging` | Neon dev branch | Test mode + Stripe CLI | Dev store |
| Preview | every PR | Preview deployment (protected) | `staging` | Neon branch per PR (Marketplace integration) | Test mode | Dev store |
| Production | `main` | Production (custom domain) | `production` | Neon `main` | Live mode | Live store |

**Maintenance automation (ADR-014):**
- Renovate opens weekly dependency PRs. Patch updates auto-merge when CI + E2E pass; minor and major updates need maintainer review.
- A scheduled workflow exports the Sanity dataset weekly.
- Uptime + Sentry alerts go to the maintainer.
- Change requests from the Studio Help tab arrive as GitHub issues (template). The Claude Code GitHub Action drafts a PR, Vercel posts a preview URL, the marketer checks it, and the maintainer merges.

**CI (GitHub Actions):** install → lint → typecheck → unit tests → build. Playwright E2E runs against the preview URL after deploy. Merges to `main` auto-deploy to production, gated by required checks and one review.

**Vercel Cron:** `30 2 * * *` extend-slot-window · `*/5 * * * *` release-holds · `0 8 * * *` 48 h reminders (08:00 UTC ≈ 10:00/11:00 Riga, depending on DST) · `0 3 * * *` Stripe reconciliation.

### Environment variables

See [`.env.example`](../.env.example). All variables are validated at boot by `src/lib/env.ts` (Zod). Secrets live only in Vercel env settings.

---

## 9. Analytics events

| Event | Where fired | Properties |
|---|---|---|
| `view_experience` | Client | experience_id, region, price_from |
| `select_date` / `select_slot` | Client | experience_id, date, option |
| `begin_checkout` | Server (session created) | booking_id, value_cents, pax |
| `booking_paid` | Server (webhook) | booking_id, value_cents, experience_id |
| `add_to_cart` / `shop_checkout` | Client | product handle, value |
| `inquiry_submitted` | Server | budget band, travellers |

Client events fire only after consent. Server events are first-party and contain no PII.

---

## 10. Security & privacy

- Secrets are stored in Vercel env only. Nothing prefixed `NEXT_PUBLIC_` is secret.
- Webhooks: Stripe signature (`stripe.webhooks.constructEvent`), Shopify HMAC, Sanity signature. Each is idempotent via `webhook_event`.
- Staff: Sanity SSO (Google/Microsoft) with custom roles (Admin, Marketer, Ops, Translator). Studio tool APIs (`/api/studio/*`) verify the caller's Sanity identity and role server-side on every request. The fallback `/admin` uses Better Auth with the same SSO provider. Staff access is invite-only.
- Manage-booking links: random 32-byte token; only the SHA-256 hash is stored; links expire after trip date + 30 days.
- Input validation with Zod everywhere. Parameterised SQL via Drizzle.
- Security headers (CSP incl. Stripe/Shopify/Sanity domains, HSTS, frame-ancestors). Studio is allowed to frame the site on preview only.
- PII is limited to the lead traveller's name/email/phone. Retention jobs apply NFR-05. DPAs are signed with Vercel, Sanity, Shopify, Stripe, Neon, Resend and Sentry.

---

## 11. Observability & operations

- Sentry for client and server errors, with source maps uploaded in CI.
- Alerts: webhook failure rate, 5xx rate, reconciliation mismatches, cron failures.
- Runbooks (in `docs/runbooks/`, written in Phase 6): refund a booking, handle a Stripe dispute, restore Postgres from a backup, roll back a deployment.

---

## 12. Cost envelope (monthly, indicative, verify at purchase)

| Item | Indicative |
|---|---|
| Vercel Pro | ~$20 per seat |
| Sanity Growth | ~$15 per seat (Free plan may suffice at start) |
| Shopify Basic | ~$29–39 + payment fees |
| Stripe | Per transaction (EEA standard cards ≈ 1.5 % + €0.25; verify for LV entity) |
| Neon (via Vercel) | $0–19 at launch scale |
| Resend | $0–20 |
| GTM, GA4 | Free |
| Uptime monitoring | $0–25 |
| Sentry | $0–26 |
| **Platform total (excl. transaction fees)** | **≈ $100–200 / month** at launch scale |

---

## 13. Architecture Decision Records

| ADR | Decision | Status |
|---|---|---|
| **ADR-001** | Next.js App Router on Vercel as the single web runtime (site, API, Studio + Studio tools). | Proposed |
| **ADR-002** | **Sanity** as the CMS. Alternatives: Shopify metaobjects (too weak for editorial), Contentful (cost, weaker preview DX). | Proposed |
| **ADR-003** | **Split commerce:** Shopify for the shop; Stripe for experience bookings. *Why not bookings in Shopify?* Shopify has no native date/slot inventory. Booking apps add fees, limit UX and fragment data. *Trade-off:* two checkouts; one basket can't hold a shop item and a booking together. Revisit if the client needs a unified basket (Q-B2). | **Needs client input** |
| **ADR-004** | **Gift vouchers.** Option A: Shopify gift cards (shop only, can't redeem against Stripe bookings). Option B: vouchers issued as Stripe promotion codes, sold through Stripe Checkout, redeemable on bookings. Option C: a voucher table in Postgres, redeemable on both (most work). Recommend **B** for v1. | **Needs client input** (Q-B3) |
| **ADR-005** | **Build a lightweight booking engine** (Postgres + Stripe) rather than buy one (Bókun, FareHarbor, Rezdy, Regiondo). This fits a single operator with fewer than ~50 products and no OTA distribution. **Buy** instead if the client needs channel distribution to Viator/GetYourGuide/Expedia, resource/guide scheduling or multiple suppliers. In that case the booking system becomes the source of truth and Stripe is its gateway. *Self-service impact:* buying adds a second back-office for the marketer, because availability and bookings would live in that tool rather than in Studio. | **Needs client input** (Q-B6) |
| **ADR-006** | Postgres (Neon via Vercel Marketplace) + Drizzle for operational data; not Sanity (no transactions or locks) and not Shopify. | Proposed |
| **ADR-007** | Staff auth = Sanity SSO + roles for everything in Studio. Better Auth is only needed if the `/admin` fallback is used (ADR-010). No customer accounts in v1. | Proposed |
| **ADR-008** | Resend + React Email for transactional email; templates versioned in repo. | Proposed |
| **ADR-009** | Stripe Checkout (hosted), not embedded Payment Element, for v1: less PCI scope, SCA handled, fastest to ship. Embedded Checkout remains an option. | Proposed |

| **ADR-010** | **Sanity Studio is the marketer's single workspace.** Bookings, manifests and inquiries are a custom Studio tool calling `/api/studio/*`. *Spike in Phase 1:* verify server-side validation of the Studio user's identity and role. *Fallback:* a standalone `/admin` with the same SSO, opened from a Studio tool link. | Proposed |
| **ADR-011** | **Availability authored in Sanity, inventory transacted in Postgres.** Schedules, capacity, blackouts and seasonal prices are content the marketer edits. Slots, holds and bookings stay transactional in Postgres, synced on publish with booking-safe rules (§6.4). | Proposed |
| **ADR-012** | **Redirects and announcement bar in Sanity, served from Vercel Edge Config.** Updated on publish, no deploy. | Proposed |
| **ADR-013** | **Google Tag Manager for marketing tags,** with Consent Mode v2. Trade-off: the marketer can add heavy scripts. Mitigated by a performance budget, Speed Insights alerts and a quarterly tag audit. | Proposed |
| **ADR-014** | **Low-touch maintenance:** Renovate + CI auto-merge for patches, monitoring to the maintainer, Claude Code GitHub Action for plain-language change requests (human-reviewed merge). | Proposed |
| **ADR-015** | **Transactional email copy in Sanity,** layout in React Email. The marketer edits words; the code guarantees rendering across mail clients. | Proposed |

**Payment gateway caveat:** confirm which payment providers Shopify offers the client's legal entity. If Shopify Payments isn't available in its country, a third-party gateway adds Shopify transaction fees (Q-E3).
