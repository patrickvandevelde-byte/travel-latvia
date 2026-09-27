import { DocumentsIcon } from "@sanity/icons/Documents";
import { defineField, defineType } from "sanity";
import { sectionsField } from "../blocks";
import { slugField } from "./slug";

/** Landing and static pages built from blocks (MKT-02, CONT-06). */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "content",
      validation: (r) => r.required().max(90),
    }),
    { ...slugField({ reservedCheck: true }), group: "content" },
    defineField({ ...sectionsField, group: "content", validation: (r) => r.required().min(1) }),
    defineField({ name: "seo", title: "Search & social", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug}` : "No address yet" }),
  },
});
