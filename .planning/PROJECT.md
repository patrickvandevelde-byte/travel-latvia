# PROJECT — Travel Latvia

**One-liner:** A headless travel platform where international travellers discover Latvia, book local experiences with live availability, buy Latvian products and request tailor-made trips.

**Core value:** Book a Latvian experience in under 2 minutes on mobile, with an honest price and instant confirmation.

**Operating principle:** a non-technical marketer runs the whole site from Sanity Studio without a developer (`docs/08-marketer-self-service.md`). Technical upkeep is automated and backed by a retainer.

**Stack:** Next.js on Vercel · Sanity · Shopify (shop) · Stripe (bookings) · Postgres/Neon · Claude Code (GSD).

**Detailed specs:** `docs/01-project-charter.md`, `docs/05-prd.md`, `docs/06-architecture.md`, `docs/04-design.md`.

## Constraints
- EUR, Europe/Riga, GDPR, WCAG 2.1 AA, SCA.
- Single merchant of record in v1 (assumption, see Q-B6).
- ~14-week build window (assumption, see Q-B5).

## Key decisions pending (block the related phases)
- ADR-003 Shopify/Stripe split → Q-B2
- ADR-004 Gift vouchers → Q-B3
- ADR-005 Build vs buy booking engine → Q-B6
- Package-travel legal status → Q-E1
- Who runs the site / bookings; maintenance model → Q-F1, Q-F3
- ADR-010 spike: Bookings tool inside Studio vs `/admin` fallback (Phase 1)
