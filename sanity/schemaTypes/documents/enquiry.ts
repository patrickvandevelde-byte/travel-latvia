import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineField, defineType } from "sanity";

/**
 * A "Plan your journey" form submission (TRIP-01/02). Created by the site,
 * never by hand; the marketer only changes status and notes.
 */
export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Replied", value: "replied" },
          { title: "Quote sent", value: "quoted" },
          { title: "Booked", value: "won" },
          { title: "Not going ahead", value: "lost" },
        ],
        layout: "radio",
      },
      initialValue: "new",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "notes",
      title: "Your notes",
      type: "text",
      rows: 4,
      description: "Internal. Never shown to the traveller.",
    }),
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", readOnly: true }),
    defineField({ name: "period", title: "Travel period", type: "string", readOnly: true }),
    defineField({ name: "tripType", title: "Type of trip", type: "string", readOnly: true }),
    defineField({ name: "wishes", title: "Wishes", type: "text", readOnly: true }),
    defineField({ name: "locale", title: "Language", type: "string", readOnly: true }),
    defineField({ name: "sourcePath", title: "Sent from page", type: "string", readOnly: true }),
    defineField({ name: "receivedAt", title: "Received", type: "datetime", readOnly: true }),
  ],
  orderings: [{ title: "Newest first", name: "receivedDesc", by: [{ field: "receivedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", tripType: "tripType", status: "status", receivedAt: "receivedAt" },
    prepare: ({ name, tripType, status, receivedAt }) => ({
      title: name || "Enquiry",
      subtitle: [status, tripType, receivedAt ? new Date(receivedAt).toLocaleDateString("en-GB") : null]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
