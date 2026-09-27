import { ImagesIcon } from "@sanity/icons/Images";
import { defineField, defineType } from "sanity";

export const polaroidsBlock = defineType({
  name: "polaroidsBlock",
  title: "Polaroid photos",
  type: "object",
  icon: ImagesIcon,
  description: "Three personal photos shown as tilted polaroids, as on the About page.",
  fields: [
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [{ type: "accessibleImage" }],
      options: { layout: "grid" },
      validation: (r) => r.required().min(2).max(6),
    }),
  ],
  preview: { select: { media: "images.0" }, prepare: ({ media }) => ({ title: "Polaroid photos", media }) },
});
