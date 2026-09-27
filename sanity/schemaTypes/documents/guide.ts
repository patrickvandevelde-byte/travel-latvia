import { BookIcon } from "@sanity/icons/Book";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";
import { slugField } from "./slug";

/** Editorial guides / blog (CONT-05). */
export const guide = defineType({
  name: "guide",
  title: "Guide",
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
      validation: (r) => r.required().max(100),
    }),
    { ...slugField(), group: "content" },
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }], group: "content" }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      type: "text",
      rows: 2,
      group: "content",
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: "heroImage",
      title: "Main image",
      type: "accessibleImage",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "richTextBlock" }),
        defineArrayMember({ type: "experienceGridBlock" }),
        defineArrayMember({ type: "galleryBlock" }),
        defineArrayMember({ type: "ctaBandBlock" }),
        defineArrayMember({ type: "videoBlock" }),
        defineArrayMember({ type: "faqBlock" }),
      ],
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: "related",
      title: "Related guides",
      type: "array",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
      group: "content",
      validation: (r) => r.unique().max(3),
    }),
    defineField({ name: "seo", title: "Search & social", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", date: "publishedAt", media: "heroImage" },
    prepare: ({ title, date, media }) => ({
      title,
      subtitle: date ? new Date(date).toLocaleDateString("en-GB") : "No date",
      media,
    }),
  },
});

export const category = defineType({
  name: "category",
  title: "Guide category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "title", title: "Name", type: "string", validation: (r) => r.required().max(40) }),
    slugField(),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
});

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "photo", title: "Photo", type: "accessibleImage" }),
    defineField({ name: "bio", title: "Short bio", type: "text", rows: 3, validation: (r) => r.max(300) }),
  ],
  preview: { select: { title: "name", media: "photo" } },
});
