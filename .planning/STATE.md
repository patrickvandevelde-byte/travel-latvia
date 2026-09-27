# STATE

**Current phase:** 0 — Discovery & spec freeze
**Last updated:** 2026-09-27

## Done
- Draft charter, deliverables, services, design, PRD, architecture, client questionnaire
- Claude Code setup: `CLAUDE.md`, `.mcp.json`, `.env.example`, `.planning/`
- Marketer self-service model (`docs/08`), MKT requirements, ADR-010…015

## Next
- Send `docs/07-client-questions.md` to the client; log answers in its Answer log
- Book a brand/design workshop
- After answers: update the ADRs and PRD, then freeze PRD v1.0 (M1)

## Blockers
- All 🔴 P1 client questions are open (top 8 listed in `docs/07-client-questions.md`)

## Decisions log
| Date | Decision | Ref |
|---|---|---|
| 2026-09-27 | Proposed stack: Next.js/Vercel + Sanity + Shopify (shop) + Stripe (bookings) + Postgres | ADR-001…009 |
| 2026-09-27 | Non-technical marketer self-service is a core requirement: Studio as single workspace, availability/promos/redirects/email copy in Sanity, automated maintenance | ADR-010…015 |
