# STATE

**Current phase:** 0 — Discovery & spec freeze (Phase 1–2 work that doesn't depend on client answers is built ahead)
**Last updated:** 2026-09-27

## Done
- Draft charter, deliverables, services, design, PRD, architecture, client questionnaire
- Claude Code setup: `CLAUDE.md`, `.mcp.json`, `.env.example`, `.planning/`
- Marketer self-service model (`docs/08`), MKT requirements, ADR-010…015
- Next.js placeholder scaffold (noindex) + Vercel project linked to the GitHub repo
- Built ahead (no client input needed):
  - Tooling: Vitest, Playwright + axe accessibility checks, Prettier, CI, Renovate, Sanity backup workflow, change-request issue form
  - `src/lib`: money (cents), dates (Europe/Riga, DST-safe), env (zod), formatting, with unit tests
  - Sanity: embedded Studio at `/studio`, task-based menu, 11 page-builder blocks, content schemas (settings, announcement, home, pages, regions, places, experiences, cancellation policies, guides, redirects), TypeGen, Help tool, automatic redirect on address change
  - Site: layout (header, footer, announcement bar), home, landing pages, destinations, places, experiences (display only), guides, 404, SEO metadata, sitemap, robots (noindex until launch), publish webhook, Edge Config redirects

## Next
- Send `docs/07-client-questions.md` to the client; log answers in its Answer log
- Book a brand/design workshop
- After answers: update the ADRs and PRD, then freeze PRD v1.0 (M1)

## Needs accounts before it can go live
- Sanity project (project ID, dataset, API token, webhook, CORS origin for the Vercel domain)
- Vercel Edge Config + token for redirects; Sentry; uptime monitor

## Deliberately not built yet (blocked)
- Booking engine, availability, promo codes, database schema: ADR-005 / Q-B6, Q-B7
- Languages / translated routing / UI labels: Q-C1
- Roles & permissions: Q-F1
- Shop: ADR-003 / Q-B2, Shopify account
- Remaining blocks: product rail (ADR-003), map (Mapbox account), form (Q-D4), countdown (promotions)

## Blockers
- All 🔴 P1 client questions are open (top 8 listed in `docs/07-client-questions.md`)

## Decisions log
| Date | Decision | Ref |
|---|---|---|
| 2026-09-27 | Proposed stack: Next.js/Vercel + Sanity + Shopify (shop) + Stripe (bookings) + Postgres | ADR-001…009 |
| 2026-09-27 | Non-technical marketer self-service is a core requirement: Studio as single workspace, availability/promos/redirects/email copy in Sanity, automated maintenance | ADR-010…015 |
