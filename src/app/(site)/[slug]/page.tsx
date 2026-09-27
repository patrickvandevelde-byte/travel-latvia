import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/blocks/Blocks";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { pageQuery, settingsQuery } from "@/modules/content/queries";

const load = (slug: string) => sanityFetch(pageQuery, { slug }, { tags: [`sanity:page:${slug}`] });

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await load(slug);
  return page ? buildMetadata({ seo: page.seo, title: page.title, path: `/${slug}` }) : {};
}

export default async function LandingPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([
    load(slug),
    sanityFetch(settingsQuery, {}, { tags: ["sanity:siteSettings"] }),
  ]);
  if (!page) notFound();
  // These sections render the page's own h1; anything else gets the title above.
  const first = page.sections?.[0];
  const startsWithHero =
    first?._type === "heroBlock" ||
    first?._type === "pageHeroBlock" ||
    (first?._type === "featureBlock" && !!first.heading);
  return (
    <>
      {startsWithHero ? null : (
        <h1 className="display mx-auto mt-12 w-full max-w-6xl px-4 text-5xl sm:px-6 sm:text-6xl lg:px-8">
          {page.title}
        </h1>
      )}
      <Blocks sections={page.sections} contact={settings} />
    </>
  );
}
