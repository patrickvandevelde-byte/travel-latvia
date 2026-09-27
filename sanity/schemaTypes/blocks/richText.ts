import { TextIcon } from "@sanity/icons/Text";
import { defineField, defineType } from "sanity";

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Text",
  type: "object",
  icon: TextIcon,
  description: "Paragraphs, headings, lists and images for storytelling.",
  fields: [
    defineField({
      name: "variant",
      title: "Width",
      type: "string",
      options: {
        list: [
          { title: "Narrow (easy reading)", value: "narrow" },
          { title: "Wide", value: "wide" },
        ],
        layout: "radio",
      },
      initialValue: "narrow",
    }),
    defineField({ name: "body", title: "Text", type: "portableText", validation: (r) => r.required() }),
  ],
  preview: {
    select: { body: "body" },
    prepare: ({ body }) => ({
      title:
        (body as { children?: { text?: string }[] }[] | undefined)?.[0]?.children?.map((c) => c.text).join("") ||
        "Text",
      subtitle: "Text",
    }),
  },
});
