import Link from "next/link";
import type { SettingsQueryResult } from "@/modules/content/sanity.types";
import { CmsLink } from "./CmsLink";
import { Container } from "./Container";

export function Header({ settings }: { settings: SettingsQueryResult | null }) {
  const name = settings?.siteName ?? "Discover Latvia";
  const menu = settings?.mainMenu ?? [];
  return (
    <header className="border-ink/10 bg-linen/95 border-b backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-forest text-lg font-semibold">
          {name}
        </Link>
        {menu.length ? (
          <>
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm font-medium">
                {menu.map((link, i) => (
                  <li key={i}>
                    <CmsLink link={link} className="hover:text-sea" />
                  </li>
                ))}
                {settings?.headerCta ? (
                  <li>
                    <CmsLink
                      link={settings.headerCta}
                      className="bg-forest text-linen hover:bg-sea rounded-full px-4 py-2"
                    />
                  </li>
                ) : null}
              </ul>
            </nav>
            <details className="relative md:hidden">
              <summary className="ring-ink/20 cursor-pointer list-none rounded-md px-3 py-2 text-sm font-semibold ring-1">
                Menu
              </summary>
              <nav aria-label="Main" className="absolute right-0 z-40 mt-2 w-64 rounded-xl bg-white p-4 shadow-lg">
                <ul className="flex flex-col gap-3">
                  {menu.map((link, i) => (
                    <li key={i}>
                      <CmsLink link={link} className="block py-1" />
                    </li>
                  ))}
                  {settings?.headerCta ? (
                    <li>
                      <CmsLink
                        link={settings.headerCta}
                        className="bg-forest text-linen block rounded-full px-4 py-2 text-center"
                      />
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
