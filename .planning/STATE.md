# STATE

**Current phase:** 2 — Content site (Baltique scope, ADR-016). Design implemented from the briefing (docs/10).
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
- Baltique design (from the briefing zip, 2026-09-27):
  - Brand tokens and fonts; header with stamp logo; footer panel
  - New blocks: brand hero, page title, text + image, enquiry form, guides/itineraries list, polaroids; two-column text
  - Pages: Home, Services, Itineraries (/guides), About, Contact with the mockup copy verbatim, placeholders kept in [brackets]
  - Enquiry pipeline: validated form → `/api/enquiries` → Sanity `enquiry` document + owner email; mailto fallback until configured; Studio "Enquiries" menu
  - Demo content mode (groq-js over the seed) so previews render without Sanity; `pnpm seed:ndjson` for the first import
  - Playwright: h1/menu/form/API checks and axe WCAG 2.1 AA on all five pages, desktop + mobile

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

## Before launch (from the briefing, SPEC §6)
- Replace 5 watermarked Getty comps + confirm rights on the other photos
- Real itineraries/guides (3–5), reviews (or keep hidden), 3 personal polaroid photos
- Verify phone number, Instagram URL, privacy + terms pages, site domain
- NL version (Q-C1), Sanity project + write token + Resend for the form

## Blockers
- Remaining 🔴 P1 questions in `docs/09-finish-questionnaire.md` (Word version sent to the client)

## Decisions log
| Date | Decision | Ref |
|---|---|---|
| 2026-09-27 | Proposed stack: Next.js/Vercel + Sanity + Shopify (shop) + Stripe (bookings) + Postgres | ADR-001…009 |
| 2026-09-27 | Non-technical marketer self-service is a core requirement: Studio as single workspace, availability/promos/redirects/email copy in Sanity, automated maintenance | ADR-010…015 |
