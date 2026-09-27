import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

/** Image with required alt text and a hotspot, used everywhere on the site (NFR-03). */
export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        'Describe the image for people who can\'t see it. Example: "Wooden boardwalk across Ķemeri bog at sunrise".',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "credit",
      title: "Photo credit",
      type: "string",
      description: "Optional. Shown under the image when required by the licence.",
    }),
  ],
  validation: (rule) =>
    rule.custom((value: { asset?: unknown } | undefined) =>
      value && !value.asset ? "Upload an image or remove this field" : true,
    ),
});
