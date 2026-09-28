import Link from "next/link";
import type { Metadata } from "next";
import { ViewTransition } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProcessStack } from "@/components/sections/ProcessStack";
import { Gallery } from "@/components/sections/Gallery";
import { VideoWindow } from "@/components/sections/VideoWindow";
import { PriceList } from "@/components/prices/PriceList";
import { StylistCard } from "@/components/team/StylistCard";
import { Photo } from "@/components/ui/Photo";
import { Button } from "@/components/ui/Button";
import { FaqList } from "@/components/ui/FaqList";
import { Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { bookingHref, pageHref, serviceAlternates, serviceHref } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, faqSchema, serviceSchema, webPageSchema } from "@/lib/schema";
import { stylistCard } from "@/lib/view-models";
import { services, bridalPackages, type Service } from "@/content/services";
import { formatRsd, priceItemById } from "@/content/prices";
import { stylistById } from "@/content/team";
import { site } from "@/lib/site";

const copy = {
  sr: {
    services: "Usluge",
    duration: "Trajanje",
    from: "Cena od",
    included: "Šta je uključeno",
    process: "Kako izgleda termin",
    prices: "Cene",
    pricesNote: "Izaberite dužinu kose — cene se menjaju odmah.",
    gallery: "Iz stolice",
    team: "Ko radi ovu uslugu",
    faq: "Pitanja",
    next: "Sledeća usluga",
    packages: "Paketi za venčanje",
    cta: (
      <>
        Rezervišite <em>svoj</em> termin.
      </>
    ),
    ctaText: "Online za minut ili pozivom. Potvrdu dobijate odmah, a podsetnik dan ranije.",
    hint: "Prikaži radove",
    bookThis: "Zakaži ovu uslugu",
    all: "Ceo cenovnik",
  },
  en: {
    services: "Services",
    duration: "Duration",
    from: "Price from",
    included: "What's included",
    process: "How the appointment goes",
    prices: "Prices",
    pricesNote: "Pick your hair length — prices update instantly.",
    gallery: "From the chair",
    team: "Who does it",
    faq: "Questions",
    next: "Next service",
    packages: "Bridal packages",
    cta: (
      <>
        Book <em>your</em> appointment.
      </>
    ),
    ctaText: "Online in a minute or by phone. Instant confirmation, and a reminder the day before.",
    hint: "Show work",
    bookThis: "Book this service",
    all: "Full price list",
  },
};

const firstPriceId = (s: Service) => {
  const map: Record<string, string> = { cuts: "zensko-sisanje", colour: "balayage", styling: "feniranje", treatments: "keratin", nails: "trajni-lak", brows: "laminacija", bridal: "sveca-frizura" };
  return priceItemById(map[s.id])?.id;
};

export function serviceMetadata(locale: Locale, s: Service): Metadata {
  const title =
    locale === "sr"
      ? `${s.title.sr} u Dorćolu, Beograd — od ${formatRsd(s.from, "sr")}`
      : `${s.title.en} in Dorćol, Belgrade — from ${formatRsd(s.from, "en")}`;
  return buildMetadata({
    locale,
    title,
    description: `${s.tagline[locale]} ${s.intro[locale][0].slice(0, 110)}…`,
    alternates: serviceAlternates(s.slug),
    eyebrow: s.title[locale],
    ogImage: `/images/${s.image}.jpg`,
  });
}

export function ServiceDetailView({ locale, service: s }: { locale: Locale; service: Service }) {
  const d = getDictionary(locale);
  const c = copy[locale];
  const url = serviceHref(locale, s.slug);
  const idx = services.findIndex((x) => x.id === s.id);
  const next = services[(idx + 1) % services.length];
  const book = bookingHref(locale, { service: firstPriceId(s) });

  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageSchema({ locale, url, name: s.title[locale], description: s.tagline[locale] }),
          serviceSchema(locale, s),
          faqSchema(s.faq[locale]),
        )}
      />

      {/* Hero */}
      <section className="theme-cream relative overflow-hidden pt-[calc(var(--header-h)+2.5rem)]">
        <div className="wrap grid gap-10 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:pb-24">
          <div>
            <Breadcrumbs
              className="anim-fade mb-10 md:mb-14"
              items={[
                { name: d.breadcrumbHome, url: pageHref(locale, "home") },
                { name: c.services, url: pageHref(locale, "services") },
                { name: s.title[locale], url },
              ]}
            />
            <p className="t-eyebrow anim-fade mb-6 text-wine">
              {s.num} / 0{services.length}
            </p>
            <h1 className="t-display anim-heading max-w-[10ch]" style={{ ["--d" as string]: "0.1s" }}>
              {s.title[locale]}
            </h1>
            <p className="anim-fade mt-8 max-w-xl font-serif text-[clamp(1.4rem,2vw,1.9rem)] italic leading-snug" style={{ ["--d" as string]: "0.3s" }}>
              {s.tagline[locale]}
            </p>
            <div className="anim-fade mt-10 flex flex-wrap items-center gap-x-10 gap-y-6" style={{ ["--d" as string]: "0.45s" }}>
              <dl className="flex gap-10">
                <div>
                  <dt className="t-eyebrow text-muted">{c.from}</dt>
                  <dd className="mt-2 font-serif text-3xl">{formatRsd(s.from, locale)}</dd>
                </div>
                <div>
                  <dt className="t-eyebrow text-muted">{c.duration}</dt>
                  <dd className="mt-2 max-w-[14rem] font-serif text-[clamp(1.4rem,2.2vw,1.9rem)] leading-tight">{s.duration[locale]}</dd>
                </div>
              </dl>
              <Button href={book}>{c.bookThis}</Button>
            </div>
          </div>
          <ViewTransition name={`look-svc-${s.id}`} share="morph" default="none">
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[3/4]">
              <div className="anim-img absolute inset-0">
                <Photo k={s.image} alt={s.alt[locale]} sizes="(min-width: 1024px) 42vw, 100vw" preload />
              </div>
            </div>
          </ViewTransition>
        </div>
      </section>

      {/* Intro + included */}
      <section className="theme-cream border-t border-line py-24 md:py-36">
        <div className="wrap grid gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <ScrubWords text={s.intro[locale][0]} className="font-serif text-[clamp(1.7rem,3vw,3rem)] leading-[1.15] tracking-[-0.015em]" />
            <Reveal>
              <p className="t-lead mt-10 max-w-2xl text-muted">{s.intro[locale][1]}</p>
            </Reveal>
          </div>
          <Reveal className="self-start bg-surface p-8 lg:sticky lg:top-28">
            <h2 className="t-eyebrow text-wine">{c.included}</h2>
            <ul className="mt-6 space-y-4">
              {s.includes[locale].map((inc, i) => (
                <li key={inc} className="flex gap-4 border-b border-line pb-4 last:border-0">
                  <span className="font-serif italic text-wine">{String(i + 1).padStart(2, "0")}</span>
                  {inc}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={book} className="w-full">
                {d.book}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {s.video && (
        <VideoWindow src={s.video.src} poster={s.video.poster} label={s.title[locale]}>
          <p className="t-display max-w-[11ch]">{s.short[locale]}</p>
        </VideoWindow>
      )}

      {/* Process */}
      <section className="theme-cream py-24 md:py-36">
        <div className="wrap">
          <SplitReveal className="t-h2 mb-14 max-w-[14ch]">{c.process}</SplitReveal>
          <ProcessStack steps={s.steps[locale]} />
        </div>
      </section>

      {/* Prices */}
      <section className="theme-cream border-t border-line py-24 md:py-36" aria-labelledby="svc-prices">
        <div className="wrap grid gap-12 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <h2 id="svc-prices" className="t-h2">
              {s.priceCategories.length ? c.prices : c.packages}
            </h2>
            <p className="mt-6 max-w-xs text-muted">{s.priceCategories.length ? c.pricesNote : s.duration[locale]}</p>
            <Link href={pageHref(locale, "prices")} className="link-draw mt-6 inline-block py-1 font-medium">
              {c.all} →
            </Link>
          </div>
          {s.priceCategories.length ? (
            <PriceList locale={locale} simple only={s.priceCategories} />
          ) : (
            <Reveal stagger={0.1} className="grid gap-4 md:grid-cols-3">
              {bridalPackages.map((p, i) => (
                <div key={p.id} className={i === 2 ? "theme-wine flex flex-col p-8" : "flex flex-col bg-surface p-8"}>
                  <h3 className="font-serif text-3xl">{p.name[locale]}</h3>
                  <p className="mt-4 font-serif text-4xl">{formatRsd(p.price, locale)}</p>
                  <ul className="mt-6 flex-1 space-y-3 text-[0.95rem]">
                    {p.items[locale].map((it) => (
                      <li key={it} className="flex gap-3">
                        <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-current opacity-60" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={bookingHref(locale, { service: "sveca-frizura" })}
                    className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-current px-5 text-[0.9rem] font-medium hover:bg-fg hover:text-bg"
                  >
                    {d.bookShort}
                  </Link>
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>

      {/* Gallery */}
      <section className="theme-cream py-24 md:py-36" aria-labelledby="svc-gallery">
        <div className="wrap">
          <SplitReveal id="svc-gallery" className="t-h2 mb-14">
            {c.gallery}
          </SplitReveal>
          <Gallery items={s.gallery.map((g) => ({ key: g.key, alt: g.alt[locale] }))} />
        </div>
      </section>

      {/* Stylists */}
      <section className="theme-blush py-24 md:py-36" aria-labelledby="svc-team">
        <div className="wrap">
          <SplitReveal id="svc-team" className="t-h2 mb-14">
            {c.team}
          </SplitReveal>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {s.stylists.map((id, i) => {
              const st = stylistById(id)!;
              return <StylistCard key={id} s={stylistCard(locale, st)} index={i} tapHint={c.hint} />;
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="theme-cream py-24 md:py-36" aria-labelledby="svc-faq">
        <div className="wrap grid gap-12 lg:grid-cols-[0.6fr_1.4fr]">
          <SplitReveal id="svc-faq" className="t-h2">
            {c.faq}
          </SplitReveal>
          <FaqList items={s.faq[locale]} />
        </div>
      </section>

      {/* Next service */}
      <Link href={serviceHref(locale, next.slug)} data-cursor={d.view} className="theme-ink group relative block overflow-hidden">
        <div className="absolute inset-0 opacity-40 transition-[opacity,transform] duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-60">
          <Photo k={next.image} alt="" sizes="100vw" />
        </div>
        <div className="wrap relative flex min-h-[60vh] flex-col justify-end py-16">
          <p className="t-eyebrow text-champagne">{c.next} →</p>
          <p className="t-display mt-6 transition-[font-style] group-hover:italic">{next.title[locale]}</p>
        </div>
      </Link>

      <CtaBand title={c.cta} text={c.ctaText} href={book} label={d.book} phone={site.phone} phoneHref={site.phoneHref} image={s.gallery[1]?.key ?? "interior-mirror"} />
    </PageShell>
  );
}
