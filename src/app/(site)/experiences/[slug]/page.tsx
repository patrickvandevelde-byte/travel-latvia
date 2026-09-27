import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExperienceCard } from "@/components/cards/ExperienceCard";
import { Container } from "@/components/site/Container";
import { RichText } from "@/components/site/RichText";
import { SanityImage } from "@/components/site/SanityImage";
import { formatDuration } from "@/lib/format";
import { formatMoney, money } from "@/lib/money";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { experienceQuery } from "@/modules/content/queries";

type Params = PageProps<"/experiences/[slug]">;
const load = (slug: string) => sanityFetch(experienceQuery, { slug }, { tags: [`sanity:experience:${slug}`] });

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const data = await load(slug);
  return data
    ? buildMetadata({
        seo: data.seo,
        title: data.title,
        description: data.summary,
        image: data.images?.[0],
        path: `/experiences/${slug}`,
      })
    : {};
}

function List({ title, items }: { title: string; items?: string[] | null }) {
  if (!items?.length) return null;
  return (
    <section>
      <h2 className="text-forest text-xl font-semibold">{title}</h2>
      <ul className="mt-3 list-disc space-y-1 pl-6">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

export default async function ExperiencePage({ params }: Params) {
  const { slug } = await params;
  const data = await load(slug);
  if (!data?.title) notFound();
  const [first, ...rest] = data.images ?? [];
  const duration = formatDuration(data.durationMinutes);

  return (
    <>
      <Container className="pt-8">
        {data.region ? (
          <Link href={`/destinations/${data.region.slug}`} className="text-sea text-sm font-semibold hover:underline">
            {data.region.title}
          </Link>
        ) : null}
        <h1 className="text-forest mt-2 text-3xl font-semibold sm:text-4xl">{data.title}</h1>
        {data.summary ? <p className="mt-3 max-w-3xl text-lg">{data.summary}</p> : null}
        <div className="mt-6 grid gap-3 md:grid-cols-[2fr_1fr]">
          <SanityImage
            image={first}
            width={1400}
            height={900}
            priority
            className="aspect-[14/9] w-full rounded-xl object-cover"
            sizes="(min-width: 768px) 66vw, 100vw"
          />
          <div className="hidden grid-rows-2 gap-3 md:grid">
            {rest.slice(0, 2).map((img, i) => (
              <SanityImage
                key={i}
                image={img}
                width={700}
                height={450}
                className="h-full w-full rounded-xl object-cover"
                sizes="33vw"
              />
            ))}
          </div>
        </div>
      </Container>

      <Container className="grid gap-10 py-10 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-10">
          {data.highlights?.length ? (
            <section>
              <h2 className="text-forest text-xl font-semibold">Highlights</h2>
              <ul className="mt-3 space-y-2">
                {data.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span aria-hidden="true" className="text-sea">
                      ✓
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          <section>
            <h2 className="text-forest text-xl font-semibold">About this experience</h2>
            <RichText value={data.description} />
          </section>
          {data.itinerary?.length ? (
            <section>
              <h2 className="text-forest text-xl font-semibold">Itinerary</h2>
              <ol className="border-sand mt-4 space-y-4 border-l-2 pl-6">
                {data.itinerary.map((stop) => (
                  <li key={stop._key}>
                    <p className="font-semibold">
                      {stop.time ? <span className="text-sea mr-2">{stop.time}</span> : null}
                      {stop.title}
                    </p>
                    {stop.description ? <p className="mt-1 text-sm">{stop.description}</p> : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
          <div className="grid gap-8 sm:grid-cols-2">
            <List title="Included" items={data.included} />
            <List title="Not included" items={data.notIncluded} />
          </div>
          {data.meetingPoint ? (
            <section>
              <h2 className="text-forest text-xl font-semibold">Meeting point</h2>
              <p className="mt-3 font-medium">{data.meetingPoint.name}</p>
              {data.meetingPoint.instructions ? <p className="mt-1">{data.meetingPoint.instructions}</p> : null}
              {data.meetingPoint.location?.lat && data.meetingPoint.location?.lng ? (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${data.meetingPoint.location.lat},${data.meetingPoint.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sea mt-2 inline-block underline underline-offset-2"
                >
                  Open in Google Maps
                </a>
              ) : null}
            </section>
          ) : null}
          <List title="What to bring" items={data.whatToBring} />
          {data.cancellationPolicy ? (
            <section>
              <h2 className="text-forest text-xl font-semibold">Cancellation policy</h2>
              <p className="mt-3 font-medium">{data.cancellationPolicy.title}</p>
              <RichText value={data.cancellationPolicy.text} />
            </section>
          ) : null}
          {data.faq?.length ? (
            <section>
              <h2 className="text-forest text-xl font-semibold">Questions & answers</h2>
              <div className="divide-ink/10 border-ink/10 mt-3 divide-y border-y">
                {data.faq.map((f) => (
                  <details key={f._key} className="py-3">
                    <summary className="cursor-pointer font-medium">{f.question}</summary>
                    <RichText value={f.answer} />
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* Booking widget (BOOK-05) replaces this panel in Phase 4. */}
        <aside className="ring-ink/5 h-fit rounded-xl bg-white p-6 shadow-sm ring-1 lg:sticky lg:top-6">
          {typeof data.priceFromCents === "number" ? (
            <p>
              from <strong className="text-forest text-2xl">{formatMoney(money(data.priceFromCents))}</strong> per
              person
            </p>
          ) : null}
          <dl className="mt-4 space-y-2 text-sm">
            {duration ? (
              <div className="flex justify-between">
                <dt>Duration</dt>
                <dd className="font-medium">{duration}</dd>
              </div>
            ) : null}
            {data.languages?.length ? (
              <div className="flex justify-between gap-4">
                <dt>Languages</dt>
                <dd className="text-right font-medium">{data.languages.join(", ")}</dd>
              </div>
            ) : null}
            {data.maxGroupSize ? (
              <div className="flex justify-between">
                <dt>Group size</dt>
                <dd className="font-medium">up to {data.maxGroupSize}</dd>
              </div>
            ) : null}
          </dl>
          <p className="bg-sand mt-6 rounded-lg p-3 text-sm">Online booking opens soon.</p>
        </aside>
      </Container>

      {data.related?.length ? (
        <Container className="py-8">
          <h2 className="text-forest mb-6 text-2xl font-semibold">You may also like</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.related.filter(Boolean).map((e) => (
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
