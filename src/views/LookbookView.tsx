import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { LookbookScroller, type LookSlide } from "@/components/lookbook/LookbookScroller";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths, serviceHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/schema";
import { looks } from "@/content/looks";
import { img } from "@/content/images";
import { serviceById } from "@/content/services";
import { stylistById } from "@/content/team";
import { site, absoluteUrl } from "@/lib/site";

const copy = {
  sr: {
    title: "Lookbook",
    metaTitle: "Lookbook — jesen/zima 2026, balayage, bob i venčane frizure",
    desc: "Lookbook ateljea Ondine: dvanaest frizura sezone — zlatni balayage, bakarni bob, holivudski talasi i venčane punđe. Kliknite na look i zakažite istu uslugu.",
    issue: "Broj 07 · jesen / zima 2026",
    h1: (
      <>
        Dvanaest <em>načina</em> da se kosa kreće.
      </>
    ),
    lead: "Skrolujte kroz sezonu. Svaki look vodi do usluge kojom je nastao.",
    look: "Look",
    by: "Stilista:",
    open: "Otvori",
    cta: (
      <>
        Želite <em>ovaj</em> look?
      </>
    ),
    ctaText: "Pošaljite nam sliku uz zakazivanje i stilista će se pripremiti pre nego što sednete.",
  },
  en: {
    title: "Lookbook",
    metaTitle: "Lookbook — autumn/winter 2026, balayage, bobs and bridal hair",
    desc: "Ondine's lookbook: twelve looks of the season — golden balayage, copper bobs, Hollywood waves and bridal updos. Tap a look to book the same service.",
    issue: "Issue 07 · autumn / winter 2026",
    h1: (
      <>
        Twelve <em>ways</em> for hair to move.
      </>
    ),
    lead: "Scroll through the season. Every look links to the service behind it.",
    look: "Look",
    by: "Stylist:",
    open: "Open",
    cta: (
      <>
        Want <em>this</em> look?
      </>
    ),
    ctaText: "Attach a photo when you book and your stylist will be ready before you sit down.",
  },
};

export function lookbookMetadata(locale: Locale): Metadata {
  const c = copy[locale];
  return buildMetadata({ locale, title: c.metaTitle, description: c.desc, alternates: pagePaths.lookbook, eyebrow: c.issue, ogImage: "/images/look-copper-bob.jpg" });
}

export function LookbookView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const c = copy[locale];
  const url = pageHref(locale, "lookbook");
  const seen = new Set<string>();
  const slides: LookSlide[] = looks.map((l) => {
    const s = serviceById(l.service);
    const morph = seen.has(s.id) ? undefined : `look-svc-${s.id}`;
    seen.add(s.id);
    return {
      id: l.id,
      title: l.title[locale],
      technique: l.technique[locale],
      stylist: stylistById(l.stylist)!.name.split(" ")[0],
      service: s.title[locale],
      image: img[l.image].src,
      alt: l.alt[locale],
      href: serviceHref(locale, s.slug),
      morph,
    };
  });

  return (
    <PageShell>
      <JsonLd
        data={graph(webPageSchema({ locale, url, name: c.title, description: c.desc, type: "CollectionPage" }), {
          "@type": "ImageGallery",
          name: c.issue,
          image: looks.map((l) => ({ "@type": "ImageObject", contentUrl: absoluteUrl(img[l.image].src), name: l.title[locale], description: l.alt[locale] })),
        })}
      />
      <section data-header="dark" className="theme-ink relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-[calc(var(--header-h)+2.5rem)]">
        <div className="wrap">
          <Breadcrumbs
            className="anim-fade mb-14"
            items={[
              { name: d.breadcrumbHome, url: pageHref(locale, "home") },
              { name: c.title, url },
            ]}
          />
          <p className="t-eyebrow anim-fade mb-8 text-champagne">{c.issue}</p>
          <h1 className="t-display anim-heading max-w-[11ch]" style={{ ["--d" as string]: "0.1s" }}>
            {c.h1}
          </h1>
          <div className="anim-fade mt-10 flex items-end justify-between gap-6" style={{ ["--d" as string]: "0.4s" }}>
            <p className="t-lead max-w-md text-muted">{c.lead}</p>
            <span aria-hidden className="t-eyebrow hidden animate-bounce text-champagne md:block">
              ↓
            </span>
          </div>
        </div>
      </section>
      <LookbookScroller looks={slides} labels={{ look: c.look, by: c.by, open: c.open }} />
      <CtaBand title={c.cta} text={c.ctaText} href={pageHref(locale, "booking")} label={d.book} phone={site.phone} phoneHref={site.phoneHref} image="look-honey-dark" />
    </PageShell>
  );
}
