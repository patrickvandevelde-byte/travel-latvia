import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DEFAULT_CHECKLIST, toManifest, type Manifest } from "@/modules/operations/manifest";
import { printDocument } from "../../sanity/tools/operations/exporters";
import { ManifestSheet, printCss } from "../../sanity/tools/operations/ManifestSheet";

const TODAY = "2027-10-01";
const manifest = (overrides: Partial<Manifest> = {}): Manifest => ({
  ...toManifest({
    _id: "drafts.trip-1",
    title: "Jansen family — autumn in Vidzeme",
    status: "confirmed",
    kind: "journey",
    tripType: "Nature & hiking",
    startDate: "2027-10-14",
    endDate: "2027-10-16",
    lead: { name: "Anna Jansen", phone: "+31 6 1234 5678", email: "anna@example.com" },
    travellers: [
      { _key: "a", fullName: "Anna Jansen", ageGroup: "adult", dietary: "Vegetarian" },
      { _key: "b", fullName: "Pēteris Ozoliņš", ageGroup: "child", medical: "Asthma" },
    ],
    itinerary: [
      { _key: "2", date: "2027-10-16", location: "Sigulda", contactName: "Ilze", contactPhone: "+371 2000 0000" },
      { _key: "1", date: "2027-10-14", location: "Rīga", programme: "Old town walk" },
    ],
    checklist: DEFAULT_CHECKLIST.map((label) => ({ label, done: true })),
    internalNotes: "Margin 18%",
  }),
  ...overrides,
});
const render = (m: Manifest, includeInternal = true, forPrint = false) =>
  renderToStaticMarkup(
    <ManifestSheet
      manifest={m}
      today={TODAY}
      includeInternal={includeInternal}
      forPrint={forPrint}
      siteName="Baltique"
    />,
  );

describe("ManifestSheet", () => {
  it("renders the header, lead, travellers and day by day", () => {
    const html = render(manifest());
    expect(html).toContain("<h1>Jansen family — autumn in Vidzeme</h1>");
    expect(html).toContain("Bespoke journey");
    expect(html).toContain("Nature &amp; hiking");
    expect(html).toContain("Thu 14 Oct – Sat 16 Oct 2027 (3 days)");
    expect(html).toContain("Confirmed");
    expect(html).toContain("+31 6 1234 5678");
    expect(html).toContain("Pēteris Ozoliņš");
    expect(html).toContain("<td>Child</td>");
    expect(html).not.toContain(">Licence<");
    // Days sorted by date, with the missing day listed.
    const riga = html.indexOf("Rīga");
    const gap = html.indexOf("(no plan yet)");
    const sigulda = html.indexOf("Sigulda");
    expect(riga).toBeGreaterThan(0);
    expect(gap).toBeGreaterThan(riga);
    expect(sigulda).toBeGreaterThan(gap);
    expect(html).toContain("Ilze, +371 2000 0000");
  });

  it("shows readiness issues and internal notes in the operator's version", () => {
    const html = render(manifest());
    expect(html).toContain("Still to do (1)");
    expect(html).toContain("No plan yet for: 15 Oct");
    expect(html).toContain("Internal notes");
    expect(html).toContain("Margin 18%");
  });

  it("shows 'Ready to go' when nothing is missing", () => {
    const m = manifest();
    const html = render({ ...m, itinerary: [...m.itinerary, { date: "2027-10-15", location: "Cēsis" }] });
    expect(html).toContain("Ready to go.");
    expect(html).not.toContain("(no plan yet)");
  });

  it("leaves readiness and internal notes out of the supplier version", () => {
    const html = render(manifest(), false);
    expect(html).not.toContain("Still to do");
    expect(html).not.toContain("Ready to go");
    expect(html).not.toContain("Internal notes");
    expect(html).not.toContain("Margin 18%");
  });

  it("adds licence and insurance columns for hunting trips", () => {
    const m = manifest({
      kind: "hunting",
      travellers: [{ fullName: "Jan Jansen", ageGroup: "adult", huntingLicence: true, insurance: false }],
    });
    const html = render(m);
    expect(html).toContain("Hunting trip");
    expect(html).toContain(">Licence<");
    expect(html).toContain(">Insurance<");
    expect(html).toContain("Hunting insurance missing for: Jan Jansen");
  });

  it("shows empty states for a brand-new journey", () => {
    const html = render(toManifest({ _id: "t2" }));
    expect(html).toContain("Untitled journey");
    expect(html).toContain("No travellers yet. Add them in the Edit tab.");
    expect(html).toContain("No days planned yet.");
    expect(html).toContain("No lead contact yet.");
  });

  it("escapes traveller input instead of rendering HTML", () => {
    const html = render(manifest({ travellers: [{ fullName: "<img src=x onerror=alert(1)>", ageGroup: "adult" }] }));
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });

  it("adds the A4 page set-up and footer only for printing", () => {
    expect(render(manifest())).not.toContain("@page");
    const html = render(manifest(), false, true);
    expect(html).toContain("size: A4");
    expect(html).toContain('"Printed 1 Oct 2027 · Baltique · page " counter(page)');
  });
});

describe("print helpers", () => {
  it("keeps the footer string from breaking out of the style tag", () => {
    const css = printCss('Evil "</style><script>');
    expect(css).not.toContain("</style");
    expect(css).toContain('Evil \\"\\3c /style>');
  });
  it("wraps the sheet in a standalone page with an escaped title", () => {
    const html = printDocument("Jansen <family>", "<article></article>");
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>Jansen &#60;family&#62;</title>");
    expect(html).toContain("<body><article></article></body>");
  });
});
