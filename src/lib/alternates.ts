import type { Locale, Localized } from "./i18n";
import { pagePaths, serviceAlternates } from "./routes";
import { services } from "@/content/services";

/** Every page on the site as a pair of language versions. */
export function allPagePairs(): Localized<string>[] {
  return [...Object.values(pagePaths), ...services.map((s) => serviceAlternates(s.slug))];
}

/** pathname in `from` locale → same page in the other locale (for the language switch). */
export function alternateMap(from: Locale): Record<string, string> {
  const to: Locale = from === "sr" ? "en" : "sr";
  return Object.fromEntries(allPagePairs().map((p) => [p[from], p[to]]));
}
