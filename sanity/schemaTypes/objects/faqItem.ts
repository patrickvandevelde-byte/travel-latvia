import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "Question",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required().max(140) }),
    defineField({ name: "answer", title: "Answer", type: "portableText", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "question" } },
});
