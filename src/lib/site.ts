/** Fictional business details — a Scale by Noon concept site. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ondine-salon-demo.vercel.app").replace(/\/$/, "");

export const site = {
  name: "Ondine",
  legalName: "Ondine atelje za kosu i lepotu",
  url: siteUrl,
  phone: "+381 11 000 0000",
  phoneHref: "tel:+381110000000",
  whatsapp: "+381 60 000 0000",
  email: "hello@ondine.rs",
  instagram: "@ondine.beograd",
  instagramUrl: "https://www.instagram.com/",
  address: {
    street: "Strahinjića Bana 44",
    district: "Dorćol",
    city: "Beograd",
    cityEn: "Belgrade",
    postal: "11000",
    country: "RS",
  },
  geo: { lat: 44.8196, lng: 20.4589 },
  /** Tue–Sat 9:00–21:00 (Europe/Belgrade). 0 = Sunday. */
  hours: [
    { day: 2, open: 9, close: 21 },
    { day: 3, open: 9, close: 21 },
    { day: 4, open: 9, close: 21 },
    { day: 5, open: 9, close: 21 },
    { day: 6, open: 9, close: 21 },
  ],
  rating: { value: 4.9, count: 312 },
  founded: 2017,
  areaServed: ["Dorćol", "Stari grad", "Vračar", "Savamala", "Senjak", "Novi Beograd", "Zemun"],
  noindex: process.env.NEXT_PUBLIC_NOINDEX !== "false",
} as const;

/** The agency behind this concept site. Single source of truth for every credit link. */
export const agency = { name: "Scale by Noon" } as const;
export const agencyUrl = "https://www.scalebynoon.com";

export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;
