import type { SettingsQueryResult } from "@/modules/content/sanity.types";
import { CmsLink } from "./CmsLink";
import { Container } from "./Container";

export function Footer({ settings }: { settings: SettingsQueryResult | null }) {
  const company = settings?.company;
  return (
    <footer className="bg-forest text-linen mt-16">
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-semibold">{settings?.siteName ?? "Discover Latvia"}</p>
          {settings?.tagline ? <p className="text-linen/80 mt-2 text-sm">{settings.tagline}</p> : null}
          <ul className="mt-4 space-y-1 text-sm">
            {settings?.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings?.phone ? (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:underline">
                  {settings.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        {(settings?.footerColumns ?? []).map((col, i) => (
          <nav key={i} aria-label={col.title ?? undefined}>
            <p className="font-semibold">{col.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {(col.links ?? []).map((link, j) => (
                <li key={j}>
                  <CmsLink link={link} className="text-linen/85 hover:text-white hover:underline" />
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="border-linen/15 text-linen/75 flex flex-col gap-2 border-t py-6 text-xs md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {company?.legalName ?? settings?.siteName ?? ""}
          {company?.registrationNumber ? ` · Reg. no. ${company.registrationNumber}` : ""}
          {company?.vatNumber ? ` · VAT ${company.vatNumber}` : ""}
        </p>
        {settings?.social?.length ? (
          <ul className="flex gap-4">
            {settings.social.map((s) => (
              <li key={s._key}>
                <a href={s.url ?? "#"} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {s.network}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </footer>
  );
}
