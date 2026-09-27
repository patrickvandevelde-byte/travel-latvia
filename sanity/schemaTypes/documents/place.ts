import { PinIcon } from "@sanity/icons/Pin";
import { defineField, defineType } from "sanity";
import { slugField } from "./slug";

/** Town or natural site within a region, e.g. Sigulda, Kuldīga, Ķemeri (CONT-02). */
export const place = defineType({
  name: "place",
  title: "Place",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "facts", title: "Quick facts" },
    { name: "seo", title: "Search & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      group: "content",
      validation: (r) => r.required().max(60),
    }),
    { ...slugField(), group: "content" },
    defineField({
      name: "region",
      title: "Region",
      type: "reference",
      to: [{ type: "region" }],
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 2,
      group: "content",
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
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "accessibleImage" }],
      options: { layout: "grid" },
      group: "content",
      validation: (r) => r.max(12),
    }),
    defineField({ name: "location", title: "Location on map", type: "geopoint", group: "content" }),
    defineField({
      name: "quickFacts",
      title: "Quick facts",
      type: "object",
      group: "facts",
      fields: [
        { name: "fromRiga", title: "Travel time from Rīga", type: "string", description: 'Example: "1 h by train"' },
        { name: "gettingThere", title: "How to get there", type: "text", rows: 3 },
        { name: "bestSeason", title: "Best season", type: "string", description: 'Example: "May–September"' },
      ],
    }),
    defineField({ name: "seo", title: "Search & social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", region: "region.title", media: "heroImage" },
    prepare: ({ title, region, media }) => ({ title, subtitle: region, media }),
  },
});
