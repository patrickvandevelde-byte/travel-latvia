import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { RichText } from "@/components/site/RichText";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { regionQuery } from "@/modules/content/queries";

const load = (slug: string) =>
  sanityFetch(regionQuery, { slug }, { tags: [`sanity:region:${slug}`, "sanity:place", "sanity:experience"] });

export async function generateMetadata({ params }: PageProps<"/destinations/[region]">): Promise<Metadata> {
  const { region } = await params;
  const data = await load(region);
  return data
    ? buildMetadata({
        seo: data.seo,
        title: data.title,
        description: data.summary,
        image: data.heroImage,
        path: `/destinations/${region}`,
      })
    : {};
}

export default async function RegionPage({ params }: PageProps<"/destinations/[region]">) {
  const { region } = await params;
  const data = await load(region);
  if (!data?.title) notFound();
  return (
    <>
      <PageHeader
        title={data.title}
        intro={data.summary}
        image={data.heroImage}
        eyebrow={
          <Link href="/destinations" className="hover:underline">
            Destinations
          </Link>
        }
      />
      {data.intro ? (
        <Container narrow className="py-8">
          <RichText value={data.intro} />
        </Container>
      ) : null}
      {data.places.length ? (
        <Container className="py-8">
          <h2 className="text-forest mb-6 text-2xl font-semibold">Places to visit</h2>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {data.places.map((p) => (
              <li key={p._id}>
                <DestinationCard item={p} />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
      {data.experiences.length ? (
        <Container className="py-8">
          <h2 className="text-forest mb-6 text-2xl font-semibold">Experiences in {data.title}</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.experiences.map((e) => (
              <li key={e._id}>
                <ExperienceCard item={e} />
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </>
  );
}
