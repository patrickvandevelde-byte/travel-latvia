import { ArrowRightIcon } from "@sanity/icons/ArrowRight";
import { defineField, defineType } from "sanity";

/** Redirects managed by the marketer (MKT-06, CMS-06, SEO-04). */
export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: "from",
      title: "Old address",
      type: "string",
      description: "The path people or Google still use, starting with /. Example: /tours/riga-walk",
      validation: (r) =>
        r.required().custom((value) => {
          if (!value) return true;
          if (!value.startsWith("/")) return "Start with /";
          if (/\s/.test(value)) return "Remove spaces";
          if (value.startsWith("/studio") || value.startsWith("/api")) return "This path can't be redirected";
          return true;
        }),
    }),
    defineField({
      name: "to",
      title: "New address",
      type: "string",
      description: "A path on this site (starting with /) or a full web address.",
      validation: (r) =>
        r.required().custom((value, ctx) => {
          if (!value) return true;
          if (!value.startsWith("/") && !/^https?:\/\//.test(value)) return "Start with / or https://";
          if (value === (ctx.document as { from?: string })?.from)
            return "The new address can't be the same as the old one";
          return true;
        }),
    }),
    defineField({
      name: "permanent",
      title: "Permanent (recommended)",
      type: "boolean",
      initialValue: true,
      description: "Tells Google the page moved for good.",
    }),
  ],
  preview: { select: { from: "from", to: "to" }, prepare: ({ from, to }) => ({ title: `${from} → ${to}` }) },
});
