import type { Localized } from "@/lib/i18n";

export type FaqGroup = { id: string; title: Localized<string>; items: Localized<{ q: string; a: string }[]> };

export const faqGroups: FaqGroup[] = [
  {
    id: "booking",
    title: { sr: "Zakazivanje", en: "Booking" },
    items: {
      sr: [
        { q: "Kako mogu da zakažem termin?", a: "Online preko sajta za manje od minut, pozivom na +381 11 000 0000 ili porukom na Instagramu. Potvrdu dobijate SMS-om." },
        { q: "Mogu li da otkažem ili pomerim termin?", a: "Da, besplatno do 24 sata ranije. Za kasnije otkazivanje zadržavamo 30% cene usluge." },
        { q: "Da li primate bez zakazivanja?", a: "Ako imamo slobodan termin — da. Petkom i subotom ipak savetujemo da zakažete unapred." },
        { q: "Koliko ranije da dođem na prvi termin?", a: "Pet minuta je sasvim dovoljno. Za boju, na prvom terminu radimo i kratku konsultaciju." },
      ],
      en: [
        { q: "How do I book?", a: "Online through the website in under a minute, by calling +381 11 000 0000 or by messaging us on Instagram. You'll get an SMS confirmation." },
        { q: "Can I cancel or move my appointment?", a: "Yes, free of charge up to 24 hours before. For later cancellations we keep 30% of the service price." },
        { q: "Do you take walk-ins?", a: "If we have a free chair — yes. On Fridays and Saturdays we recommend booking ahead." },
        { q: "How early should I arrive for a first visit?", a: "Five minutes is plenty. For colour, your first visit includes a short consultation." },
      ],
    },
  },
  {
    id: "prices",
    title: { sr: "Cene i plaćanje", en: "Prices & payment" },
    items: {
      sr: [
        { q: "Da li su cene na sajtu konačne?", a: "Jesu. Cenovnik je ažuran i ono što vidite je ono što plaćate. Jedini izuzetak je korekcija boje, koju procenjujemo na konsultaciji." },
        { q: "Kako se određuje dužina kose?", a: "Kratka je do brade, srednja do ramena, a duga ispod lopatica. Ako ste između, računamo kraću dužinu." },
        { q: "Koje načine plaćanja primate?", a: "Gotovinu, sve platne kartice, IPS QR i poklon vaučere Ondine." },
      ],
      en: [
        { q: "Are the prices on the website final?", a: "Yes. The price list is current and what you see is what you pay. The only exception is colour correction, which we quote after a consultation." },
        { q: "How is hair length defined?", a: "Short is chin length, medium is shoulder length, long is below the shoulder blades. If you're in between, we charge the shorter length." },
        { q: "Which payment methods do you accept?", a: "Cash, all major cards, IPS QR instant payments and Ondine gift cards." },
      ],
    },
  },
  {
    id: "salon",
    title: { sr: "Salon", en: "The salon" },
    items: {
      sr: [
        { q: "Gde se nalazite i gde da parkiram?", a: "Strahinjića Bana 44, Dorćol. Najbliža garaža je „Dorćol Centar“ (5 minuta pešice), a ulica je u zoni 2 (dva sata)." },
        { q: "Da li govorite engleski?", a: "Da, ceo tim govori engleski, a Mila i italijanski." },
        { q: "Koje preparate koristite?", a: "Profesionalne italijanske linije boja bez amonijaka, bond zaštitu pri svakom posvetljivanju i veganske preparate za negu." },
        { q: "Da li je salon pristupačan?", a: "Ulaz je u nivou ulice, bez stepenika, a toalet je prilagođen." },
      ],
      en: [
        { q: "Where are you and where can I park?", a: "Strahinjića Bana 44, Dorćol. The nearest garage is Dorćol Centar (5 minutes' walk) and the street is in parking zone 2 (two hours)." },
        { q: "Do you speak English?", a: "Yes, the whole team speaks English, and Mila speaks Italian too." },
        { q: "Which products do you use?", a: "Professional ammonia-free Italian colour lines, bond protection with every lightening service and vegan care products." },
        { q: "Is the salon accessible?", a: "The entrance is at street level with no steps, and the restroom is accessible." },
      ],
    },
  },
];
