# Product Requirements Document (PRD)

| | |
|---|---|
| **Version** | 0.1 (DRAFT, frozen as v1.0 at M1) |
| **Date** | 2026-09-27 |
| **Related** | [Charter](./01-project-charter.md) · [Services](./03-services.md) · [Design](./04-design.md) · [Architecture](./06-architecture.md) · [Questions](./07-client-questions.md) |

**Priority:** **P0** = launch blocker · **P1** = launch target (may slip to fast-follow) · **P2** = v2.

---

## 1. Problem statement

International travellers to Latvia can find inspiration but can't reliably *book* local experiences with live availability in one trusted place. The client also has no owned channel that turns content traffic into bookings, shop sales and high-value tailor-made trips.

## 2. Goals & non-goals

**Goals:** see Charter §2 (O1–O6).

**Non-goals (v1):** customer accounts, multi-supplier payouts, OTA/channel distribution, flights/hotels, native app, user-generated reviews.

## 3. Personas

| Persona | Description | Top jobs-to-be-done |
|---|---|---|
| **Weekend city-breaker** "Lena, 32, Berlin" | Flies into RIX for 3 days on a budget airline, books on mobile | Find the best 2–3 things to do in and around Rīga; book instantly; know the meeting point |
| **Nature seeker** "Mark & Sophie, 45, UK" | 1-week trip, wants Gauja, bogs, coast | Compare day trips; understand logistics without a car; bundle several experiences |
| **Planner / family** "The Jansens, NL" | Wants a stress-free tailor-made itinerary | Describe needs once; receive a proposal; pay a deposit securely |
| **Diaspora / gift buyer** "Ilze, 60, Canada" | Latvian heritage, buys gifts and vouchers | Buy Latvian products and gift experiences for relatives |
| **Editor** (client staff) | Publishes guides, updates experiences | Create and translate pages without a developer; preview before publishing |
| **Operations** (client staff) | Runs tours day to day | See today's manifests; adjust capacity; handle cancellations and refunds |

## 4. User journeys

See [Design §4](./04-design.md#4-primary-user-flows).

## 5. Success metrics

| Metric | Definition | Target |
|---|---|---|
| Booking conversion | Paid bookings ÷ sessions reaching an experience page | ≥ 3 % |
| Checkout completion | Paid ÷ Stripe sessions created | ≥ 55 % |
| Shop AOV | Shopify average order value | Baseline at month 1 |
| Inquiry → deposit | Deposits paid ÷ qualified inquiries | ≥ 25 % |
| Editor autonomy | Content changes needing a developer | 0 per month after hyper-care |
| Performance | CWV "Good" (p75 mobile) | ≥ 90 % of URLs |

---

## 6. Functional requirements

### 6.1 Content (CONT)

| ID | Requirement | Pri |
|---|---|---|
| CONT-01 | Home page is fully composable in Sanity from modular sections (hero, featured experiences, regions, guides, CTA bands, shop highlights). | P0 |
| CONT-02 | Region and Place pages show intro, quick facts, experiences filtered to the location, map with POIs and related guides. | P0 |
| CONT-03 | Experience listing supports filters (region, type, duration, price range, date availability) with shareable URL state. | P0 |
| CONT-04 | Experience detail shows gallery, highlights, itinerary, inclusions/exclusions, meeting point map, cancellation policy, FAQ and related items. | P0 |
| CONT-05 | Guides (blog) with categories, authors and Portable Text supporting embedded experiences, products, maps and galleries. | P0 |
| CONT-06 | Practical info hub and static pages (About, Contact, FAQ, Legal). | P0 |
| CONT-07 | Multi-day trip pages with day-by-day itinerary and dated departures. | P1 |
| CONT-08 | Site search across experiences, places and guides. | P1 |
| CONT-09 | Third-party review widget (e.g. Tripadvisor / Google) embedded on experience pages. | P2 |

### 6.2 CMS & editorial (CMS)

| ID | Requirement | Pri |
|---|---|---|
| CMS-01 | Sanity Studio embedded at `/studio`, SSO or email login, roles: Administrator, Editor, Translator. | P0 |
| CMS-02 | Schemas with validation (required fields, character limits for SEO fields, image alt text required). | P0 |
| CMS-03 | Draft preview and click-to-edit visual editing (Presentation tool) on preview deployments. | P0 |
| CMS-04 | Publishing triggers on-demand cache revalidation; changes live in < 60 s. | P0 |
| CMS-05 | Scheduled publishing / content releases (e.g. seasonal campaigns). | P1 |
| CMS-06 | Redirect management in the CMS (old URL → new URL). | P1 |

### 6.3 Internationalisation (I18N)

| ID | Requirement | Pri |
|---|---|---|
| I18N-01 | Locale-prefixed routing; EN default at root; locales configurable (EN + TBC, Q-C1). | P0 |
| I18N-02 | Document-level translations in Sanity with a missing-translation fallback to EN and a visible editor warning. | P0 |
| I18N-03 | `hreflang` alternates and localised slugs. | P0 |
| I18N-04 | Transactional emails sent in the booking's locale. | P1 |
| I18N-05 | Currency display EUR only in v1; shop may show local currency via Shopify Markets. | P1 |

### 6.4 SEO (SEO)

| ID | Requirement | Pri |
|---|---|---|
| SEO-01 | Per-page title/description/OG image with CMS overrides and sensible defaults. | P0 |
| SEO-02 | XML sitemaps (per locale) and `robots.txt`; preview deployments are `noindex`. | P0 |
| SEO-03 | Structured data: `TouristTrip`/`Product` + `Offer` for experiences, `Product` for shop, `Article`, `BreadcrumbList`, `Organization`. | P0 |
| SEO-04 | Clean, stable URLs; 301 redirects from legacy site (Q-D3). | P0 |
| SEO-05 | Dynamic OG images for experiences and guides. | P1 |

### 6.5 Shop (SHOP)

| ID | Requirement | Pri |
|---|---|---|
| SHOP-01 | Shopify store configured with products, collections, EU VAT, shipping zones and payment methods. | P0 |
| SHOP-02 | Collection pages from the Shopify Storefront API with sort and filter. | P0 |
| SHOP-03 | Product detail pages with variants, stock state and price. | P0 |
| SHOP-04 | Persistent cart (Storefront Cart API, cart ID in a cookie) with a cart drawer. | P0 |
| SHOP-05 | Checkout via Shopify-hosted checkout (`cart.checkoutUrl`), branded to match the site. | P0 |
| SHOP-06 | Shopify products synced to Sanity (read-only) so editors can feature them in guides and add story content. | P1 |
| SHOP-07 | Shopify product/collection/inventory webhooks trigger cache revalidation. | P0 |
| SHOP-08 | Shopify customer accounts (new Customer Account API). | P2 |

### 6.6 Bookings (BOOK)

| ID | Requirement | Pri |
|---|---|---|
| BOOK-01 | Each experience has one or more **options** (e.g. shared/private, language) with **rate categories** (adult, child, senior, family) and prices in integer euro cents. | P0 |
| BOOK-02 | **Schedules** generate **slots** (date + start time + capacity) from recurrence rules, with per-date overrides and blackout dates. | P0 |
| BOOK-03 | Availability API returns bookable dates/slots with remaining capacity for a date range (cached ≤ 60 s, recomputed at checkout). | P0 |
| BOOK-04 | **Holds**: proceeding to payment reserves capacity atomically for up to 30 min; expired holds are released automatically. **No overbooking under concurrency.** | P0 |
| BOOK-05 | Booking widget: date → slot → participants → live price → lead traveller details → T&Cs consent → pay. Keyboard and screen-reader accessible. | P0 |
| BOOK-06 | Configurable min/max participants, cut-off time (e.g. no bookings < 12 h before start) and min age per option. | P0 |
| BOOK-07 | Human-readable booking reference (e.g. `TL-7K3Q9P`). | P0 |
| BOOK-08 | Manage-booking page via signed magic link: view details, add to calendar (.ics), request cancellation per policy. | P0 |
| BOOK-09 | Self-service cancellation with automatic refund per policy (e.g. full refund ≥ 24 h before start). | P1 |
| BOOK-10 | Promo codes / discounts on bookings. | P1 |
| BOOK-11 | Add-ons (e.g. lunch, photo package) per option. | P2 |
| BOOK-12 | Multi-experience basket (book several experiences in one payment). | P2 |

### 6.7 Payments (PAY)

| ID | Requirement | Pri |
|---|---|---|
| PAY-01 | Booking payment via **Stripe Checkout** (hosted) in EUR; cards, Apple Pay, Google Pay and other methods enabled per Stripe account availability. | P0 |
| PAY-02 | Price is **always computed server-side** from Sanity (published) + Postgres; client-sent prices are ignored. | P0 |
| PAY-03 | Stripe webhooks (`checkout.session.completed`, `checkout.session.expired`, `charge.refunded`, `payment_intent.payment_failed`) are signature-verified and idempotent. | P0 |
| PAY-04 | Full and partial refunds from the back-office through the Stripe API. | P0 |
| PAY-05 | Deposit + balance payments for trips and tailor-made quotes (Stripe Payment Links or Invoices; balance reminder emails). | P1 |
| PAY-06 | Stripe Tax / VAT handling aligned with the accountant's guidance (Q-E2). | P1 |
| PAY-07 | Stripe Connect payouts to third-party suppliers. | P2 |

### 6.8 Notifications (NOTIF)

| ID | Requirement | Pri |
|---|---|---|
| NOTIF-01 | Booking confirmation email with reference, details, meeting point, .ics and manage link. | P0 |
| NOTIF-02 | Operations alert (email; Slack optional) on new booking, cancellation and inquiry. | P0 |
| NOTIF-03 | Reminder email 48 h before start. | P1 |
| NOTIF-04 | Cancellation / refund confirmation email. | P0 |
| NOTIF-05 | Newsletter sign-up (double opt-in) via provider TBC (Q-D4). | P1 |

### 6.9 Operations back-office (OPS)

| ID | Requirement | Pri |
|---|---|---|
| OPS-01 | Authenticated `/admin` for staff (email magic link / SSO), role-based: Admin, Ops. | P0 |
| OPS-02 | Bookings list with search/filter (date, experience, status) and booking detail view. | P0 |
| OPS-03 | Daily manifest per slot (participants, contact details, notes) exportable to CSV/PDF. | P0 |
| OPS-04 | Manage schedules, slots, capacity overrides and blackout dates. | P0 |
| OPS-05 | Create manual/offline bookings (phone, walk-in) that consume inventory. | P0 |
| OPS-06 | Cancel booking and refund (full/partial) with an audit log entry. | P0 |
| OPS-07 | Simple dashboard: bookings and revenue by day/experience. | P1 |

### 6.10 Tailor-made trips (TRIP)

| ID | Requirement | Pri |
|---|---|---|
| TRIP-01 | Multi-step inquiry form (dates/flexibility, travellers, interests, pace, budget band, accommodation level, contact, consent), spam-protected. | P0 |
| TRIP-02 | Inquiry pipeline in `/admin`: statuses New → Qualified → Quoted → Deposit paid → Confirmed / Lost; internal notes. | P0 |
| TRIP-03 | Create a quote (line items, total, deposit %) and send it by email with a Stripe payment link. | P1 |
| TRIP-04 | Payment of a deposit/balance updates inquiry status via webhook. | P1 |
| TRIP-05 | CRM sync (HubSpot/Pipedrive) (Q-D4). | P2 |

### 6.11 Analytics & consent (ANLY)

| ID | Requirement | Pri |
|---|---|---|
| ANLY-01 | Consent banner (GDPR/ePrivacy); no non-essential cookies before consent. | P0 |
| ANLY-02 | Funnel events: `view_experience`, `select_date`, `begin_checkout`, `booking_paid`, `add_to_cart`, `shop_checkout`, `inquiry_submitted`. | P0 |
| ANLY-03 | Vercel Web Analytics + Speed Insights; GA4 or privacy-friendly alternative (Q-D4). | P0 |
| ANLY-04 | Server-side conversion tracking for paid bookings (from webhook). | P1 |

---

## 7. Non-functional requirements

| ID | Area | Requirement | Pri |
|---|---|---|---|
| NFR-01 | Performance | LCP < 2.5 s, INP < 200 ms, CLS < 0.1 at p75 on mobile. JS for content pages ≤ 150 kB gzipped. | P0 |
| NFR-02 | Availability | 99.9 % monthly for public site; degraded mode if Shopify/Stripe unavailable (content still served). | P0 |
| NFR-03 | Accessibility | WCAG 2.1 AA (European Accessibility Act). | P0 |
| NFR-04 | Security | OWASP ASVS L1; secrets only in Vercel env; webhook signature checks; rate limiting on forms and APIs; bot protection on checkout and inquiry. | P0 |
| NFR-05 | Privacy | GDPR: data minimisation, DPA with every processor, retention (bookings 7 years for accounting; inquiries 24 months), data-subject request process. | P0 |
| NFR-06 | Data integrity | Money stored as integer cents + ISO currency; timestamps UTC; slot times shown in Europe/Riga. | P0 |
| NFR-07 | Observability | Error tracking (Sentry), structured logs, alert on webhook failures and on booking/payment mismatches. | P0 |
| NFR-08 | Maintainability | TypeScript strict; typed GROQ (Sanity TypeGen) and Shopify codegen; ≥ 80 % unit coverage on pricing/inventory modules; E2E on booking and shop checkout. | P0 |
| NFR-09 | Browser support | Last 2 versions of evergreen browsers; iOS Safari 16+. | P0 |
| NFR-10 | Backups | Daily Postgres backups with point-in-time recovery; Sanity dataset export weekly. | P0 |

## 8. Compliance requirements (client-owned; platform supports)

| ID | Requirement |
|---|---|
| COMP-01 | Booking conditions and cancellation policy shown and explicitly accepted before payment. |
| COMP-02 | Company details (legal name, registration no., VAT no., address) in the footer and emails. |
| COMP-03 | If classified as a package organiser: pre-contractual information form and insolvency-protection details (Directive 2015/2302). |
| COMP-04 | Right-of-withdrawal exemption for date-specific leisure services is stated correctly (Consumer Rights Directive Art. 16(l)). |
| COMP-05 | Invoices/receipts meet Latvian VAT requirements (Stripe receipts or an invoicing tool). |

## 9. Dependencies & open questions

All open items are tracked in [07-client-questions.md](./07-client-questions.md). This PRD is frozen once every **P1** question there is answered.

## 10. Release plan

See [.planning/ROADMAP.md](../.planning/ROADMAP.md).
