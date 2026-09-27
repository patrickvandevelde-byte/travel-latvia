# Client Questionnaire

**Purpose:** close the gaps that block spec freeze (M1). Every answer maps to a requirement, ADR or risk.

**How to answer:** reply inline below each question. "Don't know yet" is a valid answer; we'll propose a default.

**Priority:** 🔴 **P1** = blocks spec freeze / architecture · 🟡 **P2** = needed before the relevant phase · ⚪ **P3** = nice to know.

---

## Top 7: answer these first

| # | Question | Why it matters |
|---|---|---|
| 1 | **Q-B6** Do you run your own tours, resell other operators, or both? | Decides whether we build a booking engine or buy one, and whether payouts are needed (ADR-005) |
| 2 | **Q-B1** Exactly what will you sell at launch? | Scopes every build phase |
| 3 | **Q-A2** Final brand name and domain? | "Travel Latvia" collides with the official tourism brand (Risk R1) |
| 4 | **Q-E1** Will you sell packages (e.g. accommodation + tours)? Do you hold a tour operator registration? | Legal licence + insolvency cover (Risk R2) |
| 5 | **Q-B2** Must customers buy shop items and experiences in *one* basket? | Decides the Shopify/Stripe split (ADR-003) |
| 6 | **Q-C1** Which languages at launch? | Content and translation cost; routing |
| 7 | **Q-B5** Budget range and hard launch date? | Scope vs time trade-offs |

---

## A. Business & brand

- 🔴 **Q-A1** What is the legal entity (name, country, VAT number) that will be the merchant on Shopify and Stripe?
- 🔴 **Q-A2** What is the final brand name and domain? Do you already own it? (*latvia.travel* is the official national tourism portal, so we recommend a distinct name.)
- 🟡 **Q-A3** Do you have brand assets: logo, colours, fonts, tone of voice guide? If not, should design include a brand identity sprint?
- 🟡 **Q-A4** Name 3 websites you love (travel or not) and 3 competitors. What do you like or dislike about each?
- 🟡 **Q-A5** Is there an existing website, and what is its URL? What traffic does it get, and which pages rank well?

## B. Commercial model & offer

- 🔴 **Q-B1** Which services launch in v1? Tick all that apply and estimate how many of each:
  - [ ] Day tours / experiences (how many? ___)
  - [ ] Private tours
  - [ ] Multi-day itineraries with fixed dates
  - [ ] Tailor-made trips
  - [ ] Airport / intercity transfers
  - [ ] Physical shop products (how many SKUs? ___; any alcohol or food?)
  - [ ] Digital products (PDF guides, audio guides)
  - [ ] Gift vouchers
- 🔴 **Q-B2** How important is buying a shop product *and* an experience in one payment? What share of customers do you expect to do both?
- 🟡 **Q-B3** Gift vouchers: fixed value (e.g. €50) or a specific experience? Redeemable in the shop, on bookings, or both? Validity period?
- 🔴 **Q-B4** What does success look like at 3 and 12 months (bookings/month, revenue, inquiries)? Please confirm or adjust Charter §2.
- 🔴 **Q-B5** What is the budget range for build and for monthly running costs? Is there a hard launch date (e.g. before the summer season)?
- 🔴 **Q-B6** Operating model:
  - Own tours only, resell partners, or both?
  - If partners: do they get paid out automatically (marketplace), or do you invoice them?
  - Do you already use a booking system (Bókun, FareHarbor, Rezdy, Regiondo, spreadsheets)?
  - Do you need to distribute to Viator / GetYourGuide / Airbnb Experiences?
  - Do you need to schedule guides or vehicles (resources), or just capacity per slot?
- 🟡 **Q-B7** Pricing: per person with adult/child/senior rates? Private group prices? Seasonal prices? Early-bird or last-minute discounts? Are prices incl. VAT?
- 🟡 **Q-B8** Cancellation policy (e.g. free cancellation up to 24 h)? Same for all experiences?
- 🟡 **Q-B9** Payment rules: full payment at booking, or a deposit? Deposit % and balance due date for trips and tailor-made? Pay-on-site allowed?
- ⚪ **Q-B10** Do you serve B2B customers (agencies, corporate/MICE, schools) with net rates or invoicing?

## C. Audience & content

- 🔴 **Q-C1** Which languages at launch, and which later? (Common set: EN, DE, LV, plus one of FI/SE/NO/PL/FR depending on markets.) Who translates?
- 🟡 **Q-C2** Top 3 source markets and customer profiles (age, travel style, budget)?
- 🟡 **Q-C3** Who writes content and who provides photography/video? Do you have rights to all imagery?
- 🟡 **Q-C4** At launch, how many destination pages, experiences and guides? Do you have a list?
- ⚪ **Q-C5** Any seasonal campaigns we should plan for (Jāņi / midsummer, Christmas markets, winter activities)?

## D. Technology & operations

- 🔴 **Q-D1** Which accounts already exist: Shopify (plan?), Stripe, Sanity, Vercel, GitHub, domain registrar, Google Workspace / Microsoft 365? Who is the admin of each?
- 🟡 **Q-D2** Who handles bookings day to day, and how many staff need `/admin` access? Do guides need a mobile manifest view?
- 🟡 **Q-D3** If there is an existing site: which content must be migrated, and do we need to preserve URLs for SEO?
- 🟡 **Q-D4** Which tools do you already use or prefer?
  - Newsletter (Mailchimp, Klaviyo, Brevo…)
  - CRM (HubSpot, Pipedrive…)
  - Analytics (GA4, Plausible, Mixpanel…)
  - Reviews (Tripadvisor, Google, Trustpilot)
  - Live chat / WhatsApp
- 🟡 **Q-D5** Customer support: which channels (email, phone, WhatsApp), and in what hours?
- ⚪ **Q-D6** Do you need accounting integration (e.g. Xero, Jumis, Horizon) for Stripe and Shopify payouts?

## E. Legal, tax & finance

- 🔴 **Q-E1** Will you sell combinations of travel services (e.g. multi-day trips including accommodation or transport)? Are you registered as a tour operator with Latvia's Consumer Rights Protection Centre (PTAC), and do you have insolvency protection? *(EU Package Travel Directive 2015/2302.)*
- 🔴 **Q-E2** Has your accountant confirmed the VAT treatment of your services (e.g. EU Tour Operator Margin Scheme) and invoicing requirements?
- 🟡 **Q-E3** Have you checked which payment providers Shopify offers your legal entity (Shopify Payments availability, or a third-party gateway)?
- 🟡 **Q-E4** Do you have Terms & Conditions, booking conditions, a privacy policy and a cookie policy, or should these be drafted by your counsel?
- ⚪ **Q-E5** Do you carry liability insurance for activities? Should any insurance text or upsell appear during booking?

---

## Answer log

| Q | Answer | Date | Impact (doc/ADR updated) |
|---|---|---|---|
| | | | |
