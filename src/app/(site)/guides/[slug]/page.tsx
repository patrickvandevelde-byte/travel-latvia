import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/blocks/Blocks";
import { Container } from "@/components/site/Container";
import { PageHeader } from "@/components/site/PageHeader";
import { formatRigaDateTime } from "@/lib/dates";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { guideQuery } from "@/modules/content/queries";
import type { Section } from "@/modules/content/types";

type Params = PageProps<"/guides/[slug]">;
const load = (slug: string) => sanityFetch(guideQuery, { slug }, { tags: [`sanity:guide:${slug}`] });

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  return data
    ? buildMetadata({
        seo: data.seo,
        title: data.title,
        description: data.excerpt,
        image: data.heroImage,
        path: `/guides/${slug}`,
      })
    : {};
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data?.title) notFound();
  return (
    <article>
      <PageHeader
        title={data.title}
        intro={data.excerpt}
        image={data.heroImage}
        eyebrow={
          <Link href="/guides" className="hover:underline">
            {data.category ?? "Guides"}
          </Link>
        }
      />
      <Container narrow className="text-ink/70 pt-6 text-sm">
        {data.author?.name ? <span>By {data.author.name} · </span> : null}
        {data.publishedAt ? (
          <time dateTime={data.publishedAt}>
            {formatRigaDateTime(new Date(data.publishedAt), "en-GB", { dateStyle: "long" })}
          </time>
        ) : null}
      </Container>
      <Blocks sections={data.sections as Section[] | null} />
      {data.related?.length ? (
        <Container className="py-10">
          <h2 className="text-forest mb-4 text-2xl font-semibold">Keep reading</h2>
          <ul className="grid gap-4 sm:grid-cols-3">
            {data.related.filter(Boolean).map((g) => (
              <li key={g._id}>
                <Link href={`/guides/${g.slug}`} className="text-sea font-medium hover:underline">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      ) : null}
    </article>
  );
}
