import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";
import { sectionsField } from "../blocks";

/** Composable home page (CONT-01). */
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "Search & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Internal title",
      type: "string",
      initialValue: "Home",
      readOnly: true,
      group: "content",
    }),
    defineField({ ...sectionsField, group: "content", validation: (r) => r.required().min(1) }),
    defineField({ name: "seo", title: "Search & social", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
