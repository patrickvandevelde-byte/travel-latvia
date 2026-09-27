import { BellIcon } from "@sanity/icons/Bell";
import { defineField, defineType } from "sanity";

/** Date-bound announcement bar (MKT-05, 08 §4 T10). */
export const announcement = defineType({
  name: "announcement",
  title: "Announcement bar",
  type: "document",
  icon: BellIcon,
  fields: [
    defineField({ name: "enabled", title: "Show the announcement bar", type: "boolean", initialValue: false }),
    defineField({
      name: "message",
      title: "Message",
      type: "string",
      validation: (r) => r.max(120),
      description: 'Keep it short. Example: "Midsummer (Jāņi) tours are now open for booking".',
    }),
    defineField({ name: "link", title: "Link (optional)", type: "link" }),
    defineField({
      name: "variant",
      title: "Colour",
      type: "string",
      options: {
        list: [
          { title: "Forest", value: "forest" },
          { title: "Amber", value: "amber" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "forest",
    }),
    defineField({
      name: "startsAt",
      title: "Show from",
      type: "datetime",
      description: "Optional. Leave empty to show immediately.",
    }),
    defineField({
      name: "endsAt",
      title: "Hide after",
      type: "datetime",
      description: "Optional. The bar disappears automatically after this time.",
      validation: (r) =>
        r.custom((value, ctx) => {
          const start = (ctx.document as { startsAt?: string })?.startsAt;
          return value && start && value <= start ? "The end must be after the start" : true;
        }),
    }),
  ],
  validation: (r) =>
    r.custom((doc) =>
      (doc as { enabled?: boolean; message?: string })?.enabled && !(doc as { message?: string }).message
        ? "Add a message or turn the bar off"
        : true,
    ),
  preview: {
    select: { title: "message", enabled: "enabled" },
    prepare: ({ title, enabled }) => ({ title: title || "Announcement bar", subtitle: enabled ? "Shown" : "Hidden" }),
  },
});
