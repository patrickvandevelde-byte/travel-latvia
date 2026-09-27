import type { Metadata } from "next";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { regionsQuery } from "@/modules/content/queries";

export const metadata: Metadata = buildMetadata({
  title: "Destinations in Latvia",
  description: "Explore Latvia's regions, from Rīga and the Baltic coast to Vidzeme, Kurzeme, Zemgale and Latgale.",
  path: "/destinations",
});

export default async function DestinationsPage() {
  const regions = (await sanityFetch(regionsQuery, {}, { tags: ["sanity:region"] })) ?? [];
  return (
    <>
      <PageHeader
        title="Destinations"
        intro="From Rīga's Art Nouveau streets to pine forests, bogs and 500 km of Baltic coastline."
      />
      <Container className="pb-12">
        {regions.length ? (
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {regions.map((r) => (
              <li key={r._id}>
                <DestinationCard item={r} />
              </li>
            ))}
          </ul>
        ) : (
          <p>Destinations are being added. Check back soon.</p>
        )}
      </Container>
    </>
  );
}
