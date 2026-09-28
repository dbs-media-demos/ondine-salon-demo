import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref, serviceHref } from "@/lib/routes";
import { services } from "@/content/services";
import { site } from "@/lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const pages = (["prices", "lookbook", "team", "about", "giftCards", "reviews", "faq", "contact"] as const).map((k) => ({
    label: d.nav[k],
    href: pageHref(locale, k),
  }));

  return (
    <footer className="theme-ink relative overflow-hidden pb-24 md:pb-0">
      <div className="wrap pt-24 md:pt-36">
        <div className="grid items-end gap-10 border-b border-line pb-16 md:grid-cols-[1.4fr_1fr] md:pb-24">
          <div>
            <p className="t-eyebrow mb-6 text-champagne">{d.nav.booking}</p>
            <SplitReveal as="p" className="t-h1 max-w-[12ch]">
              {d.cta.title}
            </SplitReveal>
          </div>
          <div className="flex flex-col items-start gap-6 md:items-end md:text-right">
            <p className="max-w-sm text-muted">{d.cta.text}</p>
            <div className="flex flex-wrap gap-3">
              <Button href={pageHref(locale, "booking")} variant="light">
                {d.book}
              </Button>
              <Button href={site.phoneHref} variant="outline" arrow={false}>
                {site.phone}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="t-eyebrow mb-5 text-champagne">{d.footer.visit}</p>
            <address className="not-italic leading-relaxed text-muted">
              {site.address.street}
              <br />
              {site.address.postal} {locale === "sr" ? site.address.city : site.address.cityEn} · {site.address.district}
            </address>
            <a href={site.phoneHref} className="mt-4 block hover:text-blush">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="block text-muted hover:text-blush">
              {site.email}
            </a>
          </div>
          <div>
            <p className="t-eyebrow mb-5 text-champagne">{d.hours.title}</p>
            <p className="text-muted">
              {d.hours.weekdays}
              <br />
              <span className="text-cream">9:00 – 21:00</span>
            </p>
            <p className="mt-2 text-muted">
              {d.hours.sunMon}: {d.hours.closed}
            </p>
            <OpenBadge locale={locale} className="mt-4 text-[0.9rem]" />
          </div>
          <nav aria-label={d.footer.services}>
            <p className="t-eyebrow mb-5 text-champagne">{d.footer.services}</p>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={serviceHref(locale, s.slug)} className="link-draw text-muted hover:text-cream">
                    {s.title[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label={d.footer.pages}>
            <p className="t-eyebrow mb-5 text-champagne">{d.footer.pages}</p>
            <ul className="space-y-2">
              {pages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-draw text-muted hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={site.instagramUrl} target="_blank" rel="noopener" className="link-draw text-muted hover:text-cream">
                  Instagram ↗
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="wrap" aria-hidden>
        <Logo className="w-full text-cream/95" title="" />
      </div>

      <div className="wrap flex flex-col gap-3 border-t border-line py-8 text-[0.8rem] text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}. {d.footer.demo}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href={pageHref(locale, "privacy")} className="link-draw hover:text-cream">
            {d.nav.privacy}
          </Link>
          <a href="https://dbs-media.com" target="_blank" rel="noopener" className="link-draw hover:text-cream">
            {d.footer.credit} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
