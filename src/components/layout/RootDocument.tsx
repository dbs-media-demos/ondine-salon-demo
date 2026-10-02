import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { localeMeta, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";

/** The <html> document shared by the Serbian and English root layouts. Header, footer and the rest come from SiteChrome. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const d = getDictionary(locale);
  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables} suppressHydrationWarning>
      <body className="theme-cream min-h-screen">
        <a
          href="#main"
          className="t-eyebrow fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-wine px-5 py-3 text-cream focus:translate-y-0"
        >
          {d.skip}
        </a>
        <SmoothScroll />
        {children}
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
