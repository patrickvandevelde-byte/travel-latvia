/**
 * Redirects authored in Sanity (MKT-06) are synced to Vercel Edge Config as a
 * map keyed by normalised path, and looked up in proxy.ts on every request.
 */
export type RedirectRule = { to: string; permanent: boolean };
export type RedirectMap = Record<string, RedirectRule>;

export function normalisePath(path: string): string {
  let p = path.trim().split("?")[0].split("#")[0].toLowerCase();
  if (!p.startsWith("/")) p = `/${p}`;
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p;
}

export function buildRedirectMap(rows: { from: string; to: string; permanent: boolean | null }[]): RedirectMap {
  const map: RedirectMap = {};
  for (const row of rows) {
    const from = normalisePath(row.from);
    const to = row.to.startsWith("/") ? normalisePath(row.to) : row.to;
    if (from === to) continue; // never redirect to itself
    map[from] = { to, permanent: row.permanent ?? true };
  }
  // Collapse chains (a → b → c becomes a → c) and drop loops. Resolve against
  // an unmodified copy so the result doesn't depend on iteration order.
  const original: RedirectMap = { ...map };
  for (const from of Object.keys(original)) {
    const seen = new Set([from]);
    let rule = original[from];
    let loop = false;
    while (original[rule.to]) {
      if (seen.has(rule.to)) {
        loop = true;
        break;
      }
      seen.add(rule.to);
      rule = { to: original[rule.to].to, permanent: rule.permanent && original[rule.to].permanent };
    }
    if (loop) delete map[from];
    else map[from] = rule;
  }
  return map;
}

export function matchRedirect(map: RedirectMap | undefined | null, pathname: string): RedirectRule | null {
  if (!map) return null;
  return map[normalisePath(pathname)] ?? null;
}
