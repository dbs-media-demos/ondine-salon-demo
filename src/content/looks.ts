import type { Localized } from "@/lib/i18n";
import type { ImgKey } from "./images";

export type Look = {
  id: string;
  image: ImgKey;
  title: Localized<string>;
  technique: Localized<string>;
  stylist: string;
  service: string;
  alt: Localized<string>;
};

/** Lookbook — "Issue 07". Each look links to the service it uses. */
export const looks: Look[] = [
  {
    id: "zlatni-sat",
    image: "look-golden-waves",
    title: { sr: "Zlatni sat", en: "Golden hour" },
    technique: { sr: "Balayage, toner med", en: "Balayage, honey toner" },
    stylist: "mila",
    service: "colour",
    alt: { sr: "Duga talasasta kosa sa zlatnim balayageom, snimljena s leđa", en: "Long wavy hair with golden balayage, shot from behind" },
  },
  {
    id: "bakar",
    image: "look-copper-bob",
    title: { sr: "Bakar", en: "Copper" },
    technique: { sr: "Bob do brade, bakarni gloss", en: "Chin bob, copper gloss" },
    stylist: "jana",
    service: "cuts",
    alt: { sr: "Žena sa bakarnim bobom do brade", en: "Woman with a copper chin-length bob" },
  },
  {
    id: "noc",
    image: "look-dark-curls",
    title: { sr: "Ponoć", en: "Midnight" },
    technique: { sr: "Holivudski talasi, sjaj", en: "Hollywood waves, gloss" },
    stylist: "jana",
    service: "styling",
    alt: { sr: "Tamni sjajni talasi u profilu", en: "Dark glossy waves in profile" },
  },
  {
    id: "pesak",
    image: "look-blonde-bob",
    title: { sr: "Pesak", en: "Sand" },
    technique: { sr: "Lob sa šiškama, peščana plava", en: "Lob with a fringe, sand blonde" },
    stylist: "jana",
    service: "cuts",
    alt: { sr: "Plavi lob sa šiškama iz profila", en: "Blonde lob with a fringe in profile" },
  },
  {
    id: "med",
    image: "look-honey-dark",
    title: { sr: "Med", en: "Honey" },
    technique: { sr: "Babylights na tamnoj bazi", en: "Babylights on a dark base" },
    stylist: "mila",
    service: "colour",
    alt: { sr: "Medeni pramenovi na tamnoj pozadini", en: "Honey highlights against a dark background" },
  },
  {
    id: "narandza",
    image: "look-orange-bob",
    title: { sr: "Leto u gradu", en: "City summer" },
    technique: { sr: "Kratki bob, prirodna tekstura", en: "Short bob, natural texture" },
    stylist: "jana",
    service: "cuts",
    alt: { sr: "Kratak crni bob uz narandžastu bluzu", en: "Short black bob with an orange blouse" },
  },
  {
    id: "biser",
    image: "look-bridal-pearls",
    title: { sr: "Biser", en: "Pearl" },
    technique: { sr: "Venčana punđa, ukrasi", en: "Bridal updo, ornaments" },
    stylist: "mila",
    service: "bridal",
    alt: { sr: "Razbarušena venčana punđa sa zvezdicama i biserima", en: "Undone bridal updo with star and pearl pins" },
  },
  {
    id: "bronza",
    image: "look-bronze-portrait",
    title: { sr: "Bronza", en: "Bronze" },
    technique: { sr: "Bond tretman, gloss", en: "Bond treatment, gloss" },
    stylist: "mila",
    service: "treatments",
    alt: { sr: "Portret žene sa sjajnom smeđom kosom", en: "Portrait of a woman with glossy brown hair" },
  },
  {
    id: "vetar",
    image: "look-red-wind",
    title: { sr: "Košava", en: "Košava" },
    technique: { sr: "Crvena bakarna boja, slojevi", en: "Red copper colour, layers" },
    stylist: "mila",
    service: "colour",
    alt: { sr: "Crvena kosa na vetru", en: "Red hair blowing in the wind" },
  },
  {
    id: "vino",
    image: "look-red-fringe",
    title: { sr: "Vino", en: "Wine" },
    technique: { sr: "Bob sa ravnim šiškama, crvena", en: "Blunt-fringe bob, red" },
    stylist: "jana",
    service: "cuts",
    alt: { sr: "Crveni bob sa ravnim šiškama", en: "Red bob with a blunt fringe" },
  },
  {
    id: "svila",
    image: "look-blonde-motion",
    title: { sr: "Svila", en: "Silk" },
    technique: { sr: "Feniranje, platinasta plava", en: "Blow-out, platinum blonde" },
    stylist: "jana",
    service: "styling",
    alt: { sr: "Platinasta kosa u pokretu", en: "Platinum hair in motion" },
  },
  {
    id: "rdja",
    image: "look-rust-smile",
    title: { sr: "Nedelja", en: "Sunday" },
    technique: { sr: "Duži slojevi, mekan volumen", en: "Long layers, soft volume" },
    stylist: "jana",
    service: "styling",
    alt: { sr: "Nasmejana žena sa dugim slojevitim talasima", en: "Smiling woman with long layered waves" },
  },
];
