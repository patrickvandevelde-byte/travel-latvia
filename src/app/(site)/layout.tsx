import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { isIndexable, siteUrl } from "@/lib/env";
import { sanityFetch } from "@/modules/content/client";
import { announcementQuery, settingsQuery } from "@/modules/content/queries";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch(settingsQuery, {}, { tags: ["sanity:siteSettings"] });
  const name = settings?.siteName ?? "Discover Latvia";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings?.defaultSeo?.title ?? name, template: `%s · ${name}` },
    description: settings?.defaultSeo?.description ?? "Experiences, guides and tailor-made trips across Latvia.",
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
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
