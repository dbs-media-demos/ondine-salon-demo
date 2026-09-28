import type { Localized } from "@/lib/i18n";
import type { ImgKey } from "./images";

export type Stylist = {
  id: string;
  name: string;
  /** Serbian genitive for "Zakaži kod …" (book with …). */
  genitive: string;
  role: Localized<string>;
  years: number;
  portrait: ImgKey;
  bio: Localized<string>;
  specialties: Localized<string[]>;
  works: ImgKey[];
  services: string[];
  quote: Localized<string>;
};

export const team: Stylist[] = [
  {
    id: "mila",
    name: "Mila Radić",
    genitive: "Mile",
    role: { sr: "Osnivačica & kreativna direktorka, kolorista", en: "Founder & creative director, colourist" },
    years: 14,
    portrait: "team-mila",
    bio: {
      sr: "Učila je boju u Milanu i radila u dva londonska salona pre nego što je 2017. otvorila Ondine u Dorćolu. Specijalnost: balayage koji raste bez linije i korekcije boje koje drugi odbiju.",
      en: "Trained in colour in Milan and worked in two London salons before opening Ondine in Dorćol in 2017. Speciality: balayage that grows out without a line, and colour corrections others turn down.",
    },
    specialties: { sr: ["Balayage", "Korekcija boje", "Venčanja"], en: ["Balayage", "Colour correction", "Bridal"] },
    works: ["look-golden-waves", "colour-honey-waves", "colour-ash-curls", "colour-caramel-back"],
    services: ["colour", "treatments", "bridal", "cuts"],
    quote: { sr: "Najlepša boja je ona za koju vas pitaju da li je prirodna.", en: "The best colour is the one people ask whether it's natural." },
  },
  {
    id: "jana",
    name: "Jana Kostić",
    genitive: "Jane",
    role: { sr: "Senior stilista, precizni rezovi", en: "Senior stylist, precision cuts" },
    years: 9,
    portrait: "team-jana",
    bio: {
      sr: "Jana je razlog zašto pola Dorćola nosi bob. Šiša na suvo, meri liniju do milimetra i uvek pita kako ćete se fenirati sami — pa rez prilagodi tome.",
      en: "Jana is the reason half of Dorćol wears a bob. She cuts dry, measures the line to the millimetre and always asks how you'll style it yourself — then cuts for that.",
    },
    specialties: { sr: ["Bob & lob", "Kovrdže", "Šiške"], en: ["Bobs & lobs", "Curls", "Fringes"] },
    works: ["look-copper-bob", "cut-black-bob", "look-blonde-bob", "look-orange-bob"],
    services: ["cuts", "styling", "colour", "bridal"],
    quote: { sr: "Dobar rez se vidi tek treće nedelje.", en: "A good cut shows in week three." },
  },
  {
    id: "luka",
    name: "Luka Marić",
    genitive: "Luke",
    role: { sr: "Muške frizure & kratka kosa", en: "Men's cuts & short hair" },
    years: 7,
    portrait: "team-luka",
    bio: {
      sr: "Klasični barber zanat spojen sa ženskim salonskim tehnikama. Fade, teksturisani rezovi i duža muška kosa koja ne izgleda kao da je zaboravljena.",
      en: "Classic barbering blended with salon techniques. Fades, textured crops and longer men's hair that doesn't look forgotten.",
    },
    specialties: { sr: ["Fade", "Teksturisani rez", "Brada"], en: ["Fades", "Textured crops", "Beards"] },
    works: ["men-quiff", "men-fade-detail", "men-profile", "men-texture"],
    services: ["cuts"],
    quote: { sr: "Muška frizura treba da izgleda dobro i petog dana.", en: "A man's cut should still look good on day five." },
  },
  {
    id: "tea",
    name: "Tea Nikolić",
    genitive: "Tee",
    role: { sr: "Nail artist", en: "Nail artist" },
    years: 6,
    portrait: "team-tea",
    bio: {
      sr: "Ruski manikir, čiste linije i nude nijanse u kojima se ne vidi da su nokti rađeni — samo da su savršeni. Sterilizaciju shvata ozbiljnije od bilo koga koga znamo.",
      en: "Russian manicures, clean lines and nudes that don't look done — just perfect. Takes sterilisation more seriously than anyone we know.",
    },
    specialties: { sr: ["Ruski manikir", "Gel", "Minimalni nail art"], en: ["Russian manicure", "Builder gel", "Minimal nail art"] },
    works: ["nails-nude-fur", "nails-pastel", "nails-soft", "nails-nude-pair"],
    services: ["nails", "bridal"],
    quote: { sr: "Nude nikad nije dosadan kad je nijansa tačna.", en: "Nude is never boring when the shade is right." },
  },
  {
    id: "sara",
    name: "Sara Jovanović",
    genitive: "Sare",
    role: { sr: "Obrve & trepavice", en: "Brows & lashes" },
    years: 5,
    portrait: "team-sara",
    bio: {
      sr: "Sara mapira obrve prema licu, ne prema trendu. Njena laminacija je najtraženiji termin petkom, a lash lift ume da zameni maskaru za ceo odmor.",
      en: "Sara maps brows to the face, not to the trend. Her lamination is the most-booked Friday slot, and her lash lift can replace mascara for a whole holiday.",
    },
    specialties: { sr: ["Laminacija", "Lash lift", "Henna"], en: ["Lamination", "Lash lift", "Henna"] },
    works: ["brows-arch", "lashes-volume", "brows-warm", "brows-portrait"],
    services: ["brows", "bridal"],
    quote: { sr: "Obrve su okvir. Slika je vaše lice.", en: "Brows are the frame. Your face is the picture." },
  },
];

export const stylistById = (id: string) => team.find((s) => s.id === id);
