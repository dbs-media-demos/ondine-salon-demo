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
import { PreviewMap } from "@/components/preview/PreviewMap";
import { SnipRule } from "@/components/home/SnipRule";
import { formatRsd, minPrice, priceItemById } from "@/content/prices";
import { shades } from "@/content/shades";
import { team } from "@/content/team";
import { ShadeCard, type ShadeView } from "@/components/home/ShadeCard";
import { bookingHref } from "@/lib/routes";
import { num, openDays, telOf, type Biz } from "@/lib/biz-core";

const copy = {
  sr: {
    eyebrow: "Atelje za kosu i lepotu — Dorćol, Beograd",
    titleLead: "Kosa koja",
    titleAccent: "se kreće.",
    srTitle: "Ondine, atelje za kosu i lepotu u Dorćolu:",
    phoneService: "Frizerski salon",
    phoneTown: "u Dorćolu, Beograd",
    photoAlt: "Duga bakarna kosa u pokretu",
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
    shadesEyebrow: "Karta nijansi",
    shadesTitle: (
      <>
        Nađite <em>svoju</em> nijansu.
      </>
    ),
    shadesText: "Šest nijansi koje najčešće radimo. Izaberite jednu i odmah vidite tehniku, trajanje i cenu.",
    shadesGroup: "Nijanse",
    shadesBook: "Zakaži ovu nijansu",
    shadesStylist: "Stilista",
    shadesAlt: "Šest pramenova kose, od espresso smeđe do peščano plave, okačenih o mesingani štap",
  },
  en: {
    eyebrow: "Hair & beauty atelier — Dorćol, Belgrade",
    titleLead: "Hair that",
    titleAccent: "moves.",
    srTitle: "Ondine, a hair and beauty atelier in Dorćol, Belgrade:",
    phoneService: "Hair & beauty salon",
    phoneTown: "in Dorćol, Belgrade",
    photoAlt: "Long copper hair in motion",
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
    shadesEyebrow: "Shade card",
    shadesTitle: (
      <>
        Find <em>your</em> shade.
      </>
    ),
    shadesText: "Six shades we colour most. Pick one to see the technique, the time and the price.",
    shadesGroup: "Shades",
    shadesBook: "Book this shade",
    shadesStylist: "Stylist",
    shadesAlt: "Six hair swatches, from espresso brown to sand blonde, hanging from a brass rod",
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

/** 210 → "3 h 30 min" */
const duration = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`);

/** The shade card's answers, written on the server (no number formatting in the browser). */
function shadeViews(locale: Locale, biz?: Biz): ShadeView[] {
  const d = getDictionary(locale);
  const c = copy[locale];
  return shades.map((x) => {
    const item = priceItemById(x.item)!;
    const member = team.find((m) => m.id === x.stylist);
    return {
      id: x.id,
      name: x.name[locale],
      description: x.description[locale],
      service: `${item.name[locale]} · ${duration(item.duration)}`,
      // English previews have no dinar prices; previews have no Ondine team
      price: biz && locale === "en" ? undefined : `${d.from} ${formatRsd(minPrice(item.price), locale)}`,
      stylist: biz || !member ? undefined : `${c.shadesStylist}: ${member.name}`,
      bookHref: bookingHref(locale, { service: item.id, stylist: biz ? undefined : x.stylist }),
      root: x.root,
      tip: x.tip,
    };
  });
}

/** A preview's own copy: its name and area, and numbers that are true of it (rating, opening days). */
function previewCopy(locale: Locale, biz: Biz) {
  const c = copy[locale];
  const sr = locale === "sr";
  const days = openDays(biz);
  return {
    ...c,
    eyebrow: sr ? `Atelje za kosu i lepotu — ${biz.area}` : `Hair & beauty atelier — ${biz.area}`,
    srTitle: `${biz.name}:`,
    // No "in" in Serbian: the CRM's area is in the nominative
    phoneTown: sr ? biz.area : `in ${biz.area}`,
    afterSub: sr ? "Zakažite termin online" : "Book online",
    manifestoEyebrow: sr ? "Atelje" : "Atelier",
    manifesto: sr
      ? `${biz.shortName} je atelje u kome se kosa ne „radi“ — već se sluša. Boja koja raste lepo, rez koji pada sam od sebe i tišina umesto buke fena.`
      : `${biz.shortName} is an atelier where hair isn't 'done' — it's listened to. Colour that grows out beautifully, a cut that falls into place on its own, and calm instead of the roar of dryers.`,
    stats: [
      ...(biz.rating ? [{ v: biz.rating.count, l: sr ? "Google recenzija" : "Google reviews" }] : []),
      ...(days ? [{ v: days, l: sr ? "dana nedeljno radimo" : "days a week we're open" }] : []),
      { v: services.length, l: sr ? "usluga pod jednim krovom" : "services under one roof" },
    ],
  };
}

/**
 * The homepage. A personalised preview (/for/<token>, /en/for/<token>) passes a real business:
 * its name is cut into the masthead, its rating, hours and a map of its address replace Ondine's,
 * and the fictional team and Instagram step aside (and the dinar price list on English previews).
 */
export function HomeView({ locale, biz }: { locale: Locale; biz?: Biz }) {
  const d = getDictionary(locale);
  const c = biz ? previewCopy(locale, biz) : copy[locale];
  const rating = biz ? biz.rating : site.rating;
  const reviewsWord = locale === "sr" ? "Google recenzija" : "Google reviews";
  // The first thing a phone sees. English previews have no dinar prices (see below).
  const cuts = services[0];
  const fromPrice = biz && locale === "en" ? undefined : `${cuts.short[locale]} ${d.from} ${formatRsd(cuts.from, locale)}`;

  return (
    <PageShell className="phone:flex phone:flex-col">
      {!biz && (
        <JsonLd
          data={graph(
            businessSchema(locale, d.brandLine),
            webPageSchema({ locale, url: pageHref(locale, "home"), name: `${site.name} — ${d.descriptor}`, description: d.brandLine }),
          )}
        />
      )}
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
        name={biz?.shortName}
        phoneService={c.phoneService}
        phoneTown={c.phoneTown}
        rating={rating ? { value: rating.value, label: `${num({ lang: locale }, rating.value)} · ${rating.count} ${reviewsWord}` } : undefined}
        fromPrice={fromPrice}
        photoAlt={c.photoAlt}
        phone={biz ? biz.phoneDisplay : site.phone}
        phoneHref={biz ? (telOf(biz) ?? "") : site.phoneHref}
        callLabel={d.call}
      />

      {/* Phones: the hero's lock of hair, a still from the desktop scene, lying across the page */}
      <div aria-hidden className="theme-cream hidden overflow-hidden phone:order-1 phone:block">
        {/* A still pre-rendered with alpha at two fixed sizes, so no image optimiser touches it */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hair/lock-750.webp" srcSet="/images/hair/lock-750.webp 750w, /images/hair/lock-1125.webp 1125w" sizes="100vw" width={1125} height={470} alt="" loading="lazy" decoding="async" fetchPriority="low" className="block h-auto w-full" />
      </div>

      {/* Manifesto */}
      <section className="theme-cream relative overflow-hidden py-28 md:py-44 phone:order-9 phone:py-12" aria-label={c.manifestoEyebrow}>
        <div className="wrap relative">
          <Parallax amount={18} className="absolute -top-10 right-[4%] hidden aspect-[3/4] w-[15vw] md:block phone:hidden">
            <div className="absolute inset-0">
              <Photo k="interior-arch" alt={locale === "sr" ? "Lučno ogledalo i biljke u salonu" : "Arched mirror and plants in the salon"} sizes="15vw" />
            </div>
          </Parallax>
          <Parallax amount={24} className="absolute -bottom-24 left-[2%] hidden aspect-[4/5] w-[11vw] md:block phone:hidden">
            <div className="absolute inset-0">
              <Photo k="treat-strands" alt={locale === "sr" ? "Pramenovi kose izbliza" : "Strands of hair up close"} sizes="11vw" />
            </div>
          </Parallax>
          <p className="t-eyebrow mb-10 text-wine phone:mb-3">{c.manifestoEyebrow}</p>
          <ScrubWords text={c.manifesto} className="max-w-[22ch] font-serif text-[clamp(2rem,4.6vw,4.9rem)] leading-[1.04] tracking-[-0.02em] md:ml-[12%] phone:ml-0 phone:max-w-[34rem] phone:text-[1.5rem] phone:leading-[1.2] phone:tracking-[-0.01em]" />
          <p className="t-eyebrow mt-4 hidden text-muted phone:block">{c.afterSub}</p>
          {/* The same two photos desktop floats beside the text */}
          <div className="mt-6 hidden grid-cols-[1.25fr_1fr] gap-3 phone:grid">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Photo k="interior-arch" alt={locale === "sr" ? "Lučno ogledalo i biljke u salonu" : "Arched mirror and plants in the salon"} sizes="(min-width: 768px) 30vw, 55vw" />
            </div>
            <div className="relative aspect-[4/5] self-end overflow-hidden">
              <Photo k="treat-strands" alt={locale === "sr" ? "Pramenovi kose izbliza" : "Strands of hair up close"} sizes="(min-width: 768px) 30vw, 45vw" />
            </div>
          </div>
          <Reveal stagger={0.12} className="mt-20 grid max-w-4xl grid-cols-3 gap-6 md:ml-[12%] phone:ml-0 phone:mt-6 phone:gap-4">
            {c.stats.map((s) => (
              <div key={s.l} className="border-t border-line pt-5 phone:pt-2.5">
                <p className="font-serif text-[clamp(2.6rem,5vw,4.6rem)] leading-none phone:text-[1.9rem]">
                  <CountUp value={s.v} locale={locale} />
                </p>
                <p className="mt-2 text-[0.88rem] text-muted phone:mt-1 phone:text-[0.78rem] phone:leading-snug">{s.l}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <div className="theme-ink border-y border-line py-6 phone:hidden" aria-hidden>
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
      <section className="theme-cream py-24 md:py-36 phone:order-6 phone:py-12" aria-labelledby="services-title">
        <div className="wrap">
          <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end phone:mb-5 phone:flex-col phone:items-start phone:gap-3">
            <div>
              <p className="t-eyebrow mb-6 text-wine phone:mb-2">{c.servicesEyebrow}</p>
              <SplitReveal id="services-title" className="t-h2 max-w-[14ch] phone:max-w-none">
                {c.servicesTitle}
              </SplitReveal>
            </div>
            <Button href={pageHref(locale, "services")} variant="outline" className="phone:min-h-11 phone:px-5">
              {d.seeAll}
            </Button>
          </div>
          <ServiceIndex rows={serviceRows(locale)} cursorLabel={d.view} />
        </div>
      </section>

      {/* Shade card: the 3D tresses (desktop) or their still, and what each shade costs */}
      <section className="theme-blush relative overflow-hidden py-24 md:py-36 phone:order-6 phone:py-12" aria-labelledby="shades-title">
        <ShadeCard
          eyebrow={c.shadesEyebrow}
          title={c.shadesTitle}
          text={c.shadesText}
          groupLabel={c.shadesGroup}
          bookLabel={c.shadesBook}
          stillAlt={c.shadesAlt}
          shades={shadeViews(locale, biz)}
        />
      </section>

      <LookbookRail
        looks={railLooks(locale).slice(0, 8)}
        heading={c.railTitle}
        eyebrow={c.railEyebrow}
        allHref={pageHref(locale, "lookbook")}
        allLabel={c.railAll}
        cursorLabel={d.view}
        className="phone:order-7"
      />

      <VideoWindow src="/video/curls.mp4" poster="/video/curls.jpg" label={c.videoLabel} className="phone:order-8">
        <p className="t-display max-w-[12ch]">{c.video}</p>
      </VideoWindow>

      {!(biz && locale === "en") && (
        <>
        {/* Prices preview */}
        <section className="theme-cream py-24 md:py-36 phone:order-2 phone:pb-9 phone:pt-5" aria-labelledby="prices-title">
          <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr] phone:block">
            <div className="lg:sticky lg:top-28 lg:self-start phone:static">
              <SnipRule />
              <p className="t-eyebrow mb-6 text-wine phone:mb-2">{c.pricesEyebrow}</p>
              <SplitReveal id="prices-title" className="t-h2">
                {c.pricesTitle}
              </SplitReveal>
              <Reveal>
                <p className="t-lead mt-8 max-w-md text-muted phone:mt-2 phone:max-w-[34rem] phone:text-[0.92rem] phone:leading-snug">{c.pricesText}</p>
                <div className="mt-8 phone:hidden">
                  <Button href={pageHref(locale, "prices")}>{c.pricesAll}</Button>
                </div>
              </Reveal>
              <Parallax className="mt-12 hidden aspect-[4/3] lg:block phone:hidden" amount={10}>
                <div className="absolute inset-0">
                  <Photo k="product-pair" alt={locale === "sr" ? "Profesionalni šampon i regenerator" : "Professional shampoo and conditioner"} sizes="30vw" />
                </div>
              </Parallax>
            </div>
            <Reveal className="phone:mt-3">
              <PriceList locale={locale} compact />
              <div className="mt-4 hidden phone:block">
                <Button href={pageHref(locale, "prices")} className="w-full">
                  {c.pricesAll}
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
        </>
      )}

      {!biz && (
        <>
        {/* Team */}
        <section className="theme-cream border-t border-line py-24 md:py-36 phone:order-3 phone:border-t-0 phone:pb-9 phone:pt-0" aria-labelledby="team-title">
          <div className="wrap">
            <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end phone:mb-4 phone:flex-row phone:items-end phone:gap-3">
              <div>
                <p className="t-eyebrow mb-6 text-wine phone:mb-2">{c.teamEyebrow}</p>
                <SplitReveal id="team-title" className="t-h2 max-w-[14ch] phone:max-w-[11ch]">
                  {c.teamTitle}
                </SplitReveal>
              </div>
              <Button href={pageHref(locale, "team")} variant="outline" className="phone:min-h-10 phone:whitespace-nowrap phone:px-4 phone:text-[0.82rem] phone:[&>span:last-child]:hidden">
                {c.teamAll}
              </Button>
            </div>
            <Reveal stagger={0.1} className="no-scrollbar grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-5 phone:-mx-[var(--gutter)] phone:flex phone:snap-x phone:snap-mandatory phone:scroll-pl-[var(--gutter)] phone:items-start phone:gap-x-3 phone:overflow-x-auto phone:px-[var(--gutter)]">
              {stylistCards(locale).map((s, i) => (
                <StylistCard key={s.id} s={s} index={i} tapHint={c.teamHint} />
              ))}
            </Reveal>
          </div>
        </section>
        </>
      )}

      <ReviewsSection locale={locale} biz={biz} className="phone:order-4" />
      {!biz && <InstaGrid locale={locale} className="phone:order-10" />}
      {biz ? <PreviewMap biz={biz} locale={locale} className="phone:order-5" /> : <VisitSection locale={locale} className="phone:order-5" />}
    </PageShell>
  );
}
