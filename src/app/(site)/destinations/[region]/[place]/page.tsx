import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { RichText } from "@/components/site/RichText";
import { SanityImage } from "@/components/site/SanityImage";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { placeQuery } from "@/modules/content/queries";

type Params = PageProps<"/destinations/[region]/[place]">;
const load = (region: string, slug: string) =>
  sanityFetch(placeQuery, { region, slug }, { tags: [`sanity:place:${slug}`, "sanity:experience"] });

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { region, place } = await params;
  const data = await load(region, place);
  return data
    ? buildMetadata({
        seo: data.seo,
        title: data.title,
        description: data.summary,
        image: data.heroImage,
        path: `/destinations/${region}/${place}`,
      })
    : {};
}

export default async function PlacePage({ params }: Params) {
  const { region, place } = await params;
  const data = await load(region, place);
  if (!data?.title) notFound();
  const facts = data.quickFacts;
  return (
    <>
      <PageHeader
        title={data.title}
        intro={data.summary}
        image={data.heroImage}
        eyebrow={
          data.region ? (
            <Link href={`/destinations/${data.region.slug}`} className="hover:underline">
              {data.region.title}
            </Link>
          ) : null
        }
      />
      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_18rem]">
        <div>{data.intro ? <RichText value={data.intro} /> : null}</div>
        {facts && (facts.fromRiga || facts.bestSeason || facts.gettingThere) ? (
          <aside className="ring-ink/5 h-fit rounded-xl bg-white p-5 shadow-sm ring-1">
            <h2 className="text-forest font-semibold">Quick facts</h2>
            <dl className="mt-3 space-y-3 text-sm">
              {facts.fromRiga ? (
                <div>
                  <dt className="font-medium">From Rīga</dt>
                  <dd>{facts.fromRiga}</dd>
                </div>
              ) : null}
              {facts.bestSeason ? (
                <div>
                  <dt className="font-medium">Best season</dt>
                  <dd>{facts.bestSeason}</dd>
                </div>
              ) : null}
              {facts.gettingThere ? (
                <div>
                  <dt className="font-medium">Getting there</dt>
                  <dd>{facts.gettingThere}</dd>
                </div>
              ) : null}
            </dl>
          </aside>
        ) : null}
      </Container>
      {data.gallery?.length ? (
        <Container className="py-6">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.gallery.map((img, i) => (
              <li key={i}>
                <SanityImage
                  image={img}
                  width={600}
                  height={450}
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                  sizes="25vw"
                />
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
