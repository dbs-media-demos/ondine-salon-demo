import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { Photo } from "@/components/ui/Photo";
import { Parallax, Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { bookingHref, pageHref, pagePaths, serviceHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/schema";
import { services } from "@/content/services";
import { formatRsd } from "@/content/prices";
import { site } from "@/lib/site";
import clsx from "clsx";

const copy = {
  sr: {
    title: "Usluge",
    metaTitle: "Usluge — šišanje, balayage, keratin, nokti, obrve | Dorćol",
    desc: "Sve usluge ateljea Ondine u Dorćolu: šišanje, farbanje i balayage, feniranje, keratin, nokti, obrve i trepavice i venčane frizure. Cene od 900 RSD.",
    eyebrow: "Sedam usluga · jedan atelje",
    h1: (
      <>
        Sve što kosa <em>traži</em>, na jednom mestu.
      </>
    ),
    lead: "Od preciznog reza do venčane punđe. Svaka usluga ima svoju stranicu sa cenama, trajanjem i stilistima koji je rade.",
    included: "Uključeno",
    duration: "Trajanje",
    more: "Detaljnije",
    cta: (
      <>
        Ne znate šta vam <em>treba</em>?
      </>
    ),
    ctaText: "Zakažite besplatnu konsultaciju od 15 minuta. Pogledamo kosu, porazgovaramo i predložimo plan — bez obaveze.",
  },
  en: {
    title: "Services",
    metaTitle: "Services — cuts, balayage, keratin, nails, brows | Belgrade",
    desc: "Every service at Ondine in Dorćol, Belgrade: haircuts, colour and balayage, blow-dry, keratin, nails, brows and lashes and bridal hair. Prices from 900 RSD.",
    eyebrow: "Seven services · one atelier",
    h1: (
      <>
        Everything your hair <em>asks for</em>, in one place.
      </>
    ),
    lead: "From a precision cut to a bridal updo. Each service has its own page with prices, timing and the stylists who do it.",
    included: "Included",
    duration: "Duration",
    more: "Details",
    cta: (
      <>
        Not sure what you <em>need</em>?
      </>
    ),
    ctaText: "Book a free 15-minute consultation. We look at your hair, talk it through and suggest a plan — no strings attached.",
  },
};

export function servicesMetadata(locale: Locale): Metadata {
  const c = copy[locale];
  return buildMetadata({ locale, title: c.metaTitle, description: c.desc, alternates: pagePaths.services, eyebrow: c.title, ogImage: "/images/colour-painting.jpg" });
}

export function ServicesView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const c = copy[locale];
  const url = pageHref(locale, "services");
  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageSchema({ locale, url, name: c.title, description: c.desc, type: "CollectionPage" }),
          {
            "@type": "ItemList",
            itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.title[locale], url: `${site.url}${serviceHref(locale, s.slug)}` })),
          },
        )}
      />
      <PageHero
        eyebrow={c.eyebrow}
        title={c.h1}
        lead={c.lead}
        crumbs={[
          { name: d.breadcrumbHome, url: pageHref(locale, "home") },
          { name: c.title, url },
        ]}
        image="colour-painting"
        imageAlt={locale === "sr" ? "Nanošenje balayage boje četkicom" : "Painting balayage colour on with a brush"}
      />

      <div className="theme-cream">
        {services.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={s.id} className="border-t border-line py-20 md:py-32" aria-labelledby={`svc-${s.id}`}>
              <div className={clsx("wrap grid items-center gap-10 md:grid-cols-2 md:gap-20")}>
                <Link href={serviceHref(locale, s.slug)} data-cursor={d.view} className={clsx("group block", flip && "md:order-2")} aria-label={s.title[locale]} tabIndex={-1}>
                  <Parallax className="aspect-[4/5]" amount={14}>
                    <div className="absolute inset-0">
                      <Photo k={s.image} alt={s.alt[locale]} sizes="(min-width: 768px) 45vw, 100vw" className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                    </div>
                  </Parallax>
                </Link>
                <div>
                  <p className="t-eyebrow mb-6 text-wine">
                    {s.num} / 0{services.length}
                  </p>
                  <SplitReveal id={`svc-${s.id}`} className="t-h1">
                    {s.title[locale]}
                  </SplitReveal>
                  <Reveal>
                    <p className="mt-6 font-serif text-[1.5rem] italic leading-snug">{s.tagline[locale]}</p>
                    <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-line py-6">
                      <div>
                        <dt className="t-eyebrow text-muted">{d.from}</dt>
                        <dd className="mt-2 font-serif text-2xl">{formatRsd(s.from, locale)}</dd>
                      </div>
                      <div>
                        <dt className="t-eyebrow text-muted">{c.duration}</dt>
                        <dd className="mt-2 font-serif text-2xl">{s.duration[locale]}</dd>
                      </div>
                    </dl>
                    <p className="t-eyebrow mt-8 text-muted">{c.included}</p>
                    <ul className="mt-3 space-y-2">
                      {s.includes[locale].slice(0, 4).map((inc) => (
                        <li key={inc} className="flex gap-3">
                          <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-wine" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10 flex flex-wrap gap-3">
                      <Button href={serviceHref(locale, s.slug)}>
                        {c.more}: {s.short[locale]}
                      </Button>
                      <Button href={bookingHref(locale)} variant="outline">
                        {d.bookShort}
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <CtaBand title={c.cta} text={c.ctaText} href={pageHref(locale, "booking")} label={d.book} phone={site.phone} phoneHref={site.phoneHref} />
    </PageShell>
  );
}
