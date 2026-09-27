import { describe, expect, it } from "vitest";
import { rigaDateKey, rigaOffsetMinutes, rigaWallTimeToUtc } from "@/lib/dates";

describe("Europe/Riga dates", () => {
  it("uses UTC+3 in summer and UTC+2 in winter", () => {
    expect(rigaOffsetMinutes(new Date("2027-07-14T12:00:00Z"))).toBe(180);
    expect(rigaOffsetMinutes(new Date("2027-01-14T12:00:00Z"))).toBe(120);
  });

  it("converts Riga wall-clock times to UTC across DST", () => {
    expect(rigaWallTimeToUtc("2027-07-14", "10:00").toISOString()).toBe("2027-07-14T07:00:00.000Z");
    expect(rigaWallTimeToUtc("2027-12-24", "10:00").toISOString()).toBe("2027-12-24T08:00:00.000Z");
  });

  it("assigns late-evening UTC instants to the next Riga day", () => {
    expect(rigaDateKey(new Date("2027-07-14T22:30:00Z"))).toBe("2027-07-15");
  });

  it("rejects malformed input", () => {
    expect(() => rigaWallTimeToUtc("14/07/2027", "10:00")).toThrow(RangeError);
  });
});
