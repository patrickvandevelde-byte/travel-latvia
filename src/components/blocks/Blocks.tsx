import type { Section, SectionOf } from "@/modules/content/types";
import { DestinationCard } from "../cards/DestinationCard";
import { ExperienceCard } from "../cards/ExperienceCard";
import { CmsLink } from "../site/CmsLink";
import { Container } from "../site/Container";
import { RichText } from "../site/RichText";
import { SanityImage } from "../site/SanityImage";

function SectionHeading({ children }: { children?: string | null }) {
  if (!children) return null;
  return <h2 className="text-forest mb-6 text-2xl font-semibold sm:text-3xl">{children}</h2>;
}

const buttonClass =
  "inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2";

function Hero({ block, isFirst }: { block: SectionOf<"heroBlock">; isFirst: boolean }) {
  const Heading = isFirst ? "h1" : "h2";
  const text = (
    <div className="max-w-2xl">
      {block.eyebrow ? <p className="text-sm font-semibold tracking-widest uppercase">{block.eyebrow}</p> : null}
      <Heading className="mt-3 text-4xl leading-tight font-semibold sm:text-5xl">{block.headline}</Heading>
      {block.intro ? <p className="mt-4 text-lg">{block.intro}</p> : null}
      {block.actions?.length ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {block.actions.map((a, i) => (
            <CmsLink
              key={i}
              link={a}
              className={`${buttonClass} ${i === 0 ? "text-ink bg-amber-600" : "text-ink bg-white/90"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );

  if (block.variant === "image") {
    return (
      <section className="relative isolate overflow-hidden">
        <SanityImage
          image={block.image}
          width={2000}
          height={1000}
          priority={isFirst}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="from-ink/75 to-ink/10 absolute inset-0 -z-10 bg-gradient-to-r" aria-hidden="true" />
        <Container className="py-24 text-white sm:py-32">{text}</Container>
      </section>
    );
  }
  if (block.variant === "split") {
    return (
      <Container className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
        <div className="text-forest">{text}</div>
        <SanityImage
          image={block.image}
          width={1000}
          height={800}
          priority={isFirst}
          className="w-full rounded-2xl object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </Container>
    );
  }
  return <Container className="text-forest py-16 sm:py-24">{text}</Container>;
}

function Experiences({ block }: { block: SectionOf<"experienceGridBlock"> }) {
  const items = (block.items ?? []).filter(Boolean).slice(0, block.mode === "region" ? (block.limit ?? 6) : 12);
  if (!items.length) return null;
  const carousel = block.variant === "carousel";
  return (
    <Container className="py-12">
      <SectionHeading>{block.heading}</SectionHeading>
      <ul
        className={
          carousel ? "-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {items.map((item) => (
          <li key={item._id} className={carousel ? "w-72 shrink-0 snap-start" : undefined}>
            <ExperienceCard item={item} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

function Destinations({ block }: { block: SectionOf<"destinationCardsBlock"> }) {
  const items = (block.items ?? []).filter(Boolean);
  if (!items.length) return null;
  return (
    <Container className="py-12">
      <SectionHeading>{block.heading}</SectionHeading>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item._id}>
            <DestinationCard item={item} />
          </li>
        ))}
      </ul>
    </Container>
  );
}

const CTA_COLOURS: Record<string, string> = {
  forest: "bg-forest text-linen",
  sea: "bg-sea text-white",
  sand: "bg-sand text-ink",
};

function CtaBand({ block }: { block: SectionOf<"ctaBandBlock"> }) {
  return (
    <section className={`${CTA_COLOURS[block.variant ?? "forest"] ?? CTA_COLOURS.forest} my-8`}>
      <Container className="flex flex-col items-start gap-4 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{block.headline}</h2>
          {block.text ? <p className="mt-2 max-w-xl opacity-90">{block.text}</p> : null}
        </div>
        <CmsLink link={block.action} className={`${buttonClass} text-ink bg-amber-600`} />
      </Container>
    </section>
  );
}

function Gallery({ block }: { block: SectionOf<"galleryBlock"> }) {
  return (
    <Container className="py-12">
      <SectionHeading>{block.heading}</SectionHeading>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {(block.images ?? []).map((img, i) => (
          <li key={i}>
            <SanityImage
              image={img}
              width={800}
              height={600}
              className="aspect-[4/3] w-full rounded-lg object-cover"
              sizes="(min-width: 768px) 33vw, 50vw"
            />
          </li>
        ))}
      </ul>
    </Container>
  );
}

function Testimonials({ block }: { block: SectionOf<"testimonialsBlock"> }) {
  return (
    <Container className="py-12">
      <SectionHeading>{block.heading}</SectionHeading>
      <ul className="grid gap-6 md:grid-cols-3">
        {(block.items ?? []).map((t) => (
          <li key={t._key}>
            <figure className="ring-ink/5 h-full rounded-xl bg-white p-6 shadow-sm ring-1">
              <blockquote className="text-lg">“{t.quote}”</blockquote>
              <figcaption className="text-ink/70 mt-4 text-sm">
                {t.author}
                {t.origin ? `, ${t.origin}` : ""}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Container>
  );
}

function Faq({ block }: { block: SectionOf<"faqBlock"> }) {
  return (
    <Container narrow className="py-12">
      <SectionHeading>{block.heading}</SectionHeading>
      <div className="divide-ink/10 border-ink/10 divide-y border-y">
        {(block.items ?? []).map((item) => (
          <details key={item._key} className="group py-4">
            <summary className="text-forest cursor-pointer list-none font-semibold marker:hidden">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="pb-2">
              <RichText value={item.answer} />
            </div>
          </details>
        ))}
      </div>
    </Container>
  );
}

function Stats({ block }: { block: SectionOf<"statsBlock"> }) {
  return (
    <Container className="py-12">
      <SectionHeading>{block.heading}</SectionHeading>
      <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {(block.items ?? []).map((s) => (
          <div key={s._key} className="flex flex-col-reverse">
            <dt className="mt-1 text-sm">{s.label}</dt>
            <dd className="text-forest text-3xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}

function Video({ block }: { block: SectionOf<"videoBlock"> }) {
  // Embeds load only after consent (ANLY-01); until the consent banner ships, link out instead.
  return (
    <Container narrow className="py-12">
      <a
        href={block.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-xl"
      >
        <SanityImage
          image={block.poster}
          width={1200}
          height={675}
          className="aspect-video w-full object-cover"
          sizes="(min-width: 768px) 720px, 100vw"
        />
        <span className="bg-ink/30 absolute inset-0 flex items-center justify-center">
          <span className="text-ink rounded-full bg-white/90 px-5 py-2.5 text-sm font-semibold">
            ▶ Watch: {block.title}
          </span>
        </span>
      </a>
    </Container>
  );
}

function Spacer({ block }: { block: SectionOf<"spacerBlock"> }) {
  const size = { small: "py-4", medium: "py-8", large: "py-16" }[block.size ?? "medium"] ?? "py-8";
  return (
    <Container className={size}>
      {block.divider ? <hr className="border-ink/15" /> : <div aria-hidden="true" />}
    </Container>
  );
}

function RichTextSection({ block }: { block: SectionOf<"richTextBlock"> }) {
  return (
    <Container narrow={block.variant !== "wide"} className="py-8">
      <RichText value={block.body} />
    </Container>
  );
}

/** Renders page-builder sections in order (MKT-02). Unknown types are skipped. */
export function Blocks({ sections }: { sections: Section[] | null | undefined }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((block, index) => {
        switch (block._type) {
          case "heroBlock":
            return <Hero key={block._key} block={block} isFirst={index === 0} />;
          case "richTextBlock":
            return <RichTextSection key={block._key} block={block} />;
          case "experienceGridBlock":
            return <Experiences key={block._key} block={block} />;
          case "destinationCardsBlock":
            return <Destinations key={block._key} block={block} />;
          case "ctaBandBlock":
            return <CtaBand key={block._key} block={block} />;
          case "galleryBlock":
            return <Gallery key={block._key} block={block} />;
          case "testimonialsBlock":
            return <Testimonials key={block._key} block={block} />;
          case "faqBlock":
            return <Faq key={block._key} block={block} />;
          case "statsBlock":
            return <Stats key={block._key} block={block} />;
          case "videoBlock":
            return <Video key={block._key} block={block} />;
          case "spacerBlock":
            return <Spacer key={block._key} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
