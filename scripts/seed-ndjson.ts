/**
 * Writes sanity/seed/baltique.ndjson from the demo documents, with image
 * assets attached via `_sanityAsset` so `sanity dataset import` uploads them.
 *
 *   pnpm seed:ndjson
 *   pnpm exec sanity dataset import sanity/seed/baltique.ndjson staging --replace
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { demoAssetId, demoDocuments, demoImages, type DemoImageKey } from "../sanity/seed/baltique";

const fileFor = Object.fromEntries(
  (Object.keys(demoImages) as DemoImageKey[]).map((k) => [demoAssetId(k), demoImages[k].file]),
);

function attachAssets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(attachAssets);
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (o._type === "accessibleImage" && o.asset && typeof o.asset === "object") {
      const ref = (o.asset as { _ref?: string })._ref;
      const file = ref ? fileFor[ref] : undefined;
      if (file) {
        const { asset: _asset, ...rest } = o;
        void _asset;
        return { ...rest, _sanityAsset: `image@file://./images/${file}` };
      }
    }
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, attachAssets(v)]));
  }
  return value;
}

const docs = demoDocuments.filter((d) => d._type !== "sanity.imageAsset").map(attachAssets);
const out = resolve("sanity/seed/baltique.ndjson");
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents to ${out}. Put the image files in sanity/seed/images/ before importing.`);
