import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { SanityImage as SanityImageValue } from "@/modules/content/image";
import { SanityImage } from "./SanityImage";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="display mt-10 text-3xl">{children}</h2>,
    h3: ({ children }) => <h3 className="display text-ink mt-8 text-2xl">{children}</h3>,
    normal: ({ children }) => <p className="mt-4 leading-relaxed">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-red mt-6 border-l-4 pl-4 text-lg italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => (
      <a href={value?.href} className="text-red hover:text-red-dark underline underline-offset-2">
        {children}
      </a>
    ),
  },
  types: {
    accessibleImage: ({ value }) => (
      <figure className="mt-8">
        <SanityImage
          image={value as SanityImageValue}
          width={1200}
          height={750}
          className="w-full rounded-xl"
          sizes="(min-width: 768px) 720px, 100vw"
        />
        {(value as { credit?: string }).credit ? (
          <figcaption className="text-ink/70 mt-2 text-sm">{(value as { credit?: string }).credit}</figcaption>
        ) : null}
      </figure>
    ),
  },
};

export function RichText({ value }: { value: unknown }) {
  if (!Array.isArray(value)) return null;
  return <PortableText value={value} components={components} />;
}
