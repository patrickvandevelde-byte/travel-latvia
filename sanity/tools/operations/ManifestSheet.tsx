import {
  AGE_GROUP_LABELS,
  formatDateRange,
  formatDay,
  formatLongDate,
  itineraryRows,
  readiness,
  travellerName,
  TRIP_KIND_LABELS,
  TRIP_STATUS_LABELS,
  type Manifest,
} from "../../../src/modules/operations/manifest";

/**
 * The journey manifest as a printable sheet (OPS-03, docs/11 §7).
 *
 * Plain React with its own CSS string and no Studio dependencies, so the same
 * component renders inside the Studio's Manifest tab, as static markup in a
 * separate print window, and in unit tests.
 */
export type ManifestSheetProps = {
  manifest: Manifest;
  /** Riga calendar day (YYYY-MM-DD) used for the readiness checks. */
  today: string;
  /** Off for the supplier version: hides readiness and internal notes. */
  includeInternal: boolean;
  /** Adds the A4 page set-up and the printed-on footer. */
  forPrint?: boolean;
  /** Shown in the print footer, e.g. "30 Oct 2026". */
  printedOn?: string;
  /** Shown in the print footer, e.g. "Baltique". */
  siteName?: string;
};

/** Screen and print styles, scoped to `.tlm`. Readable without colour. */
export const MANIFEST_CSS = `
.tlm { box-sizing: border-box; max-width: 210mm; margin: 0 auto; padding: 24px; background: #fff; color: #1b1b1b;
  font: 14px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.tlm *, .tlm *::before, .tlm *::after { box-sizing: inherit; }
.tlm h1 { font-size: 22px; line-height: 1.25; margin: 0 0 6px; }
.tlm h2 { font-size: 15px; margin: 22px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #c9c9c9; }
.tlm p { margin: 0 0 6px; }
.tlm .tlm-meta { display: flex; flex-wrap: wrap; gap: 6px 12px; align-items: center; color: #3d3d3d; }
.tlm .tlm-badge { display: inline-block; padding: 1px 8px; border: 1px solid #777; border-radius: 999px; font-size: 12px; }
.tlm .tlm-unsaved { color: #6b6b6b; font-size: 12px; margin-top: 6px; }
.tlm .tlm-ready { margin-top: 16px; padding: 10px 12px; border: 1px solid #2e7d32; border-left-width: 6px;
  background: #edf7ee; border-radius: 4px; }
.tlm .tlm-issues { margin-top: 16px; padding: 10px 12px; border: 1px solid #b26a00; border-left-width: 6px;
  background: #fff6e5; border-radius: 4px; }
.tlm .tlm-issues ul { margin: 6px 0 0; padding-left: 20px; }
.tlm table { width: 100%; border-collapse: collapse; font-size: 13px; }
.tlm th, .tlm td { text-align: left; vertical-align: top; padding: 6px 8px; border-bottom: 1px solid #dedede; }
.tlm th { font-weight: 600; border-bottom: 2px solid #9a9a9a; white-space: nowrap; }
.tlm tr { break-inside: avoid; page-break-inside: avoid; }
.tlm .tlm-num { width: 2.5em; }
.tlm .tlm-muted { color: #6b6b6b; font-style: italic; }
.tlm .tlm-pre { white-space: pre-wrap; }
.tlm .tlm-dl { display: grid; grid-template-columns: max-content 1fr; gap: 2px 16px; margin: 0; }
.tlm .tlm-dl dt { font-weight: 600; }
.tlm .tlm-dl dd { margin: 0; }
.tlm .tlm-checklist { list-style: none; margin: 0; padding: 0; columns: 2 220px; }
.tlm .tlm-checklist li { break-inside: avoid; padding: 2px 0; }
.tlm .tlm-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 640px) { .tlm { padding: 16px; } .tlm table { font-size: 12px; } .tlm th, .tlm td { padding: 4px; } }
`;

/** Quotes a value for a CSS string literal. Escapes "<" so it can never close the style tag. */
function cssString(value: string): string {
  return `"${value
    .replace(/[\\"]/g, "\\$&")
    .replace(/</g, "\\3c ")
    .replace(/[\r\n]+/g, " ")}"`;
}

/** A4 page set-up and the "Printed … · page N" footer, only in the print window. */
export function printCss(footer: string): string {
  return `
@page { size: A4; margin: 14mm; @bottom-center { content: ${cssString(`${footer} · page `)} counter(page); font: 9px system-ui, sans-serif; color: #555; } }
html, body { margin: 0; background: #fff; }
.tlm { max-width: none; padding: 0; font-size: 12px; }
.tlm h2 { break-after: avoid; page-break-after: avoid; }
.tlm thead { display: table-header-group; }
.tlm .tlm-ready, .tlm .tlm-issues { background: none; }
`;
}

const Yes = () => (
  <span>
    ✓<span className="tlm-sr"> yes</span>
  </span>
);

function TravellersTable({ m }: { m: Manifest }) {
  if (m.travellers.length === 0) {
    return <p className="tlm-muted">No travellers yet. Add them in the Edit tab.</p>;
  }
  const hunting = m.kind === "hunting";
  return (
    <table>
      <thead>
        <tr>
          <th scope="col" className="tlm-num">
            #
          </th>
          <th scope="col">Name</th>
          <th scope="col">Adult/Child</th>
          <th scope="col">Dietary</th>
          <th scope="col">Medical</th>
          <th scope="col">Notes</th>
          {hunting ? <th scope="col">Licence</th> : null}
          {hunting ? <th scope="col">Insurance</th> : null}
        </tr>
      </thead>
      <tbody>
        {m.travellers.map((t, i) => (
          <tr key={i}>
            <td className="tlm-num">{i + 1}</td>
            <td>{travellerName(t, i)}</td>
            <td>{AGE_GROUP_LABELS[t.ageGroup]}</td>
            <td>{t.dietary ?? "–"}</td>
            <td>{t.medical ?? "–"}</td>
            <td>{t.notes ?? "–"}</td>
            {hunting ? <td>{t.huntingLicence ? <Yes /> : "–"}</td> : null}
            {hunting ? <td>{t.insurance ? <Yes /> : "–"}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DayByDayTable({ m }: { m: Manifest }) {
  const rows = itineraryRows(m);
  if (rows.length === 0) {
    return <p className="tlm-muted">No days planned yet. Set the dates and add days in the Edit tab.</p>;
  }
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Location</th>
          <th scope="col">Programme</th>
          <th scope="col">Contact</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ date, day }, i) => (
          <tr key={`${date}-${i}`}>
            <td style={{ whiteSpace: "nowrap" }}>{date ? formatDay(date) : "Date not set"}</td>
            {day ? (
              <>
                <td>{day.location || "–"}</td>
                <td className="tlm-pre">{day.programme ?? ""}</td>
                <td>{[day.contactName, day.contactPhone].filter(Boolean).join(", ") || "–"}</td>
              </>
            ) : (
              <td colSpan={3} className="tlm-muted">
                (no plan yet)
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ManifestSheet({
  manifest: m,
  today,
  includeInternal,
  forPrint = false,
  printedOn,
  siteName,
}: ManifestSheetProps) {
  const issues = readiness(m, today);
  const footer = [`Printed ${printedOn ?? formatLongDate(today)}`, siteName].filter(Boolean).join(" · ");
  const css = forPrint ? MANIFEST_CSS + printCss(footer) : MANIFEST_CSS;
  const lead = m.lead;

  return (
    <article className="tlm" aria-label={`Manifest: ${m.title}`}>
      {/* Static CSS (plus an escaped footer string when printing); no user HTML. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <header>
        <h1>{m.title}</h1>
        <div className="tlm-meta">
          <span className="tlm-badge">{TRIP_KIND_LABELS[m.kind]}</span>
          <span>{formatDateRange(m.startDate, m.endDate)}</span>
          <span className="tlm-badge">{TRIP_STATUS_LABELS[m.status]}</span>
        </div>
      </header>

      {includeInternal ? (
        issues.length === 0 ? (
          <section className="tlm-ready" aria-label="Readiness">
            <strong>Ready to go.</strong> Nothing left to check.
          </section>
        ) : (
          <section className="tlm-issues" aria-label="Readiness">
            <strong>Still to do ({issues.length})</strong>
            <ul>
              {issues.map((issue) => (
                <li key={issue.code} data-code={issue.code}>
                  {issue.message}
                </li>
              ))}
            </ul>
          </section>
        )
      ) : null}

      <section>
        <h2>Lead contact</h2>
        {lead.name || lead.phone || lead.email ? (
          <dl className="tlm-dl">
            <dt>Name</dt>
            <dd>{lead.name || "–"}</dd>
            <dt>Phone</dt>
            <dd>{lead.phone ?? "–"}</dd>
            <dt>Email</dt>
            <dd>{lead.email ?? "–"}</dd>
          </dl>
        ) : (
          <p className="tlm-muted">No lead contact yet. Add one in the Edit tab.</p>
        )}
      </section>

      <section>
        <h2>Travellers ({m.travellers.length})</h2>
        <TravellersTable m={m} />
      </section>

      <section>
        <h2>Day by day</h2>
        <DayByDayTable m={m} />
      </section>

      <section>
        <h2>Checklist</h2>
        {m.checklist.length === 0 ? (
          <p className="tlm-muted">No checklist items.</p>
        ) : (
          <ul className="tlm-checklist">
            {m.checklist.map((item, i) => (
              <li key={i}>
                {item.done ? "☑" : "☐"} {item.label}
                <span className="tlm-sr">{item.done ? " (done)" : " (open)"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {includeInternal ? (
        <section>
          <h2>Internal notes</h2>
          {m.internalNotes ? (
            <p className="tlm-pre">{m.internalNotes}</p>
          ) : (
            <p className="tlm-muted">No internal notes.</p>
          )}
        </section>
      ) : null}
    </article>
  );
}
