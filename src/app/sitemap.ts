import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { sanityFetch } from "@/modules/content/client";
import { pathFor } from "@/modules/content/paths";
import { sitemapQuery } from "@/modules/content/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = (await sanityFetch(sitemapQuery, {}, { tags: ["sanity"] })) ?? [];
  const staticPaths = ["/", "/destinations", "/experiences", "/guides"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({ url: new URL(p, siteUrl).toString() }));
  for (const doc of docs) {
    const path = pathFor(doc);
    if (path) entries.push({ url: new URL(path, siteUrl).toString(), lastModified: doc._updatedAt });
  }
  return entries;
}
