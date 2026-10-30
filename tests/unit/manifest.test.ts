import { describe, expect, it } from "vitest";
import {
  addDays,
  DEFAULT_CHECKLIST,
  exportFileName,
  formatCompactRange,
  formatDateRange,
  itineraryRows,
  readiness,
  toManifest,
  travellersCsv,
  tripDays,
  whatsappSummary,
  type Manifest,
} from "@/modules/operations/manifest";

/** A journey that is ready to go: every rule passes on TODAY. */
const ready = (overrides: Partial<Manifest> = {}): Manifest => ({
  id: "trip-1",
  title: "Jansen family — autumn in Vidzeme",
  kind: "journey",
  status: "confirmed",
  tripType: "Nature & hiking",
  startDate: "2027-10-14",
  endDate: "2027-10-16",
  lead: { name: "Anna Jansen", email: "anna@example.com", phone: "+31 6 1234 5678" },
  travellers: [
    { fullName: "Anna Jansen", ageGroup: "adult" },
    { fullName: "Jan Jansen", ageGroup: "adult", dietary: "Vegetarian" },
  ],
  itinerary: [
    { date: "2027-10-14", location: "Rīga" },
    { date: "2027-10-15", location: "Cēsis" },
    { date: "2027-10-16", location: "Sigulda" },
  ],
  checklist: DEFAULT_CHECKLIST.map((label) => ({ label, done: true })),
  ...overrides,
});
const TODAY = "2027-09-01";
const codes = (m: Manifest, today = TODAY) => readiness(m, today).map((i) => i.code);

describe("calendar dates", () => {
  it("adds days across month and year ends", () => {
    expect(addDays("2027-10-31", 1)).toBe("2027-11-01");
    expect(addDays("2027-12-31", 1)).toBe("2028-01-01");
    expect(addDays("2028-03-01", -1)).toBe("2028-02-29");
  });
  it("lists every day of a journey, inclusive", () => {
    expect(tripDays("2027-10-14", "2027-10-16")).toEqual(["2027-10-14", "2027-10-15", "2027-10-16"]);
    expect(tripDays("2027-10-14", "2027-10-14")).toEqual(["2027-10-14"]);
  });
  it("returns no days for an invalid or reversed range", () => {
    expect(tripDays("2027-10-16", "2027-10-14")).toEqual([]);
    expect(tripDays("", "2027-10-14")).toEqual([]);
    expect(tripDays("2027-02-30", "2027-03-02")).toEqual([]);
  });
  it("formats a range with weekdays and length", () => {
    expect(formatDateRange("2027-10-14", "2027-10-19")).toBe("Thu 14 Oct – Tue 19 Oct 2027 (6 days)");
    expect(formatDateRange("2027-12-30", "2028-01-02")).toBe("Thu 30 Dec 2027 – Sun 2 Jan 2028 (4 days)");
    expect(formatDateRange("2027-10-14", "2027-10-14")).toBe("Thu 14 Oct 2027 (1 day)");
    expect(formatDateRange("", "")).toBe("Dates not set");
  });
  it("formats a compact range for list previews", () => {
    expect(formatCompactRange("2027-10-14", "2027-10-19")).toBe("14 Oct – 19 Oct 2027");
    expect(formatCompactRange("2027-12-30", "2028-01-02")).toBe("30 Dec 2027 – 2 Jan 2028");
    expect(formatCompactRange("2027-10-14", "")).toBe("14 Oct 2027");
    expect(formatCompactRange("", "")).toBe("Dates not set");
  });
});

describe("toManifest", () => {
  it("tolerates an empty or partial document", () => {
    const m = toManifest({ _id: "drafts.abc", _type: "trip" });
    expect(m).toMatchObject({
      id: "abc",
      title: "Untitled journey",
      kind: "journey",
      status: "planned",
      startDate: "",
      lead: { name: "" },
      travellers: [],
      itinerary: [],
      checklist: [],
    });
    expect(toManifest(null).travellers).toEqual([]);
  });
  it("normalises values, drops junk and sorts the itinerary by date", () => {
    const m = toManifest({
      _id: "t1",
      title: "  Hunt  ",
      kind: "hunting",
      status: "bogus",
      travellers: [{ _key: "a", fullName: "Jan", ageGroup: "child", huntingLicence: true }, "junk", null],
      itinerary: [
        { _key: "2", date: "2027-10-15", location: "Ķemeri" },
        { _key: "x", location: "No date" },
        { _key: "1", date: "2027-10-14", location: "Rīga", programme: "  " },
      ],
      checklist: [{ label: "Deposit received", done: true }, { label: "" }, { label: "Balance received" }],
    });
    expect(m.title).toBe("Hunt");
    expect(m.kind).toBe("hunting");
    expect(m.status).toBe("planned");
    expect(m.travellers).toEqual([{ fullName: "Jan", ageGroup: "child", huntingLicence: true }]);
    expect(m.itinerary.map((d) => d.location)).toEqual(["Rīga", "Ķemeri", "No date"]);
    expect(m.itinerary[0].programme).toBeUndefined();
    expect(m.checklist).toEqual([
      { label: "Deposit received", done: true },
      { label: "Balance received", done: false },
    ]);
  });
});

describe("itineraryRows", () => {
  it("adds a '(no plan yet)' row for each day without an entry", () => {
    const rows = itineraryRows(ready({ itinerary: [{ date: "2027-10-15", location: "Cēsis" }] }));
    expect(rows.map((r) => [r.date, r.day?.location ?? null])).toEqual([
      ["2027-10-14", null],
      ["2027-10-15", "Cēsis"],
      ["2027-10-16", null],
    ]);
  });
});

describe("readiness", () => {
  it("is empty for a journey that is ready", () => {
    expect(readiness(ready(), TODAY)).toEqual([]);
  });
  it("never flags a cancelled journey", () => {
    expect(readiness(ready({ status: "cancelled", travellers: [], lead: { name: "" } }), TODAY)).toEqual([]);
  });
  it("no-travellers", () => {
    expect(readiness(ready({ travellers: [] }), TODAY)).toEqual([
      { code: "no-travellers", message: "No travellers added" },
    ]);
  });
  it("no-lead-phone", () => {
    expect(readiness(ready({ lead: { name: "Anna Jansen" } }), TODAY)).toEqual([
      { code: "no-lead-phone", message: "No phone number for the lead traveller" },
    ]);
  });
  it("still-planned: only within two weeks of departure", () => {
    expect(codes(ready({ status: "planned" }), "2027-09-29")).toEqual([]);
    expect(readiness(ready({ status: "planned" }), "2027-09-30")).toEqual([
      { code: "still-planned", message: "Departs within two weeks but is still marked Planned" },
    ]);
  });
  it("itinerary-gaps lists the days without a plan", () => {
    expect(readiness(ready({ itinerary: [{ date: "2027-10-14", location: "Rīga" }] }), TODAY)).toEqual([
      { code: "itinerary-gaps", message: "No plan yet for: 15 Oct, 16 Oct" },
    ]);
  });
  it("open-checklist counts and names open items", () => {
    const checklist = DEFAULT_CHECKLIST.map((label, i) => ({ label, done: i >= 3 }));
    expect(readiness(ready({ checklist }), TODAY)).toEqual([
      {
        code: "open-checklist",
        message: "3 checklist items open: Deposit received, Balance received, Accommodation confirmed",
      },
    ]);
    expect(readiness(ready({ checklist: [{ label: "Deposit received", done: false }] }), TODAY)[0].message).toBe(
      "1 checklist item open: Deposit received",
    );
  });
  it("hunting-licence and hunting-insurance name the travellers", () => {
    const m = ready({
      kind: "hunting",
      travellers: [
        { fullName: "Anna Jansen", ageGroup: "adult", huntingLicence: true, insurance: false },
        { fullName: "Jan Jansen", ageGroup: "adult" },
      ],
    });
    expect(readiness(m, TODAY)).toEqual([
      { code: "hunting-licence", message: "Hunting licence missing for: Jan Jansen" },
      { code: "hunting-insurance", message: "Hunting insurance missing for: Anna Jansen, Jan Jansen" },
    ]);
  });
  it("ignores licence fields on a bespoke journey", () => {
    expect(codes(ready({ travellers: [{ fullName: "Jan Jansen", ageGroup: "adult" }] }))).toEqual([]);
  });
  it("mark-completed once a confirmed journey is over", () => {
    expect(codes(ready(), "2027-10-16")).toEqual([]);
    expect(readiness(ready(), "2027-10-17")).toEqual([
      { code: "mark-completed", message: "Journey is over: mark it Completed" },
    ]);
    expect(codes(ready({ status: "completed" }), "2027-10-17")).toEqual([]);
  });
  it("reports issues in the documented order", () => {
    const m = ready({
      kind: "hunting",
      status: "planned",
      lead: { name: "Anna Jansen" },
      travellers: [],
      itinerary: [],
      checklist: [{ label: "Deposit received", done: false }],
    });
    expect(codes(m, "2027-10-10")).toEqual([
      "no-travellers",
      "no-lead-phone",
      "still-planned",
      "itinerary-gaps",
      "open-checklist",
    ]);
    const over = ready({ kind: "hunting", travellers: [{ fullName: "Jan", ageGroup: "adult" }] });
    expect(codes(over, "2027-11-01")).toEqual(["hunting-licence", "hunting-insurance", "mark-completed"]);
  });
});

describe("travellersCsv", () => {
  it("starts with a BOM, uses CRLF and quotes per RFC 4180", () => {
    const csv = travellersCsv(
      ready({
        travellers: [
          { fullName: "Anna Jansen", ageGroup: "adult", dietary: 'No nuts, "really"' },
          { fullName: "Pēteris Ozoliņš", ageGroup: "child", notes: "Line one\nLine two" },
        ],
      }),
    );
    expect(csv.startsWith("﻿#,Name,Age group,Dietary,Medical,Notes\r\n")).toBe(true);
    expect(csv).toBe(
      '﻿#,Name,Age group,Dietary,Medical,Notes\r\n1,Anna Jansen,Adult,"No nuts, ""really""",,\r\n2,Pēteris Ozoliņš,Child,,,"Line one\nLine two"\r\n',
    );
  });
  it("adds licence and insurance columns for hunting trips", () => {
    const csv = travellersCsv(
      ready({ kind: "hunting", travellers: [{ fullName: "Jan", ageGroup: "adult", huntingLicence: true }] }),
    );
    expect(csv.split("\r\n")).toEqual([
      "﻿#,Name,Age group,Dietary,Medical,Notes,Hunting licence,Hunting insurance",
      "1,Jan,Adult,,,,Yes,No",
      "",
    ]);
  });
  it("neutralises spreadsheet formulas", () => {
    const csv = travellersCsv(ready({ travellers: [{ fullName: "=HYPERLINK(1)", ageGroup: "adult" }] }));
    expect(csv).toContain("\r\n1,'=HYPERLINK(1),Adult,");
  });
});

describe("exportFileName", () => {
  it("makes a safe, dated file name", () => {
    expect(exportFileName(ready({ title: "Ķemeri bog walk — Jansen" }), "travellers", "csv")).toBe(
      "kemeri-bog-walk-jansen-2027-10-14-travellers.csv",
    );
  });
});

describe("whatsappSummary", () => {
  it("summarises the journey without internal notes", () => {
    const text = whatsappSummary(
      ready({
        internalNotes: "Secret margin",
        travellers: [{ fullName: "Anna Jansen", ageGroup: "child", dietary: "Vegetarian" }],
        itinerary: [
          { date: "2027-10-14", location: "Rīga", programme: "Old town walk\nDinner", contactName: "Guide Ilze" },
        ],
      }),
    );
    expect(text).toBe(
      [
        "*Jansen family — autumn in Vidzeme*",
        "Thu 14 Oct – Sat 16 Oct 2027 (3 days) · Confirmed",
        "Lead: Anna Jansen · +31 6 1234 5678 · anna@example.com",
        "",
        "*Travellers (1)*",
        "1. Anna Jansen (child; diet: Vegetarian)",
        "",
        "*Day by day*",
        "Thu 14 Oct: Rīga · Guide Ilze",
        "  Old town walk Dinner",
        "Fri 15 Oct: (no plan yet)",
        "Sat 16 Oct: (no plan yet)",
      ].join("\n"),
    );
    expect(text).not.toContain("Secret");
  });
});
