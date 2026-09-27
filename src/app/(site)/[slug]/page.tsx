import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/blocks/Blocks";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { pageQuery } from "@/modules/content/queries";

const load = (slug: string) => sanityFetch(pageQuery, { slug }, { tags: [`sanity:page:${slug}`] });

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await load(slug);
  return page ? buildMetadata({ seo: page.seo, title: page.title, path: `/${slug}` }) : {};
}

export default async function LandingPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const page = await load(slug);
  if (!page) notFound();
  const startsWithHero = page.sections?.[0]?._type === "heroBlock";
  return (
    <>
      {startsWithHero ? null : (
        <h1 className="text-forest mx-auto mt-12 w-full max-w-6xl px-4 text-4xl font-semibold sm:px-6">{page.title}</h1>
      )}
      <Blocks sections={page.sections} />
    </>
  );
}
