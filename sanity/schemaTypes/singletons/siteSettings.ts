import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";

/** Global settings the marketer edits without a developer (MKT-05, COMP-02). */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "brand", title: "Brand", default: true },
    { name: "navigation", title: "Menu & footer" },
    { name: "contact", title: "Contact & company" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      group: "brand",
      validation: (r) => r.required().max(40),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string", group: "brand", validation: (r) => r.max(80) }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "accessibleImage",
      group: "brand",
      description: "SVG or PNG with a transparent background.",
    }),
    defineField({
      name: "mainMenu",
      title: "Main menu",
      type: "array",
      group: "navigation",
      of: [defineArrayMember({ type: "link" })],
      description: "Links in the top menu, in order. Keep it to 6 or fewer.",
      validation: (r) => r.max(7).warning("More than 6 menu items is hard to use on mobile."),
    }),
    defineField({
      name: "headerCta",
      title: "Header button",
      type: "link",
      group: "navigation",
      description: 'Optional highlighted button, e.g. "Plan your trip".',
    }),
    defineField({
      name: "footerColumns",
      title: "Footer columns",
      type: "array",
      group: "navigation",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "footerColumn",
          fields: [
            { name: "title", title: "Column title", type: "string", validation: (r) => r.required().max(30) },
            { name: "links", title: "Links", type: "array", of: [{ type: "link" }], validation: (r) => r.max(8) },
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),
    defineField({
      name: "email",
      title: "Contact email",
      type: "string",
      group: "contact",
      validation: (r) => r.email(),
    }),
    defineField({
      name: "phone",
      title: "Contact phone",
      type: "string",
      group: "contact",
      description: "International format, e.g. +371 2000 0000",
    }),
    defineField({
      name: "social",
      title: "Social media",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            {
              name: "network",
              title: "Network",
              type: "string",
              options: { list: ["Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "Pinterest"] },
              validation: (r) => r.required(),
            },
            { name: "url", title: "Profile link", type: "url", validation: (r) => r.required() },
          ],
          preview: { select: { title: "network", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "company",
      title: "Company details",
      type: "object",
      group: "contact",
      description: "Legally required in the footer and emails.",
      fields: [
        { name: "legalName", title: "Legal name", type: "string" },
        { name: "registrationNumber", title: "Registration number", type: "string" },
        { name: "vatNumber", title: "VAT number", type: "string" },
        { name: "address", title: "Address", type: "text", rows: 3 },
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "Default search & social",
      type: "seo",
      group: "seo",
      description: "Used when a page has no SEO settings of its own.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
