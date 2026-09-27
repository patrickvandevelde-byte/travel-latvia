import Link from "next/link";
import type { GuidesQueryResult } from "@/modules/content/sanity.types";
import { SanityImage } from "../site/SanityImage";

export type GuideCardData = GuidesQueryResult[number];

/** "overlay": title on the photo (guides grid). "stacked": photo, title, teaser, link (home carousel). */
export function GuideCard({ item, variant = "stacked" }: { item: GuideCardData; variant?: "stacked" | "overlay" }) {
  const href = `/guides/${item.slug}`;
  if (variant === "overlay") {
    return (
      <article className="group relative flex flex-col gap-3.5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[18px]">
          <SanityImage
            image={item.image}
            width={640}
            height={800}
            className="h-full w-full object-cover"
            sizes="(min-width: 900px) 33vw, (min-width: 560px) 50vw, 100vw"
          />
          <h3 className="display absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5 text-[28px] text-white">
            <Link
              href={href}
              className="group-focus-within:underline after:absolute after:inset-0 focus-visible:outline-none"
            >
              {item.title}
            </Link>
          </h3>
        </div>
        {item.excerpt ? <p className="text-[15px]">{item.excerpt}</p> : null}
        <span className="btn self-start" aria-hidden="true">
          Read more
        </span>
      </article>
    );
  }
  return (
    <article className="group relative flex flex-col gap-3.5">
      <SanityImage
        image={item.image}
        width={640}
        height={480}
        className="aspect-[4/3] w-full rounded-[18px] object-cover"
        sizes="320px"
      />
      <h3 className="display text-[26px]">
        <Link
          href={href}
          className="group-focus-within:underline after:absolute after:inset-0 focus-visible:outline-none"
        >
          {item.title}
        </Link>
      </h3>
      {item.excerpt ? <p className="text-[15px]">{item.excerpt}</p> : null}
      <span className="text-red">Read more …</span>
    </article>
  );
}
