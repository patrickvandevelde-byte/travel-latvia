import type { Section, SectionOf } from "@/modules/content/types";
import type { SettingsQueryResult } from "@/modules/content/sanity.types";
import { DestinationCard } from "../cards/DestinationCard";
import { ExperienceCard } from "../cards/ExperienceCard";
import { GuideCard } from "../cards/GuideCard";
import { EnquiryForm } from "../forms/EnquiryForm";
import { CmsLink } from "../site/CmsLink";
import { Container } from "../site/Container";
import { RichText } from "../site/RichText";
import { SanityImage } from "../site/SanityImage";

type Contact = Pick<NonNullable<SettingsQueryResult>, "founderName" | "email" | "phone"> | null | undefined;

function SectionHeading({
  children,
  script,
  center,
}: {
  children?: string | null;
  script?: string | null;
  center?: boolean;
}) {
  if (!children) return null;
  return (
    <div className={`mb-8 flex flex-wrap items-end gap-4 ${center ? "justify-center" : ""}`}>
      <h2 className="display text-4xl sm:text-6xl">{children}</h2>
      {script ? <span className="script mb-2 text-2xl sm:text-3xl">{script}</span> : null}
    </div>
  );
}

function Hero({ block, isFirst }: { block: SectionOf<"heroBlock">; isFirst: boolean }) {
  const Heading = isFirst ? "h1" : "h2";
  if (block.variant === "brand") {
    return (
      <Container className="pt-4">
        <section className="relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[28px] p-6 text-white sm:min-h-[620px] sm:p-12">
          <SanityImage
            image={block.image}
            width={2000}
            height={1250}
            priority={isFirst}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/5 to-black/30" aria-hidden="true" />
          <div className="flex flex-wrap items-end gap-4">
            <Heading className="display text-6xl text-white sm:text-8xl lg:text-[110px]">{block.headline}</Heading>
            {block.script ? <span className="script mb-3 text-2xl text-white sm:text-3xl">{block.script}</span> : null}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <a
              href="#after-hero"
              aria-label="Scroll down"
              className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-white text-white"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 4v16M5 13l7 7 7-7" />
              </svg>
            </a>
            {block.tag ? (
              <span className="border-red bg-cream text-ink rounded-full border-[1.5px] px-5 py-2 text-sm">
                {block.tag}
              </span>
            ) : null}
          </div>
        </section>
        <div id="after-hero" />
      </Container>
    );
  }
  const text = (
    <div className="max-w-2xl">
      {block.eyebrow ? <p className="text-sm font-semibold tracking-widest uppercase">{block.eyebrow}</p> : null}
      <Heading className="display mt-3 text-5xl sm:text-7xl">{block.headline}</Heading>
      {block.script ? <span className="script mt-2 text-2xl">{block.script}</span> : null}
      {block.intro ? <p className="mt-4 text-lg">{block.intro}</p> : null}
      {block.actions?.length ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {block.actions.map((a, i) => (
            <CmsLink key={i} link={a} className={`btn ${i === 0 ? "btn-solid" : "btn-light"}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
  if (block.variant === "image") {
    return (
      <Container className="pt-4">
        <section className="relative isolate overflow-hidden rounded-[28px] p-6 py-24 text-white sm:p-12 sm:py-32 [&_.display]:text-white">
          <SanityImage
            image={block.image}
            width={2000}
            height={1000}
            priority={isFirst}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/60 to-black/10" aria-hidden="true" />
          {text}
        </section>
      </Container>
    );
  }
  if (block.variant === "split") {
    return (
      <Container className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
        {text}
        <SanityImage
          image={block.image}
          width={1000}
          height={800}
          priority={isFirst}
          className="w-full rounded-[18px] object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </Container>
    );
  }
  return <Container className="py-16 sm:py-24">{text}</Container>;
}

function PageHero({
  block,
  contact,
  isFirst,
}: {
  block: SectionOf<"pageHeroBlock">;
  contact: Contact;
  isFirst: boolean;
}) {
  const Heading = isFirst ? "h1" : "h2";
  const title = (
    <>
      <Heading className="display inline text-5xl sm:text-7xl">{block.title}</Heading>
      {block.script ? <span className="script ml-2 text-2xl sm:text-3xl">{block.script}</span> : null}
    </>
  );
  if (block.variant === "card") {
    return (
      <Container className="pt-4">
        <section className="relative isolate grid min-h-[480px] place-items-center overflow-hidden rounded-[28px] px-4 py-6 sm:py-14">
          <SanityImage
            image={block.image}
            width={2000}
            height={1000}
            priority={isFirst}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-x-0 top-6 text-center">{title}</div>
          <div className="bg-cream/95 mt-28 max-w-3xl rounded-[28px] p-6 text-center sm:p-12">
            {contact?.founderName || contact?.email || contact?.phone ? (
              <p className="mb-5 font-semibold">
                {contact.founderName}
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="block font-medium hover:underline">
                    {contact.email}
                  </a>
                ) : null}
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className="block font-medium hover:underline">
                    {contact.phone}
                  </a>
                ) : null}
              </p>
            ) : null}
            <div className="text-left">
              <RichText value={block.cardBody} />
            </div>
            {block.action ? <CmsLink link={block.action} className="btn btn-solid mt-6" /> : null}
          </div>
        </section>
      </Container>
    );
  }
  return <Container className="pt-10 pb-6 text-center sm:pt-16">{title}</Container>;
}

function Feature({ block, isFirst }: { block: SectionOf<"featureBlock">; isFirst: boolean }) {
  const Heading = isFirst ? "h1" : "h2";
  const media = (
    <div
      className={`relative overflow-hidden rounded-[18px] ${block.imageShape === "tall" ? "aspect-[4/5]" : "aspect-[16/10]"}`}
    >
      <SanityImage
        image={block.image}
        width={block.imageShape === "tall" ? 1000 : 1400}
        height={block.imageShape === "tall" ? 1250 : 875}
        priority={isFirst}
        className="h-full w-full object-cover"
        sizes="(min-width: 768px) 50vw, 100vw"
      />
      {block.label ? (
        <span className="bg-cream absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[13px] font-semibold whitespace-nowrap shadow-md">
          {block.label}
        </span>
      ) : null}
    </div>
  );
  return (
    <Container className="py-10 sm:py-14">
      <div className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${block.imagePosition === "left" ? "" : ""}`}>
        <div className={block.imagePosition === "left" ? "md:order-2" : ""}>
          {block.heading ? <Heading className="display mb-5 text-4xl sm:text-6xl">{block.heading}</Heading> : null}
          {block.title ? (
            block.heading ? (
              <h3 className="display text-ink mb-3 text-[26px] leading-tight font-normal">{block.title}</h3>
            ) : (
              <Heading className="display text-ink mb-3 text-[28px]">{block.title}</Heading>
            )
          ) : null}
          <RichText value={block.body} />
          {block.action ? <CmsLink link={block.action} className="btn mt-6" /> : null}
        </div>
        <div className={block.imagePosition === "left" ? "md:order-1" : ""}>{media}</div>
      </div>
    </Container>
  );
}

function Enquiry({ block, contact }: { block: SectionOf<"enquiryFormBlock">; contact: Contact }) {
  return (
    <Container className="scroll-mt-24 py-12 sm:py-20" id="plan">
      <div className="grid items-start gap-8 md:grid-cols-[1fr_1.05fr] md:gap-16">
        <div>
          <h2 className="display mb-6 text-4xl sm:text-6xl">{block.heading}</h2>
          <RichText value={block.intro} />
          {block.script ? <span className="script mt-6 block text-2xl sm:text-3xl">{block.script}</span> : null}
        </div>
        <EnquiryForm
          tripTypes={block.tripTypes ?? []}
          submitLabel={block.submitLabel ?? "Send"}
          note={block.note}
          successMessage={block.successMessage ?? "Thank you. You will hear back within a week."}
          fallbackEmail={contact?.email}
        />
      </div>
    </Container>
  );
}

function GuideList({ block }: { block: SectionOf<"guideListBlock"> }) {
  const limit = block.mode === "latest" ? (block.limit ?? 6) : 12;
  const items = (block.items ?? []).filter(Boolean).slice(0, limit);
  if (!items.length && !block.ctaText) return null;
  if (block.variant === "grid") {
    const cta = block.ctaText ? (
      <li key="cta" className="relative flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
          <SanityImage
            image={block.ctaImage}
            width={640}
            height={800}
            className="h-full w-full object-cover"
            sizes="33vw"
          />
          <CmsLink
            link={block.ctaLink}
            className="display absolute inset-0 grid place-items-center bg-[rgba(60,30,10,0.45)] p-6 text-center text-3xl text-white sm:text-4xl"
          >
            {block.ctaText}
          </CmsLink>
        </div>
      </li>
    ) : null;
    const cards = items.map((g) => (
      <li key={g._id}>
        <GuideCard item={g} variant="overlay" />
      </li>
    ));
    if (cta) cards.splice(Math.min(2, cards.length), 0, cta);
    return (
      <Container className="py-8 sm:py-12">
        <SectionHeading>{block.heading}</SectionHeading>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">{cards}</ul>
      </Container>
    );
  }
  return (
    <section className="py-12 sm:py-20">
      <Container>
        <SectionHeading center>{block.heading}</SectionHeading>
        <ul
          className="-mx-4 flex snap-x gap-7 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6"
          aria-label={block.heading ?? "Guides"}
        >
          {items.map((g) => (
            <li key={g._id} className="w-[min(320px,80vw)] shrink-0 snap-start">
              <GuideCard item={g} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Polaroids({ block }: { block: SectionOf<"polaroidsBlock"> }) {
  const tilts = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];
  return (
    <Container className="py-10">
      <ul className="grid grid-cols-2 items-center gap-8 md:grid-cols-3">
        {(block.images ?? []).map((img, i) => (
          <li
            key={i}
            className={`bg-white p-3 pb-10 shadow-[0_8px_24px_rgba(0,0,0,0.12)] motion-safe:${tilts[i % tilts.length]}`}
          >
            <SanityImage
              image={img}
              width={600}
              height={600}
              className="aspect-square w-full object-cover"
              sizes="33vw"
            />
          </li>
        ))}
      </ul>
    </Container>
  );
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
  forest: "bg-forest text-cream",
  sea: "bg-red text-cream",
  sand: "bg-cream-deep text-ink",
};

function CtaBand({ block }: { block: SectionOf<"ctaBandBlock"> }) {
  return (
    <Container className="my-8">
      <section
        className={`${CTA_COLOURS[block.variant ?? "forest"] ?? CTA_COLOURS.forest} flex flex-col items-start gap-4 rounded-[28px] p-8 sm:p-12 md:flex-row md:items-center md:justify-between`}
      >
        <div>
          <h2 className="display text-3xl text-inherit sm:text-4xl [&]:text-current">{block.headline}</h2>
          {block.text ? <p className="mt-2 max-w-xl opacity-90">{block.text}</p> : null}
        </div>
        <CmsLink link={block.action} className="btn btn-light" />
      </section>
    </Container>
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
              className="aspect-[4/3] w-full rounded-[18px] object-cover"
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
    <Container className="py-12 sm:py-16">
      <SectionHeading script={block.script}>{block.heading}</SectionHeading>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(block.items ?? []).map((t) => (
          <li key={t._key}>
            <figure className="border-red bg-cream h-full rounded-[18px] border-[1.5px] px-6 py-5 text-sm">
              <blockquote>“{t.quote}”</blockquote>
              <figcaption className="text-red mt-3 text-[13px] font-semibold">
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
      <div className="divide-line border-line divide-y border-y">
        {(block.items ?? []).map((item) => (
          <details key={item._key} className="group py-4">
            <summary className="text-red cursor-pointer list-none font-semibold">
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
            <dd className="display text-4xl">{s.value}</dd>
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
        className="group relative block overflow-hidden rounded-[18px]"
      >
        <SanityImage
          image={block.poster}
          width={1200}
          height={675}
          className="aspect-video w-full object-cover"
          sizes="(min-width: 768px) 720px, 100vw"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="btn btn-light">▶ Watch: {block.title}</span>
        </span>
      </a>
    </Container>
  );
}

function Spacer({ block }: { block: SectionOf<"spacerBlock"> }) {
  const size = { small: "py-4", medium: "py-8", large: "py-16" }[block.size ?? "medium"] ?? "py-8";
  return (
    <Container className={size}>
      {block.divider ? <hr className="border-line" /> : <div aria-hidden="true" />}
    </Container>
  );
}

function RichTextSection({ block }: { block: SectionOf<"richTextBlock"> }) {
  if (block.variant === "columns") {
    return (
      <Container className="py-6 sm:py-10">
        <div className="prose-columns">
          <RichText value={block.body} />
        </div>
      </Container>
    );
  }
  return (
    <Container narrow={block.variant !== "wide"} className="py-8">
      <RichText value={block.body} />
    </Container>
  );
}

/** Renders page-builder sections in order (MKT-02). Unknown types are skipped. */
export function Blocks({ sections, contact }: { sections: Section[] | null | undefined; contact?: Contact }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map((block, index) => {
        const isFirst = index === 0;
        switch (block._type) {
          case "heroBlock":
            return <Hero key={block._key} block={block} isFirst={isFirst} />;
          case "pageHeroBlock":
            return <PageHero key={block._key} block={block} contact={contact} isFirst={isFirst} />;
          case "featureBlock":
            return <Feature key={block._key} block={block} isFirst={isFirst} />;
          case "richTextBlock":
            return <RichTextSection key={block._key} block={block} />;
          case "enquiryFormBlock":
            return <Enquiry key={block._key} block={block} contact={contact} />;
          case "guideListBlock":
            return <GuideList key={block._key} block={block} />;
          case "polaroidsBlock":
            return <Polaroids key={block._key} block={block} />;
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
