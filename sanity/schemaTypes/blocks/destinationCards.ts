import { PinIcon } from "@sanity/icons/Pin";
import { defineField, defineType } from "sanity";

export const destinationCardsBlock = defineType({
  name: "destinationCardsBlock",
  title: "Destinations",
  type: "object",
  icon: PinIcon,
  description: "Cards linking to regions or places, such as Rīga, Vidzeme or Kuldīga.",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string", validation: (r) => r.max(80) }),
    defineField({
      name: "items",
      title: "Destinations",
      type: "array",
      of: [{ type: "reference", to: [{ type: "region" }, { type: "place" }] }],
      validation: (r) => r.required().min(2).max(8).unique(),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: title || "Destinations", subtitle: "Destinations" }),
  },
});
