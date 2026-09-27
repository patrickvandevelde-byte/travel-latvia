import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { defineField, defineType } from "sanity";

export const experienceGridBlock = defineType({
  name: "experienceGridBlock",
  title: "Experiences",
  type: "object",
  icon: ThLargeIcon,
  description: "A grid or carousel of experience cards. Pick them by hand or show them automatically by region.",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.max(80) }),
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Grid", value: "grid" },
          { title: "Carousel", value: "carousel" },
        ],
        layout: "radio",
      },
      initialValue: "grid",
    }),
    defineField({
      name: "mode",
      title: "Which experiences",
      type: "string",
      options: {
        list: [
          { title: "Pick by hand", value: "manual" },
          { title: "Automatically, from a region", value: "region" },
        ],
        layout: "radio",
      },
      initialValue: "manual",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "experiences",
      title: "Experiences",
      type: "array",
      of: [{ type: "reference", to: [{ type: "experience" }] }],
      hidden: ({ parent }) => parent?.mode !== "manual",
      validation: (r) => r.unique().max(12),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "reference",
      to: [{ type: "region" }],
      hidden: ({ parent }) => parent?.mode !== "region",
    }),
    defineField({
      name: "limit",
      title: "How many to show",
      type: "number",
      initialValue: 6,
      hidden: ({ parent }) => parent?.mode !== "region",
      validation: (r) => r.min(1).max(12).integer(),
    }),
  ],
  preview: {
    select: { title: "heading", mode: "mode" },
    prepare: ({ title, mode }) => ({
      title: title || "Experiences",
      subtitle: `Experiences · ${mode === "region" ? "automatic" : "hand-picked"}`,
    }),
  },
});
