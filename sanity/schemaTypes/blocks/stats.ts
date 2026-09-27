import { SparklesIcon } from "@sanity/icons/Sparkles";
import { defineField, defineType } from "sanity";

export const statsBlock = defineType({
  name: "statsBlock",
  title: "Key facts",
  type: "object",
  icon: SparklesIcon,
  description: 'Three or four short facts or selling points, e.g. "500 km of coastline".',
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.max(80) }),
    defineField({
      name: "items",
      title: "Facts",
      type: "array",
      validation: (r) => r.required().min(3).max(4),
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            {
              name: "value",
              title: "Big number or word",
              type: "string",
              description: 'Example: "500 km"',
              validation: (r) => r.required().max(12),
            },
            {
              name: "label",
              title: "Label",
              type: "string",
              description: 'Example: "of sandy Baltic coastline"',
              validation: (r) => r.required().max(60),
            },
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Key facts", subtitle: "Key facts" }),
  },
});
