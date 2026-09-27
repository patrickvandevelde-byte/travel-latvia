import Link from "next/link";
import type { SettingsQueryResult } from "@/modules/content/sanity.types";
import { CmsLink } from "./CmsLink";
import { Container } from "./Container";
import { SanityImage } from "./SanityImage";

const navLink = "inline-block py-2 text-[13px] font-medium uppercase tracking-[0.12em] text-red hover:text-red-dark";

export function Header({ settings }: { settings: SettingsQueryResult | null }) {
  const name = settings?.siteName ?? "Baltique";
  const menu = settings?.mainMenu ?? [];
  return (
    <header className="bg-cream/90 sticky top-0 z-40 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Container className="flex min-h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${name} home`} className="shrink-0">
          {settings?.logo?.asset ? (
            <SanityImage
              image={settings.logo}
              width={144}
              height={144}
              priority
              className="h-[72px] w-[72px] -rotate-6 object-contain"
              sizes="72px"
            />
          ) : (
            <span className="display text-2xl">{name}</span>
          )}
        </Link>
        {menu.length ? (
          <>
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-6 lg:gap-10">
                {menu.map((link, i) => (
                  <li key={i}>
                    <CmsLink link={link} className={navLink} />
                  </li>
                ))}
                {settings?.headerCta ? (
                  <li>
                    <CmsLink link={settings.headerCta} className="btn btn-solid" />
                  </li>
                ) : null}
              </ul>
            </nav>
            <details className="relative md:hidden">
              <summary className="btn cursor-pointer list-none px-4 text-[13px] tracking-[0.12em] uppercase">
                Menu
              </summary>
              <nav
                aria-label="Main"
                className="border-line bg-cream absolute right-0 z-40 mt-2 w-64 rounded-[18px] border p-4 shadow-lg"
              >
                <ul className="flex flex-col gap-1">
                  {menu.map((link, i) => (
                    <li key={i}>
                      <CmsLink link={link} className={`${navLink} block py-3`} />
                    </li>
                  ))}
                  {settings?.headerCta ? (
                    <li className="pt-2">
                      <CmsLink link={settings.headerCta} className="btn btn-solid w-full" />
                    </li>
                  ) : null}
                </ul>
              </nav>
            </details>
          </>
        ) : null}
      </Container>
    </header>
  );
}
