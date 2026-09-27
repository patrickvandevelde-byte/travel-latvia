# Deliverables

Every deliverable has an owner, a format and an acceptance criterion. Requirement IDs (e.g. `BOOK-03`) refer to [05-prd.md](./05-prd.md).

## Phase 0 — Discovery & spec freeze (weeks 0–2)

| ID | Deliverable | Format | Owner | Acceptance criterion |
|---|---|---|---|---|
| D0.1 | Project charter (signed) | `docs/01-project-charter.md` | Delivery lead | Sponsor signs §11 |
| D0.2 | Answered client questionnaire | `docs/07-client-questions.md` | Client | All **P1** questions answered |
| D0.3 | Brand inputs | Logo, fonts, photography, tone of voice | Client / Designer | Assets delivered or brand workshop held |
| D0.4 | PRD v1.0 | `docs/05-prd.md` | Delivery lead | Open questions closed; sponsor approves |
| D0.5 | Architecture v1.0 + ADRs | `docs/06-architecture.md` | Tech lead | ADR-001…006 status = Accepted |
| D0.6 | Content inventory & migration list | Spreadsheet | Client content lead | Every v1 page type has an owner and due date |
| D0.7 | Marketer profile & task list | Interview notes → `docs/08` §4 | Delivery lead + marketer | Marketer confirms the task matrix covers their weekly work |

## Phase 1 — Foundation (weeks 2–4)

| ID | Deliverable | Acceptance criterion |
|---|---|---|
| D1.1 | Next.js repository scaffold (TypeScript, Tailwind, lint, test) | `pnpm build` and `pnpm test` pass in CI |
| D1.2 | Vercel project with Preview + Production environments | Every PR gets a preview URL; env vars set per environment |
| D1.3 | Sanity project, datasets (`production`, `staging`), embedded Studio at `/studio`, SSO, roles, task-based structure | Marketer logs in via SSO and finds every section of 08 §3 |
| D1.9 | ADR-010 spike: Studio tool with server-verified Sanity user + role | Decision recorded: Studio tool or `/admin` fallback |
| D1.10 | Maintenance automation: Renovate, uptime checks, Sentry alerts, Sanity backup workflow | First Renovate PR auto-merged after green CI |
| D1.4 | Sanity schemas for all v1 content types | Matches Architecture §5.1 |
| D1.5 | Design system: tokens, typography, core components | Components rendered on a `/design` preview route; WCAG AA contrast |
| D1.6 | Postgres database + migrations | Schema from Architecture §5.2 applied to preview and prod |
| D1.7 | Claude Code setup | `CLAUDE.md`, `.mcp.json`, `.planning/` in repo; team onboarded |
| D1.8 | CI/CD pipeline | Lint, typecheck, unit tests, Playwright smoke on preview |

## Phase 2 — Content site (weeks 4–7)

| ID | Deliverable | Requirements |
|---|---|---|
| D2.1 | Home page | `CONT-01` |
| D2.2 | Destination & region pages | `CONT-02` |
| D2.3 | Experience listing with filters + detail pages (display only) | `CONT-03`, `CONT-04` |
| D2.4 | Guides / blog | `CONT-05` |
| D2.5 | Practical info & static pages | `CONT-06` |
| D2.6 | Internationalisation (routing, translated content, hreflang) | `I18N-01…04` |
| D2.7 | SEO foundations (metadata, sitemap, structured data, redirects) | `SEO-01…05` |
| D2.8 | Visual editing / live preview in Studio | `CMS-03`, `MKT-03` |
| D2.9 | Page builder: ≥ 15 blocks + 5 page templates | `MKT-02` |
| D2.10 | Global settings, announcement bar, redirects via Edge Config, SEO tab | `MKT-05…07` |
| D2.11 | Campaign releases, revision restore, delete protection | `MKT-04`, `MKT-16` |
| D2.12 | GTM + Consent Mode v2 | `MKT-12` |

## Phase 3 — Shop (weeks 7–9)

| ID | Deliverable | Requirements |
|---|---|---|
| D3.1 | Shopify store configured (products, markets, taxes, shipping, payments) | Client + dev; `SHOP-01` |
| D3.2 | Product listing & detail pages from Storefront API | `SHOP-02`, `SHOP-03` |
| D3.3 | Cart drawer + redirect to Shopify checkout | `SHOP-04`, `SHOP-05` |
| D3.4 | Product sync into Sanity (Sanity Connect) for editorial merchandising | `SHOP-06` |
| D3.5 | Shopify webhooks → cache revalidation | `SHOP-07` |

## Phase 4 — Bookings (weeks 8–11)

| ID | Deliverable | Requirements |
|---|---|---|
| D4.1 | Availability & inventory engine (slots, capacity, holds) | `BOOK-01…04` |
| D4.2 | Booking widget (date → slot → participants → price) | `BOOK-05` |
| D4.3 | Stripe Checkout integration + webhooks | `PAY-01…05` |
| D4.4 | Transactional emails (confirmation, reminder, cancellation) | `NOTIF-01…04` |
| D4.5 | Manage-booking page (magic link) | `BOOK-08` |
| D4.6 | Studio Bookings tool: bookings, manifests, manual booking, refunds | `OPS-01…06`, `MKT-10` |
| D4.7 | Studio Availability: schedules, blackouts, seasonal prices + sync with guardrails | `BOOK-02`, `MKT-09` |
| D4.8 | Promo codes in Studio | `MKT-08` |
| D4.9 | Editable email copy + send-test | `MKT-11` |

## Phase 5 — Tailor-made trips (weeks 10–12)

| ID | Deliverable | Requirements |
|---|---|---|
| D5.1 | Multi-step inquiry form | `TRIP-01` |
| D5.2 | Inquiry pipeline in back-office | `TRIP-02` |
| D5.3 | Quote → Stripe deposit / balance payment | `TRIP-03`, `TRIP-04` |

## Phase 6 — Hardening, launch & hand-over (weeks 12–14, hyper-care to 18)

| ID | Deliverable | Acceptance criterion |
|---|---|---|
| D6.1 | Test report (functional, E2E, cross-browser, mobile) | No open P1/P2 defects |
| D6.2 | Accessibility audit | WCAG 2.1 AA: no critical issues |
| D6.3 | Performance report | LCP < 2.5 s, INP < 200 ms, CLS < 0.1 (p75, mobile) |
| D6.4 | Legal pages & consent (T&Cs, booking conditions, privacy, cookies) | Provided/approved by client's counsel |
| D6.5 | Analytics & dashboards | Funnel events firing (Architecture §9) |
| D6.6 | Go-live runbook & DNS cut-over | Executed; rollback tested |
| D6.7 | Editor & operations training + recorded walkthroughs | Client team completes a booking and publishes a page unaided |
| D6.8 | Hand-over pack (docs, credentials transfer, support SLA) | Signed off |
| D6.9 | Marketer handbook + 10 videos in the Studio Help tab | Covers every task in 08 §4 |
| D6.10 | **Marketer autonomy test** | ≥ 18/20 unaided, no booking-safety failure (08 §9) |
| D6.11 | Change-request pipeline (issue form → Claude Code PR → preview → merge) | One real request completed end to end |
| D6.12 | Support retainer & SLA signed | Before go-live |
