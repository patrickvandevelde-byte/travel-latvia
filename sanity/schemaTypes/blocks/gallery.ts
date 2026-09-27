import { ImagesIcon } from "@sanity/icons/Images";
import { defineField, defineType } from "sanity";

export const galleryBlock = defineType({
  name: "galleryBlock",
  title: "Image gallery",
  type: "object",
  icon: ImagesIcon,
  description: "A set of photos shown as a grid.",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.max(80) }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "accessibleImage" }],
      options: { layout: "grid" },
      validation: (r) => r.required().min(2).max(12),
    }),
  ],
  preview: {
    select: { title: "heading", media: "images.0" },
    prepare: ({ title, media }) => ({ title: title || "Gallery", subtitle: "Image gallery", media }),
  },
});
