import { pathFor } from "./paths";

export type LinkValue = {
  label?: string | null;
  kind?: string | null;
  external?: string | null;
  internal?: { _type: string; slug?: string | null; regionSlug?: string | null } | null;
} | null;

/** Resolves a CMS link to an href, or null when it points nowhere. */
export function hrefFor(link: LinkValue | undefined): string | null {
  if (!link) return null;
  if (link.kind === "external") return link.external ?? null;
  return link.internal ? pathFor(link.internal) : null;
}
