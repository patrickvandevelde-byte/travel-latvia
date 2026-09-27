import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "../../../../sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main
        style={{
          fontFamily: "system-ui, sans-serif",
          maxWidth: 560,
          margin: "15vh auto",
          padding: "0 16px",
          lineHeight: 1.6,
        }}
      >
        <h1 style={{ fontSize: 24 }}>The content studio isn&apos;t connected yet</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and <code>NEXT_PUBLIC_SANITY_DATASET</code> in the Vercel
          project settings, then redeploy.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
