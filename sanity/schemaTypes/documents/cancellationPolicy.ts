import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

export const cancellationPolicy = defineType({
  name: "cancellationPolicy",
  title: "Cancellation policy",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      description: 'Example: "Free cancellation up to 24 hours".',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "rules",
      title: "Refund rules",
      type: "array",
      description: "From most to least generous. Example: 100 % refund if cancelled 24 hours or more before the start.",
      validation: (r) => r.required().min(1),
      of: [
        {
          type: "object",
          name: "refundRule",
          fields: [
            {
              name: "hoursBefore",
              title: "Cancelled at least … hours before start",
              type: "number",
              validation: (r) => r.required().min(0).integer(),
            },
            {
              name: "refundPercent",
              title: "Refund (%)",
              type: "number",
              validation: (r) => r.required().min(0).max(100).integer(),
            },
          ],
          preview: {
            select: { h: "hoursBefore", p: "refundPercent" },
            prepare: ({ h, p }) => ({ title: `${p} % refund if cancelled ≥ ${h} h before` }),
          },
        },
      ],
    }),
    defineField({
      name: "text",
      title: "Text shown to travellers",
      type: "portableText",
      validation: (r) => r.required(),
    }),
  ],
});
