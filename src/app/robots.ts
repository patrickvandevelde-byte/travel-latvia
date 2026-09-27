import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/env";

/** Everything is disallowed until launch and on previews (SEO-02). */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api"] },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
