import type { Metadata, Viewport } from "next";
import { site, siteUrl } from "./site";
import type { Locale } from "./i18n";
import { getDictionary } from "@/i18n/dictionary";

export function rootMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${site.name} — ${dict.descriptor}`, template: `%s | ${site.name}` },
    description: dict.brandLine,
    applicationName: site.name,
    authors: [{ name: "DBS Media", url: "https://dbs-media.com" }],
    creator: "DBS Media",
    publisher: site.name,
    category: "Beauty salon",
    formatDetection: { telephone: false, email: false, address: false },
    // Concept site: kept out of search engines unless NEXT_PUBLIC_NOINDEX === "false".
    robots: site.noindex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    other: {
      "geo.region": "RS-00",
      "geo.placename": locale === "sr" ? "Beograd" : "Belgrade",
      "geo.position": `${site.geo.lat};${site.geo.lng}`,
    },
  };
}

export const rootViewport: Viewport = {
  themeColor: "#f4ede4",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};
