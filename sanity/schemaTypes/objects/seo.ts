import { SearchIcon } from "@sanity/icons/Search";
import { defineField, defineType } from "sanity";

/** SEO tab on every routable document (MKT-07, SEO-01). */
export const seo = defineType({
  name: "seo",
  title: "Search & social",
  type: "object",
  icon: SearchIcon,
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: "title",
      title: "Search title",
      type: "string",
      description:
        "Shown in Google results and browser tabs. Aim for 30–60 characters. Leave empty to use the page title.",
      validation: (rule) => [
        rule.max(70).warning("Google usually cuts titles longer than about 60 characters."),
        rule.min(15).warning("Very short titles tend to perform poorly in search."),
      ],
    }),
    defineField({
      name: "description",
      title: "Search description",
      type: "text",
      rows: 3,
      description: "The short summary under the title in Google. Aim for 70–160 characters.",
      validation: (rule) => [
        rule.max(160).warning("Google usually cuts descriptions longer than 160 characters."),
        rule.min(50).warning("Descriptions under 50 characters are often replaced by Google."),
      ],
    }),
    defineField({
      name: "image",
      title: "Social sharing image",
      type: "accessibleImage",
      description: "Shown when the page is shared on social media or messaging apps. Best size: 1200 × 630 px.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Turn on for pages that shouldn't appear in Google, such as campaign-only landing pages.",
      initialValue: false,
    }),
  ],
});
