import type { Metadata } from "next";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { experiencesQuery } from "@/modules/content/queries";

export const metadata: Metadata = buildMetadata({
  title: "Things to do in Latvia",
  description: "Guided tours, day trips and activities across Latvia.",
  path: "/experiences",
});

// Filters (CONT-03) follow once enough experiences exist to filter.
export default async function ExperiencesPage() {
  const items = (await sanityFetch(experiencesQuery, {}, { tags: ["sanity:experience"] })) ?? [];
  return (
    <>
      <PageHeader title="Experiences" intro="Tours, day trips and activities with local guides." />
      <Container className="pb-12">
        {items.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((e) => (
              <li key={e._id}>
                <ExperienceCard item={e} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Experiences are being added. Check back soon.</p>
        )}
      </Container>
    </>
  );
}
