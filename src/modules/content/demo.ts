import { evaluate, parse } from "groq-js";
import type { QueryParams } from "next-sanity";
import { demoDocuments, demoImages, type DemoImageKey } from "../../../sanity/seed/baltique";

/**
 * Demo content mode: when no Sanity project is configured, the same GROQ
 * queries run in-process against the seed documents, so the site renders the
 * real design with the mockup copy. Never used once Sanity is connected.
 */
export async function demoFetch<T = unknown>(query: string, params: QueryParams = {}): Promise<T> {
  const tree = parse(query);
  const value = await evaluate(tree, { dataset: demoDocuments, params, timestamp: new Date() });
  return (await value.get()) as T;
}

/** Local file for a demo image asset reference, or null for a real Sanity asset. */
export function demoImageUrl(ref: string | undefined): string | null {
  if (!ref?.startsWith("image-demo-")) return null;
  const k = ref.slice("image-demo-".length) as DemoImageKey;
  return demoImages[k]?.url ?? null;
}
