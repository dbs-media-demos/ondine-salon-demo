import type { ReactNode } from "react";
import { otherLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/i18n/dictionary";
import { pageHref, type PageKey } from "@/lib/routes";
import { alternateMap } from "@/lib/alternates";
import { graph, businessSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { telOf, type Biz } from "@/lib/biz-core";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header, type NavLink } from "./Header";
import { Footer } from "./Footer";
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

/**
 * Header, the page, footer, the phone bar and the demo pill. A personalised preview passes `biz`:
 * its name, phone and address replace Ondine's.
 */
export function SiteChrome({ locale, biz, children }: { locale: Locale; biz?: Biz; children: ReactNode }) {
  const d = getDictionary(locale);
  const link = (key: PageKey): NavLink => ({ key, label: d.nav[key], href: pageHref(locale, key), image: menuImages[key] });
  const primary = (["services", "prices", "lookbook", "team", "about"] as const).map(link);
  const all = (["home", "services", "prices", "lookbook", "team", "about", "giftCards", "reviews", "faq", "contact"] as const).map(link);
  const phone = biz ? biz.phoneDisplay : site.phone;
  const phoneHref = biz ? (telOf(biz) ?? "") : site.phoneHref;

  return (
    <>
      {!biz && <JsonLd data={graph(businessSchema(locale, d.brandLine, false), websiteSchema(locale, d.brandLine))} />}
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
        phone={phone}
        phoneHref={phoneHref}
        address={biz ? biz.address.full : `${site.address.street}, ${locale === "sr" ? site.address.city : site.address.cityEn}`}
        instagram={biz ? "" : site.instagram}
        instagramUrl={site.instagramUrl}
        brandName={biz?.shortName}
      />
      {children}
      <Footer locale={locale} biz={biz} />
      <MobileBar callLabel={d.call} bookLabel={d.book} phoneHref={phoneHref} bookHref={pageHref(locale, "booking")} />
      <DemoPill
        label={biz ? (locale === "sr" ? `Pregled za ${biz.shortName} · Scale by Noon` : `Preview for ${biz.shortName} · by Scale by Noon`) : d.demoPill}
        dismissLabel={d.demoDismiss}
      />
    </>
  );
}
