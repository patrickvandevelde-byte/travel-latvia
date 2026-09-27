# Travel Latvia (working title)

A headless travel platform: discover Latvia, book experiences, shop Latvian products, and request tailor-made trips. A non-technical marketer runs it day to day from Sanity Studio.

**Status:** Phase 0 (discovery). The foundation and content site are built ahead; bookings and the shop wait on client decisions. See [.planning/STATE.md](.planning/STATE.md).

```bash
pnpm install
pnpm dev        # site at http://localhost:3000, content studio at /studio
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Without Sanity settings the site shows a "coming soon" page and the Studio shows setup instructions.

## Connecting services

1. **Sanity:** create a project at sanity.io/manage with datasets `production` and `staging`.
   - Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in Vercel (Production → `production`; Preview and Development → `staging`).
   - Add the site URLs (localhost, preview, production) under API → CORS origins, with credentials allowed.
   - Add a webhook: `POST https://<site>/api/revalidate`, on create/update/delete, projection `{ _type, "slug": slug.current }`, with a secret. Store the secret as `SANITY_REVALIDATE_SECRET`.
2. **Redirects (optional until launch):** create a Vercel Edge Config and connect it to the project, which sets `EDGE_CONFIG`. Then set `EDGE_CONFIG_ID` and `EDGE_CONFIG_WRITE_TOKEN` (a Vercel access token).
3. **Search engines:** the site stays `noindex` until `SITE_LAUNCHED=true` is set in Production.

## Documents

| # | Doc | Purpose |
|---|---|---|
| 01 | [Project charter](docs/01-project-charter.md) | Why, scope, milestones, risks, governance |
| 02 | [Deliverables](docs/02-deliverables.md) | What gets delivered per phase and its acceptance criteria |
| 03 | [Services](docs/03-services.md) | What the platform sells + system-of-record map |
| 04 | [Key designs](docs/04-design.md) | IA, templates, flows, components, visual direction |
| 05 | [PRD](docs/05-prd.md) | Requirements with IDs |
| 06 | [Architecture](docs/06-architecture.md) | Stack, data models, flows, environments, ADRs |
| 07 | [Client questions](docs/07-client-questions.md) | Open decisions blocking spec freeze |
| 08 | [Marketer self-service](docs/08-marketer-self-service.md) | How a non-technical marketer runs the site; guardrails; maintenance; autonomy test |
| 09 | [Finish questionnaire](docs/09-finish-questionnaire.md) | Decisions, accounts and content the owner/marketer must supply to finish and launch |

AI-assisted development: see [CLAUDE.md](CLAUDE.md) and [.planning/](.planning/) (GSD workflow).

## Stack

Next.js · Vercel · Sanity · Shopify · Stripe · Postgres (Neon) · Resend
