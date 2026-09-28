import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { PriceList } from "@/components/prices/PriceList";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { SplitReveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, faqSchema, webPageSchema, businessSchema } from "@/lib/schema";
import { faqGroups } from "@/content/faq";
import { site } from "@/lib/site";

const copy = {
  sr: {
    title: "Cenovnik",
    metaTitle: "Cenovnik frizerskog salona u Dorćolu — šišanje, balayage, keratin, nokti",
    desc: "Kompletan cenovnik ateljea Ondine u RSD: žensko šišanje od 3.200, balayage od 10.500, keratin od 9.000, trajni lak 2.800. Cene po dužini kose, bez skrivenih doplata.",
    eyebrow: "Cenovnik 2026 · sve cene u RSD",
    h1: (
      <>
        Cene, <em>bez</em> iznenađenja.
      </>
    ),
    lead: "Ceo cenovnik, pretraživ i po dužini kose. Ono što vidite je ono što plaćate — PDV i završno feniranje su uključeni tamo gde piše.",
    faq: "O cenama",
    cta: (
      <>
        Našli ste <em>šta</em> tražite?
      </>
    ),
    ctaText: "Kliknite „Zakaži“ pored bilo koje usluge ili nas pozovite — pomoći ćemo da izaberete.",
  },
  en: {
    title: "Prices",
    metaTitle: "Hair salon prices in Dorćol, Belgrade — cuts, balayage, keratin, nails",
    desc: "Ondine's full price list in RSD: women's cut from 3,200, balayage from 10,500, keratin from 9,000, gel polish 2,800. Prices by hair length, no hidden extras.",
    eyebrow: "Price list 2026 · all prices in RSD",
    h1: (
      <>
        Prices, <em>without</em> surprises.
      </>
    ),
    lead: "The full price list, searchable and by hair length. What you see is what you pay — VAT and the finishing blow-dry are included where stated.",
    faq: "About prices",
    cta: (
      <>
        Found <em>what</em> you need?
      </>
    ),
    ctaText: "Tap “Book” next to any service or give us a call — we'll help you choose.",
  },
};

export function pricesMetadata(locale: Locale): Metadata {
  const c = copy[locale];
  return buildMetadata({ locale, title: c.metaTitle, description: c.desc, alternates: pagePaths.prices, eyebrow: c.title, ogImage: "/images/product-pair.jpg" });
}

export function PricesView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const c = copy[locale];
  const faq = faqGroups.find((g) => g.id === "prices")!.items[locale];
  const url = pageHref(locale, "prices");
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ locale, url, name: c.title, description: c.desc }), businessSchema(locale, d.brandLine, false), faqSchema(faq))} />
      <PageHero
        eyebrow={c.eyebrow}
        title={c.h1}
        lead={c.lead}
        crumbs={[
          { name: d.breadcrumbHome, url: pageHref(locale, "home") },
          { name: c.title, url },
        ]}
      />
      <section className="theme-cream pb-24">
        <div className="wrap">
          <PriceList locale={locale} />
        </div>
      </section>
      <section className="theme-cream border-t border-line py-24 md:py-32">
        <div className="wrap grid gap-12 lg:grid-cols-[0.6fr_1.4fr]">
          <SplitReveal className="t-h2">{c.faq}</SplitReveal>
          <FaqList items={faq} />
        </div>
      </section>
      <CtaBand title={c.cta} text={c.ctaText} href={pageHref(locale, "booking")} label={d.book} phone={site.phone} phoneHref={site.phoneHref} image="product-bronze" />
    </PageShell>
  );
}
