import Link from "next/link";
import { formatDuration } from "@/lib/format";
import { formatMoney, money } from "@/lib/money";
import type { ExperienceCardData } from "@/modules/content/types";
import { SanityImage } from "../site/SanityImage";

const BADGE_LABELS: Record<string, string> = {
  bestseller: "Bestseller",
  new: "New",
  "free-cancellation": "Free cancellation",
  family: "Family friendly",
};

export function ExperienceCard({ item }: { item: ExperienceCardData }) {
  const duration = formatDuration(item.durationMinutes);
  return (
    <article className="group ring-ink/5 relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1">
      <SanityImage
        image={item.image}
        width={640}
        height={440}
        className="aspect-[16/11] w-full object-cover"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        {item.badges?.length ? (
          <ul className="flex flex-wrap gap-1.5" aria-label="Highlights">
            {item.badges.map((b) => (
              <li key={b} className="bg-cream-deep rounded-full px-2 py-0.5 text-xs font-medium">
                {BADGE_LABELS[b] ?? b}
              </li>
            ))}
          </ul>
        ) : null}
        {item.region ? <p className="text-forest text-sm">{item.region}</p> : null}
        <h3 className="text-forest text-lg leading-snug font-semibold">
          <Link
            href={`/experiences/${item.slug}`}
            className="group-focus-within:underline after:absolute after:inset-0 focus-visible:outline-none"
          >
            {item.title}
          </Link>
        </h3>
        {item.summary ? <p className="text-ink/80 line-clamp-2 text-sm">{item.summary}</p> : null}
        <div className="mt-auto flex items-baseline justify-between pt-2 text-sm">
          <span>{duration}</span>
          {typeof item.priceFromCents === "number" ? (
            <span>
              from <strong className="text-base">{formatMoney(money(item.priceFromCents))}</strong>
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
