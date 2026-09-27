/** Shown only while the site runs on seed content (no Sanity project configured). */
export function DemoBanner() {
  return (
    <p className="bg-ink text-cream px-4 py-1.5 text-center text-xs" role="status">
      Preview with sample content from the mockup. Some photos are unlicensed comps. Connect Sanity to edit.
    </p>
  );
}
