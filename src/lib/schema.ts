import { localeMeta, type Locale } from "./i18n";
import { absoluteUrl, site } from "./site";
import { pageHref, serviceHref } from "./routes";
import { reviews } from "@/content/reviews";
import { priceCategories, minPrice, maxPrice } from "@/content/prices";
import type { Service } from "@/content/services";

/** schema.org builders. Everything links back to one HairSalon node via @id. */

export const businessId = `${site.url}/#salon`;
export const websiteId = `${site.url}/#website`;

type Json = Record<string, unknown>;

export const graph = (...nodes: Json[]) => ({ "@context": "https://schema.org", "@graph": nodes });

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

/** The price list as an OfferCatalog — Google can read every price, unlike a JPG menu. */
function offerCatalog(locale: Locale): Json {
  return {
    "@type": "OfferCatalog",
    name: locale === "sr" ? "Cenovnik" : "Price list",
    url: absoluteUrl(pageHref(locale, "prices")),
    itemListElement: priceCategories.map((c) => ({
      "@type": "OfferCatalog",
      name: c.name[locale],
      itemListElement: c.items.map((i) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: i.name[locale] },
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RSD",
          ...(minPrice(i.price) === maxPrice(i.price)
            ? { price: minPrice(i.price) }
            : { minPrice: minPrice(i.price), maxPrice: maxPrice(i.price) }),
        },
      })),
    })),
  };
}

export function businessSchema(locale: Locale, description: string, withReviews = true): Json {
  return {
    "@type": ["HairSalon", "BeautySalon"],
    "@id": businessId,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    image: [absoluteUrl("/images/interior-room.jpg"), absoluteUrl("/images/look-golden-waves.jpg")],
    description,
    telephone: site.phone,
    email: site.email,
    priceRange: "1.200–18.500 RSD",
    currenciesAccepted: "RSD",
    paymentAccepted: "Cash, Credit Card, IPS QR",
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: locale === "sr" ? site.address.city : site.address.cityEn,
      postalCode: site.address.postal,
      addressRegion: site.address.district,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Dorćol, Beograd")}`,
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayNames[h.day],
      opens: hh(h.open),
      closes: hh(h.close),
    })),
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    knowsLanguage: ["sr", "en", "it"],
    aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.value, reviewCount: site.rating.count, bestRating: 5 },
    ...(withReviews
      ? {
          review: reviews.slice(0, 6).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            datePublished: r.date,
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.text[r.lang],
            inLanguage: r.lang,
          })),
        }
      : {}),
    hasOfferCatalog: offerCatalog(locale),
    sameAs: [site.instagramUrl],
  };
}

export function websiteSchema(locale: Locale, description: string): Json {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.name,
    description,
    publisher: { "@id": businessId },
    inLanguage: localeMeta[locale].hreflang,
  };
}

export function webPageSchema(opts: { locale: Locale; url: string; name: string; description: string; type?: string }): Json {
  return {
    "@type": opts.type ?? "WebPage",
    "@id": `${absoluteUrl(opts.url)}#webpage`,
    url: absoluteUrl(opts.url),
    name: opts.name,
    description: opts.description,
    inLanguage: localeMeta[opts.locale].hreflang,
    isPartOf: { "@id": websiteId },
    about: { "@id": businessId },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.url),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(locale: Locale, s: Service): Json {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(serviceHref(locale, s.slug))}#service`,
    name: s.title[locale],
    description: s.tagline[locale],
    serviceType: s.title[locale],
    provider: { "@id": businessId },
    areaServed: { "@type": "City", name: locale === "sr" ? "Beograd" : "Belgrade" },
    image: absoluteUrl(`/images/${s.image}.jpg`),
    offers: { "@type": "Offer", priceCurrency: "RSD", price: s.from, priceSpecification: { "@type": "PriceSpecification", minPrice: s.from, priceCurrency: "RSD" } },
  };
}
