import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineField, defineType } from "sanity";

export const enquiryFormBlock = defineType({
  name: "enquiryFormBlock",
  title: "Plan your journey (form)",
  type: "object",
  icon: EnvelopeIcon,
  description: "The enquiry form with an intro beside it. Submissions appear under Enquiries in this studio.",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Plan your journey",
      validation: (r) => r.required().max(60),
    }),
    defineField({ name: "intro", title: "Intro text", type: "portableText" }),
    defineField({
      name: "script",
      title: "Handwritten line",
      type: "string",
      description: 'Example: "let\'s create experiences that stay".',
      validation: (r) => r.max(50),
    }),
    defineField({
      name: "tripTypes",
      title: "Trip types in the dropdown",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "Nature & hiking",
        "Adventure (4x4, kayaking)",
        "Sauna & wellness",
        "Culinary & culture",
        "Hunting trip",
        "A bit of everything",
      ],
      validation: (r) => r.min(2).max(10),
    }),
    defineField({
      name: "submitLabel",
      title: "Button text",
      type: "string",
      initialValue: "Send",
      validation: (r) => r.max(30),
    }),
    defineField({
      name: "note",
      title: "Small print under the button",
      type: "string",
      initialValue: "Your details are only used to answer your enquiry.",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "successMessage",
      title: "Thank-you message",
      type: "string",
      initialValue: "Thank you. You will hear back within a week.",
      validation: (r) => r.required().max(200),
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Enquiry form" }) },
});
