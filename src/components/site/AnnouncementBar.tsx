import type { AnnouncementQueryResult } from "@/modules/content/sanity.types";
import { CmsLink } from "./CmsLink";

export function AnnouncementBar({ announcement }: { announcement: AnnouncementQueryResult | null }) {
  if (!announcement?.message) return null;
  const colours = announcement.variant === "amber" ? "bg-cream-deep text-ink" : "bg-forest text-cream";
  return (
    <div className={`${colours} px-4 py-2 text-center text-sm`} role="region" aria-label="Announcement">
      {announcement.message}{" "}
      {announcement.link ? (
        <CmsLink link={announcement.link} className="font-semibold underline underline-offset-2" />
      ) : null}
    </div>
  );
}
