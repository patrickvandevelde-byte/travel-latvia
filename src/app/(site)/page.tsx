import type { Metadata } from "next";
import { Blocks } from "@/components/blocks/Blocks";
import { sanityFetch } from "@/modules/content/client";
import { buildMetadata } from "@/modules/content/metadata";
import { homePageQuery, settingsQuery } from "@/modules/content/queries";

export async function generateMetadata(): Promise<Metadata> {
  const home = await sanityFetch(homePageQuery, {}, { tags: ["sanity:homePage"] });
  return buildMetadata({ seo: home?.seo, path: "/" });
}

function ComingSoon() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-xl text-center">
        <p className="text-forest text-sm font-semibold tracking-widest uppercase">Coming soon</p>
        <h1 className="text-forest mt-4 text-4xl font-semibold sm:text-5xl">
          Discover Latvia, from Rīga to the Baltic coast
        </h1>
        <p className="mt-6 text-lg">
          Experiences, guides and tailor-made trips through Gauja National Park, Kuldīga, Jūrmala and beyond.
        </p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [home, settings] = await Promise.all([
    sanityFetch(homePageQuery, {}, { tags: ["sanity:homePage"] }),
    sanityFetch(settingsQuery, {}, { tags: ["sanity:siteSettings"] }),
  ]);
  if (!home?.sections?.length) return <ComingSoon />;
  return <Blocks sections={home.sections} contact={settings} />;
}
