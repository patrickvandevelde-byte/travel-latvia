import { BookIcon } from "@sanity/icons/Book";
import { defineField, defineType } from "sanity";

export const guideListBlock = defineType({
  name: "guideListBlock",
  title: "Guides / itineraries",
  type: "object",
  icon: BookIcon,
  description: "Cards linking to guides. Pick them by hand or show the latest automatically.",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.max(60) }),
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Carousel", value: "carousel" },
          { title: "Grid with title on the photo", value: "grid" },
        ],
        layout: "radio",
      },
      initialValue: "carousel",
    }),
    defineField({
      name: "mode",
      title: "Which guides",
      type: "string",
      options: {
        list: [
          { title: "Latest automatically", value: "latest" },
          { title: "Pick by hand", value: "manual" },
        ],
        layout: "radio",
      },
      initialValue: "latest",
    }),
    defineField({
      name: "guides",
      title: "Guides",
      type: "array",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
      hidden: ({ parent }) => parent?.mode !== "manual",
      validation: (r) => r.unique().max(12),
    }),
    defineField({
      name: "limit",
      title: "How many",
      type: "number",
      initialValue: 6,
      hidden: ({ parent }) => parent?.mode !== "latest",
      validation: (r) => r.min(1).max(12).integer(),
    }),
    defineField({
      name: "ctaText",
      title: '"Get in touch" card text',
      type: "string",
      description: "Optional card in the grid, e.g. \"Can't find what you're dreaming of? Get in touch anyway.\"",
      validation: (r) => r.max(120),
    }),
    defineField({ name: "ctaLink", title: "Card links to", type: "link", hidden: ({ parent }) => !parent?.ctaText }),
    defineField({
      name: "ctaImage",
      title: "Card photo",
      type: "accessibleImage",
      hidden: ({ parent }) => !parent?.ctaText,
    }),
  ],
  preview: {
    select: { title: "heading", mode: "mode" },
    prepare: ({ title, mode }) => ({
      title: title || "Guides",
      subtitle: `Guides · ${mode === "manual" ? "hand-picked" : "latest"}`,
    }),
  },
});
