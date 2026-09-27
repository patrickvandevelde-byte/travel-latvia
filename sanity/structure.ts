import { ArrowRightIcon } from "@sanity/icons/ArrowRight";
import { BellIcon } from "@sanity/icons/Bell";
import { BookIcon } from "@sanity/icons/Book";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { HomeIcon } from "@sanity/icons/Home";
import { PinIcon } from "@sanity/icons/Pin";
import { RocketIcon } from "@sanity/icons/Rocket";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string, icon: React.ComponentType) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(type).documentId(type).title(title));

/**
 * Task-based Studio menu (MKT-01, docs/08 §3). Menus are named after what the
 * marketer wants to do, not after data types. Sections for features that
 * aren't built yet (availability, promo codes, emails, bookings) are added in
 * their phases.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Travel Latvia")
    .items([
      S.listItem()
        .title("Website")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Website")
            .items([
              singleton(S, "homePage", "Home page", HomeIcon),
              S.documentTypeListItem("page").title("Landing & other pages").icon(DocumentsIcon),
              S.divider(),
              S.documentTypeListItem("region").title("Regions").icon(EarthGlobeIcon),
              S.documentTypeListItem("place").title("Places").icon(PinIcon),
              S.divider(),
              S.documentTypeListItem("guide").title("Guides (blog)").icon(BookIcon),
              S.documentTypeListItem("category").title("Guide categories").icon(TagIcon),
              S.documentTypeListItem("author").title("Authors").icon(UserIcon),
            ]),
        ),
      S.listItem()
        .title("Experiences")
        .icon(RocketIcon)
        .child(
          S.list()
            .title("Experiences")
            .items([
              S.documentTypeListItem("experience").title("Experiences").icon(RocketIcon),
              S.documentTypeListItem("cancellationPolicy").title("Cancellation policies").icon(DocumentTextIcon),
            ]),
        ),
      S.listItem()
        .title("Campaigns")
        .icon(BellIcon)
        .child(
          S.list()
            .title("Campaigns")
            .items([singleton(S, "announcement", "Announcement bar", BellIcon)]),
        ),
      S.divider(),
      S.documentTypeListItem("redirect").title("SEO & redirects").icon(ArrowRightIcon),
      singleton(S, "siteSettings", "Settings", CogIcon),
    ]);
