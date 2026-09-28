import type { ReactNode } from "react";
import { fontVariables } from "@/lib/fonts";
import { localeMeta, otherLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { pageHref, type PageKey } from "@/lib/routes";
import { alternateMap } from "@/lib/alternates";
import { graph, businessSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header, type NavLink } from "./Header";
import { Footer } from "./Footer";
import { SmoothScroll } from "./SmoothScroll";
import { Cursor } from "./Cursor";
import { MobileBar } from "./MobileBar";
import { DemoPill } from "./DemoPill";

const menuImages: Partial<Record<PageKey, string>> = {
  home: "/images/interior-arch.jpg",
  services: "/images/colour-painting.jpg",
  prices: "/images/product-pair.jpg",
  lookbook: "/images/look-golden-waves.jpg",
  team: "/images/team-mila.jpg",
  about: "/images/interior-room.jpg",
  giftCards: "/images/product-bronze.jpg",
  reviews: "/images/look-rust-smile.jpg",
  faq: "/images/interior-mirror.jpg",
  contact: "/images/interior-chairs.jpg",
};

/** The <html> document shared by the Serbian and English root layouts. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  const d = getDictionary(locale);
  const link = (key: PageKey): NavLink => ({ key, label: d.nav[key], href: pageHref(locale, key), image: menuImages[key] });
  const primary = (["services", "prices", "lookbook", "team", "about"] as const).map(link);
  const all = (["home", "services", "prices", "lookbook", "team", "about", "giftCards", "reviews", "faq", "contact"] as const).map(link);

  return (
    <html lang={localeMeta[locale].htmlLang} className={fontVariables} suppressHydrationWarning>
      <body className="theme-cream min-h-screen">
        <JsonLd data={graph(businessSchema(locale, d.brandLine, false), websiteSchema(locale, d.brandLine))} />
        <a
          href="#main"
          className="t-eyebrow fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-wine px-5 py-3 text-cream focus:translate-y-0"
        >
          {d.skip}
        </a>
        <SmoothScroll />
        <Header
          locale={locale}
          homeHref={pageHref(locale, "home")}
          bookHref={pageHref(locale, "booking")}
          bookLabel={d.book}
          menuLabel={d.menu}
          closeLabel={d.close}
          langLabel={d.langSwitch}
          primary={primary}
          all={all}
          altMap={alternateMap(locale)}
          otherHome={pageHref(otherLocale(locale), "home")}
          phone={site.phone}
          phoneHref={site.phoneHref}
          address={`${site.address.street}, ${locale === "sr" ? site.address.city : site.address.cityEn}`}
          instagram={site.instagram}
          instagramUrl={site.instagramUrl}
        />
        {children}
        <Footer locale={locale} />
        <MobileBar callLabel={d.call} bookLabel={d.book} phoneHref={site.phoneHref} bookHref={pageHref(locale, "booking")} />
        <DemoPill label={d.demoPill} dismissLabel={d.demoDismiss} />
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
