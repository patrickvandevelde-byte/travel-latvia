import { CommentIcon } from "@sanity/icons/Comment";
import { defineField, defineType } from "sanity";

export const testimonialsBlock = defineType({
  name: "testimonialsBlock",
  title: "Testimonials",
  type: "object",
  icon: CommentIcon,
  description: "Quotes from real travellers. Only use genuine reviews you have permission to publish.",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Reviews",
      validation: (r) => r.max(80),
    }),
    defineField({
      name: "script",
      title: "Handwritten line next to the heading",
      type: "string",
      description: 'Example: "don\'t just believe us".',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: "items",
      title: "Quotes",
      type: "array",
      validation: (r) => r.required().min(1).max(6),
      of: [
        {
          type: "object",
          name: "testimonial",
          fields: [
            { name: "quote", title: "Quote", type: "text", rows: 3, validation: (r) => r.required().max(300) },
            { name: "author", title: "Name", type: "string", validation: (r) => r.required().max(60) },
            { name: "origin", title: "From", type: "string", description: 'Example: "Berlin, Germany"' },
          ],
          preview: { select: { title: "author", subtitle: "quote" } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Testimonials", subtitle: "Testimonials" }),
  },
});
