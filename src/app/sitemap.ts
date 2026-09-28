import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { pagePaths, serviceAlternates } from "@/lib/routes";
import { services } from "@/content/services";
import type { Localized } from "@/lib/i18n";

const UPDATED = new Date("2026-09-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const pairs: { pair: Localized<string>; priority: number }[] = [
    ...Object.entries(pagePaths).map(([key, pair]) => ({
      pair,
      priority: key === "home" ? 1 : ["prices", "booking", "services"].includes(key) ? 0.9 : key === "privacy" ? 0.2 : 0.7,
    })),
    ...services.map((s) => ({ pair: serviceAlternates(s.slug), priority: 0.8 })),
  ];
  // One <url> per language version, each listing both alternates (hreflang).
  return pairs.flatMap(({ pair, priority }) =>
    (["sr", "en"] as const).map((locale) => ({
      url: absoluteUrl(pair[locale]),
      lastModified: UPDATED,
      changeFrequency: "monthly" as const,
      priority: locale === "sr" ? priority : Math.max(0.1, +(priority - 0.1).toFixed(1)),
      alternates: { languages: { sr: absoluteUrl(pair.sr), en: absoluteUrl(pair.en), "x-default": absoluteUrl(pair.sr) } },
    })),
  );
}
