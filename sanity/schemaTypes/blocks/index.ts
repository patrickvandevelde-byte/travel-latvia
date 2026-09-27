import { ctaBandBlock } from "./ctaBand";
import { destinationCardsBlock } from "./destinationCards";
import { enquiryFormBlock } from "./enquiryForm";
import { experienceGridBlock } from "./experienceGrid";
import { faqBlock } from "./faq";
import { featureBlock } from "./feature";
import { galleryBlock } from "./gallery";
import { guideListBlock } from "./guideList";
import { heroBlock } from "./hero";
import { pageHeroBlock } from "./pageHero";
import { polaroidsBlock } from "./polaroids";
import { richTextBlock } from "./richText";
import { spacerBlock } from "./spacer";
import { statsBlock } from "./stats";
import { testimonialsBlock } from "./testimonials";
import { videoBlock } from "./video";

/**
 * Page-builder block library (MKT-02, docs/08 §5), extended with the sections
 * from the Baltique mockup (docs/10). Still to add once their dependencies are
 * decided: map (Mapbox account), countdown (MKT-08).
 */
export const blocks = [
  heroBlock,
  pageHeroBlock,
  featureBlock,
  richTextBlock,
  enquiryFormBlock,
  guideListBlock,
  polaroidsBlock,
  experienceGridBlock,
  destinationCardsBlock,
  ctaBandBlock,
  galleryBlock,
  testimonialsBlock,
  faqBlock,
  statsBlock,
  videoBlock,
  spacerBlock,
];

export const blockTypeNames = blocks.map((b) => b.name);

/** Array field shared by every page-builder document. */
export const sectionsField = {
  name: "sections",
  title: "Page sections",
  type: "array",
  description: "Build the page from sections. Drag to reorder.",
  of: blockTypeNames.map((type) => ({ type })),
  options: { insertMenu: { views: [{ name: "list" as const }] } },
};
