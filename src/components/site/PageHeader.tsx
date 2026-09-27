import type { SanityImage as SanityImageValue } from "@/modules/content/image";
import { Container } from "./Container";
import { SanityImage } from "./SanityImage";

export function PageHeader({
  title,
  intro,
  image,
  eyebrow,
  script,
}: {
  title: string;
  intro?: string | null;
  image?: SanityImageValue | null;
  eyebrow?: React.ReactNode;
  script?: string | null;
}) {
  if (image?.asset) {
    return (
      <Container className="pt-6">
        <section className="relative isolate overflow-hidden rounded-[28px]">
          <SanityImage
            image={image}
            width={2000}
            height={900}
            priority
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/20 to-black/5"
            aria-hidden="true"
          />
          <div className="p-6 pt-32 text-white sm:p-12 sm:pt-44">
            {eyebrow ? <div className="text-sm font-semibold">{eyebrow}</div> : null}
            <h1 className="display mt-2 max-w-3xl text-5xl text-white sm:text-6xl">{title}</h1>
            {intro ? <p className="mt-4 max-w-2xl text-lg text-white/90">{intro}</p> : null}
          </div>
        </section>
      </Container>
    );
  }
  return (
    <Container className="pt-10 pb-6 text-center sm:pt-16">
      {eyebrow ? <div className="text-forest text-sm font-semibold">{eyebrow}</div> : null}
      <h1 className="display inline text-5xl sm:text-7xl">{title}</h1>
      {script ? <span className="script ml-2 text-2xl sm:text-3xl">{script}</span> : null}
      {intro ? <p className="mx-auto mt-4 max-w-2xl text-lg">{intro}</p> : null}
    </Container>
  );
}
