/**
 * Browser helpers for the Manifest tab: print window, file download and
 * clipboard. Each one checks that a browser window exists and reports
 * success, so the view can tell the operator when something was blocked.
 */

const hasWindow = () => typeof window !== "undefined" && typeof document !== "undefined";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** A complete standalone HTML page around the sheet's static markup. */
export function printDocument(title: string, bodyMarkup: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title></head><body>${bodyMarkup}</body></html>`;
}

/**
 * Opens the sheet in a new window and starts the browser's print dialog,
 * where "Save as PDF" is one of the printers. The Studio itself is never
 * printed. Returns false when there is no window or pop-ups are blocked.
 */
export function openPrintWindow(html: string): boolean {
  if (!hasWindow()) return false;
  const win = window.open("", "_blank");
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  // Let the new window lay out before the print dialog opens.
  win.setTimeout(() => win.print(), 250);
  return true;
}

/** Downloads text as a file, e.g. the travellers CSV. */
export function downloadText(fileName: string, content: string, mimeType: string): boolean {
  if (!hasWindow() || typeof URL.createObjectURL !== "function") return false;
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

/** Copies text to the clipboard, with a fallback for browsers without the Clipboard API. */
export async function copyText(text: string): Promise<boolean> {
  if (!hasWindow()) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path (e.g. permissions denied).
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}
