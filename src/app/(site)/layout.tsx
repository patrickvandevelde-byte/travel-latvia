import type { Metadata } from "next";
import { Caveat, DM_Sans, Instrument_Serif } from "next/font/google";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { DemoBanner } from "@/components/site/DemoBanner";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { isIndexable, siteUrl } from "@/lib/env";
import { isDemoContent, sanityFetch } from "@/modules/content/client";
import { imageUrl } from "@/modules/content/image";
import { announcementQuery, settingsQuery } from "@/modules/content/queries";
import "./globals.css";

// Brand type from the mockup: condensed serif display, handwritten accents, DM Sans body.
const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});
const script = Caveat({ variable: "--font-caveat", subsets: ["latin", "latin-ext"], weight: ["500", "600"] });
const body = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch(settingsQuery, {}, { tags: ["sanity:siteSettings"] });
  const name = settings?.siteName ?? "Baltique";
  const logo = imageUrl(settings?.logo, 192, 192);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings?.defaultSeo?.title ?? name, template: `%s · ${name}` },
    description: settings?.defaultSeo?.description ?? settings?.tagline ?? undefined,
    icons: logo ? { icon: logo } : undefined,
    // Kept out of search engines until launch (SEO-02).
    robots: { index: isIndexable, follow: isIndexable },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [settings, announcement] = await Promise.all([
    sanityFetch(settingsQuery, {}, { tags: ["sanity:siteSettings"] }),
    // Short cache so scheduled start/end times take effect within minutes.
    sanityFetch(announcementQuery, {}, { tags: ["sanity:announcement"], revalidate: 300 }),
  ]);
  return (
    <html lang="en" className={`${display.variable} ${script.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {isDemoContent ? <DemoBanner /> : null}
        <AnnouncementBar announcement={announcement} />
        <Header settings={settings} />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
