import { SplitVerticalIcon } from "@sanity/icons/SplitVertical";
import { defineField, defineType } from "sanity";

export const spacerBlock = defineType({
  name: "spacerBlock",
  title: "Spacer",
  type: "object",
  icon: SplitVerticalIcon,
  description: "Extra space or a divider line between sections.",
  fields: [
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: { list: ["small", "medium", "large"], layout: "radio", direction: "horizontal" },
      initialValue: "medium",
    }),
    defineField({ name: "divider", title: "Show a divider line", type: "boolean", initialValue: false }),
  ],
  preview: { select: { size: "size" }, prepare: ({ size }) => ({ title: `Spacer · ${size}` }) },
});
