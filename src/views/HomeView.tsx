import { HeroMasthead } from "@/components/home/HeroMasthead";
import { ServiceIndex } from "@/components/home/ServiceIndex";
import { LookbookRail } from "@/components/home/LookbookRail";
import { VideoWindow } from "@/components/sections/VideoWindow";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { InstaGrid } from "@/components/sections/InstaGrid";
import { VisitSection } from "@/components/sections/VisitSection";
import { PriceList } from "@/components/prices/PriceList";
import { StylistCard } from "@/components/team/StylistCard";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { Photo } from "@/components/ui/Photo";
import { Marquee } from "@/components/ui/Marquee";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { SplitReveal, Reveal, ScrubWords, Parallax } from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, businessSchema, webPageSchema } from "@/lib/schema";
import { railLooks, serviceRows, stylistCards } from "@/lib/view-models";
import { services } from "@/content/services";
import { site } from "@/lib/site";

const copy = {
  sr: {
    eyebrow: "Atelje za kosu i lepotu — Dorćol, Beograd",
    titleLead: "Kosa koja",
    titleAccent: "se kreće.",
    srTitle: "Ondine, atelje za kosu i lepotu u Dorćolu:",
    after: "Boja, rez i sjaj koji žive van ogledala.",
    afterSub: "Od 2017. u Strahinjića Bana",
    prices: "Pogledaj cenovnik",
    scroll: "Skroluj",
    manifestoEyebrow: "Atelje · od 2017.",
    manifesto:
      "Ondine je mali atelje u srcu Dorćola u kome se kosa ne „radi“ — već se sluša. Boja koja raste lepo, rez koji pada sam od sebe i tišina umesto buke fena.",
    stats: [
      { v: 14, l: "godina iskustva" },
      { v: 5, l: "stilista u timu" },
      { v: 312, l: "Google recenzija" },
    ],
    servicesEyebrow: "Usluge",
    servicesTitle: (
      <>
        Sedam stvari koje radimo <em>izuzetno</em> dobro.
      </>
    ),
    railEyebrow: "Lookbook · Jesen / zima 2026",
    railTitle: (
      <>
        Broj <em>07</em>
      </>
    ),
    railAll: "Ceo lookbook",
    video: (
      <>
        Svaka kosa ima <em>svoj</em> pokret.
      </>
    ),
    videoLabel: "Feniranje u pokretu",
    pricesEyebrow: "Cenovnik",
    pricesTitle: (
      <>
        Cene koje <em>Google</em> može da pročita.
      </>
    ),
    pricesText:
      "Bez cenovnika u JPG-u i bez „zavisi“. Izaberite dužinu kose i cene se menjaju odmah. Ono što vidite je ono što plaćate.",
    pricesAll: "Ceo cenovnik",
    teamEyebrow: "Tim",
    teamTitle: (
      <>
        Ruke iza <em>svake</em> frizure.
      </>
    ),
    teamHint: "Prikaži radove",
    teamAll: "Upoznajte tim",
  },
  en: {
    eyebrow: "Hair & beauty atelier — Dorćol, Belgrade",
    titleLead: "Hair that",
    titleAccent: "moves.",
    srTitle: "Ondine, a hair and beauty atelier in Dorćol, Belgrade:",
    after: "Colour, cut and shine that live beyond the mirror.",
    afterSub: "On Strahinjića Bana since 2017",
    prices: "See the price list",
    scroll: "Scroll",
    manifestoEyebrow: "Atelier · since 2017",
    manifesto:
      "Ondine is a small atelier in the heart of Dorćol where hair isn't 'done' — it's listened to. Colour that grows out beautifully, a cut that falls into place on its own, and calm instead of the roar of dryers.",
    stats: [
      { v: 14, l: "years of experience" },
      { v: 5, l: "stylists on the team" },
      { v: 312, l: "Google reviews" },
    ],
    servicesEyebrow: "Services",
    servicesTitle: (
      <>
        Seven things we do <em>exceptionally</em> well.
      </>
    ),
    railEyebrow: "Lookbook · Autumn / winter 2026",
    railTitle: (
      <>
        Issue <em>07</em>
      </>
    ),
    railAll: "Full lookbook",
    video: (
      <>
        Every head of hair has <em>its own</em> movement.
      </>
    ),
    videoLabel: "Blow-dry in motion",
    pricesEyebrow: "Prices",
    pricesTitle: (
      <>
        Prices <em>Google</em> can actually read.
      </>
    ),
    pricesText: "No JPG menus and no 'it depends'. Pick your hair length and the prices change instantly. What you see is what you pay.",
    pricesAll: "Full price list",
    teamEyebrow: "Team",
    teamTitle: (
      <>
        The hands behind <em>every</em> look.
      </>
    ),
    teamHint: "Show work",
    teamAll: "Meet the team",
  },
};

export function homeMetadata(locale: Locale): Metadata {
  const d = getDictionary(locale);
  return buildMetadata({
    locale,
    title: locale === "sr" ? "Ondine — frizerski salon i atelje lepote u Dorćolu, Beograd" : "Ondine — hair & beauty salon in Dorćol, Belgrade",
    absoluteTitle: true,
    description: d.brandLine,
    alternates: pagePaths.home,
    eyebrow: d.descriptor,
    ogImage: "/images/look-golden-waves.jpg",
  });
}

export function HomeView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const c = copy[locale];

  return (
    <PageShell>
      <JsonLd
        data={graph(
          businessSchema(locale, d.brandLine),
          webPageSchema({ locale, url: pageHref(locale, "home"), name: `${site.name} — ${d.descriptor}`, description: d.brandLine }),
        )}
      />
      <HeroMasthead
        locale={locale}
        eyebrow={c.eyebrow}
        titleLead={c.titleLead}
        titleAccent={c.titleAccent}
        srTitle={c.srTitle}
        after={c.after}
        afterSub={c.afterSub}
        bookHref={pageHref(locale, "booking")}
        bookLabel={d.book}
        pricesHref={pageHref(locale, "prices")}
        pricesLabel={c.prices}
        scrollLabel={c.scroll}
      />

      {/* Manifesto */}
      <section className="theme-cream relative overflow-hidden py-28 md:py-44" aria-label={c.manifestoEyebrow}>
        <div className="wrap relative">
          <Parallax amount={18} className="absolute -top-10 right-[4%] hidden aspect-[3/4] w-[15vw] md:block">
            <div className="absolute inset-0">
              <Photo k="interior-arch" alt={locale === "sr" ? "Lučno ogledalo i biljke u salonu" : "Arched mirror and plants in the salon"} sizes="15vw" />
            </div>
          </Parallax>
          <Parallax amount={24} className="absolute -bottom-24 left-[2%] hidden aspect-[4/5] w-[11vw] md:block">
            <div className="absolute inset-0">
              <Photo k="treat-strands" alt={locale === "sr" ? "Pramenovi kose izbliza" : "Strands of hair up close"} sizes="11vw" />
            </div>
          </Parallax>
          <p className="t-eyebrow mb-10 text-wine">{c.manifestoEyebrow}</p>
          <ScrubWords text={c.manifesto} className="max-w-[22ch] font-serif text-[clamp(2rem,4.6vw,4.9rem)] leading-[1.04] tracking-[-0.02em] md:ml-[12%]" />
          <Reveal stagger={0.12} className="mt-20 grid max-w-4xl grid-cols-3 gap-6 md:ml-[12%]">
            {c.stats.map((s) => (
              <div key={s.l} className="border-t border-line pt-5">
                <p className="font-serif text-[clamp(2.6rem,5vw,4.6rem)] leading-none">
                  <CountUp value={s.v} locale={locale} />
                </p>
                <p className="mt-2 text-[0.88rem] text-muted">{s.l}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <div className="theme-ink border-y border-line py-6" aria-hidden>
        <Marquee duration={45}>
          {services.map((s) => (
            <span key={s.id} className="flex items-center font-serif text-[clamp(2.2rem,4vw,3.8rem)] italic">
              <span className="px-8">{s.title[locale]}</span>
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-champagne" fill="currentColor">
                <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z" />
              </svg>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Services index */}
      <section className="theme-cream py-24 md:py-36" aria-labelledby="services-title">
        <div className="wrap">
          <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
            <div>
              <p className="t-eyebrow mb-6 text-wine">{c.servicesEyebrow}</p>
              <SplitReveal id="services-title" className="t-h2 max-w-[14ch]">
                {c.servicesTitle}
              </SplitReveal>
            </div>
            <Button href={pageHref(locale, "services")} variant="outline">
              {d.seeAll}
            </Button>
          </div>
          <ServiceIndex rows={serviceRows(locale)} cursorLabel={d.view} />
        </div>
      </section>

      <LookbookRail
        looks={railLooks(locale).slice(0, 8)}
        heading={c.railTitle}
        eyebrow={c.railEyebrow}
        allHref={pageHref(locale, "lookbook")}
        allLabel={c.railAll}
        cursorLabel={d.view}
      />

      <VideoWindow src="/video/curls.mp4" poster="/video/curls.jpg" label={c.videoLabel}>
        <p className="t-display max-w-[12ch]">{c.video}</p>
      </VideoWindow>

      {/* Prices preview */}
      <section className="theme-cream py-24 md:py-36" aria-labelledby="prices-title">
        <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="t-eyebrow mb-6 text-wine">{c.pricesEyebrow}</p>
            <SplitReveal id="prices-title" className="t-h2">
              {c.pricesTitle}
            </SplitReveal>
            <Reveal>
              <p className="t-lead mt-8 max-w-md text-muted">{c.pricesText}</p>
              <div className="mt-8">
                <Button href={pageHref(locale, "prices")}>{c.pricesAll}</Button>
              </div>
            </Reveal>
            <Parallax className="mt-12 hidden aspect-[4/3] lg:block" amount={10}>
              <div className="absolute inset-0">
                <Photo k="product-pair" alt={locale === "sr" ? "Profesionalni šampon i regenerator" : "Professional shampoo and conditioner"} sizes="30vw" />
              </div>
            </Parallax>
          </div>
          <Reveal>
            <PriceList locale={locale} compact />
          </Reveal>
        </div>
      </section>

      {/* Team */}
      <section className="theme-cream border-t border-line py-24 md:py-36" aria-labelledby="team-title">
        <div className="wrap">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="t-eyebrow mb-6 text-wine">{c.teamEyebrow}</p>
              <SplitReveal id="team-title" className="t-h2 max-w-[14ch]">
                {c.teamTitle}
              </SplitReveal>
            </div>
            <Button href={pageHref(locale, "team")} variant="outline">
              {c.teamAll}
            </Button>
          </div>
          <Reveal stagger={0.1} className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-5">
            {stylistCards(locale).map((s, i) => (
              <StylistCard key={s.id} s={s} index={i} tapHint={c.teamHint} />
            ))}
          </Reveal>
        </div>
      </section>

      <ReviewsSection locale={locale} />
      <InstaGrid locale={locale} />
      <VisitSection locale={locale} />
    </PageShell>
  );
}
