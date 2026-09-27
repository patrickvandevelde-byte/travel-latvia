import { BlockElementIcon } from "@sanity/icons/BlockElement";
import { defineField, defineType } from "sanity";

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  icon: BlockElementIcon,
  description: "Big opening section with a headline, image and up to two buttons. Use once, at the top of a page.",
  fields: [
    defineField({
      name: "variant",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Brand: logo name, tagline and photo (home)", value: "brand" },
          { title: "Full-width image", value: "image" },
          { title: "Image beside text", value: "split" },
          { title: "Text only", value: "minimal" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Small label above headline",
      type: "string",
      description: 'Optional. Example: "Summer 2027".',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: 'For the brand layout this is the name shown large, e.g. "Baltique".',
      validation: (r) => r.required().max(90),
    }),
    defineField({
      name: "script",
      title: "Handwritten tagline",
      type: "string",
      description: 'Example: "discover the undiscovered".',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: "tag",
      title: "Pill text",
      type: "string",
      description: 'Small pill at the bottom, e.g. "Bespoke boutique journeys in the Baltics".',
      hidden: ({ parent }) => parent?.variant !== "brand",
      validation: (r) => r.max(60),
    }),
    defineField({ name: "intro", title: "Intro text", type: "text", rows: 3, validation: (r) => r.max(240) }),
    defineField({
      name: "image",
      title: "Image",
      type: "accessibleImage",
      description: "Landscape photo, at least 2000 px wide.",
      hidden: ({ parent }) => parent?.variant === "minimal",
      validation: (r) =>
        r.custom((value, ctx) =>
          (ctx.parent as { variant?: string })?.variant !== "minimal" && !value ? "This layout needs an image" : true,
        ),
    }),
    defineField({
      name: "actions",
      title: "Buttons",
      type: "array",
      of: [{ type: "link" }],
      validation: (r) => r.max(2),
    }),
  ],
  preview: {
    select: { title: "headline", variant: "variant", media: "image" },
    prepare: ({ title, variant, media }) => ({ title: title || "Hero", subtitle: `Hero · ${variant}`, media }),
  },
});
