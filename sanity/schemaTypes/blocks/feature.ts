import { SplitHorizontalIcon } from "@sanity/icons/SplitHorizontal";
import { defineField, defineType } from "sanity";

export const featureBlock = defineType({
  name: "featureBlock",
  title: "Text + image",
  type: "object",
  icon: SplitHorizontalIcon,
  description: "Two columns: text on one side, a photo on the other. The workhorse section of the site.",
  fields: [
    defineField({
      name: "heading",
      title: "Big heading",
      type: "string",
      description: 'Optional red display heading, e.g. "Four seasons. Endless forests."',
      validation: (r) => r.max(80),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'Smaller title above the text, e.g. "Tailor-made journeys through Latvia".',
      validation: (r) => r.max(90),
    }),
    defineField({ name: "body", title: "Text", type: "portableText", validation: (r) => r.required() }),
    defineField({ name: "image", title: "Photo", type: "accessibleImage", validation: (r) => r.required() }),
    defineField({
      name: "label",
      title: "Label on the photo",
      type: "string",
      description: 'Optional pill on the photo, e.g. "Journeys shaped around you".',
      validation: (r) => r.max(40),
    }),
    defineField({
      name: "imagePosition",
      title: "Photo position",
      type: "string",
      options: {
        list: [
          { title: "Right", value: "right" },
          { title: "Left", value: "left" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "right",
    }),
    defineField({
      name: "imageShape",
      title: "Photo shape",
      type: "string",
      options: {
        list: [
          { title: "Wide", value: "wide" },
          { title: "Tall", value: "tall" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "wide",
    }),
    defineField({ name: "action", title: "Button", type: "link" }),
  ],
  preview: {
    select: { title: "heading", subtitle: "title", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || subtitle || "Text + image",
      subtitle: "Text + image",
      media,
    }),
  },
});
