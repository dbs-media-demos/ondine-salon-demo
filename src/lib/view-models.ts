import type { Locale } from "./i18n";
import { bookingHref, serviceHref } from "./routes";
import { img } from "@/content/images";
import { team, type Stylist } from "@/content/team";
import { looks } from "@/content/looks";
import { serviceById, services } from "@/content/services";
import { formatRsd } from "@/content/prices";
import { getDictionary } from "@/i18n/dictionary";
import type { StylistCardData } from "@/components/team/StylistCard";
import type { RailLook } from "@/components/home/LookbookRail";
import type { ServiceRow } from "@/components/home/ServiceIndex";

export function stylistCard(locale: Locale, s: Stylist): StylistCardData {
  const d = getDictionary(locale);
  const first = s.name.split(" ")[0];
  return {
    id: s.id,
    name: s.name,
    role: s.role[locale],
    years: locale === "sr" ? `${s.years} god. iskustva` : `${s.years} yrs experience`,
    portrait: img[s.portrait].src,
    portraitAlt: locale === "sr" ? `${s.name}, ${s.role.sr}` : `${s.name}, ${s.role.en}`,
    specialties: s.specialties[locale],
    works: s.works.map((w, i) => ({ src: img[w].src, alt: locale === "sr" ? `Rad: ${first}, ${i + 1}` : `Work by ${first}, ${i + 1}` })),
    bookHref: bookingHref(locale, { stylist: s.id }),
    bookLabel: d.bookWith(locale === "sr" ? s.genitive : first),
    quote: s.quote[locale],
  };
}

export const stylistCards = (locale: Locale) => team.map((s) => stylistCard(locale, s));

export function railLooks(locale: Locale): RailLook[] {
  return looks.map((l, i) => ({
    id: l.id,
    n: String(i + 1).padStart(2, "0"),
    title: l.title[locale],
    technique: l.technique[locale],
    image: img[l.image].src,
    alt: l.alt[locale],
    href: serviceHref(locale, serviceById(l.service).slug),
  }));
}

export function serviceRows(locale: Locale): ServiceRow[] {
  const d = getDictionary(locale);
  return services.map((s) => ({
    id: s.id,
    num: s.num,
    title: s.title[locale],
    tagline: s.tagline[locale],
    href: serviceHref(locale, s.slug),
    image: img[s.image].src,
    alt: s.alt[locale],
    from: `${d.from} ${formatRsd(s.from, locale)}`,
  }));
}
