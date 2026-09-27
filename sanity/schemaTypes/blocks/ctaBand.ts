import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { defineField, defineType } from "sanity";

export const ctaBandBlock = defineType({
  name: "ctaBandBlock",
  title: "Call to action",
  type: "object",
  icon: BulbOutlineIcon,
  description: 'A coloured band with a short message and a button, e.g. "Plan a tailor-made trip".',
  fields: [
    defineField({
      name: "variant",
      title: "Colour",
      type: "string",
      options: {
        list: [
          { title: "Forest", value: "forest" },
          { title: "Sea", value: "sea" },
          { title: "Sand", value: "sand" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "forest",
    }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (r) => r.required().max(80) }),
    defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (r) => r.max(200) }),
    defineField({ name: "action", title: "Button", type: "link", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "headline" }, prepare: ({ title }) => ({ title, subtitle: "Call to action" }) },
});
