/**
 * Journey manifest (OPS-03, re-scoped by ADR-019, docs/11).
 *
 * Pure domain logic: turns a `trip` document into a plain `Manifest` model,
 * checks whether a journey is ready to go and produces the CSV and WhatsApp
 * exports. No Sanity, React or network imports, so a future slot-based
 * manifest over Postgres bookings can reuse the same sheet and rules.
 *
 * Dates are calendar dates (YYYY-MM-DD), not instants. "Today" is passed in by
 * the caller as the Riga calendar day (`rigaDateKey` in src/lib/dates.ts).
 */

export type TripKind = "journey" | "hunting";
export type TripStatus = "planned" | "confirmed" | "completed" | "cancelled";
export type AgeGroup = "adult" | "child";

export type Traveller = {
  fullName: string;
  ageGroup: AgeGroup;
  dietary?: string;
  medical?: string;
  notes?: string;
  huntingLicence?: boolean;
  insurance?: boolean;
};

export type ItineraryDay = {
  date: string;
  location: string;
  programme?: string;
  contactName?: string;
  contactPhone?: string;
};

export type CheckItem = { label: string; done: boolean };

export type Manifest = {
  id: string;
  title: string;
  kind: TripKind;
  status: TripStatus;
  tripType?: string;
  startDate: string;
  endDate: string;
  lead: { name: string; email?: string; phone?: string };
  travellers: Traveller[];
  itinerary: ItineraryDay[];
  checklist: CheckItem[];
  internalNotes?: string;
};

export type ReadinessIssue = { code: string; message: string };

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  planned: "Planned",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const TRIP_KIND_LABELS: Record<TripKind, string> = {
  journey: "Bespoke journey",
  hunting: "Hunting trip",
};

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = { adult: "Adult", child: "Child" };

/** Checklist every new journey starts with (docs/11 §5). */
export const DEFAULT_CHECKLIST: readonly string[] = [
  "Deposit received",
  "Balance received",
  "Accommodation confirmed",
  "Transport confirmed",
  "Travel insurance confirmed",
];

/** Days ahead that count as "departing soon" in the Operations menu. */
export const DEPARTING_SOON_DAYS = 30;
/** A journey departing within this many days should no longer be Planned. */
const STILL_PLANNED_DAYS = 14;
/** Guard against runaway loops on bad data: no journey lasts longer than a year. */
const MAX_TRIP_DAYS = 366;

// ---------------------------------------------------------------------------
// Calendar dates
// ---------------------------------------------------------------------------

const DATE_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDateKey(key: string): Date | null {
  const match = DATE_KEY.exec(key);
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d ? date : null;
}

/** True for a real calendar date in YYYY-MM-DD form. */
export function isDateKey(value: unknown): value is string {
  return typeof value === "string" && parseDateKey(value) !== null;
}

/** Adds whole days to a calendar date ("2027-10-14" + 1 = "2027-10-15"). */
export function addDays(dateKey: string, days: number): string {
  const date = parseDateKey(dateKey);
  if (!date) throw new RangeError(`Expected YYYY-MM-DD, got "${dateKey}"`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Every calendar date from start to end, inclusive. Empty when the range is invalid. */
export function tripDays(startDate: string, endDate: string): string[] {
  const start = parseDateKey(startDate);
  const end = parseDateKey(endDate);
  if (!start || !end || end < start) return [];
  const days: string[] = [];
  for (let d = startDate; days.length < MAX_TRIP_DAYS; d = addDays(d, 1)) {
    days.push(d);
    if (d === endDate) break;
  }
  return days;
}

function formatParts(dateKey: string, locale: string, options: Intl.DateTimeFormatOptions) {
  const date = parseDateKey(dateKey);
  if (!date) return null;
  const parts = new Intl.DateTimeFormat(locale, { ...options, timeZone: "UTC" }).formatToParts(date);
  return (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
}

/** "15 Oct" */
export function formatShortDate(dateKey: string, locale = "en-GB"): string {
  const get = formatParts(dateKey, locale, { day: "numeric", month: "short" });
  return get ? `${get("day")} ${get("month")}` : dateKey;
}

/** "Thu 14 Oct", or "Thu 14 Oct 2027" with the year. */
export function formatDay(dateKey: string, locale = "en-GB", withYear = false): string {
  const get = formatParts(dateKey, locale, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  if (!get) return dateKey;
  const day = `${get("weekday")} ${get("day")} ${get("month")}`;
  return withYear ? `${day} ${get("year")}` : day;
}

/** "14 Oct 2027" */
export function formatLongDate(dateKey: string, locale = "en-GB"): string {
  const get = formatParts(dateKey, locale, { day: "numeric", month: "short", year: "numeric" });
  return get ? `${get("day")} ${get("month")} ${get("year")}` : dateKey;
}

/** "14 Oct – 19 Oct 2027", for list previews. */
export function formatCompactRange(startDate: string, endDate: string, locale = "en-GB"): string {
  if (!isDateKey(startDate)) return isDateKey(endDate) ? `until ${formatLongDate(endDate, locale)}` : "Dates not set";
  if (!isDateKey(endDate) || startDate === endDate) return formatLongDate(startDate, locale);
  const sameYear = startDate.slice(0, 4) === endDate.slice(0, 4);
  const start = sameYear ? formatShortDate(startDate, locale) : formatLongDate(startDate, locale);
  return `${start} – ${formatLongDate(endDate, locale)}`;
}

/** "Thu 14 Oct – Tue 19 Oct 2027 (6 days)" */
export function formatDateRange(startDate: string, endDate: string, locale = "en-GB"): string {
  if (!isDateKey(startDate) && !isDateKey(endDate)) return "Dates not set";
  if (!isDateKey(startDate) || !isDateKey(endDate)) {
    return `${formatDay(isDateKey(startDate) ? startDate : endDate, locale, true)} (dates incomplete)`;
  }
  const count = tripDays(startDate, endDate).length;
  if (count === 0) return `${formatDay(startDate, locale, true)} – ${formatDay(endDate, locale, true)} (check dates)`;
  const length = `(${count} ${count === 1 ? "day" : "days"})`;
  if (startDate === endDate) return `${formatDay(startDate, locale, true)} ${length}`;
  const sameYear = startDate.slice(0, 4) === endDate.slice(0, 4);
  return `${formatDay(startDate, locale, !sameYear)} – ${formatDay(endDate, locale, true)} ${length}`;
}

// ---------------------------------------------------------------------------
// Sanity document → Manifest
// ---------------------------------------------------------------------------

type Loose = Record<string, unknown>;

const isObject = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown): string | undefined => {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed ? trimmed : undefined;
};
const flag = (v: unknown): boolean | undefined => (typeof v === "boolean" ? v : undefined);
const objects = (v: unknown): Loose[] => (Array.isArray(v) ? v.filter(isObject) : []);
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

function toTraveller(raw: Loose): Traveller {
  return {
    fullName: text(raw.fullName) ?? "",
    ageGroup: oneOf(raw.ageGroup, ["adult", "child"], "adult"),
    dietary: text(raw.dietary),
    medical: text(raw.medical),
    notes: text(raw.notes),
    huntingLicence: flag(raw.huntingLicence),
    insurance: flag(raw.insurance),
  };
}

function toItineraryDay(raw: Loose): ItineraryDay {
  return {
    date: text(raw.date) ?? "",
    location: text(raw.location) ?? "",
    programme: text(raw.programme),
    contactName: text(raw.contactName),
    contactPhone: text(raw.contactPhone),
  };
}

/** Days with a date first (soonest first), undated entries last; stable otherwise. */
function byDate(a: ItineraryDay, b: ItineraryDay): number {
  if (!a.date || !b.date) return a.date ? -1 : b.date ? 1 : 0;
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

/**
 * Builds a manifest from a (possibly partial or draft) `trip` document.
 * Missing arrays become empty, unknown values fall back to safe defaults and
 * the itinerary is sorted by date.
 */
export function toManifest(doc: unknown): Manifest {
  const d = isObject(doc) ? doc : {};
  const lead = isObject(d.lead) ? d.lead : {};
  return {
    id: (text(d._id) ?? "").replace(/^drafts\./, ""),
    title: text(d.title) ?? "Untitled journey",
    kind: oneOf(d.kind, ["journey", "hunting"], "journey"),
    status: oneOf(d.status, ["planned", "confirmed", "completed", "cancelled"], "planned"),
    tripType: text(d.tripType),
    startDate: text(d.startDate) ?? "",
    endDate: text(d.endDate) ?? "",
    lead: { name: text(lead.name) ?? "", email: text(lead.email), phone: text(lead.phone) },
    travellers: objects(d.travellers).map(toTraveller),
    itinerary: objects(d.itinerary).map(toItineraryDay).sort(byDate),
    checklist: objects(d.checklist)
      .map((c) => ({ label: text(c.label) ?? "", done: c.done === true }))
      .filter((c) => c.label),
    internalNotes: text(d.internalNotes),
  };
}

/** A traveller's name for lists and messages, with a stand-in when it is still empty. */
export function travellerName(t: Traveller, index: number): string {
  return t.fullName || `Traveller ${index + 1}`;
}

export type ItineraryRow = { date: string; day: ItineraryDay | null };

/**
 * The "Day by day" table: every itinerary entry sorted by date, plus a row
 * with `day: null` ("no plan yet") for each date of the journey without one.
 */
export function itineraryRows(m: Manifest): ItineraryRow[] {
  const planned = new Set(m.itinerary.map((d) => d.date));
  const gaps: ItineraryRow[] = tripDays(m.startDate, m.endDate)
    .filter((date) => !planned.has(date))
    .map((date) => ({ date, day: null }));
  const rows: ItineraryRow[] = [...m.itinerary.map((day) => ({ date: day.date, day })), ...gaps];
  return rows.sort((a, b) => {
    if (!a.date || !b.date) return a.date ? -1 : b.date ? 1 : 0;
    return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
  });
}

// ---------------------------------------------------------------------------
// Readiness
// ---------------------------------------------------------------------------

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Everything that still needs doing before (or after) the journey, in a fixed
 * order (docs/11 §8). Empty means "Ready to go". Cancelled journeys are never
 * flagged.
 */
export function readiness(m: Manifest, today: string): ReadinessIssue[] {
  if (m.status === "cancelled") return [];
  const issues: ReadinessIssue[] = [];
  const names = (list: Traveller[]) => list.map((t) => travellerName(t, m.travellers.indexOf(t))).join(", ");

  if (m.travellers.length === 0) {
    issues.push({ code: "no-travellers", message: "No travellers added" });
  }
  if (!m.lead.phone) {
    issues.push({ code: "no-lead-phone", message: "No phone number for the lead traveller" });
  }
  if (
    m.status === "planned" &&
    isDateKey(m.startDate) &&
    isDateKey(today) &&
    m.startDate <= addDays(today, STILL_PLANNED_DAYS)
  ) {
    issues.push({ code: "still-planned", message: "Departs within two weeks but is still marked Planned" });
  }
  const planned = new Set(m.itinerary.map((d) => d.date));
  const gaps = tripDays(m.startDate, m.endDate).filter((date) => !planned.has(date));
  if (gaps.length > 0) {
    issues.push({
      code: "itinerary-gaps",
      message: `No plan yet for: ${gaps.map((g) => formatShortDate(g)).join(", ")}`,
    });
  }
  const open = m.checklist.filter((c) => !c.done);
  if (open.length > 0) {
    issues.push({
      code: "open-checklist",
      message: `${plural(open.length, "checklist item", "checklist items")} open: ${open.map((c) => c.label).join(", ")}`,
    });
  }
  if (m.kind === "hunting") {
    const noLicence = m.travellers.filter((t) => !t.huntingLicence);
    if (noLicence.length > 0) {
      issues.push({ code: "hunting-licence", message: `Hunting licence missing for: ${names(noLicence)}` });
    }
    const noInsurance = m.travellers.filter((t) => !t.insurance);
    if (noInsurance.length > 0) {
      issues.push({ code: "hunting-insurance", message: `Hunting insurance missing for: ${names(noInsurance)}` });
    }
  }
  if (m.status === "confirmed" && isDateKey(m.endDate) && isDateKey(today) && m.endDate < today) {
    issues.push({ code: "mark-completed", message: "Journey is over: mark it Completed" });
  }
  return issues;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * One CSV field (RFC 4180). Values that a spreadsheet would run as a formula
 * (starting with = + - @) get a leading apostrophe so a name can never
 * execute anything when the file is opened in Excel.
 */
function csvField(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

const yesNo = (v: boolean | undefined) => (v ? "Yes" : "No");

/**
 * Travellers as CSV that opens cleanly in Excel: UTF-8 with a byte order mark
 * (keeps Rīga and Ķemeri intact), RFC 4180 quoting and CRLF line endings.
 */
export function travellersCsv(m: Manifest): string {
  const hunting = m.kind === "hunting";
  const header = ["#", "Name", "Age group", "Dietary", "Medical", "Notes"];
  if (hunting) header.push("Hunting licence", "Hunting insurance");
  const rows = m.travellers.map((t, i) => {
    const row = [
      String(i + 1),
      t.fullName,
      AGE_GROUP_LABELS[t.ageGroup],
      t.dietary ?? "",
      t.medical ?? "",
      t.notes ?? "",
    ];
    if (hunting) row.push(yesNo(t.huntingLicence), yesNo(t.insurance));
    return row;
  });
  return `﻿${[header, ...rows].map((r) => r.map(csvField).join(",")).join("\r\n")}\r\n`;
}

/** A file name for downloads, e.g. "jansen-family-autumn-in-vidzeme-2027-10-14-travellers.csv". */
export function exportFileName(m: Manifest, suffix: string, extension: string): string {
  const slug = m.title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return [slug || "journey", isDateKey(m.startDate) ? m.startDate : null, suffix]
    .filter(Boolean)
    .join("-")
    .concat(`.${extension}`);
}

/**
 * Plain-text summary to paste into WhatsApp for a guide, driver or lodge.
 * Uses WhatsApp's *bold*; never includes internal notes or readiness issues.
 */
export function whatsappSummary(m: Manifest): string {
  const lines: string[] = [
    `*${m.title}*`,
    `${formatDateRange(m.startDate, m.endDate)} · ${TRIP_STATUS_LABELS[m.status]}`,
  ];
  const lead = [m.lead.name, m.lead.phone, m.lead.email].filter(Boolean).join(" · ");
  if (lead) lines.push(`Lead: ${lead}`);

  lines.push("", `*Travellers (${m.travellers.length})*`);
  if (m.travellers.length === 0) lines.push("None yet");
  m.travellers.forEach((t, i) => {
    const details = [
      t.ageGroup === "child" ? "child" : null,
      t.dietary ? `diet: ${t.dietary}` : null,
      t.medical ? `medical: ${t.medical}` : null,
      t.notes ?? null,
    ].filter(Boolean);
    lines.push(`${i + 1}. ${travellerName(t, i)}${details.length ? ` (${details.join("; ")})` : ""}`);
  });

  const rows = itineraryRows(m);
  if (rows.length > 0) {
    lines.push("", "*Day by day*");
    for (const { date, day } of rows) {
      const when = date ? formatDay(date) : "Date not set";
      if (!day) {
        lines.push(`${when}: (no plan yet)`);
        continue;
      }
      const contact = [day.contactName, day.contactPhone].filter(Boolean).join(" ");
      lines.push(`${when}: ${day.location || "(no location)"}${contact ? ` · ${contact}` : ""}`);
      if (day.programme) lines.push(`  ${day.programme.replace(/\s*\n\s*/g, " ")}`);
    }
  }
  return lines.join("\n");
}
