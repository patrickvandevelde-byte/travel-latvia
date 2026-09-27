import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { defineField, defineType } from "sanity";

export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ",
  type: "object",
  icon: HelpCircleIcon,
  description: "Questions and answers that open and close. Also helps Google show your answers.",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Frequently asked questions",
      validation: (r) => r.max(80),
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [{ type: "faqItem" }],
      validation: (r) => r.required().min(1).max(20),
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "FAQ" }) },
});
