import { RocketIcon } from "@sanity/icons/Rocket";
import { defineArrayMember, defineField, defineType } from "sanity";
import { slugField } from "./slug";

/**
 * Experience content (CONT-04). Bookable options, rate categories and
 * schedules (BOOK-01/02, MKT-09) are added in Phase 4 once the build-vs-buy
 * decision (ADR-005, Q-B6) and pricing model (Q-B7) are settled.
 */
export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: RocketIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "practical", title: "Practical info" },
    { name: "merch", title: "Merchandising" },
    { name: "seo", title: "Search & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description: 'Example: "Gauja National Park, Sigulda & Cēsis day trip".',
      validation: (r) => r.required().max(90),
    }),
    { ...slugField(), group: "content" },
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Guided tour", value: "tour" },
          { title: "Activity", value: "activity" },
          { title: "Private tour", value: "private" },
          { title: "Transfer", value: "transfer" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "reference",
      to: [{ type: "region" }],
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "places",
      title: "Places visited",
      type: "array",
      of: [{ type: "reference", to: [{ type: "place" }] }],
      group: "content",
      validation: (r) => r.unique(),
    }),
    defineField({
      name: "summary",
      title: "Short summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "Shown on cards. One or two sentences.",
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
      group: "content",
      description: "3–6 short bullet points.",
      validation: (r) => r.min(3).max(6),
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [{ type: "accessibleImage" }],
      options: { layout: "grid" },
      group: "content",
      description: "The first photo is used on cards. At least 3.",
      validation: (r) => r.required().min(3).max(15),
    }),
    defineField({
      name: "description",
      title: "Full description",
      type: "portableText",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "itinerary",
      title: "Itinerary",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "itineraryStop",
          fields: [
            { name: "time", title: "Time or duration", type: "string", description: 'Example: "09:00" or "45 min"' },
            { name: "title", title: "Stop", type: "string", validation: (r) => r.required() },
            { name: "description", title: "Description", type: "text", rows: 2 },
          ],
          preview: { select: { title: "title", subtitle: "time" } },
        }),
      ],
    }),
    defineField({
      name: "durationMinutes",
      title: "Duration (minutes)",
      type: "number",
      group: "practical",
      validation: (r) => r.required().min(15).integer(),
    }),
    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      of: [{ type: "string" }],
      group: "practical",
      options: { list: ["English", "Latvian", "German", "Russian", "French", "Finnish", "Swedish", "Polish"] },
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "maxGroupSize",
      title: "Maximum group size",
      type: "number",
      group: "practical",
      validation: (r) => r.min(1).integer(),
    }),
    defineField({ name: "included", title: "Included", type: "array", of: [{ type: "string" }], group: "practical" }),
    defineField({
      name: "notIncluded",
      title: "Not included",
      type: "array",
      of: [{ type: "string" }],
      group: "practical",
    }),
    defineField({
      name: "meetingPoint",
      title: "Meeting point",
      type: "object",
      group: "practical",
      validation: (r) => r.required(),
      fields: [
        { name: "name", title: "Name", type: "string", validation: (r) => r.required() },
        { name: "instructions", title: "How to find it", type: "text", rows: 3 },
        { name: "location", title: "Location on map", type: "geopoint", validation: (r) => r.required() },
      ],
    }),
    defineField({
      name: "whatToBring",
      title: "What to bring",
      type: "array",
      of: [{ type: "string" }],
      group: "practical",
    }),
    defineField({
      name: "cancellationPolicy",
      title: "Cancellation policy",
      type: "reference",
      to: [{ type: "cancellationPolicy" }],
      group: "practical",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "faq",
      title: "Questions & answers",
      type: "array",
      of: [{ type: "faqItem" }],
      group: "practical",
    }),
    defineField({
      name: "priceFromCents",
      title: '"From" price shown on cards (cents)',
      type: "number",
      group: "merch",
      description:
        "Display only until online booking launches, e.g. 4500 = €45. Checkout prices will come from the booking options.",
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [{ type: "string" }],
      group: "merch",
      options: {
        list: [
          { title: "Bestseller", value: "bestseller" },
          { title: "New", value: "new" },
          { title: "Free cancellation", value: "free-cancellation" },
          { title: "Family friendly", value: "family" },
        ],
      },
    }),
    defineField({
      name: "related",
      title: "Related experiences",
      type: "array",
      of: [{ type: "reference", to: [{ type: "experience" }] }],
      group: "merch",
      validation: (r) => r.unique().max(6),
    }),
    defineField({ name: "seo", title: "Search & social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", region: "region.title", media: "images.0" },
    prepare: ({ title, region, media }) => ({ title, subtitle: region, media }),
  },
});
