import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { StylistCard } from "@/components/team/StylistCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { Photo } from "@/components/ui/Photo";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { bookingHref, pageHref, pagePaths } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema, businessId } from "@/lib/schema";
import { stylistCards } from "@/lib/view-models";
import { team } from "@/content/team";
import { site, absoluteUrl } from "@/lib/site";
import { img } from "@/content/images";
import clsx from "clsx";

const copy = {
  sr: {
    title: "Tim",
    metaTitle: "Tim — kolorista, stilisti, nail i brow artist u Dorćolu",
    desc: "Upoznajte tim ateljea Ondine: Mila (balayage i boja), Jana (precizni rezovi), Luka (muške frizure), Tea (nokti) i Sara (obrve i trepavice). Zakažite kod omiljene stilistkinje.",
    eyebrow: "Pet ljudi · 51 godina iskustva",
    h1: (
      <>
        Ruke kojima <em>verujete</em> svoju kosu.
      </>
    ),
    lead: "Mali tim, namerno. Svako radi ono u čemu je najbolji, a svaki novi član tima prolazi tri meseca obuke u salonu pre prvog klijenta.",
    hint: "Prikaži radove",
    about: "O",
    cta: (
      <>
        Imate <em>omiljenu</em> stilistkinju?
      </>
    ),
    ctaText: "Izaberite je u drugom koraku zakazivanja i videćete samo njene slobodne termine.",
  },
  en: {
    title: "Team",
    metaTitle: "Team — colourist, stylists, nail & brow artists in Dorćol, Belgrade",
    desc: "Meet the Ondine team: Mila (balayage & colour), Jana (precision cuts), Luka (men's cuts), Tea (nails) and Sara (brows & lashes). Book with your favourite stylist.",
    eyebrow: "Five people · 51 years of experience",
    h1: (
      <>
        Hands you can <em>trust</em> with your hair.
      </>
    ),
    lead: "A small team, on purpose. Everyone does what they do best, and every new team member trains in-house for three months before their first client.",
    hint: "Show work",
    about: "About",
    cta: (
      <>
        Have a <em>favourite</em> stylist?
      </>
    ),
    ctaText: "Choose them in step two of booking and you'll only see their free slots.",
  },
};

export function teamMetadata(locale: Locale): Metadata {
  const c = copy[locale];
  return buildMetadata({ locale, title: c.metaTitle, description: c.desc, alternates: pagePaths.team, eyebrow: c.title, ogImage: "/images/team-mila.jpg" });
}

export function TeamView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const c = copy[locale];
  const url = pageHref(locale, "team");
  const cards = stylistCards(locale);
  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageSchema({ locale, url, name: c.title, description: c.desc }),
          ...team.map((m) => ({
            "@type": "Person",
            name: m.name,
            jobTitle: m.role[locale],
            image: absoluteUrl(img[m.portrait].src),
            worksFor: { "@id": businessId },
            knowsAbout: m.specialties[locale],
          })),
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
      />
      <section className="theme-cream pb-24">
        <div className="wrap grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((s, i) => (
            <StylistCard key={s.id} s={s} index={i} tapHint={c.hint} />
          ))}
        </div>
      </section>

      {team.map((m, i) => (
        <section key={m.id} className={clsx("py-24 md:py-32", i % 2 ? "theme-blush" : "theme-cream border-t border-line")} aria-labelledby={`bio-${m.id}`}>
          <div className="wrap grid items-center gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <Reveal className={clsx("grid grid-cols-2 gap-3", i % 2 && "md:order-2")}>
              <div className="relative col-span-2 aspect-[4/3] overflow-hidden">
                <Photo k={m.works[0]} alt={cards[i].works[0].alt} sizes="(min-width: 768px) 38vw, 100vw" />
              </div>
              {m.works.slice(1, 3).map((w, k) => (
                <div key={w} className="relative aspect-square overflow-hidden">
                  <Photo k={w} alt={cards[i].works[k + 1].alt} sizes="(min-width: 768px) 19vw, 50vw" />
                </div>
              ))}
            </Reveal>
            <div>
              <p className="t-eyebrow mb-6 text-wine">
                0{i + 1} · {m.role[locale]}
              </p>
              <SplitReveal id={`bio-${m.id}`} className="t-h1">
                {m.name}
              </SplitReveal>
              <Reveal>
                <p className="mt-8 font-serif text-[1.6rem] italic leading-snug">“{m.quote[locale]}”</p>
                <p className="t-lead mt-6 max-w-xl text-muted">{m.bio[locale]}</p>
                <div className="mt-10">
                  <Button href={bookingHref(locale, { stylist: m.id })}>{cards[i].bookLabel}</Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <CtaBand title={c.cta} text={c.ctaText} href={pageHref(locale, "booking")} label={d.book} phone={site.phone} phoneHref={site.phoneHref} image="interior-chairs" />
    </PageShell>
  );
}
