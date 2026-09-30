import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ReviewsGrid } from "@/components/sections/ReviewsGrid";
import { CityMap } from "@/components/sections/CityMap";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { GiftCardDesigner } from "@/components/forms/GiftCardDesigner";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList } from "@/components/ui/FaqList";
import { Stars } from "@/components/ui/Stars";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Reveal, SplitReveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref, pagePaths, type PageKey } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";
import { graph, faqSchema, webPageSchema, businessSchema } from "@/lib/schema";
import { faqGroups } from "@/content/faq";
import { reviews } from "@/content/reviews";
import { site } from "@/lib/site";
import type { ImgKey } from "@/content/images";

type L = { sr: string; en: string };
const pick = (v: L, locale: Locale) => v[locale];

const crumbs = (locale: Locale, key: PageKey, name: string) => [
  { name: getDictionary(locale).breadcrumbHome, url: pageHref(locale, "home") },
  { name, url: pageHref(locale, key) },
];

const meta = (key: PageKey, title: L, desc: L, image: ImgKey) => (locale: Locale): Metadata =>
  buildMetadata({ locale, title: pick(title, locale), description: pick(desc, locale), alternates: pagePaths[key], eyebrow: getDictionary(locale).nav[key], ogImage: `/images/${image}.jpg` });

/* ─────────────── Gift cards ─────────────── */

export const giftCardsMetadata = meta(
  "giftCards",
  { sr: "Poklon vaučeri — frizerski salon u Dorćolu", en: "Gift cards — hair salon gift vouchers in Belgrade" },
  {
    sr: "Poklonite balayage, manikir ili keratin. Poklon vaučeri ateljea Ondine od 3.000 RSD, e-mailom odmah ili štampani u koverti. Važe 12 meseci za sve usluge.",
    en: "Give balayage, a manicure or keratin. Ondine gift cards from 3,000 RSD, emailed instantly or printed in an envelope. Valid 12 months for every service.",
  },
  "product-bronze",
);

export function GiftCardsView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const sr = locale === "sr";
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ locale, url: pageHref(locale, "giftCards"), name: d.nav.giftCards, description: sr ? "Poklon vaučeri" : "Gift cards" }))} />
      <PageHero
        eyebrow={sr ? "Poklon koji se ne vraća" : "The gift nobody returns"}
        title={
          sr ? (
            <>
              Poklonite <em>sat</em> samo za nju.
            </>
          ) : (
            <>
              Give an <em>hour</em> just for them.
            </>
          )
        }
        lead={sr ? "Izaberite iznos i dizajn, dodajte poruku — vaučer stiže e-mailom za minut ili ga preuzimate u salonu u koverti sa voskom." : "Choose an amount and design, add a message — the card arrives by email in a minute, or pick it up at the salon in a wax-sealed envelope."}
        crumbs={crumbs(locale, "giftCards", d.nav.giftCards)}
      />
      <section className="theme-cream pb-24 md:pb-36">
        <div className="wrap">
          <GiftCardDesigner locale={locale} />
        </div>
      </section>
      <CtaBand
        title={sr ? <>Radije <em>uživo</em>?</> : <>Prefer <em>in person</em>?</>}
        text={sr ? "Vaučere prodajemo i na recepciji, uto–sub 9–21 h. Plaćanje karticom, gotovinom ili IPS QR kodom." : "Gift cards are also sold at reception, Tue–Sat 9 am–9 pm. Pay by card, cash or IPS QR."}
        href={pageHref(locale, "contact")}
        label={d.nav.contact}
        phone={site.phone}
        phoneHref={site.phoneHref}
        image="product-trio"
      />
    </PageShell>
  );
}

/* ─────────────── Reviews ─────────────── */

export const reviewsMetadata = meta(
  "reviews",
  { sr: "Utisci klijenata — 4,9 ★ na Google-u, Dorćol", en: "Client reviews — 4.9 ★ on Google, Belgrade" },
  {
    sr: "Šta klijenti kažu o ateljeu Ondine u Dorćolu: 312 Google recenzija, prosečna ocena 4,9. Balayage, šišanje, nokti, obrve i venčane frizure.",
    en: "What clients say about Ondine in Dorćol, Belgrade: 312 Google reviews, 4.9 average. Balayage, cuts, nails, brows and bridal hair.",
  },
  "look-rust-smile",
);

export function ReviewsView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const sr = locale === "sr";
  const dist = [
    [5, 91],
    [4, 6],
    [3, 2],
    [2, 1],
    [1, 0],
  ];
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ locale, url: pageHref(locale, "reviews"), name: d.reviews.title, description: d.reviews.basedOn(site.rating.count) }), businessSchema(locale, d.brandLine))} />
      <PageHero
        eyebrow="Google"
        title={sr ? <>Reči koje <em>čuvamo</em>.</> : <>Words we <em>keep</em>.</>}
        crumbs={crumbs(locale, "reviews", d.nav.reviews)}
      >
        <div className="flex flex-wrap items-end gap-10">
          <div className="flex items-end gap-5">
            <p className="font-serif text-[clamp(4.5rem,9vw,8rem)] leading-[0.8]">{sr ? "4,9" : "4.9"}</p>
            <div className="pb-2">
              <Stars value={5} className="text-lg text-wine" label={`${site.rating.value} / 5`} />
              <p className="mt-2 text-[0.9rem] text-muted">{d.reviews.basedOn(site.rating.count)}</p>
            </div>
          </div>
          <ul className="w-full max-w-xs space-y-1.5 text-[0.8rem]" aria-label={sr ? "Raspodela ocena" : "Rating breakdown"}>
            {dist.map(([s, p]) => (
              <li key={s} className="flex items-center gap-3">
                <span className="w-3">{s}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                  <span className="block h-full rounded-full bg-wine" style={{ width: `${p}%` }} />
                </span>
                <span className="w-8 text-right text-muted">{p}%</span>
              </li>
            ))}
          </ul>
        </div>
      </PageHero>
      <section className="theme-cream pb-24 md:pb-36">
        <div className="wrap">
          <ReviewsGrid locale={locale} allLabel={sr ? `Sve (${reviews.length})` : `All (${reviews.length})`} />
        </div>
      </section>
      <CtaBand
        title={sr ? <>Bili ste <em>kod nas</em>?</> : <>Been <em>to see us</em>?</>}
        text={sr ? "Recenzija na Google-u pomaže drugima da nas pronađu. Traje minut i mnogo nam znači." : "A Google review helps others find us. It takes a minute and means a lot."}
        href={pageHref(locale, "booking")}
        label={d.book}
        phone={site.phone}
        phoneHref={site.phoneHref}
        image="look-bronze-portrait"
      />
    </PageShell>
  );
}

/* ─────────────── FAQ ─────────────── */

export const faqMetadata = meta(
  "faq",
  { sr: "Česta pitanja — zakazivanje, cene, parking", en: "FAQ — booking, prices and parking in Belgrade" },
  {
    sr: "Odgovori na najčešća pitanja: kako zakazati i otkazati termin, kako se određuje dužina kose, načini plaćanja, parking u Dorćolu i preparati koje koristimo.",
    en: "Answers to common questions: booking and cancelling, how hair length is priced, payment methods, parking in Dorćol and the products we use.",
  },
  "interior-mirror",
);

export function FaqView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const sr = locale === "sr";
  const all = faqGroups.flatMap((g) => g.items[locale]);
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ locale, url: pageHref(locale, "faq"), name: d.nav.faq, description: all[0].q, type: "FAQPage" }), faqSchema(all))} />
      <PageHero
        eyebrow={d.nav.faq}
        title={sr ? <>Sve što ste <em>hteli</em> da pitate.</> : <>Everything you <em>wanted</em> to ask.</>}
        lead={sr ? "Ne vidite svoje pitanje? Pišite nam na Instagramu ili pozovite — odgovaramo istog dana." : "Don't see your question? Message us on Instagram or call — we reply the same day."}
        crumbs={crumbs(locale, "faq", d.nav.faq)}
      />
      {faqGroups.map((g) => (
        <section key={g.id} className="theme-cream border-t border-line py-16 md:py-24" aria-labelledby={`faq-${g.id}`}>
          <div className="wrap grid gap-10 lg:grid-cols-[0.6fr_1.4fr]">
            <SplitReveal id={`faq-${g.id}`} className="t-h2">
              {g.title[locale]}
            </SplitReveal>
            <FaqList items={g.items[locale]} />
          </div>
        </section>
      ))}
      <CtaBand title={sr ? <>Spremni za <em>termin</em>?</> : <>Ready to <em>book</em>?</>} text={d.cta.text} href={pageHref(locale, "booking")} label={d.book} phone={site.phone} phoneHref={site.phoneHref} />
    </PageShell>
  );
}

/* ─────────────── Booking ─────────────── */

export const bookingMetadata = meta(
  "booking",
  { sr: "Zakazivanje online — frizer u Dorćolu, termin za minut", en: "Book online — hair salon in Belgrade, booked in a minute" },
  {
    sr: "Zakažite šišanje, balayage, keratin, manikir ili laminaciju obrva online: izaberite uslugu, stilistu i termin. Uto–sub 9–21 h, Strahinjića Bana 44.",
    en: "Book a cut, balayage, keratin, manicure or brow lamination online: pick a service, stylist and time. Tue–Sat 9 am–9 pm, Strahinjića Bana 44.",
  },
  "interior-chairs",
);

export function BookingView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const sr = locale === "sr";
  return (
    <PageShell>
      <JsonLd
        data={graph(webPageSchema({ locale, url: pageHref(locale, "booking"), name: d.nav.booking, description: d.cta.text }), {
          "@type": "ReserveAction",
          target: { "@type": "EntryPoint", urlTemplate: `${site.url}${pageHref(locale, "booking")}`, inLanguage: locale },
          result: { "@type": "Reservation", name: sr ? "Termin u salonu" : "Salon appointment" },
        })}
      />
      <section className="theme-cream pb-24 pt-[calc(var(--header-h)+2.5rem)] md:pb-36">
        <div className="wrap">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="t-eyebrow anim-fade mb-6 text-wine">{sr ? "Online zakazivanje · 4 koraka" : "Online booking · 4 steps"}</p>
              <h1 className="t-h1 anim-heading">{sr ? <>Vaš <em>termin</em>.</> : <>Your <em>appointment</em>.</>}</h1>
            </div>
            <div className="anim-fade text-[0.95rem] text-muted md:text-right">
              <OpenBadge locale={locale} />
              <p className="mt-2">
                {sr ? "Radije telefonom? " : "Prefer to call? "}
                <a href={site.phoneHref} className="font-medium text-fg underline underline-offset-4">
                  {site.phone}
                </a>
              </p>
            </div>
          </div>
          <BookingFlow locale={locale} />
        </div>
      </section>
    </PageShell>
  );
}

/* ─────────────── Contact ─────────────── */

export const contactMetadata = meta(
  "contact",
  { sr: "Kontakt — Strahinjića Bana 44, Dorćol, Beograd", en: "Contact — Strahinjića Bana 44, Dorćol, Belgrade" },
  {
    sr: "Adresa, telefon i radno vreme ateljea Ondine: Strahinjića Bana 44, Dorćol, Beograd. Uto–sub 9–21 h. Pišite nam ili zakažite online.",
    en: "Address, phone and opening hours for Ondine: Strahinjića Bana 44, Dorćol, Belgrade. Tue–Sat 9 am–9 pm. Message us or book online.",
  },
  "interior-room",
);

export function ContactView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const sr = locale === "sr";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Strahinjića Bana, Beograd")}`;
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ locale, url: pageHref(locale, "contact"), name: d.nav.contact, description: d.brandLine, type: "ContactPage" }), businessSchema(locale, d.brandLine, false))} />
      <PageHero
        eyebrow={d.nav.contact}
        title={sr ? <>Svratite, pišite, <em>pozovite</em>.</> : <>Drop by, write, <em>call</em>.</>}
        crumbs={crumbs(locale, "contact", d.nav.contact)}
      >
        <div className="grid max-w-3xl gap-8 sm:grid-cols-3">
          <div>
            <p className="t-eyebrow mb-2 text-muted">{sr ? "Telefon" : "Phone"}</p>
            <a href={site.phoneHref} className="font-serif text-2xl hover:text-wine">
              {site.phone}
            </a>
          </div>
          <div>
            <p className="t-eyebrow mb-2 text-muted">E-mail</p>
            <a href={`mailto:${site.email}`} className="font-serif text-2xl hover:text-wine">
              {site.email}
            </a>
          </div>
          <div>
            <p className="t-eyebrow mb-2 text-muted">Instagram</p>
            <a href={site.instagramUrl} target="_blank" rel="noopener" className="font-serif text-2xl hover:text-wine">
              {site.instagram}
            </a>
          </div>
        </div>
      </PageHero>
      <section className="theme-cream border-t border-line py-24 md:py-32">
        <div className="wrap grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SplitReveal className="t-h2 mb-12">{sr ? "Pošaljite poruku" : "Send a message"}</SplitReveal>
            <ContactForm locale={locale} />
          </div>
          <Reveal className="space-y-8">
            <CityMap className="aspect-[4/3] w-full" label={sr ? "Stilizovana mapa Dorćola sa lokacijom salona" : "Stylised map of Dorćol with the salon location"} />
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="t-eyebrow mb-3 text-muted">{sr ? "Adresa" : "Address"}</p>
                <address className="not-italic leading-relaxed">
                  {site.address.street}
                  <br />
                  {site.address.postal} {sr ? site.address.city : site.address.cityEn}
                </address>
                <a href={mapsUrl} target="_blank" rel="noopener" className="link-draw mt-2 inline-block py-1 font-medium">
                  {sr ? "Otvori u Google mapama" : "Open in Google Maps"} ↗
                </a>
              </div>
              <div>
                <p className="t-eyebrow mb-3 text-muted">{d.hours.title}</p>
                <p>{d.hours.weekdays} · 9–21</p>
                <p className="text-muted">
                  {d.hours.sunMon}: {d.hours.closed}
                </p>
                <OpenBadge locale={locale} className="mt-3 text-[0.9rem]" />
              </div>
            </div>
            <Button href={pageHref(locale, "booking")}>{d.book}</Button>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}

/* ─────────────── Privacy ─────────────── */

export const privacyMetadata = meta(
  "privacy",
  { sr: "Politika privatnosti", en: "Privacy policy" },
  { sr: "Kako Ondine prikuplja i čuva podatke pri zakazivanju i kupovini vaučera.", en: "How Ondine collects and stores data for bookings and gift cards." },
  "interior-arch",
);

const privacy = {
  sr: [
    ["Ko smo", "Ondine atelje za kosu i lepotu, Strahinjića Bana 44, 11000 Beograd. Za pitanja o podacima pišite na hello@ondine.rs. Napomena: ovo je konceptni sajt koji je izradio Scale by Noon; salon je izmišljen i nijedan podatak se ne šalje niti čuva."],
    ["Koje podatke prikupljamo", "Pri zakazivanju: ime, broj telefona, e-mail (opciono) i napomenu. Pri kupovini vaučera: e-mail kupca i ime primaoca. Ne prikupljamo podatke o platnim karticama — plaćanje obrađuje banka."],
    ["Zašto", "Isključivo da bismo potvrdili i podsetili vas na termin, odnosno isporučili vaučer. Podatke ne prodajemo i ne delimo sa trećim licima osim sa sistemom za zakazivanje koji koristimo."],
    ["Koliko dugo", "Podatke o terminima čuvamo 24 meseca od poslednje posete, zatim ih brišemo. Možete zatražiti brisanje u bilo kom trenutku."],
    ["Kolačići", "Sajt ne koristi kolačiće za praćenje ni oglašavanje. Pamtimo samo da ste zatvorili obaveštenje o konceptnom sajtu, i to samo do kraja sesije."],
    ["Vaša prava", "U skladu sa Zakonom o zaštiti podataka o ličnosti imate pravo na pristup, ispravku, brisanje i prigovor Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti."],
  ],
  en: [
    ["Who we are", "Ondine hair & beauty atelier, Strahinjića Bana 44, 11000 Belgrade, Serbia. For data questions email hello@ondine.rs. Note: this is a concept site built by Scale by Noon; the salon is fictional and no data is sent or stored."],
    ["What we collect", "When you book: name, phone number, email (optional) and a note. When you buy a gift card: the buyer's email and the recipient's name. We never collect card details — payments are handled by the bank."],
    ["Why", "Only to confirm and remind you of your appointment, or to deliver a gift card. We don't sell your data or share it with anyone except the booking system we use."],
    ["How long", "Appointment data is kept for 24 months after your last visit, then deleted. You can ask us to delete it at any time."],
    ["Cookies", "The site uses no tracking or advertising cookies. We only remember that you closed the concept-site notice, and only for the current session."],
    ["Your rights", "Under Serbia's Personal Data Protection Act you have the right to access, correct and delete your data, and to complain to the Commissioner for Information of Public Importance and Personal Data Protection."],
  ],
};

export function PrivacyView({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  return (
    <PageShell>
      <JsonLd data={graph(webPageSchema({ locale, url: pageHref(locale, "privacy"), name: d.nav.privacy, description: privacy[locale][0][1] }))} />
      <PageHero eyebrow={locale === "sr" ? "Ažurirano: septembar 2026." : "Updated: September 2026"} title={d.nav.privacy} crumbs={crumbs(locale, "privacy", d.nav.privacy)} />
      <section className="theme-cream pb-24 md:pb-36">
        <div className="wrap max-w-4xl">
          {privacy[locale].map(([h, p], i) => (
            <div key={h} className="grid gap-4 border-t border-line py-10 md:grid-cols-[14rem_1fr]">
              <h2 className="t-h3">
                <span className="mr-3 text-wine">0{i + 1}</span>
                {h}
              </h2>
              <p className="t-lead text-muted">{p}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
