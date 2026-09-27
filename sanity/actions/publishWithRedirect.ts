import { useClient, type DocumentActionComponent } from "sanity";
import { pathFor } from "../../src/modules/content/paths";
import { apiVersion } from "../env";

type SlugDoc = { _type: string; slug?: { current?: string }; region?: { _ref?: string } };

async function pathOf(doc: SlugDoc | null | undefined, fetchRegionSlug: (id: string) => Promise<string | null>) {
  if (!doc?.slug?.current) return null;
  const regionSlug = doc._type === "place" && doc.region?._ref ? await fetchRegionSlug(doc.region._ref) : null;
  return pathFor({ _type: doc._type, slug: doc.slug.current, regionSlug });
}

/**
 * Wraps the Publish action: when a published page's web address changes,
 * a permanent redirect from the old address is created automatically, so old
 * links and Google rankings keep working (MKT-06).
 */
export function withAutomaticRedirect(original: DocumentActionComponent): DocumentActionComponent {
  const Action: DocumentActionComponent = (props) => {
    const client = useClient({ apiVersion });
    const result = original(props);
    if (!result) return result;

    return {
      ...result,
      onHandle: async () => {
        const fetchRegionSlug = (id: string) =>
          client.fetch<string | null>(`*[_id == $id][0].slug.current`, { id: id.replace(/^drafts\./, "") });
        const oldPath = await pathOf(props.published as SlugDoc | null, fetchRegionSlug);
        const newPath = await pathOf(props.draft as SlugDoc | null, fetchRegionSlug);
        if (oldPath && newPath && oldPath !== newPath) {
          const id = `redirect-auto-${oldPath.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
          await client.createOrReplace({ _id: id, _type: "redirect", from: oldPath, to: newPath, permanent: true });
        }
        result.onHandle?.();
      },
    };
  };
  return Action;
}
