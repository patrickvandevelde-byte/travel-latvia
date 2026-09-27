import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "../../../sanity/env";

export type SanityImage = {
  asset?: { _ref: string } | null;
  hotspot?: { x?: number; y?: number } | null;
  crop?: unknown;
  alt?: string | null;
  credit?: string | null;
} | null;

const builder = createImageUrlBuilder({ projectId: projectId || "placeholder", dataset });

/** URL for a Sanity image at a given width, cropped around the editor's hotspot. */
export function imageUrl(image: SanityImage | undefined, width: number, height?: number): string | null {
  if (!image?.asset?._ref) return null;
  let b = builder
    .image(image as Parameters<typeof builder.image>[0])
    .width(width)
    .auto("format")
    .quality(80);
  if (height) b = b.height(height).fit("crop");
  return b.url();
}
