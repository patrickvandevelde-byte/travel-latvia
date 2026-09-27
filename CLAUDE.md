# CLAUDE.md — Travel Latvia

Headless travel platform for Latvia. It covers editorial discovery content, experience **bookings** (Stripe), a **shop** (Shopify) and **tailor-made trip** inquiries. Hosted on Vercel.

**Primary user of the back end: a non-technical marketer.** They run everything from Sanity Studio. Build every feature so that it can be managed from there (`docs/08-marketer-self-service.md`).

## Source of truth: read before coding

| Need | File |
|---|---|
| Why / scope / risks | `docs/01-project-charter.md` |
| What to build (requirement IDs) | `docs/05-prd.md` |
| How to build it | `docs/06-architecture.md` |
| UI, IA, components, tokens | `docs/04-design.md` |
| Which system owns which data | `docs/03-services.md` §2.1 |
| Open client decisions | `docs/07-client-questions.md` |
| Marketer workspace, guardrails, autonomy test | `docs/08-marketer-self-service.md` |
| Current phase / progress | `.planning/STATE.md`, `.planning/ROADMAP.md` |

**Do not implement anything that depends on an unanswered 🔴 P1 question or an ADR marked "Needs client input".** Stop and surface the question instead.

## Workflow (GSD, spec-driven)

1. Pick the next plan from `.planning/ROADMAP.md` for the current phase in `.planning/STATE.md`.
2. Every change references requirement IDs (e.g. `BOOK-04`) in the commit message and PR.
3. Small atomic commits. Tests come before or alongside code for `src/modules/**`.
4. When a phase plan is done, update `.planning/REQUIREMENTS.md` (status) and `.planning/STATE.md`.
5. When a decision changes the architecture, add or update an ADR in `docs/06-architecture.md` §13.

## Stack

Next.js (App Router, TS strict) · Tailwind + shadcn/ui · Sanity (embedded Studio at `/studio`, next-sanity, TypeGen, AI Assist, custom Studio tools) · Shopify Storefront API · Stripe Checkout · Postgres (Neon) + Drizzle · Vercel Edge Config · GTM · Renovate · Resend + React Email · next-intl · Zod · Vitest · Playwright · pnpm.

## Commands (available once Phase 1 scaffold lands)

```bash
pnpm dev                 # local dev (needs .env.local — `vercel env pull .env.local`)
pnpm build && pnpm start
pnpm lint && pnpm typecheck
pnpm test                # vitest
pnpm test:e2e            # playwright
pnpm db:generate         # drizzle-kit generate
pnpm db:migrate          # apply migrations
pnpm sanity:typegen      # regenerate GROQ types after schema/query changes
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Non-negotiable rules

- **Money:** integer cents + ISO currency (`EUR`). Never floats. Use `src/lib/money.ts`.
- **Time:** store UTC (`timestamptz`); display and compute slot days in `Europe/Riga`. Use `src/lib/dates.ts`.
- **Prices are computed server-side** from Sanity (published perspective) + Postgres. Never trust client-sent amounts.
- **Inventory:** all capacity changes go through `src/modules/booking/inventory.ts`, inside a transaction with `SELECT … FOR UPDATE`. Never write `slot.booked` anywhere else.
- **Webhooks:** verify the signature first, dedupe via `webhook_event`, and make handlers idempotent. Return 2xx only after the transaction commits.
- **System of record:** do not copy data owned by another system into a new store (see `docs/03-services.md` §2.1).
- **Secrets:** never commit `.env*` (except `.env.example`). Never prefix a secret with `NEXT_PUBLIC_`.
- **Stripe & Shopify:** use test mode / the dev store everywhere except production. Never call live keys from local or preview.
- **Accessibility:** WCAG 2.1 AA is part of Done. Use Radix/shadcn primitives, label every input, keep the booking flow keyboard-complete.
- **i18n:** no hard-coded UI strings; use `messages/*.json`. Keep Latvian diacritics (Rīga, Cēsis, Ķemeri).
- **Validation:** Zod at every boundary (route handlers, server actions, env, webhooks).

## Marketer-first rules (self-service)

- **If the marketer can see it, the marketer can edit it.** No hard-coded marketing copy, images, links, CTAs, menu items, SEO text or email wording. System strings (validation errors) may live in `messages/*.json`.
- **Routine work never needs code, a deploy, Vercel or GitHub.** If a feature needs any of these for a routine change, the design is wrong. Raise it.
- **Every page-builder block** ships with a Studio preview thumbnail, a plain-language title and description, sensible defaults, validation and a fixed set of design-system variants. Never offer free colour, font or HTML fields.
- **Every schema field**: plain-language `title`, a `description` with an example when not obvious, and validation (required, length, image dimensions, alt text).
- **Destructive or booking-affecting actions** (capacity cuts, blackouts, deletes, refunds) go through guarded Studio document actions that show the impact and ask for confirmation.
- **Update the handbook:** a new marketer-facing feature adds or updates its how-to in `sanity/help/` and the task matrix in `docs/08` §4.
- **Studio tool APIs** (`/api/studio/*`) verify the Sanity user and role server-side on every request.

## Code conventions

- Domain logic lives in `src/modules/<domain>/`. It is framework-agnostic and unit-tested. Route handlers and server actions stay thin.
- GROQ queries live in `src/modules/content/queries.ts` and use `defineQuery` for TypeGen.
- Shopify GraphQL lives in `src/modules/shop/queries/`, typed via codegen.
- Server Components by default; `"use client"` only for interactive islands (booking widget, cart, forms).
- Cache tags: `sanity:<type>:<slug>`, `shopify:product:<handle>`, `shopify:collection:<handle>`.

## MCP servers (see `.mcp.json`)

- **Sanity:** query/patch content, deploy schema, read Sanity docs and rules.
- **Vercel:** projects, env vars, deployments, logs.
- **Stripe:** test-mode objects, docs. Never use it against live mode without explicit approval.
- **Shopify Dev:** Storefront/Admin API docs and GraphQL schema validation.
- **GitHub:** built into the environment.

@AGENTS.md
