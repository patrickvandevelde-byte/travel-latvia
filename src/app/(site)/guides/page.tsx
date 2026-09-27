import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { SanityImage } from "@/components/site/SanityImage";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { guidesQuery } from "@/modules/content/queries";

export const metadata: Metadata = buildMetadata({
  title: "Latvia travel guides",
  description: "Practical guides and stories for travelling in Latvia.",
  path: "/guides",
});

export default async function GuidesPage() {
  const guides = (await sanityFetch(guidesQuery, {}, { tags: ["sanity:guide"] })) ?? [];
  return (
    <>
      <PageHeader title="Guides" intro="Seasons, festivals, food and practical tips for travelling in Latvia." />
      <Container className="pb-12">
        {guides.length ? (
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <li key={g._id}>
                <article className="group relative">
                  <SanityImage
                    image={g.image}
                    width={640}
                    height={400}
                    className="aspect-[16/10] w-full rounded-xl object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                  {g.category ? <p className="text-sea mt-3 text-sm">{g.category}</p> : null}
                  <h2 className="text-forest mt-1 text-lg font-semibold">
                    <Link href={`/guides/${g.slug}`} className="group-hover:underline after:absolute after:inset-0">
                      {g.title}
                    </Link>
                  </h2>
                  {g.excerpt ? <p className="mt-1 line-clamp-3 text-sm">{g.excerpt}</p> : null}
                </article>
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
