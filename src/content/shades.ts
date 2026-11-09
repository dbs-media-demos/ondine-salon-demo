import type { Localized } from "@/lib/i18n";

/**
 * The shade card on the homepage: six shades the atelier colours most, each tied to the price-list item
 * that makes it (so the card's price is always the price list's). `root`/`tip` colour the 3D tresses
 * and the swatch dots; the order is the order they hang in.
 */
export type ShadeEntry = {
  id: string;
  name: Localized<string>;
  description: Localized<string>;
  /** Price-list item id (src/content/prices.ts). */
  item: string;
  stylist: string;
  root: string;
  tip: string;
};

export const shades: ShadeEntry[] = [
  {
    id: "ponoc",
    name: { sr: "Ponoć", en: "Midnight" },
    description: { sr: "Duboka espresso boja sa ogledalskim sjajem.", en: "Deep espresso with a mirror gloss." },
    item: "gloss",
    stylist: "jana",
    root: "#0b0605",
    tip: "#2c1a12",
  },
  {
    id: "bronza",
    name: { sr: "Bronza", en: "Bronze" },
    description: { sr: "Topli smeđi color melt, bez oštre linije izrasta.", en: "A warm brown colour melt with no hard regrowth line." },
    item: "color-melt",
    stylist: "mila",
    root: "#26120a",
    tip: "#6e3f22",
  },
  {
    id: "bakar",
    name: { sr: "Bakar", en: "Copper" },
    description: { sr: "Bakarna boja cele dužine, od korena do vrhova.", en: "All-over copper, from the root to the ends." },
    item: "farbanje-cele-duzine",
    stylist: "mila",
    root: "#2c0d06",
    tip: "#9a3d16",
  },
  {
    id: "med",
    name: { sr: "Med", en: "Honey" },
    description: { sr: "Tanki medeni pramenovi na tamnoj bazi.", en: "Fine honey babylights on a dark base." },
    item: "babylights",
    stylist: "mila",
    root: "#2a170c",
    tip: "#a8743a",
  },
  {
    id: "zlatni-sat",
    name: { sr: "Zlatni sat", en: "Golden hour" },
    description: { sr: "Balayage iz slobodne ruke, sa medenim tonerom.", en: "Hand-painted balayage with a honey toner." },
    item: "balayage",
    stylist: "mila",
    root: "#3a2414",
    tip: "#cf9d58",
  },
  {
    id: "pesak",
    name: { sr: "Pesak", en: "Sand" },
    description: { sr: "Peščana plava u foliji, meka i bez žutila.", en: "Soft sand blonde in foils, with no brassiness." },
    item: "pramenovi",
    stylist: "jana",
    root: "#7c6044",
    tip: "#d9c09a",
  },
];
