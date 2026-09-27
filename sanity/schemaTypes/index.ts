import { blocks } from "./blocks";
import { cancellationPolicy } from "./documents/cancellationPolicy";
import { enquiry } from "./documents/enquiry";
import { experience } from "./documents/experience";
import { author, category, guide } from "./documents/guide";
import { page } from "./documents/page";
import { place } from "./documents/place";
import { redirect } from "./documents/redirect";
import { region } from "./documents/region";
import { accessibleImage } from "./objects/accessibleImage";
import { faqItem } from "./objects/faqItem";
import { link } from "./objects/link";
import { portableText } from "./objects/richText";
import { seo } from "./objects/seo";
import { announcement } from "./singletons/announcement";
import { guidesPage } from "./singletons/guidesPage";
import { homePage } from "./singletons/homePage";
import { siteSettings } from "./singletons/siteSettings";

export const singletonTypes = new Set(["siteSettings", "homePage", "guidesPage", "announcement"]);
/** Created by the website, not from the "+" menu. */
export const systemTypes = new Set(["enquiry"]);

export const schemaTypes = [
  // objects
  accessibleImage,
  seo,
  link,
  portableText,
  faqItem,
  ...blocks,
  // singletons
  siteSettings,
  homePage,
  guidesPage,
  announcement,
  // documents
  page,
  region,
  place,
  experience,
  cancellationPolicy,
  guide,
  category,
  author,
  redirect,
  enquiry,
];
