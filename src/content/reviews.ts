import type { Localized } from "@/lib/i18n";

export type Review = {
  id: string;
  name: string;
  area: string;
  rating: number;
  date: string;
  service: string;
  stylist: string;
  /** Language the review was written in. */
  lang: "sr" | "en";
  text: Localized<string>;
};

/** Fictional Google-style reviews for this concept site. */
export const reviews: Review[] = [
  {
    id: "r1",
    name: "Milica S.",
    area: "Dorćol",
    rating: 5,
    date: "2026-09-12",
    service: "colour",
    stylist: "mila",
    lang: "sr",
    text: {
      sr: "Posle tri salona i narandžastih pramenova, Mila mi je za dva termina vratila hladnu plavu. Prvi put mi je izrast posle dva meseca izgledao kao da je namerno.",
      en: "After three salons and brassy highlights, Mila got me back to a cool blonde in two sessions. For the first time, two months of regrowth looked intentional.",
    },
  },
  {
    id: "r2",
    name: "Hannah W.",
    area: "Savamala",
    rating: 5,
    date: "2026-09-03",
    service: "cuts",
    stylist: "jana",
    lang: "en",
    text: {
      sr: "Preselila sam se u Beograd iz Minhena i plašila se prvog šišanja na novom mestu. Jana je razumela bob koji sam želela iz jedne fotografije. Engleski bez problema, rezervacija za minut.",
      en: "Moved to Belgrade from Munich and dreaded my first haircut somewhere new. Jana understood the bob I wanted from one photo. Perfect English, booking took a minute.",
    },
  },
  {
    id: "r3",
    name: "Nikola P.",
    area: "Vračar",
    rating: 5,
    date: "2026-08-27",
    service: "cuts",
    stylist: "luka",
    lang: "sr",
    text: {
      sr: "Luka je jedini koji mi je ošišao gustu kosu tako da stoji i bez gela. Termin tačno na vreme, kafa odlična, nema čekanja.",
      en: "Luka is the only one who's cut my thick hair so it sits right without gel. On time to the minute, great coffee, no waiting.",
    },
  },
  {
    id: "r4",
    name: "Jelena M.",
    area: "Senjak",
    rating: 5,
    date: "2026-08-19",
    service: "bridal",
    stylist: "mila",
    lang: "sr",
    text: {
      sr: "Punđa je izdržala venčanje u avgustu, 34 stepena i ples do tri ujutru. Proba mesec dana ranije mi je skinula ogroman stres. Hvala Mila i Tea!",
      en: "The updo survived an August wedding, 34°C and dancing until 3 am. The trial a month before took so much stress off. Thank you Mila and Tea!",
    },
  },
  {
    id: "r5",
    name: "Ana K.",
    area: "Stari grad",
    rating: 5,
    date: "2026-08-08",
    service: "nails",
    stylist: "tea",
    lang: "sr",
    text: {
      sr: "Trajni lak kod Tee traje mi četiri nedelje, bez ijednog odlomljenog nokta. Vidi se da se instrumenti sterilišu — kesicu je otvorila preda mnom.",
      en: "Tea's gel polish lasts me four weeks without a single chip. You can tell instruments are sterilised — she opened the pouch right in front of me.",
    },
  },
  {
    id: "r6",
    name: "Sofia R.",
    area: "Dorćol",
    rating: 5,
    date: "2026-07-30",
    service: "brows",
    stylist: "sara",
    lang: "en",
    text: {
      sr: "Laminacija obrva kod Sare je najbolja koju sam radila, a radila sam je u tri zemlje. Prirodno, gusto i ništa ne liči na tetovažu.",
      en: "Sara's brow lamination is the best I've had, and I've had it done in three countries. Natural, full and nothing tattoo-looking about it.",
    },
  },
  {
    id: "r7",
    name: "Tamara D.",
    area: "Novi Beograd",
    rating: 5,
    date: "2026-07-21",
    service: "treatments",
    stylist: "mila",
    lang: "sr",
    text: {
      sr: "Keratin bez onog mirisa koji suzi oči. Kosa mi se suši za 10 minuta umesto 40 i posle tri meseca je i dalje glatka.",
      en: "Keratin without the eye-watering smell. My hair dries in 10 minutes instead of 40 and is still smooth three months later.",
    },
  },
  {
    id: "r8",
    name: "Marko J.",
    area: "Zemun",
    rating: 5,
    date: "2026-07-10",
    service: "cuts",
    stylist: "luka",
    lang: "sr",
    text: {
      sr: "Doveo sam sina od šest godina koji mrzi šišanje. Luka ga je ošišao uz crtani na telefonu i obojica smo izašli srećni.",
      en: "Brought my six-year-old son who hates haircuts. Luka cut his hair while he watched cartoons and we both left happy.",
    },
  },
  {
    id: "r9",
    name: "Ivana T.",
    area: "Vračar",
    rating: 5,
    date: "2026-06-29",
    service: "colour",
    stylist: "mila",
    lang: "sr",
    text: {
      sr: "Cenovnik na sajtu je tačno ono što sam platila. Nema „to je dodatno“ na kraju. Balayage je ispao bolji od slike koju sam donela.",
      en: "The price on the website is exactly what I paid. No 'that's extra' at the end. The balayage turned out better than the photo I brought.",
    },
  },
  {
    id: "r10",
    name: "Claire B.",
    area: "Kosančićev venac",
    rating: 5,
    date: "2026-06-14",
    service: "styling",
    stylist: "jana",
    lang: "en",
    text: {
      sr: "Rezervisala sam feniranje pred poslovnu večeru dok sam bila u Beogradu na tri dana. Talasi su trajali i sledeći dan u avionu.",
      en: "Booked a blow-dry before a business dinner while in Belgrade for three days. The waves lasted through the next day's flight.",
    },
  },
  {
    id: "r11",
    name: "Dragana L.",
    area: "Dorćol",
    rating: 4,
    date: "2026-06-02",
    service: "colour",
    stylist: "jana",
    lang: "sr",
    text: {
      sr: "Boja savršena, ali subotom je baš gužva i čekala sam desetak minuta. Salon je predivan, a osoblje zna šta radi.",
      en: "The colour is perfect, but Saturdays are busy and I waited about ten minutes. The salon is gorgeous and the staff know what they're doing.",
    },
  },
  {
    id: "r12",
    name: "Katarina V.",
    area: "Stari grad",
    rating: 5,
    date: "2026-05-18",
    service: "brows",
    stylist: "sara",
    lang: "sr",
    text: {
      sr: "Lash lift pred more i nisam ponela maskaru. Sara je objasnila svaki korak i dala mi serum za negu.",
      en: "Lash lift before the seaside and I didn't pack mascara. Sara explained every step and gave me a conditioning serum.",
    },
  },
];
