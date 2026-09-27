/**
 * Timestamps are stored in UTC. Slot days are computed and displayed in the
 * operating time zone, Europe/Riga (CLAUDE.md, NFR-06).
 */
export const OPERATING_TIME_ZONE = "Europe/Riga";

/** Calendar date (YYYY-MM-DD) of an instant in Europe/Riga. */
export function rigaDateKey(instant: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: OPERATING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Offset of Europe/Riga from UTC in minutes at a given instant (+120 or +180). */
export function rigaOffsetMinutes(instant: Date): number {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: OPERATING_TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(instant)
    .find((p) => p.type === "timeZoneName")?.value;
  const match = name?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

/**
 * Converts a Riga wall-clock time (e.g. "2027-07-14", "10:00") to a UTC instant.
 * Handles daylight saving: the offset is resolved for that specific date.
 */
export function rigaWallTimeToUtc(dateKey: string, time: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match || !timeMatch) {
    throw new RangeError(`Expected YYYY-MM-DD and HH:MM, got "${dateKey}" "${time}"`);
  }
  const [, y, m, d] = match.map(Number);
  const [, hh, mm] = timeMatch.map(Number);
  const naiveUtc = Date.UTC(y, m - 1, d, hh, mm);
  // First guess with the offset at the naive instant, then correct once around DST changes.
  let offset = rigaOffsetMinutes(new Date(naiveUtc));
  let result = new Date(naiveUtc - offset * 60_000);
  const corrected = rigaOffsetMinutes(result);
  if (corrected !== offset) {
    offset = corrected;
    result = new Date(naiveUtc - offset * 60_000);
  }
  return result;
}

export function formatRigaDateTime(
  instant: Date,
  locale = "en-GB",
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: OPERATING_TIME_ZONE }).format(instant);
}
