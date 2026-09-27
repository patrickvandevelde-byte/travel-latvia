import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { defineField, defineType } from "sanity";
import { slugField } from "./slug";

/** Region, e.g. Rīga, Vidzeme, Kurzeme, Zemgale, Latgale, Coast (CONT-02). */
export const region = defineType({
  name: "region",
  title: "Region",
  type: "document",
  icon: EarthGlobeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      group: "content",
      description: 'Keep Latvian spelling, e.g. "Rīga", "Vidzeme".',
      validation: (r) => r.required().max(60),
    }),
    { ...slugField(), group: "content" },
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "One or two sentences for cards and search results.",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "heroImage",
      title: "Main image",
      type: "accessibleImage",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Introduction", type: "portableText", group: "content" }),
    defineField({ name: "location", title: "Map centre", type: "geopoint", group: "content" }),
    defineField({ name: "seo", title: "Search & social", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "summary", media: "heroImage" } },
});
