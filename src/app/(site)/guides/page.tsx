import type { Metadata } from "next";
import { Blocks } from "@/components/blocks/Blocks";
import { GuideCard } from "@/components/cards/GuideCard";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { guidesPageQuery, guidesQuery } from "@/modules/content/queries";

const loadPage = () => sanityFetch(guidesPageQuery, {}, { tags: ["sanity:guidesPage", "sanity:guide"] });

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadPage();
  return buildMetadata({ seo: page?.seo, title: page?.title ?? "Guides", path: "/guides" });
}

export default async function GuidesPage() {
  const page = await loadPage();
  if (page?.sections?.length) {
    const startsWithTitle = page.sections[0]._type === "pageHeroBlock";
    return (
      <>
        {startsWithTitle ? null : <PageHeader title={page.title ?? "Guides"} />}
        <Blocks sections={page.sections} />
      </>
    );
  }
  const guides = (await sanityFetch(guidesQuery, {}, { tags: ["sanity:guide"] })) ?? [];
  return (
    <>
      <PageHeader title={page?.title ?? "Guides"} />
      <Container className="pb-12">
        {guides.length ? (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <li key={g._id}>
                <GuideCard item={g} variant="overlay" />
              </li>
            ))}
          </ul>
        ) : (
          <p>Guides are being written. Check back soon.</p>
        )}
      </Container>
    </>
  );
}
