import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeView } from "@/views/HomeView";
import { previewBiz } from "@/lib/preview";

// Always the CRM's current data: an edit there shows on the next reload
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const biz = await previewBiz((await params).token);
  const robots = { index: false, follow: false, googleBot: { index: false, follow: false } };
  if (!biz) return { title: "Preview not found", robots };
  const title = `${biz.name} | Frizerski salon, ${biz.area}`;
  const description = `Šišanje, boja i nega kose — ${biz.area}. Zakažite termin: ${biz.phoneDisplay || "online"}.`;
  return {
    title: { absolute: title },
    description,
    robots,
    alternates: { canonical: null, languages: {} },
    openGraph: { type: "website", siteName: biz.name, title, description, images: [] },
    twitter: { card: "summary", title, description },
  };
}

export default async function PreviewPage({ params }: Props) {
  const biz = await previewBiz((await params).token);
  if (!biz) notFound();
  return <HomeView locale="sr" biz={biz} />;
}
