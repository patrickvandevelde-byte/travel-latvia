# REQUIREMENTS — traceability

Full wording lives in `docs/05-prd.md`. This file tracks **scope (v1/v2)**, **phase** and **status**.

Status: `todo` · `in-progress` · `done` · `blocked (Q-xx)`

## v1

| ID | Summary | Pri | Phase | Status |
|---|---|---|---|---|
| CMS-01 | Studio at /studio, roles | P0 | 1 | todo |
| CMS-02 | Schemas + validation | P0 | 1 | todo |
| CMS-03 | Draft preview + visual editing | P0 | 2 | todo |
| CMS-04 | Publish → revalidate < 60 s | P0 | 2 | todo |
| CMS-05 | Scheduled publishing / releases | P0 | 2 | todo |
| CMS-06 | Redirect management | P0 | 2 | todo |
| CONT-01 | Composable home | P0 | 2 | todo |
| CONT-02 | Region & place pages | P0 | 2 | todo |
| CONT-03 | Experience listing + filters | P0 | 2 | todo |
| CONT-04 | Experience detail | P0 | 2 | todo |
| CONT-05 | Guides / blog | P0 | 2 | todo |
| CONT-06 | Practical info + static pages | P0 | 2 | todo |
| CONT-07 | Multi-day trip pages | P1 | 5 | blocked (Q-E1) |
| CONT-08 | Site search | P1 | 2 | todo |
| I18N-01 | Locale routing | P0 | 2 | blocked (Q-C1) |
| I18N-02 | Document-level translations | P0 | 2 | blocked (Q-C1) |
| I18N-03 | hreflang + localised slugs | P0 | 2 | todo |
| I18N-04 | Localised emails | P1 | 4 | todo |
| I18N-05 | EUR display; Shopify Markets | P1 | 3 | todo |
| SEO-01 | Metadata | P0 | 2 | todo |
| SEO-02 | Sitemaps / robots | P0 | 2 | todo |
| SEO-03 | Structured data | P0 | 2 | todo |
| SEO-04 | Stable URLs + legacy redirects | P0 | 6 | blocked (Q-D3) |
| SEO-05 | Dynamic OG images | P1 | 2 | todo |
| SHOP-01 | Shopify store setup | P0 | 3 | blocked (Q-D1, Q-E3) |
| SHOP-02 | Collections | P0 | 3 | todo |
| SHOP-03 | PDP | P0 | 3 | todo |
| SHOP-04 | Cart + drawer | P0 | 3 | todo |
| SHOP-05 | Hosted checkout | P0 | 3 | todo |
| SHOP-06 | Sanity Connect sync | P1 | 3 | todo |
| SHOP-07 | Shopify webhooks → revalidate | P0 | 3 | todo |
| BOOK-01 | Options + rate categories | P0 | 4 | blocked (Q-B6, Q-B7) |
| BOOK-02 | Schedules in Studio → slots in Postgres | P0 | 4 | blocked (Q-B6) |
| BOOK-03 | Availability API | P0 | 4 | todo |
| BOOK-04 | Atomic holds, no overbooking | P0 | 4 | todo |
| BOOK-05 | Booking widget | P0 | 4 | todo |
| BOOK-06 | Min/max pax, cutoff, min age | P0 | 4 | todo |
| BOOK-07 | Booking reference | P0 | 4 | todo |
| BOOK-08 | Manage booking (magic link) | P0 | 4 | todo |
| BOOK-09 | Self-service cancel + refund | P1 | 4 | blocked (Q-B8) |
| BOOK-10 | Promo codes (→ MKT-08) | P0 | 4 | todo |
| PAY-01 | Stripe Checkout | P0 | 4 | todo |
| PAY-02 | Server-side pricing | P0 | 4 | todo |
| PAY-03 | Verified, idempotent webhooks | P0 | 4 | todo |
| PAY-04 | Refunds from back-office | P0 | 4 | todo |
| PAY-05 | Deposit + balance | P1 | 5 | blocked (Q-B9) |
| PAY-06 | VAT handling | P1 | 4 | blocked (Q-E2) |
| NOTIF-01 | Confirmation email | P0 | 4 | todo |
| NOTIF-02 | Ops alerts | P0 | 4 | todo |
| NOTIF-03 | 48 h reminder | P1 | 4 | todo |
| NOTIF-04 | Cancellation email | P0 | 4 | todo |
| NOTIF-05 | Newsletter sign-up | P1 | 2 | blocked (Q-D4) |
| OPS-01 | Bookings tool in Studio + roles | P0 | 4 | todo |
| OPS-02 | Bookings list/detail | P0 | 4 | todo |
| OPS-03 | Daily manifest export | P0 | 4 | todo |
| OPS-04 | Manage schedules/slots | P0 | 4 | todo |
| OPS-05 | Manual bookings | P0 | 4 | todo |
| OPS-06 | Cancel/refund + audit log | P0 | 4 | todo |
| OPS-07 | Dashboard | P1 | 6 | todo |
| TRIP-01 | Inquiry form | P0 | 5 | todo |
| TRIP-02 | Inquiry pipeline | P0 | 5 | todo |
| TRIP-03 | Quote + payment link | P1 | 5 | todo |
| TRIP-04 | Deposit webhook → status | P1 | 5 | todo |
| ANLY-01 | Consent banner | P0 | 2 | todo |
| ANLY-02 | Funnel events | P0 | 4 | blocked (Q-D4) |
| ANLY-03 | Vercel Analytics + GA4/alt | P0 | 2 | todo |
| ANLY-04 | Server-side conversions | P1 | 4 | todo |
| MKT-01 | Task-based Studio structure + field help | P0 | 1 | todo |
| MKT-02 | Page builder: blocks + templates | P0 | 2 | todo |
| MKT-03 | Visual editing + device preview | P0 | 2 | todo |
| MKT-04 | Campaign releases | P0 | 2 | todo |
| MKT-05 | Global settings, announcement, UI labels | P0 | 2 | todo |
| MKT-06 | Redirects + auto-redirect on slug change | P0 | 2 | todo |
| MKT-07 | SEO tab with previews/warnings | P0 | 2 | todo |
| MKT-08 | Promo codes in Studio | P0 | 4 | todo |
| MKT-09 | Availability in Studio with guardrails | P0 | 4 | blocked (Q-B6) |
| MKT-10 | Bookings tool in Studio | P0 | 4 | todo |
| MKT-11 | Editable email copy | P1 | 4 | todo |
| MKT-12 | GTM + Consent Mode v2 | P0 | 2 | todo |
| MKT-13 | AI Assist (translate, alt text, SEO) | P1 | 2 | blocked (Q-F6) |
| MKT-14 | Configurable forms | P1 | 2 | todo |
| MKT-15 | Studio dashboard + to-do | P1 | 6 | todo |
| MKT-16 | Restore + delete protection | P0 | 2 | todo |
| MKT-17 | Least-privilege roles | P0 | 1 | blocked (Q-F1) |
| MKT-18 | Help hub in Studio | P0 | 6 | todo |
| MKT-19 | Change-request pipeline (Claude Code) | P1 | 6 | blocked (Q-F3) |
| MKT-20 | Automated maintenance | P0 | 1 | todo |
| NFR-01…10 | Non-functional (perf, a11y, security, privacy…) | P0 | all | todo |
| NFR-11 | Marketer autonomy test ≥ 18/20 | P0 | 6 | todo |
| COMP-01…05 | Compliance support | P0 | 6 | blocked (Q-E1, Q-E2, Q-E4) |

## v2 (out of scope for v1)

CONT-09 reviews widget · MKT-21 A/B testing · SHOP-08 customer accounts · BOOK-11 add-ons · BOOK-12 multi-experience basket · PAY-07 Stripe Connect · TRIP-05 CRM sync · OTA/channel distribution · native app.
