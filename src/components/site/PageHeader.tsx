import type { SanityImage as SanityImageValue } from "@/modules/content/image";
import { Container } from "./Container";
import { SanityImage } from "./SanityImage";

export function PageHeader({
  title,
  intro,
  image,
  eyebrow,
}: {
  title: string;
  intro?: string | null;
  image?: SanityImageValue | null;
  eyebrow?: React.ReactNode;
}) {
  if (image?.asset) {
    return (
      <section className="relative isolate overflow-hidden">
        <SanityImage
          image={image}
          width={2000}
          height={900}
          priority
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="from-ink/80 via-ink/30 to-ink/10 absolute inset-0 -z-10 bg-gradient-to-t" aria-hidden="true" />
        <Container className="pt-32 pb-12 text-white sm:pt-44">
          {eyebrow ? <div className="text-sm font-semibold">{eyebrow}</div> : null}
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold sm:text-5xl">{title}</h1>
          {intro ? <p className="mt-4 max-w-2xl text-lg text-white/90">{intro}</p> : null}
        </Container>
      </section>
    );
  }
  return (
    <Container className="pt-12 pb-6">
      {eyebrow ? <div className="text-sea text-sm font-semibold">{eyebrow}</div> : null}
      <h1 className="text-forest mt-2 text-4xl font-semibold sm:text-5xl">{title}</h1>
      {intro ? <p className="mt-4 max-w-2xl text-lg">{intro}</p> : null}
    </Container>
  );
}
