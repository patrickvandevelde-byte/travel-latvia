import { blocks } from "./blocks";
import { cancellationPolicy } from "./documents/cancellationPolicy";
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
import { homePage } from "./singletons/homePage";
import { siteSettings } from "./singletons/siteSettings";

export const singletonTypes = new Set(["siteSettings", "homePage", "announcement"]);

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
];
