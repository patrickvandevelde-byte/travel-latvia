# ROADMAP

Weeks are relative to kick-off. Each phase ends with a demo on a preview URL and a gate review.

## Phase 0 — Discovery & spec freeze (wk 0–2) · Gate M1
- 0.1 Client answers all 🔴 questions in `docs/07-client-questions.md`
- 0.2 Resolve ADR-003/004/005; update PRD → v1.0
- 0.3 Brand inputs + moodboard + style tiles → direction chosen
- 0.4 Accounts provisioned under the client's entity (GitHub, Vercel, Sanity, Shopify, Stripe, domain)

## Phase 1 — Foundation (wk 2–4) · Gate M2
- 1.1 Scaffold Next.js (TS strict, Tailwind, shadcn/ui, ESLint/Prettier, Vitest, Playwright), CI workflow
- 1.2 Vercel project, env vars per environment, Neon via Marketplace, Sentry
- 1.3 Sanity project + datasets, embedded Studio, core schemas (CMS-01, CMS-02), TypeGen
- 1.4 Drizzle schema + migrations (Architecture §5.2)
- 1.5 Design tokens + core components on `/design`
- 1.6 `src/lib`: env, money, dates, logger

## Phase 2 — Content site (wk 4–7) · Gate M3
- 2.1 Layout, header/footer, locale routing (I18N-01…03)
- 2.2 Home + modular blocks (CONT-01)
- 2.3 Regions / places (CONT-02)
- 2.4 Experience listing + detail, display only (CONT-03, CONT-04)
- 2.5 Guides + static pages (CONT-05, CONT-06)
- 2.6 Visual editing, revalidation webhooks, redirects (CMS-03…06)
- 2.7 SEO + consent + analytics base (SEO-01…03, 05; ANLY-01, 03)

## Phase 3 — Shop (wk 7–9)
- 3.1 Shopify client + codegen; collections + PDP (SHOP-02, 03)
- 3.2 Cart + drawer + checkout redirect (SHOP-04, 05)
- 3.3 Webhooks + Sanity Connect (SHOP-06, 07)

## Phase 4 — Bookings (wk 8–11) · Gate M4
- 4.1 Pricing + inventory modules with unit tests (BOOK-01, 02, 04, 06; PAY-02)
- 4.2 Availability API + booking widget (BOOK-03, 05)
- 4.3 Stripe Checkout + webhooks + reconciliation (PAY-01, 03)
- 4.4 Emails (NOTIF-01…04), manage booking (BOOK-07, 08)
- 4.5 Back-office (OPS-01…06), refunds (PAY-04)
- 4.6 Concurrency test: parallel checkouts cannot overbook

## Phase 5 — Tailor-made & trips (wk 10–12)
- 5.1 Inquiry form + pipeline (TRIP-01, 02)
- 5.2 Quotes + Stripe payment links + webhook (TRIP-03, 04; PAY-05)
- 5.3 Multi-day trip pages (CONT-07), if Q-E1 allows

## Phase 6 — Hardening & launch (wk 12–14) · Gates M5, M6
- 6.1 E2E suite, cross-browser, a11y audit, performance pass
- 6.2 Legal pages, compliance (COMP-01…05), redirects (SEO-04)
- 6.3 Content QA, training, runbooks
- 6.4 Go-live: DNS, live keys, Stripe/Shopify live webhooks, monitoring
- Hyper-care to wk 18 (M7)
