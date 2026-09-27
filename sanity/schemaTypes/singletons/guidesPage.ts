import { BookIcon } from "@sanity/icons/Book";
import { defineField, defineType } from "sanity";
import { sectionsField } from "../blocks";

/** The /guides overview page ("Our curated guides"), built from sections. */
export const guidesPage = defineType({
  name: "guidesPage",
  title: "Guides page",
  type: "document",
  icon: BookIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      initialValue: "Our curated guides",
      validation: (r) => r.required().max(60),
    }),
    defineField({ ...sectionsField, group: "content" }),
    defineField({ name: "seo", title: "Search & social", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Guides page" }) },
});
