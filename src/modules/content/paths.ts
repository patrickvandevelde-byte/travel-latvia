/**
 * Public URL paths per content type. Shared by the site (links, sitemap) and
 * the Studio (preview, automatic redirects) so they can never disagree.
 */
export type RoutableType = "homePage" | "page" | "region" | "place" | "experience" | "guide";

export type PathInput = {
  _type: string;
  slug?: string | null;
  regionSlug?: string | null;
};

export function pathFor({ _type, slug, regionSlug }: PathInput): string | null {
  switch (_type) {
    case "homePage":
      return "/";
    case "page":
      return slug ? `/${slug}` : null;
    case "region":
      return slug ? `/destinations/${slug}` : null;
    case "place":
      return slug && regionSlug ? `/destinations/${regionSlug}/${slug}` : null;
    case "experience":
      return slug ? `/experiences/${slug}` : null;
    case "guide":
      return slug ? `/guides/${slug}` : null;
    default:
      return null;
  }
}
