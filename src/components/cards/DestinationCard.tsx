import Link from "next/link";
import { pathFor } from "@/modules/content/paths";
import type { DestinationCardData } from "@/modules/content/types";
import { SanityImage } from "../site/SanityImage";

export function DestinationCard({ item }: { item: DestinationCardData }) {
  const href = pathFor(item);
  return (
    <article className="group relative overflow-hidden rounded-xl">
      <SanityImage
        image={item.image}
        width={640}
        height={800}
        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        sizes="(min-width: 1024px) 25vw, 50vw"
      />
      <div className="from-ink/80 via-ink/10 absolute inset-0 bg-gradient-to-t to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="text-xl font-semibold">
          {href ? (
            <Link
              href={href}
              className="after:absolute after:inset-0 focus-visible:underline focus-visible:outline-none"
            >
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>
        {item.summary ? <p className="mt-1 line-clamp-2 text-sm text-white/90">{item.summary}</p> : null}
      </div>
    </article>
  );
}
