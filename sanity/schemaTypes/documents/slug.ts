import { defineField } from "sanity";

/** Paths the site itself uses; a page slug may not take them. */
const RESERVED = [
  "studio",
  "api",
  "admin",
  "destinations",
  "experiences",
  "guides",
  "shop",
  "booking",
  "trips",
  "tailor-made",
  "plan",
  "cart",
];

export function slugField(options: { source?: string; reservedCheck?: boolean } = {}) {
  return defineField({
    name: "slug",
    title: "Web address",
    type: "slug",
    description:
      "The last part of the page address. Generated from the title; lowercase letters, numbers and hyphens only. Changing it after publishing breaks old links unless you add a redirect.",
    options: { source: options.source ?? "title", maxLength: 80 },
    validation: (rule) =>
      rule.required().custom((value) => {
        const current = value?.current;
        if (!current) return true;
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
          return "Use lowercase letters, numbers and single hyphens only";
        }
        if (options.reservedCheck && RESERVED.includes(current)) {
          return `"${current}" is used by the site itself. Choose another address.`;
        }
        return true;
      }),
  });
}
