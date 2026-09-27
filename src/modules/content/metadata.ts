import type { Metadata } from "next";
import { isIndexable, siteUrl } from "@/lib/env";
import { imageUrl, type SanityImage } from "./image";

type Seo =
  | {
      title?: string | null;
      description?: string | null;
      noIndex?: boolean | null;
      image?: SanityImage | null;
    }
  | null
  | undefined;

/** Page metadata from the CMS SEO tab with fallbacks (SEO-01, MKT-07). */
export function buildMetadata({
  seo,
  title,
  description,
  path,
  image,
}: {
  seo?: Seo;
  title?: string | null;
  description?: string | null;
  path: string;
  image?: SanityImage | null;
}): Metadata {
  const resolvedTitle = seo?.title || title || undefined;
  const resolvedDescription = seo?.description || description || undefined;
  const ogImage = imageUrl(seo?.image ?? image ?? null, 1200, 630);
  const index = isIndexable && !seo?.noIndex;
  return {
    // Omit rather than set undefined, so the layout's default title and description apply.
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
    ...(resolvedDescription ? { description: resolvedDescription } : {}),
    alternates: { canonical: new URL(path, siteUrl).toString() },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: new URL(path, siteUrl).toString(),
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    robots: { index, follow: index },
  };
}
