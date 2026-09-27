import type { SettingsQueryResult } from "@/modules/content/sanity.types";
import { CmsLink } from "./CmsLink";
import { Container } from "./Container";
import { SanityImage } from "./SanityImage";

const icon = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function Footer({ settings }: { settings: SettingsQueryResult | null }) {
  const company = settings?.company;
  const name = settings?.siteName ?? "Baltique";
  const headline = settings?.footerHeadline ?? settings?.tagline;
  const social = settings?.social ?? [];
  const phoneHref = settings?.phone ? `tel:${settings.phone.replace(/[^+\d]/g, "")}` : null;
  return (
    <footer className="bg-cream-deep relative mt-16 pt-16">
      <Container className="relative">
        {settings?.logo?.asset ? (
          <SanityImage
            image={settings.logo}
            width={240}
            height={240}
            className="absolute -top-[92px] right-6 z-10 h-[120px] w-[120px] rotate-[10deg] object-contain"
            sizes="120px"
          />
        ) : null}
        <div className="relative isolate flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[28px] p-6 sm:p-12">
          {settings?.footerImage?.asset ? (
            <SanityImage
              image={settings.footerImage}
              width={1600}
              height={800}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="bg-forest/20 absolute inset-0 -z-10" aria-hidden="true" />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/50 to-black/10" aria-hidden="true" />
          {headline ? <h2 className="display max-w-xl text-4xl sm:text-5xl">{headline}</h2> : null}
          <div className="text-ink mt-8 text-[15px]">
            {settings?.founderName ? <p className="font-semibold">{settings.founderName}</p> : null}
            {settings?.email ? (
              <a href={`mailto:${settings.email}`} className="block hover:underline">
                {settings.email}
              </a>
            ) : null}
            {settings?.phone && phoneHref ? (
              <a href={phoneHref} className="block hover:underline">
                {settings.phone}
              </a>
            ) : null}
            <ul className="mt-6 flex gap-2.5" aria-label="Contact channels">
              {social.map((s) => (
                <li key={s._key}>
                  <a
                    href={s.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.network ?? undefined}
                    className="bg-cream text-ink grid h-10 w-10 place-items-center rounded-full hover:bg-white"
                  >
                    {s.network === "Instagram" ? (
                      <svg {...icon}>
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                      </svg>
                    ) : (
                      <span className="text-xs font-semibold">{s.network?.slice(0, 2)}</span>
                    )}
                  </a>
                </li>
              ))}
              {settings?.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    aria-label="Email"
                    className="bg-cream text-ink grid h-10 w-10 place-items-center rounded-full hover:bg-white"
                  >
                    <svg {...icon}>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  </a>
                </li>
              ) : null}
              {settings?.whatsapp ? (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="bg-cream text-ink grid h-10 w-10 place-items-center rounded-full hover:bg-white"
                  >
                    <svg {...icon}>
                      <path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.2-4.4A9 9 0 1 1 21 12z" />
                    </svg>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        {settings?.footerColumns?.length ? (
          <div className="grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-4">
            {settings.footerColumns.map((col, i) => (
              <nav key={i} aria-label={col.title ?? undefined}>
                <p className="text-red font-semibold">{col.title}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {(col.links ?? []).map((link, j) => (
                    <li key={j}>
                      <CmsLink link={link} className="hover:underline" />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        ) : null}
        <div className="text-ink-soft flex flex-wrap justify-between gap-4 py-6 text-[13px]">
          <p>
            © {new Date().getFullYear()} {company?.legalName ?? name}
            {company?.registrationNumber ? ` · Reg. no. ${company.registrationNumber}` : ""}
            {company?.vatNumber ? ` · VAT ${company.vatNumber}` : ""}
          </p>
          {settings?.legalLinks?.length ? (
            <ul className="flex gap-3">
              {settings.legalLinks.map((link, i) => (
                <li key={i}>
                  <CmsLink link={link} className="hover:underline" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  );
}
