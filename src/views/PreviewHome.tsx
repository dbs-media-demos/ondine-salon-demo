import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HomeView, type HeroKind } from "@/views/HomeView";
import { previewBiz } from "@/lib/preview";
import type { Locale } from "@/lib/i18n";

/**
 * A personalised preview's homepage (/for/<token>, /en/for/<token>, and their /v2 without 3D).
 * A business in the other language is sent to the same version under its own root.
 */
export async function previewHomeMetadata(locale: Locale, token: string): Promise<Metadata> {
  const biz = await previewBiz(token);
  const robots = { index: false, follow: false, googleBot: { index: false, follow: false } };
  if (!biz) return { title: "Preview not found", robots };
  const title = locale === "sr" ? `${biz.name} | Frizerski salon, ${biz.area}` : `${biz.name} | Hair & Beauty Salon in ${biz.area}`;
  const description =
    locale === "sr"
      ? `Šišanje, boja i nega kose — ${biz.area}. Zakažite termin: ${biz.phoneDisplay || "online"}.`
      : `Cuts, colour and care in ${biz.area}. Book online or call ${biz.phoneDisplay || "us"}.`;
  return {
    title: { absolute: title },
    description,
    robots,
    alternates: { canonical: null, languages: {} },
    openGraph: { type: "website", siteName: biz.name, title, description, images: [] },
    twitter: { card: "summary", title, description },
  };
}

export async function PreviewHome({ locale, token, hero = "3d" }: { locale: Locale; token: string; hero?: HeroKind }) {
  const biz = await previewBiz(token);
  if (!biz) notFound();
  if (biz.lang !== locale) redirect(`${biz.lang === "en" ? "/en" : ""}/for/${token}${hero === "2d" ? "/v2" : ""}`);
  return <HomeView locale={locale} biz={biz} hero={hero} />;
}
