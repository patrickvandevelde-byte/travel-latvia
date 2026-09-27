import { BlockElementIcon } from "@sanity/icons/BlockElement";
import { defineField, defineType } from "sanity";

export const pageHeroBlock = defineType({
  name: "pageHeroBlock",
  title: "Page title",
  type: "object",
  icon: BlockElementIcon,
  description:
    'Big red title with a handwritten tagline, e.g. "What we offer" + "only in Latvia". Use once, at the top.',
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required().max(60) }),
    defineField({
      name: "script",
      title: "Handwritten tagline",
      type: "string",
      description: 'Short, lowercase. Example: "beyond bucket lists".',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Text only", value: "text" },
          { title: "Over a photo, with a contact card", value: "card" },
        ],
        layout: "radio",
      },
      initialValue: "text",
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "accessibleImage",
      hidden: ({ parent }) => parent?.variant !== "card",
    }),
    defineField({
      name: "cardBody",
      title: "Card text",
      type: "portableText",
      description: "Shown in the cream card over the photo, under the contact details from Settings.",
      hidden: ({ parent }) => parent?.variant !== "card",
    }),
    defineField({ name: "action", title: "Button", type: "link", hidden: ({ parent }) => parent?.variant !== "card" }),
  ],
  preview: {
    select: { title: "title", script: "script" },
    prepare: ({ title, script }) => ({ title, subtitle: `Page title${script ? ` · ${script}` : ""}` }),
  },
});
