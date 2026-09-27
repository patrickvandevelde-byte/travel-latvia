import { ctaBandBlock } from "./ctaBand";
import { destinationCardsBlock } from "./destinationCards";
import { experienceGridBlock } from "./experienceGrid";
import { faqBlock } from "./faq";
import { galleryBlock } from "./gallery";
import { heroBlock } from "./hero";
import { richTextBlock } from "./richText";
import { spacerBlock } from "./spacer";
import { statsBlock } from "./stats";
import { testimonialsBlock } from "./testimonials";
import { videoBlock } from "./video";

/**
 * Page-builder block library (MKT-02, docs/08 §5). Still to add once their
 * dependencies are decided: productRail (ADR-003), map (Mapbox account),
 * form (MKT-14 / Q-D4), countdown (MKT-08).
 */
export const blocks = [
  heroBlock,
  richTextBlock,
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
