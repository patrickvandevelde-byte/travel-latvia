import "server-only";
import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../../../sanity/env";

const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;

type QueryResult<Q extends string> = Q extends keyof SanityQueries ? SanityQueries[Q] : unknown;

/**
 * Fetch published content. Results are cached and tagged so a Sanity publish
 * webhook can refresh them within seconds (CMS-04). Returns null when Sanity
 * isn't configured yet, so the site still builds and renders a placeholder.
 */
export async function sanityFetch<const Q extends string>(
  query: Q,
  params: QueryParams = {},
  { tags = [], revalidate = 3600 }: { tags?: string[]; revalidate?: number } = {},
): Promise<QueryResult<Q> | null> {
  if (!client) return null;
  return client.fetch(query, params, {
    next: { revalidate, tags: ["sanity", ...tags] },
  }) as Promise<QueryResult<Q>>;
}

export { isSanityConfigured };
