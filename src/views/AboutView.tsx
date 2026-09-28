import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Gallery } from "@/components/sections/Gallery";
import { VisitSection } from "@/components/sections/VisitSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Photo } from "@/components/ui/Photo";
import { Marquee } from "@/components/ui/Marquee";
import { Parallax, Reveal, ScrubWords, SplitReveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const copy = {
  sr: {
    title: "O nama",
    metaTitle: "O nama — atelje Ondine u Dorćolu od 2017.",
    desc: "Ondine je otvoren 2017. u Strahinjića Bana, u Dorćolu. Mali atelje za kosu i lepotu, profesionalni italijanski preparati, bez žurbe i bez skrivenih cena.",
    eyebrow: "Od 2017. u Dorćolu",
    h1: (
      <>
        Atelje, <em>ne</em> fabrika frizura.
      </>
    ),
    lead: "Pet stolica, jedan veliki prozor na Strahinjića Bana i pravilo da nikada ne zakazujemo dve klijentkinje u isto vreme kod iste osobe.",
    story:
      "Mila Radić je posle deset godina u Milanu i Londonu želela salon u koji bi i sama volela da dolazi: tih, svetao, bez žurbe i bez cenovnika koji se „dogovara“ na kasi. Tako je 2017. nastao Ondine — ime po vodenoj vili, jer se lepa kosa, kao i voda, uvek kreće.",
    values: [
      { t: "Vreme", d: "Termini su duži nego što treba. Nikad ne žurimo i nikad ne preklapamo klijente." },
      { t: "Iskrenost", d: "Ako nešto nije dobro za vašu kosu, reći ćemo — i predložiti šta jeste." },
      { t: "Transparentnost", d: "Svaka cena je na sajtu. Bez doplata na kasi, bez „to je dodatno“." },
      { t: "Nega", d: "Bond zaštita u svakom posvetljivanju, veganski preparati, sterilni instrumenti." },
    ],
    timeline: [
      ["2017", "Otvaranje u Strahinjića Bana 44, dve stolice i Mila."],
      ["2019", "Jana i Luka se pridružuju timu. Otvaramo muški kutak."],
      ["2021", "Tea donosi ruski manikir. Pravimo zasebnu sobu za nokte."],
      ["2023", "Sara i obrve & trepavice. Salon se širi na pet stolica."],
      ["2026", "312 Google recenzija i prosečna ocena 4,9."],
    ],
    space: "Prostor",
    values_t: "U šta verujemo",
    story_t: "Priča",
    cta: (
      <>
        Svratite na <em>kafu</em>.
      </>
    ),
    ctaText: "Prvi put ste kod nas? Zakažite besplatnu konsultaciju i upoznajte prostor pre prvog termina.",
  },
  en: {
    title: "About",
    metaTitle: "About — Ondine atelier in Dorćol, Belgrade since 2017",
    desc: "Ondine opened in 2017 on Strahinjića Bana in Dorćol, Belgrade. A small hair and beauty atelier with professional Italian products, no rush and no hidden prices.",
    eyebrow: "In Dorćol since 2017",
    h1: (
      <>
        An atelier, <em>not</em> a hair factory.
      </>
    ),
    lead: "Five chairs, one big window onto Strahinjića Bana, and a rule never to book two clients at the same time with the same person.",
    story:
      "After ten years in Milan and London, Mila Radić wanted a salon she'd love to visit herself: quiet, bright, unhurried, with no price list 'negotiated' at the till. So in 2017 Ondine was born — named after the water spirit, because beautiful hair, like water, is always moving.",
    values: [
      { t: "Time", d: "Appointments run longer than they need to. We never rush and never double-book." },
      { t: "Honesty", d: "If something isn't right for your hair, we'll tell you — and suggest what is." },
      { t: "Transparency", d: "Every price is on the website. No extras at the till, no 'that's additional'." },
      { t: "Care", d: "Bond protection with every lightening, vegan products, sterilised tools." },
    ],
    timeline: [
      ["2017", "Opening at Strahinjića Bana 44 — two chairs and Mila."],
      ["2019", "Jana and Luka join. A men's corner opens."],
      ["2021", "Tea brings the Russian manicure. A dedicated nail room."],
      ["2023", "Sara joins for brows & lashes. The salon grows to five chairs."],
      ["2026", "312 Google reviews and a 4.9 average."],
    ],
    space: "The space",
    values_t: "What we believe in",
    story_t: "The story",
    cta: (
      <>
        Drop by for a <em>coffee</em>.
      </>
    ),
    ctaText: "First time with us? Book a free consultation and see the space before your first appointment.",
  },
};

export function aboutMetadata(locale: Locale): Metadata {
  const c = copy[locale];
  return buildMetadata({ locale, title: c.metaTitle, description: c.desc, alternates: pagePaths.about, eyebrow: c.title, ogImage: "/images/interior-room.jpg" });
}

export function AboutView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const c = copy[locale];
  const url = pageHref(locale, "about");
  const alt = (sr: string, en: string) => (locale === "sr" ? sr : en);
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ locale, url, name: c.title, description: c.desc, type: "AboutPage" }))} />
      <PageHero
        eyebrow={c.eyebrow}
        title={c.h1}
        lead={c.lead}
        crumbs={[
          { name: d.breadcrumbHome, url: pageHref(locale, "home") },
          { name: c.title, url },
        ]}
        image="interior-arch"
        imageAlt={alt("Lučno ogledalo sa biljkama u salonu Ondine", "Arched mirror with plants at Ondine")}
      />

      <section className="theme-cream border-t border-line py-24 md:py-40">
        <div className="wrap grid gap-12 lg:grid-cols-[0.4fr_1.6fr]">
          <p className="t-eyebrow text-wine">{c.story_t}</p>
          <ScrubWords text={c.story} className="font-serif text-[clamp(1.8rem,3.6vw,3.8rem)] leading-[1.1] tracking-[-0.015em]" />
        </div>
      </section>

      <Parallax className="h-[80vh]" amount={20} reveal={false}>
        <div className="absolute inset-0">
          <Photo k="interior-room" alt={alt("Svetao enterijer salona sa pet stolica", "The bright salon interior with five chairs")} sizes="100vw" />
        </div>
      </Parallax>

      <section className="theme-ink py-24 md:py-36" aria-labelledby="values">
        <div className="wrap">
          <SplitReveal id="values" className="t-h2 mb-16">
            {c.values_t}
          </SplitReveal>
          <Reveal stagger={0.1} className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
            {c.values.map((v, i) => (
              <div key={v.t} className="bg-ink p-8 md:p-10">
                <p className="font-serif text-5xl italic text-champagne">0{i + 1}</p>
                <h3 className="t-h3 mt-10">{v.t}</h3>
                <p className="mt-4 text-muted">{v.d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="theme-cream py-24 md:py-36" aria-label="Timeline">
        <div className="wrap">
          <ol className="border-t border-line">
            {c.timeline.map(([y, t]) => (
              <Reveal as="li" key={y} className="grid gap-4 border-b border-line py-8 md:grid-cols-[14rem_1fr] md:items-baseline">
                <span className="font-serif text-[clamp(3rem,6vw,5.5rem)] leading-none">{y}</span>
                <span className="t-lead">{t}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <div className="theme-blush py-8" aria-hidden>
        <Marquee duration={50}>
          {["Dorćol", "Balayage", "Bob", "Keratin", "Gloss", "Nude", "Lash lift", "Chignon"].map((w) => (
            <span key={w} className="px-10 font-serif text-[clamp(3rem,7vw,6rem)] italic">
              {w} <span className="text-wine">·</span>
            </span>
          ))}
        </Marquee>
      </div>

      <section className="theme-cream py-24 md:py-36" aria-labelledby="space">
        <div className="wrap">
          <SplitReveal id="space" className="t-h2 mb-14">
            {c.space}
          </SplitReveal>
          <Gallery
            items={[
              { key: "interior-chairs", alt: alt("Stolice za šišanje i ogledala", "Styling chairs and mirrors") },
              { key: "product-trio", alt: alt("Preparati za negu na polici", "Care products on a shelf") },
              { key: "interior-mirror", alt: alt("Stolica odražena u okruglom ogledalu", "A chair reflected in a round mirror") },
              { key: "treat-wash", alt: alt("Pranje kose uz masažu", "Hair wash with a massage") },
              { key: "nails-wall", alt: alt("Zid sa lakovima za nokte", "The nail polish wall") },
              { key: "product-shampoo", alt: alt("Šampon na polici", "Shampoo on the shelf") },
            ]}
          />
        </div>
      </section>

      <VisitSection locale={locale} />
      <CtaBand title={c.cta} text={c.ctaText} href={pageHref(locale, "booking")} label={d.book} phone={site.phone} phoneHref={site.phoneHref} image="interior-mirror" />
    </PageShell>
  );
}
