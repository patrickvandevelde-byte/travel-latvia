import type { AnnouncementQueryResult } from "@/modules/content/sanity.types";
import { CmsLink } from "./CmsLink";

export function AnnouncementBar({ announcement }: { announcement: AnnouncementQueryResult | null }) {
  if (!announcement?.message) return null;
  const colours = announcement.variant === "amber" ? "bg-amber-500 text-ink" : "bg-forest text-linen";
  return (
    <div className={`${colours} px-4 py-2 text-center text-sm`} role="region" aria-label="Announcement">
      {announcement.message}{" "}
      {announcement.link ? (
        <CmsLink link={announcement.link} className="font-semibold underline underline-offset-2" />
      ) : null}
    </div>
  );
}
