import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { BizProvider } from "@/components/preview/BizContext";
import { PreviewGuard } from "@/components/preview/PreviewGuard";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { previewBiz } from "@/lib/preview";

/**
 * A personalised preview made in the Scale by Noon CRM: this homepage with a real business's
 * name, phone, address, hours and rating. The site is bilingual, so a Serbian business gets this
 * root and the other language is sent to /en/for. i18n/sr-preview generalises Ondine's review lines (ReviewCard).
 */
export default async function PreviewLayout({ children, params }: { children: ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  const biz = await previewBiz(token);
  if (!biz) notFound();
  if (biz.lang !== "sr") redirect(`/en/for/${token}`);
  return (
    <BizProvider biz={biz}>
      <SiteChrome locale="sr" biz={biz}>
        {children}
      </SiteChrome>
      <PreviewGuard />
    </BizProvider>
  );
}
