import { CalendarIcon } from "@sanity/icons/Calendar";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { ClipboardIcon } from "@sanity/icons/Clipboard";
import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  AGE_GROUP_LABELS,
  DEFAULT_CHECKLIST,
  formatCompactRange,
  formatShortDate,
  isDateKey,
  TRIP_STATUS_LABELS,
  type AgeGroup,
  type TripStatus,
} from "../../../src/modules/operations/manifest";

/**
 * Journey ("trip"): the operations record for one bespoke journey or hunting
 * trip (OPS-03, ADR-019, docs/11 §5). For the operator only: nothing from a
 * journey is ever queried by the website. Keep personal data to what a
 * supplier needs: no passport numbers, no dates of birth.
 */

type TripDocumentFields = { kind?: string; startDate?: string; endDate?: string; status?: string };

export const traveller = defineType({
  name: "traveller",
  title: "Traveller",
  type: "object",
  icon: UserIcon,
  fields: [
    defineField({
      name: "fullName",
      title: "Full name",
      type: "string",
      description: "As the lodge or guide should know them, e.g. Anna Jansen.",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "ageGroup",
      title: "Age group",
      type: "string",
      options: {
        list: [
          { title: "Adult", value: "adult" },
          { title: "Child", value: "child" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "adult",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "dietary",
      title: "Dietary needs",
      type: "string",
      description: "Shared with lodges and restaurants, e.g. Vegetarian, nut allergy.",
      validation: (r) => r.max(120),
    }),
    defineField({
      name: "medical",
      title: "Medical",
      type: "string",
      description: "Only what a guide must know, e.g. Asthma, carries an inhaler.",
      validation: (r) => r.max(120),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "string",
      description: "Anything else useful on the day, e.g. Fly-fishing beginner.",
      validation: (r) => r.max(160),
    }),
    defineField({
      name: "huntingLicence",
      title: "Licence received",
      type: "boolean",
      description: "Tick when you have a copy of this traveller's hunting licence.",
      initialValue: false,
      hidden: ({ document }) => (document as TripDocumentFields | undefined)?.kind !== "hunting",
    }),
    defineField({
      name: "insurance",
      title: "Hunting insurance received",
      type: "boolean",
      description: "Tick when you have proof of this traveller's hunting insurance.",
      initialValue: false,
      hidden: ({ document }) => (document as TripDocumentFields | undefined)?.kind !== "hunting",
    }),
  ],
  preview: {
    select: {
      fullName: "fullName",
      ageGroup: "ageGroup",
      dietary: "dietary",
      medical: "medical",
      huntingLicence: "huntingLicence",
      insurance: "insurance",
    },
    prepare: ({ fullName, ageGroup, dietary, medical, huntingLicence, insurance }) => ({
      title: fullName || "Traveller",
      subtitle: [
        AGE_GROUP_LABELS[(ageGroup as AgeGroup) ?? "adult"] ?? "Adult",
        dietary ? "dietary" : null,
        medical ? "medical" : null,
        huntingLicence ? "licence ✓" : null,
        insurance ? "insurance ✓" : null,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});

export const itineraryDay = defineType({
  name: "itineraryDay",
  title: "Day",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (r) => [
        r.required(),
        r
          .custom((value, context) => {
            const { startDate, endDate } = (context.document ?? {}) as TripDocumentFields;
            if (!isDateKey(value) || !isDateKey(startDate) || !isDateKey(endDate)) return true;
            return value < startDate || value > endDate ? "This day is outside the journey's first and last day" : true;
          })
          .warning(),
      ],
    }),
    defineField({
      name: "location",
      title: "Where",
      type: "string",
      description: "Town, lodge or area, e.g. Cēsis or Ķemeri National Park.",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "programme",
      title: "Programme",
      type: "text",
      rows: 3,
      description: "What happens that day, e.g. Morning hike in Gauja valley, dinner at the manor.",
      validation: (r) => r.max(600),
    }),
    defineField({
      name: "contactName",
      title: "Contact on the day",
      type: "string",
      description: "Lodge, guide, driver… e.g. Ilze (guide).",
      validation: (r) => r.max(80),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact phone",
      type: "string",
      description: "Include the country code, e.g. +371 2000 0000.",
      validation: (r) => r.max(40),
    }),
  ],
  preview: {
    select: { date: "date", location: "location" },
    prepare: ({ date, location }) => ({
      title: [isDateKey(date) ? formatShortDate(date) : "No date", location].filter(Boolean).join(" · "),
    }),
  },
});

export const checkItem = defineType({
  name: "checkItem",
  title: "Checklist item",
  type: "object",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "label",
      title: "What needs doing",
      type: "string",
      description: "e.g. Deposit received, Guide booked.",
      validation: (r) => r.required().max(80),
    }),
    defineField({ name: "done", title: "Done", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { label: "label", done: "done" },
    prepare: ({ label, done }) => ({ title: `${done ? "✓" : "○"} ${label || "Checklist item"}` }),
  },
});

export const trip = defineType({
  name: "trip",
  title: "Journey",
  type: "document",
  icon: ClipboardIcon,
  fields: [
    defineField({
      name: "title",
      title: "Journey name",
      type: "string",
      description: "A name you'll recognise, e.g. Jansen family — autumn in Vidzeme.",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Set to Cancelled instead of deleting: the record and its history stay.",
      options: {
        list: (Object.keys(TRIP_STATUS_LABELS) as TripStatus[]).map((value) => ({
          title: TRIP_STATUS_LABELS[value],
          value,
        })),
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "planned",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Kind of journey",
      type: "string",
      description: "Hunting trips show licence and insurance fields for each traveller.",
      options: {
        list: [
          { title: "Bespoke journey", value: "journey" },
          { title: "Hunting trip", value: "hunting" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "journey",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tripType",
      title: "Trip type (from the enquiry)",
      type: "string",
      description: "e.g. Nature & hiking. Filled in when you create the journey from an enquiry.",
      validation: (r) => r.max(60),
    }),
    defineField({
      name: "startDate",
      title: "First day",
      type: "date",
      description: "The day the travellers arrive or the programme starts.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      title: "Last day",
      type: "date",
      description: "The day the travellers leave. Same as First day for a one-day trip.",
      validation: (r) =>
        r.required().custom((value, context) => {
          const { startDate } = (context.document ?? {}) as TripDocumentFields;
          if (!isDateKey(value) || !isDateKey(startDate)) return true;
          return value < startDate ? "Last day must be on or after First day" : true;
        }),
    }),
    defineField({
      name: "enquiry",
      title: "Enquiry",
      type: "reference",
      to: [{ type: "enquiry" }],
      weak: true,
      description: "The enquiry this journey came from.",
      options: { disableNew: true },
    }),
    defineField({
      name: "lead",
      title: "Lead traveller / contact",
      type: "object",
      description: "The person you and the suppliers contact about this journey.",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
          description: "e.g. Anna Jansen.",
          validation: (r) => r.required().max(80),
        }),
        defineField({ name: "email", title: "Email", type: "string", validation: (r) => r.email().max(200) }),
        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
          description: "Include the country code, e.g. +31 6 1234 5678. Shown on the manifest for guides.",
          validation: (r) => r.max(40),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "travellers",
      title: "Travellers",
      type: "array",
      description: "Everyone travelling, including the lead traveller.",
      of: [defineArrayMember({ type: "traveller" })],
      validation: (r) =>
        r.max(40).custom((value, context) => {
          const { status } = (context.document ?? {}) as TripDocumentFields;
          return status === "confirmed" && (!Array.isArray(value) || value.length === 0)
            ? "Add at least one traveller before marking the journey Confirmed"
            : true;
        }),
    }),
    defineField({
      name: "itinerary",
      title: "Day by day",
      type: "array",
      description: "One entry per day: where they are, what happens and who to call. Order doesn't matter.",
      of: [defineArrayMember({ type: "itineraryDay" })],
      validation: (r) => r.max(60),
    }),
    defineField({
      name: "checklist",
      title: "Checklist",
      type: "array",
      description: "Tick items off as they are done. Add your own, e.g. Guide booked.",
      of: [defineArrayMember({ type: "checkItem" })],
      initialValue: () =>
        DEFAULT_CHECKLIST.map((label, i) => ({ _key: `check-${i + 1}`, _type: "checkItem", label, done: false })),
      validation: (r) => r.max(30),
    }),
    defineField({
      name: "internalNotes",
      title: "Internal notes",
      type: "text",
      rows: 5,
      description:
        "For you only. Never shown to travellers; left out of the supplier version of the manifest. E.g. margin, special requests.",
      validation: (r) => r.max(4000),
    }),
  ],
  orderings: [
    { title: "First day (soonest first)", name: "startAsc", by: [{ field: "startDate", direction: "asc" }] },
    { title: "First day (latest first)", name: "startDesc", by: [{ field: "startDate", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", startDate: "startDate", endDate: "endDate", status: "status" },
    prepare: ({ title, startDate, endDate, status }) => ({
      title: title || "Untitled journey",
      subtitle: [formatCompactRange(startDate ?? "", endDate ?? ""), TRIP_STATUS_LABELS[status as TripStatus]]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
