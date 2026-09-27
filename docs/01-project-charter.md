# Project Charter — Travel Latvia Platform

| | |
|---|---|
| **Status** | DRAFT v0.1 — awaiting client answers ([07-client-questions.md](./07-client-questions.md)) |
| **Date** | 2026-09-27 |
| **Working title** | Travel Latvia (name is provisional, see Risk R1) |
| **Client / Sponsor** | _TBC_ |
| **Delivery lead** | _TBC_ |

---

## 1. Executive summary (SCQA)

**Situation.** Latvia is an under-marketed Baltic destination with strong demand drivers: Rīga old town (UNESCO), the Gauja and Ķemeri national parks, Jūrmala coast, Art Nouveau heritage, and direct low-cost flights into RIX. Travellers research on content sites, then book fragmented local operators by email, phone or third-party OTAs.

**Complication.** No single, well-designed place lets an international traveller *discover* Latvia, *book* experiences with live availability, *buy* related products (guides, gifts, vouchers) and *request* a tailor-made trip. Operators that try to build this typically end up with a WordPress site plus disconnected booking plug-ins, manual invoicing and no reliable data.

**Question.** How do we launch a fast, editorially rich, commerce-capable travel platform that the client's team can run themselves, within a lean budget and a ~14-week window?

**Answer.** Build a headless platform on **Next.js + Vercel**, with **Sanity** as the editorial CMS, **Shopify** for physical/digital shop products, and **Stripe** for experience bookings and trip deposits. Operational data (availability, bookings, inquiries) lives in **Postgres**. Delivery is AI-assisted with **Claude Code** under a spec-driven (GSD) workflow, so every feature traces back to a requirement in the PRD.

---

## 2. Objectives

Targets are proposed and must be confirmed by the client (Q-B4).

| # | Objective | Measure | Proposed target |
|---|---|---|---|
| O1 | Launch a bookable platform | Go-live of v1 scope (PRD §6) | Week 14 after kick-off |
| O2 | Convert traffic into revenue | Booking conversion (session → paid booking) | ≥ 1.5 % within 3 months of launch |
| O3 | Grow the shop | Shop orders / month | Baseline set at month 1, +20 % by month 6 |
| O4 | Generate high-value leads | Qualified tailor-made inquiries / month | ≥ 20 by month 3 |
| O5 | Be fast and findable | Core Web Vitals "Good" on ≥ 90 % of URLs; indexed pages | By launch + 30 days |
| O6 | Client self-sufficiency | Editors publish content and manage bookings with no developer help | By launch |

---

## 3. Scope

### 3.1 In scope (v1)

1. **Discovery content** — destinations, regions, experiences, travel guides / blog, practical info.
2. **Experience booking** — date/slot availability, participant types, Stripe payment, confirmation email, manage-booking link.
3. **Shop** — headless Shopify catalogue, cart and Shopify-hosted checkout.
4. **Tailor-made trips** — inquiry form, internal quote workflow, Stripe deposit payment.
5. **CMS** — Sanity Studio with visual editing/preview for all editorial content and experience definitions.
6. **Operations back-office (lightweight)** — booking list, slot/capacity management, manual booking, cancel/refund.
7. **Multilingual** — EN at launch + up to 2 additional locales (TBC, Q-C1).
8. **Foundations** — SEO, analytics with consent, GDPR, WCAG 2.1 AA accessibility, monitoring.
9. **Claude Code setup** — CLAUDE.md, MCP servers, GSD planning files, CI.

### 3.2 Out of scope (v1) — candidates for v2

- Customer accounts / loyalty (guest checkout + magic link in v1)
- Multi-supplier marketplace with payouts (Stripe Connect)
- Channel-manager / OTA distribution (Viator, GetYourGuide, Bókun)
- Flights, hotels or dynamic packaging
- Native mobile app
- Reviews platform (v1 may embed a third-party widget)
- Migration of legacy content beyond an agreed list (Q-D3)

---

## 4. Deliverables (summary)

Full breakdown, acceptance criteria and owners: [02-deliverables.md](./02-deliverables.md).

| Phase | Key deliverables |
|---|---|
| 0 Discovery | Signed charter, answered questionnaire, brand inputs, final PRD |
| 1 Foundation | Repo, Vercel environments, Sanity Studio + schemas, design system, CI |
| 2 Content site | Home, destinations, experiences (display), guides, i18n, SEO |
| 3 Shop | Shopify headless catalogue, cart, checkout, webhooks |
| 4 Bookings | Availability engine, Stripe checkout, emails, manage booking, back-office |
| 5 Tailor-made | Inquiry → quote → deposit flow |
| 6 Launch | QA, performance, accessibility, legal pages, go-live, hand-over |

---

## 5. Milestones

Relative to kick-off (week 0). Dates are fixed once Phase 0 closes.

| Milestone | Week | Gate |
|---|---|---|
| M0 Kick-off | 0 | Charter signed |
| M1 Spec freeze | 2 | PRD v1.0 + design direction approved |
| M2 Foundation live on preview URL | 4 | Studio usable, design system in Storybook/preview |
| M3 Content site feature-complete | 7 | Client content entry starts |
| M4 Commerce complete (shop + bookings) | 11 | End-to-end test purchases in Stripe/Shopify test mode |
| M5 UAT sign-off | 13 | No open P1/P2 defects |
| M6 Go-live | 14 | Production cut-over, DNS, monitoring |
| M7 Hyper-care end | 18 | Hand-over complete |

---

## 6. Stakeholders & RACI

| Activity | Client sponsor | Client content/ops | Delivery lead | Developer(s) + Claude Code | Designer |
|---|---|---|---|---|---|
| Scope & budget decisions | **A** | C | R | I | I |
| Brand & visual design | A | C | C | I | **R** |
| PRD & architecture | C | C | **A/R** | R | C |
| Build & test | I | I | A | **R** | C |
| Content entry & translation | A | **R** | C | I | I |
| Legal/compliance (T&Cs, travel licence, VAT) | **A/R** | C | C | I | I |
| UAT & go-live decision | **A** | R | R | C | I |

R = Responsible, A = Accountable, C = Consulted, I = Informed.

---

## 7. Budget

_TBC (Q-B5)._ Recurring platform costs are estimated in [06-architecture.md §12](./06-architecture.md#12-cost-envelope-monthly-indicative-verify-at-purchase).

---

## 8. Top risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R1 | **Name / brand conflict.** "Travel Latvia" / *latvia.travel* is used by the official national tourism portal (LIAA). | High | High | Confirm brand name and domain before design (Q-A2). Avoid confusing similarity. |
| R2 | **Package Travel regulation.** Selling combined services (e.g. accommodation + tour) may make the client a package organiser under EU Directive 2015/2302, requiring registration with Latvia's PTAC and insolvency protection. | High | Medium | Legal confirmation before launch (Q-E1). v1 can restrict to single-service experiences. |
| R3 | **Two checkouts** (Shopify for shop, Stripe for bookings) confuse customers if they want both in one basket. | Medium | Medium | Clear UX separation; ADR-003. Re-evaluate once order mix is known (Q-B2). |
| R4 | **Content readiness.** Platform ready, content not. | High | High | Content plan and entry start at M3; templates and word-count guidance in Studio. |
| R5 | **Overbooking** from concurrent checkouts or offline sales. | High | Low | Transactional holds with expiry; single source of truth for inventory (see Architecture §6). |
| R6 | **VAT treatment** of travel services (EU Tour Operator Margin Scheme) affects pricing display and invoicing. | Medium | Medium | Accountant sign-off (Q-E2) before pricing logic is built. |
| R7 | **Accessibility compliance.** European Accessibility Act applies to e-commerce since June 2025. | Medium | Medium | WCAG 2.1 AA as a Definition-of-Done criterion; automated + manual audits. |

---

## 9. Assumptions & constraints

**Assumptions** (each one is also a client question):

- The client operates or resells **its own experiences** (single merchant of record) in v1 — not a multi-supplier marketplace.
- Currency **EUR**, operating time zone **Europe/Riga**.
- The client has, or will open, **Shopify** (Basic plan or higher) and **Stripe** accounts in its own legal entity.
- The client provides photography, copy and translations, or budgets for them.
- English is the primary language.

**Constraints**

- Hosting on Vercel; code in GitHub (`travel-latvia` repo).
- GDPR and Latvian consumer law apply.
- Payments must be SCA / 3-D Secure compliant (handled by Stripe and Shopify).

---

## 10. Governance

- **Cadence:** weekly 30-min status (progress, risks, decisions); fortnightly demo on the preview URL.
- **Decision log:** Architecture Decision Records in [06-architecture.md §13](./06-architecture.md#13-architecture-decision-records).
- **Change control:** anything not in PRD v1.0 is logged as a change request with an impact estimate; the sponsor approves.
- **Definition of Done:** requirement ID satisfied, tests pass, preview deployed, WCAG 2.1 AA checks pass, docs updated.

---

## 11. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Client sponsor | | | |
| Delivery lead | | | |
