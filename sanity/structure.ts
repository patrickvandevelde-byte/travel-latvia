import { ArchiveIcon } from "@sanity/icons/Archive";
import { ArrowRightIcon } from "@sanity/icons/ArrowRight";
import { BellIcon } from "@sanity/icons/Bell";
import { BookIcon } from "@sanity/icons/Book";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { ClipboardIcon } from "@sanity/icons/Clipboard";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { HomeIcon } from "@sanity/icons/Home";
import { LaunchIcon } from "@sanity/icons/Launch";
import { PinIcon } from "@sanity/icons/Pin";
import { RocketIcon } from "@sanity/icons/Rocket";
import { TagIcon } from "@sanity/icons/Tag";
import { UserIcon } from "@sanity/icons/User";
import type { DefaultDocumentNodeResolver, StructureResolver } from "sanity/structure";
import { rigaDateKey } from "../src/lib/dates";
import { addDays, DEPARTING_SOON_DAYS } from "../src/modules/operations/manifest";
import { ManifestView } from "./tools/operations/ManifestView";

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string, icon: React.ComponentType) =>
  S.listItem().title(title).icon(icon).child(S.document().schemaType(type).documentId(type).title(title));

/**
 * Operations menu (OPS-03, docs/11 §6.1): journeys by what the operator asks,
 * "what departs next, and is it ready?". "Today" is the Riga calendar day,
 * computed once when the menu loads (reload the Studio to refresh the lists).
 */
function operations(S: Parameters<StructureResolver>[0]) {
  const today = rigaDateKey(new Date());
  const soon = addDays(today, DEPARTING_SOON_DAYS);
  const soonestFirst = [{ field: "startDate", direction: "asc" as const }];
  return S.listItem()
    .title("Operations")
    .icon(ClipboardIcon)
    .child(
      S.list()
        .title("Operations")
        .items([
          S.listItem()
            .title("Departing soon")
            .icon(LaunchIcon)
            .child(
              S.documentTypeList("trip")
                .title(`Departing in the next ${DEPARTING_SOON_DAYS} days`)
                .filter('_type == "trip" && startDate >= $today && startDate <= $soon && status != "cancelled"')
                .params({ today, soon })
                .defaultOrdering(soonestFirst),
            ),
          S.listItem()
            .title("Upcoming journeys")
            .icon(CalendarIcon)
            .child(
              S.documentTypeList("trip")
                .title("Upcoming journeys")
                .filter('_type == "trip" && startDate >= $today')
                .params({ today })
                .defaultOrdering(soonestFirst),
            ),
          S.listItem()
            .title("Past journeys")
            .icon(ArchiveIcon)
            .child(
              S.documentTypeList("trip")
                .title("Past journeys")
                .filter('_type == "trip" && endDate < $today')
                .params({ today })
                .defaultOrdering([{ field: "startDate", direction: "desc" }]),
            ),
          S.divider(),
          S.documentTypeListItem("trip").title("All journeys").icon(ClipboardIcon),
        ]),
    );
}

/** Journeys get a Manifest tab next to the edit form (docs/11 §7). */
export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (schemaType === "trip") {
    return S.document().views([
      S.view.form(),
      S.view.component(ManifestView).title("Manifest").icon(ClipboardIcon).id("manifest"),
    ]);
  }
  return S.document().views([S.view.form()]);
};

/**
 * Task-based Studio menu (MKT-01, docs/08 §3). Menus are named after what the
 * marketer wants to do, not after data types. Experiences, regions and places
 * stay available for later; the Baltique site (docs/10) is pages + guides +
 * enquiries, and Operations holds the journeys.
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
              S.documentTypeListItem("page").title("Pages (Services, About, Contact…)").icon(DocumentsIcon),
              S.divider(),
              singleton(S, "guidesPage", "Guides page", BookIcon),
              S.documentTypeListItem("guide").title("Guides & itineraries").icon(BookIcon),
              S.documentTypeListItem("category").title("Guide categories").icon(TagIcon),
              S.documentTypeListItem("author").title("Authors").icon(UserIcon),
              S.divider(),
              S.documentTypeListItem("region").title("Regions").icon(EarthGlobeIcon),
              S.documentTypeListItem("place").title("Places").icon(PinIcon),
            ]),
        ),
      S.listItem()
        .title("Enquiries")
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title("Enquiries")
            .items([
              S.listItem()
                .title("New")
                .icon(EnvelopeIcon)
                .child(
                  S.documentTypeList("enquiry")
                    .title("New enquiries")
                    .filter('_type == "enquiry" && status == "new"')
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("In progress")
                .child(
                  S.documentTypeList("enquiry")
                    .title("In progress")
                    .filter('_type == "enquiry" && status in ["replied", "quoted"]')
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("All")
                .child(
                  S.documentTypeList("enquiry")
                    .title("All enquiries")
                    .defaultOrdering([{ field: "receivedAt", direction: "desc" }]),
                ),
            ]),
        ),
      operations(S),
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
