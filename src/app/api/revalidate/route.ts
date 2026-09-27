import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { z } from "zod";
import { env } from "@/lib/env";
import { sanityFetch } from "@/modules/content/client";
import { redirectsQuery } from "@/modules/content/queries";
import { buildRedirectMap } from "@/modules/content/redirects";

const payload = z.object({
  _type: z.string(),
  slug: z.string().nullish(),
});

/**
 * Sanity publish webhook → refresh cached pages within seconds (CMS-04).
 * Configure in Sanity: POST to /api/revalidate, projection
 * `{ _type, "slug": slug.current }`, secret = SANITY_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  if (!env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Webhook secret not configured" }, { status: 500 });
  }
  const { isValidSignature, body } = await parseBody(req, env.SANITY_REVALIDATE_SECRET, true);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }
  const parsed = payload.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Unexpected payload" }, { status: 400 });
  }

  const { _type, slug } = parsed.data;
  const tags = [`sanity:${_type}`];
  if (slug) tags.push(`sanity:${_type}:${slug}`);
  // Menus, cards and blocks reference other documents, so refresh everything
  // from Sanity as well; the site is small enough that this stays cheap.
  tags.push("sanity");
  for (const tag of tags) revalidateTag(tag, "max");

  const redirects = _type === "redirect" ? await syncRedirects() : undefined;
  return NextResponse.json({ revalidated: tags, redirects });
}

/** Pushes the full redirect map to Edge Config so proxy.ts serves it (ADR-012). */
async function syncRedirects(): Promise<"synced" | "skipped" | "failed"> {
  const id = process.env.EDGE_CONFIG_ID;
  const token = process.env.EDGE_CONFIG_WRITE_TOKEN;
  if (!id || !token) return "skipped";
  const rows = (await sanityFetch(redirectsQuery, {}, { revalidate: 0 })) ?? [];
  const res = await fetch(`https://api.vercel.com/v1/edge-config/${id}/items`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ operation: "upsert", key: "redirects", value: buildRedirectMap(rows) }] }),
  });
  if (!res.ok) {
    console.error("Edge Config redirect sync failed", res.status, await res.text());
    return "failed";
  }
  return "synced";
}
