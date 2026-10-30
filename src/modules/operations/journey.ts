/**
 * Journey lifecycle helpers for the Studio actions (OPS-03, docs/11 §6.2–6.3).
 * Pure functions: the actions in sanity/actions/ only fetch, write and navigate.
 */
import { DEFAULT_CHECKLIST, formatLongDate, isDateKey, toManifest } from "./manifest";

type Loose = Record<string, unknown>;
const text = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const clip = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value);

/** A new `trip` document, without `_id` (the caller adds `drafts.<uuid>`). */
export type JourneyDraft = {
  _type: "trip";
  title: string;
  status: "planned";
  kind: "journey" | "hunting";
  tripType?: string;
  lead: { name: string; email?: string; phone?: string };
  travellers: { _key: string; _type: "traveller"; fullName: string; ageGroup: "adult" }[];
  enquiry: { _type: "reference"; _ref: string; _weak: true };
  checklist: { _key: string; _type: "checkItem"; label: string; done: false }[];
  internalNotes: string;
};

/**
 * Prefills a journey from an enquiry so nothing is retyped: title, kind
 * (Hunting trip when the trip type mentions "hunt"), lead contact as the
 * first traveller, a weak link back to the enquiry, the travel period and
 * wishes as internal notes, status Planned and the default checklist.
 * `newKey` makes the array item keys (e.g. a random id).
 */
export function journeyFromEnquiry(enquiry: unknown, newKey: () => string): JourneyDraft {
  const e: Loose = typeof enquiry === "object" && enquiry !== null ? (enquiry as Loose) : {};
  const name = text(e.name) ?? "Traveller";
  const tripType = text(e.tripType);
  const email = text(e.email);
  const phone = text(e.phone);
  return {
    _type: "trip",
    title: clip(`${name} — ${tripType ?? "journey"}`, 80),
    status: "planned",
    kind: tripType && /hunt/i.test(tripType) ? "hunting" : "journey",
    ...(tripType ? { tripType: clip(tripType, 60) } : {}),
    lead: { name: clip(name, 80), ...(email ? { email } : {}), ...(phone ? { phone } : {}) },
    travellers: [{ _key: newKey(), _type: "traveller", fullName: clip(name, 80), ageGroup: "adult" }],
    enquiry: { _type: "reference", _ref: (text(e._id) ?? "").replace(/^drafts\./, ""), _weak: true },
    checklist: DEFAULT_CHECKLIST.map((label) => ({ _key: newKey(), _type: "checkItem", label, done: false })),
    internalNotes: `Travel period: ${text(e.period) ?? "not given"}\n\nWishes:\n${text(e.wishes) ?? "not given"}`,
  };
}

/**
 * The confirmation shown before deleting a journey that has not departed
 * yet, or null when deleting needs no extra warning (cancelled, already
 * started, or no first day set).
 */
export function deleteWarning(doc: unknown, today: string): string | null {
  const m = toManifest(doc);
  if (m.status === "cancelled" || !isDateKey(m.startDate) || m.startDate < today) return null;
  const n = m.travellers.length;
  const who = n === 0 ? "no travellers yet" : `${n} ${n === 1 ? "traveller" : "travellers"}`;
  return `This journey departs on ${formatLongDate(m.startDate)} with ${who}. Delete it anyway? Setting the status to Cancelled keeps the record.`;
}
