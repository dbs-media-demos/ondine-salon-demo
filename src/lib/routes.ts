import type { Locale, Localized } from "./i18n";

/** Localized URL paths. Serbian lives at the root, English under /en. */
export const pagePaths = {
  home: { sr: "/", en: "/en" },
  services: { sr: "/usluge", en: "/en/services" },
  prices: { sr: "/cenovnik", en: "/en/prices" },
  lookbook: { sr: "/lookbook", en: "/en/lookbook" },
  team: { sr: "/tim", en: "/en/team" },
  about: { sr: "/o-nama", en: "/en/about" },
  giftCards: { sr: "/poklon-vauceri", en: "/en/gift-cards" },
  reviews: { sr: "/utisci", en: "/en/reviews" },
  faq: { sr: "/cesta-pitanja", en: "/en/faq" },
  booking: { sr: "/zakazivanje", en: "/en/booking" },
  contact: { sr: "/kontakt", en: "/en/contact" },
  privacy: { sr: "/privatnost", en: "/en/privacy" },
} satisfies Record<string, Localized<string>>;

export type PageKey = keyof typeof pagePaths;

export const pageHref = (locale: Locale, key: PageKey) => pagePaths[key][locale];

export const serviceHref = (locale: Locale, slug: Localized<string>) => `${pagePaths.services[locale]}/${slug[locale]}`;

export const serviceAlternates = (slug: Localized<string>): Localized<string> => ({
  sr: serviceHref("sr", slug),
  en: serviceHref("en", slug),
});

/** Booking link with a service (and optionally a stylist) preselected. */
export const bookingHref = (locale: Locale, opts: { service?: string; stylist?: string } = {}) => {
  const q = new URLSearchParams();
  if (opts.service) q.set("usluga", opts.service);
  if (opts.stylist) q.set("stilista", opts.stylist);
  const s = q.toString();
  return `${pagePaths.booking[locale]}${s ? `?${s}` : ""}`;
};
