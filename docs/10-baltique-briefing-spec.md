# Baltique website — SPEC

Static site for **Baltique**, a boutique travel agency (Fabienne Verschelde) selling bespoke journeys and hunting trips in Latvia. Distilled from the Canva mockup `Baltique - Website ENG.pdf` (5 pages, 21 Sept 2026).

This folder is a complete, dependency-free v0. Open `index.html` in a browser; no build step.

## 1. Scope

| In v0 | Not in v0 (backlog, see §6) |
|---|---|
| 5 pages: Home, Services, Itineraries (curated guides), About, Contact | NL translation |
| Shared header / footer, mobile nav | Real form backend |
| Enquiry form (mailto fallback) | Real itineraries / guides / reviews content |
| All real copy from the mockup | CMS |
| Brand tokens, fonts, image assets | Analytics, cookie banner, privacy/terms pages |

## 2. Structure

```
site/
  index.html          Home
  services.html       What we offer (bespoke journeys + hunting trips)
  itineraries.html    Our curated guides
  about.html          Why I started
  contact.html        Contact us
  css/styles.css      Single stylesheet, tokens in :root
  js/main.js          Mobile nav, carousel arrows, enquiry form
  assets/img/         Images extracted from the mockup (see §5)
  SPEC.md             This file
```

Header and footer markup is duplicated in each page on purpose (no templating). If the site grows, move to Astro or Eleventy and turn them into partials; nothing else needs to change.

## 3. Design tokens (sampled from the mockup)

| Token | Value | Use |
|---|---|---|
| `--cream` | `#FEF7EF` | page background |
| `--cream-deep` | `#F6EBDD` | footer band |
| `--red` | `#BD020A` | headings, nav, outlines, logo |
| `--forest` | `#2F4A2A` | Send button, script accents |
| `--ink` | `#2B2420` | body text |
| Display font | Instrument Serif (Google Fonts) | h1/h2/h3, condensed serif as in mockup |
| Script font | Caveat | handwritten taglines ("discover the undiscovered") |
| Body font | DM Sans | everything else |
| Radii | 28px panels, 18px images, pill buttons | |

Layout: 1200px container, 2-column feature blocks, 3-column card and review grids, all collapsing to 1 column below 760px.

## 4. Page contents (source of truth = mockup copy, verbatim)

**Home** — hero (logo wordmark + "discover the undiscovered" + pill "Bespoke boutique journeys in the Baltics") → "Four seasons. Endless forests." + Tailor-made journeys intro → Authentic hunting trips teaser → "A country waiting to be discovered." + founder intro → Plan your journey form → Itineraries carousel → Reviews → footer.

**Services** — "What we offer / only in Latvia" → Bespoke journeys to Latvia (full text, label "Journeys shaped around you") → Hunting trips in Latvia (full text, label "Hunt the way it used to be") → form → reviews.

**Itineraries** — "Our curated guides / beyond bucket lists" → 2-paragraph intro → 3×2 card grid, one card is the CTA "Can't find what you're dreaming of? Get in touch anyway."

**About** — "Why I started / sharing my experiences" → Fabienne's story (7 paragraphs) → polaroid strip (3 photos).

**Contact** — "Contact us / we'll get back to you" over photo → card with name, email, phone and 2 paragraphs → form.

**Footer (all pages)** — stamp logo, "Bespoke boutique journeys in the Baltics", Fabienne Verschelde, info@balt-run.com, +32 4981 12 36 30, Instagram / email / WhatsApp icons.

## 5. Assets

All images in `assets/img/` were extracted from the PDF and downscaled (max 1800px, JPEG q82). `logo-stamp.png` is the stamp logo with transparency.

**Licensing flags. Five images are watermarked Getty comps in the mockup and must be licensed or replaced before launch:** `folk-boots.jpg`, `river-autumn.jpg`, `riga-skyline.jpg`, `winter-tree.jpg`, `frost-forest.jpg`. `snow-forest.jpg` carries a faint Adobe Stock mark. `hero-aerial-lake.jpg`, `forest-woman.jpg`, `red-deer.jpg`, `sunset-sky.jpg`, `winter-aerial.jpg`, `jeep-road.jpg`, `jeep-view.jpg` show no watermark but their source is unknown; confirm rights.

## 6. Placeholders and open items

Placeholders are marked `[like this]` in the HTML and with `<!-- PLACEHOLDER -->` comments.

1/ **Itineraries (home carousel)** — mockup used template copy ("2023 Axis S Comfortline"). Needs 3 to 5 real itineraries: title, teaser, image, link.
2/ **Curated guides (itineraries page)** — 5 cards with lorem ipsum in mockup. Needs real guide titles, teasers and destinations (blog posts or PDFs). Decide: blog section on-site, or external links.
3/ **Reviews** — lorem ipsum in mockup. Needs 3 to 5 real, attributed quotes. Remove the section until then rather than ship placeholders.
4/ **About polaroids** — mockup shows empty frames. Needs 3 personal photos.
5/ **Form backend** — `js/main.js` has `FORM_ENDPOINT = ''`; currently falls back to a pre-filled `mailto:`. Options: Formspree, Netlify Forms, or a small serverless function that emails info@balt-run.com. Add spam protection (honeypot or Turnstile). Form fields: name, email, phone, travel period, trip type (select), wishes.
6/ **NL version** — nav has an inert "NL" link. Mockup title says "ENG", so an NL mockup presumably exists. Plan: `/nl/` folder mirroring the 5 pages, `hreflang` tags, language switch keeps the current page.
7/ **Phone number** — mockup shows `+32 4981 12 36 30` (10 digits after the country code, unusual for a Belgian mobile). Verify with Fabienne before launch; `tel:` and WhatsApp links use it as printed.
8/ **Social links** — Instagram URL unknown; footer icon links to `#`.
9/ **Privacy / Terms** — footer links are `#`. Needed for GDPR given the enquiry form.
10/ **Domain and hosting** — email domain is balt-run.com; confirm the site domain. Static host (Netlify, Vercel, Cloudflare Pages) is enough.
11/ **SEO** — each page has a title and meta description; add OpenGraph image, `sitemap.xml`, `robots.txt` at launch.

## 7. Acceptance criteria (v0)

- [x] All 5 pages open locally, nav links and `aria-current` correct on each
- [x] Mobile nav toggles below 860px; layout single-column below 760px
- [x] Real mockup copy is verbatim; placeholders are explicit
- [x] Form submits (mailto fallback) and shows a status line
- [x] Fonts load from Google Fonts; fallbacks defined
- [ ] Watermarked images replaced (blocks launch)
- [ ] Placeholder content replaced (blocks launch)
- [ ] Form backend wired (blocks launch)
