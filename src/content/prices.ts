import type { Localized } from "@/lib/i18n";

/** Kratka / srednja / duga — price switches live with the hair-length toggle. */
export type Length = "short" | "medium" | "long";
export type Price = number | Record<Length, number>;

export type PriceItem = {
  id: string;
  name: Localized<string>;
  note?: Localized<string>;
  price: Price;
  /** "od" / "from" prefix for consultative prices. */
  from?: boolean;
  duration: number;
  popular?: boolean;
};

export type PriceCategory = {
  id: string;
  name: Localized<string>;
  /** Service page this category belongs to. */
  service: string;
  items: PriceItem[];
};

const L = (short: number, medium: number, long: number) => ({ short, medium, long });

export const lengthLabels: Record<Length, Localized<string>> = {
  short: { sr: "Kratka", en: "Short" },
  medium: { sr: "Srednja", en: "Medium" },
  long: { sr: "Duga", en: "Long" },
};

export const priceCategories: PriceCategory[] = [
  {
    id: "sisanje",
    name: { sr: "Šišanje", en: "Haircuts" },
    service: "cuts",
    items: [
      { id: "zensko-sisanje", name: { sr: "Žensko šišanje + feniranje", en: "Women's cut + blow-dry" }, price: L(3200, 3800, 4400), duration: 75, popular: true },
      { id: "sisanje-na-suvo", name: { sr: "Šišanje na suvo (kovrdže)", en: "Dry cut (curls)" }, note: { sr: "Pramen po pramen, bez stanjivanja", en: "Curl by curl, no thinning" }, price: L(3500, 4200, 4900), duration: 90 },
      { id: "sisanje-siski", name: { sr: "Šišanje šiški", en: "Fringe trim" }, price: 900, duration: 15 },
      { id: "musko-sisanje", name: { sr: "Muško šišanje", en: "Men's cut" }, price: 2200, duration: 45, popular: true },
      { id: "musko-brada", name: { sr: "Muško šišanje + brada", en: "Men's cut + beard" }, price: 2900, duration: 60 },
      { id: "decije-sisanje", name: { sr: "Dečije šišanje (do 10 god.)", en: "Kids' cut (under 10)" }, price: 1500, duration: 30 },
    ],
  },
  {
    id: "farbanje",
    name: { sr: "Farbanje", en: "Colour" },
    service: "colour",
    items: [
      { id: "farbanje-izrasta", name: { sr: "Farbanje izrasta", en: "Root touch-up" }, note: { sr: "Do 3 cm, sa feniranjem", en: "Up to 3 cm, with blow-dry" }, price: 4500, duration: 90, popular: true },
      { id: "farbanje-cele-duzine", name: { sr: "Farbanje cele dužine", en: "All-over colour" }, price: L(5500, 6800, 8200), duration: 120 },
      { id: "gloss", name: { sr: "Toniranje / gloss", en: "Toner / gloss" }, price: L(3000, 3600, 4200), duration: 45 },
      { id: "pramenovi", name: { sr: "Pramenovi u foliji", en: "Foil highlights" }, price: L(7500, 9500, 11500), duration: 150 },
      { id: "korekcija-boje", name: { sr: "Korekcija boje", en: "Colour correction" }, note: { sr: "Posle besplatne konsultacije", en: "After a free consultation" }, price: 14000, from: true, duration: 240 },
    ],
  },
  {
    id: "balayage",
    name: { sr: "Balayage", en: "Balayage" },
    service: "colour",
    items: [
      { id: "balayage", name: { sr: "Balayage", en: "Balayage" }, note: { sr: "Toner, bond zaštita i feniranje uključeni", en: "Toner, bond protection and blow-dry included" }, price: L(10500, 13500, 16500), duration: 210, popular: true },
      { id: "babylights", name: { sr: "Babylights / airtouch", en: "Babylights / airtouch" }, price: L(12000, 15000, 18500), duration: 240 },
      { id: "color-melt", name: { sr: "Color melt / ombré", en: "Colour melt / ombré" }, price: L(9000, 11500, 14000), duration: 180 },
      { id: "balayage-osvezavanje", name: { sr: "Osvežavanje balayagea", en: "Balayage refresh" }, note: { sr: "Toner + face framing pramenovi", en: "Toner + face-framing pieces" }, price: L(6000, 7200, 8400), duration: 120 },
      { id: "bond-dodatak", name: { sr: "Bond tretman uz boju", en: "Bond add-on with colour" }, price: 1800, duration: 15 },
    ],
  },
  {
    id: "feniranje",
    name: { sr: "Feniranje", en: "Blow-dry" },
    service: "styling",
    items: [
      { id: "feniranje", name: { sr: "Pranje + feniranje", en: "Wash + blow-dry" }, price: L(1800, 2200, 2600), duration: 45, popular: true },
      { id: "talasi", name: { sr: "Talasi (figaro ili pegla)", en: "Waves (tong or flat iron)" }, price: L(2400, 2900, 3400), duration: 60 },
      { id: "sveca-frizura", name: { sr: "Svečana frizura / punđa", en: "Occasion style / updo" }, price: 4500, duration: 75 },
      { id: "matura", name: { sr: "Frizura za maturu (sa probom)", en: "Prom style (with trial)" }, price: 6500, duration: 120 },
      { id: "maska-pranje", name: { sr: "Pranje + maska po izboru", en: "Wash + mask of choice" }, price: 1200, duration: 20 },
    ],
  },
  {
    id: "nokti",
    name: { sr: "Nokti", en: "Nails" },
    service: "nails",
    items: [
      { id: "manikir", name: { sr: "Ruski manikir", en: "Russian manicure" }, price: 1800, duration: 45 },
      { id: "trajni-lak", name: { sr: "Manikir + trajni lak", en: "Manicure + gel polish" }, price: 2800, duration: 60, popular: true },
      { id: "gel-izlivanje", name: { sr: "Izlivanje gel noktiju", en: "Builder gel set" }, price: 4200, duration: 120 },
      { id: "gel-korekcija", name: { sr: "Korekcija gela", en: "Gel infill" }, price: 3600, duration: 90 },
      { id: "pedikir", name: { sr: "Medicinski pedikir", en: "Medical pedicure" }, price: 3200, duration: 60 },
      { id: "pedikir-lak", name: { sr: "Pedikir + trajni lak", en: "Pedicure + gel polish" }, price: 4200, duration: 75 },
      { id: "nail-art", name: { sr: "Nail art (po noktu)", en: "Nail art (per nail)" }, price: 200, duration: 5 },
      { id: "skidanje-gela", name: { sr: "Skidanje gela", en: "Gel removal" }, price: 900, duration: 15 },
    ],
  },
  {
    id: "obrve",
    name: { sr: "Obrve i trepavice", en: "Brows & lashes" },
    service: "brows",
    items: [
      { id: "oblikovanje-obrva", name: { sr: "Oblikovanje obrva", en: "Brow shaping" }, price: 1200, duration: 20 },
      { id: "farbanje-obrva", name: { sr: "Farbanje obrva", en: "Brow tint" }, price: 900, duration: 15 },
      { id: "henna", name: { sr: "Henna obrve", en: "Henna brows" }, price: 2400, duration: 45 },
      { id: "laminacija", name: { sr: "Laminacija obrva", en: "Brow lamination" }, note: { sr: "Sa oblikovanjem i farbanjem", en: "With shaping and tint" }, price: 3200, duration: 60, popular: true },
      { id: "lash-lift", name: { sr: "Lash lift + farbanje", en: "Lash lift + tint" }, price: 3800, duration: 60, popular: true },
      { id: "trepavice-klasik", name: { sr: "Trepavice 1:1 classic", en: "Classic 1:1 lashes" }, price: 4800, duration: 120 },
      { id: "trepavice-volume", name: { sr: "Volume trepavice", en: "Volume lashes" }, price: 5800, duration: 150 },
      { id: "trepavice-korekcija", name: { sr: "Korekcija trepavica (do 3 ned.)", en: "Lash infill (within 3 wks)" }, price: 3200, duration: 75 },
    ],
  },
  {
    id: "tretmani",
    name: { sr: "Tretmani", en: "Treatments" },
    service: "treatments",
    items: [
      { id: "keratin", name: { sr: "Keratinsko ispravljanje", en: "Keratin smoothing" }, note: { sr: "Bez formaldehida, traje 3–5 meseci", en: "Formaldehyde-free, lasts 3–5 months" }, price: L(9000, 12000, 15000), duration: 180, popular: true },
      { id: "botox", name: { sr: "Botox za kosu", en: "Hair botox" }, price: L(7000, 9000, 11000), duration: 120 },
      { id: "bond-tretman", name: { sr: "Bond tretman (rekonstrukcija)", en: "Bond rebuilding treatment" }, price: L(3200, 3800, 4500), duration: 60 },
      { id: "hidratacija", name: { sr: "Dubinska hidratacija", en: "Deep hydration" }, price: 2600, duration: 45 },
      { id: "vlasiste", name: { sr: "Ritual za vlasište (piling + masaža)", en: "Scalp ritual (scrub + massage)" }, price: 2900, duration: 45 },
    ],
  },
];

export const allPriceItems = priceCategories.flatMap((c) => c.items.map((i) => ({ ...i, category: c })));

export const priceItemById = (id: string) => allPriceItems.find((i) => i.id === id);

export const minPrice = (p: Price) => (typeof p === "number" ? p : p.short);
export const maxPrice = (p: Price) => (typeof p === "number" ? p : p.long);

export const formatRsd = (n: number, locale: "sr" | "en") =>
  `${new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : "en-US").format(n)} RSD`;
