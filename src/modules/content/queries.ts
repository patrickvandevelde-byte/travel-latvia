import { defineQuery } from "next-sanity";

/**
 * All GROQ queries live here and use defineQuery so `pnpm sanity:typegen`
 * generates their result types (CLAUDE.md code conventions).
 */

const image = /* groq */ `{ asset, hotspot, crop, alt, credit }`;

const link = /* groq */ `{
  label,
  kind,
  external,
  "internal": internal->{ _type, "slug": slug.current, "regionSlug": region->slug.current }
}`;

const experienceCard = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  summary,
  durationMinutes,
  priceFromCents,
  badges,
  "region": region->title,
  "image": images[0]${image}
}`;

const destinationCard = /* groq */ `{
  _id,
  _type,
  title,
  "slug": slug.current,
  "regionSlug": region->slug.current,
  summary,
  "image": heroImage${image}
}`;

const guideCard = /* groq */ `{
  _id, title, "slug": slug.current, excerpt, publishedAt, "category": category->title, "image": heroImage${image}
}`;

const sectionProjection = /* groq */ `{
  ...,
  _type == "heroBlock" => { image${image}, actions[]${link} },
  _type == "featureBlock" => { image${image}, action${link} },
  _type == "pageHeroBlock" => { image${image}, action${link} },
  _type == "polaroidsBlock" => { images[]${image} },
  _type == "guideListBlock" => {
    ctaLink${link},
    ctaImage${image},
    "items": select(
      mode == "manual" => guides[]->${guideCard},
      *[_type == "guide" && defined(slug.current)] | order(publishedAt desc) [0...12]${guideCard}
    )
  },
  _type == "ctaBandBlock" => { action${link} },
  _type == "galleryBlock" => { images[]${image} },
  _type == "videoBlock" => { poster${image} },
  _type == "destinationCardsBlock" => { "items": items[]->${destinationCard} },
  _type == "experienceGridBlock" => {
    "items": select(
      mode == "region" => *[_type == "experience" && region._ref == ^.region._ref && defined(slug.current)] | order(title asc) [0...12]${experienceCard},
      experiences[]->${experienceCard}
    )
  }
}`;

const sections = /* groq */ `sections[]${sectionProjection}`;

const seo = /* groq */ `seo{ title, description, noIndex, image${image} }`;

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  siteName,
  tagline,
  scriptTagline,
  founderName,
  logo${image},
  mainMenu[]${link},
  headerCta${link},
  footerHeadline,
  footerImage${image},
  footerColumns[]{ title, links[]${link} },
  legalLinks[]${link},
  email,
  phone,
  whatsapp,
  social,
  company,
  defaultSeo{ title, description, image${image} }
}`);

export const announcementQuery = defineQuery(`*[_id == "announcement" && enabled == true
  && (!defined(startsAt) || startsAt <= now())
  && (!defined(endsAt) || endsAt > now())][0]{ message, variant, link${link} }`);

export const homePageQuery = defineQuery(`*[_id == "homePage"][0]{ ${sections}, ${seo} }`);

export const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id, title, ${sections}, ${seo}
}`);

export const regionQuery = defineQuery(`*[_type == "region" && slug.current == $slug][0]{
  _id,
  title,
  summary,
  intro,
  heroImage${image},
  ${seo},
  "places": *[_type == "place" && region._ref == ^._id && defined(slug.current)] | order(title asc)${destinationCard},
  "experiences": *[_type == "experience" && region._ref == ^._id && defined(slug.current)] | order(title asc)${experienceCard}
}`);

export const placeQuery =
  defineQuery(`*[_type == "place" && slug.current == $slug && region->slug.current == $region][0]{
  _id,
  title,
  summary,
  intro,
  heroImage${image},
  gallery[]${image},
  quickFacts,
  "region": region->{ title, "slug": slug.current },
  ${seo},
  "experiences": *[_type == "experience" && ^._id in places[]._ref && defined(slug.current)] | order(title asc)${experienceCard}
}`);

export const regionsQuery = defineQuery(
  `*[_type == "region" && defined(slug.current)] | order(title asc)${destinationCard}`,
);

export const experiencesQuery = defineQuery(
  `*[_type == "experience" && defined(slug.current)] | order(title asc)${experienceCard}`,
);

export const experienceQuery = defineQuery(`*[_type == "experience" && slug.current == $slug][0]{
  _id,
  title,
  type,
  summary,
  highlights,
  images[]${image},
  description,
  itinerary,
  durationMinutes,
  languages,
  maxGroupSize,
  included,
  notIncluded,
  meetingPoint,
  whatToBring,
  priceFromCents,
  badges,
  faq,
  "region": region->{ title, "slug": slug.current },
  "cancellationPolicy": cancellationPolicy->{ title, text },
  "related": related[]->${experienceCard},
  ${seo}
}`);

export const guidesQuery = defineQuery(
  `*[_type == "guide" && defined(slug.current)] | order(publishedAt desc)${guideCard}`,
);

export const guidesPageQuery = defineQuery(`*[_id == "guidesPage"][0]{ title, ${sections}, ${seo} }`);

export const enquiryTargetQuery = defineQuery(
  `*[_id == "siteSettings"][0]{ siteName, email, enquiryNotificationEmail }`,
);

export const guideQuery = defineQuery(`*[_type == "guide" && slug.current == $slug][0]{
  _id,
  title,
  excerpt,
  publishedAt,
  heroImage${image},
  "category": category->title,
  "author": author->{ name, bio, photo${image} },
  "sections": body[]${sectionProjection},
  "related": related[]->${guideCard},
  ${seo}
}`);

export const sitemapQuery =
  defineQuery(`*[_type in ["page", "region", "place", "experience", "guide"] && defined(slug.current) && seo.noIndex != true]{
  _type, _updatedAt, "slug": slug.current, "regionSlug": region->slug.current
}`);

export const redirectsQuery = defineQuery(
  `*[_type == "redirect" && defined(from) && defined(to)]{ from, to, permanent }`,
);
