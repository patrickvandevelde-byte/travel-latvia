import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

export const linkableTypes = [
  { type: "homePage" },
  { type: "page" },
  { type: "region" },
  { type: "place" },
  { type: "experience" },
  { type: "guide" },
];

/**
 * A link to another page on the site (a reference, so it never breaks when a
 * URL changes) or to an external website.
 */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: 'The text people click. Example: "Explore Gauja National Park".',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "kind",
      title: "Links to",
      type: "string",
      options: {
        list: [
          { title: "A page on this site", value: "internal" },
          { title: "Another website", value: "external" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "internal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "internal",
      title: "Page",
      type: "reference",
      to: linkableTypes,
      hidden: ({ parent }) => parent?.kind !== "internal",
      validation: (rule) =>
        rule.custom((value, context) =>
          (context.parent as { kind?: string })?.kind === "internal" && !value ? "Choose a page" : true,
        ),
    }),
    defineField({
      name: "external",
      title: "Web address",
      type: "url",
      description: "Full address including https://",
      hidden: ({ parent }) => parent?.kind !== "external",
      validation: (rule) =>
        rule
          .uri({ scheme: ["https", "http", "mailto", "tel"] })
          .custom((value, context) =>
            (context.parent as { kind?: string })?.kind === "external" && !value ? "Enter a web address" : true,
          ),
    }),
  ],
  preview: {
    select: { title: "label", kind: "kind", internal: "internal.title", external: "external" },
    prepare: ({ title, kind, internal, external }) => ({
      title,
      subtitle: kind === "external" ? external : internal ? `→ ${internal}` : "No page chosen",
    }),
  },
});
