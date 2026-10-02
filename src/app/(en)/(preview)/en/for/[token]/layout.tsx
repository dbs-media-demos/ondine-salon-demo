import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { BizProvider } from "@/components/preview/BizContext";
import { PreviewGuard } from "@/components/preview/PreviewGuard";
import { Translate, translateGateCss } from "@/components/preview/Translate";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { previewBiz } from "@/lib/preview";
import { enPreview } from "@/i18n/en-preview";

/**
 * A personalised preview made in the Scale by Noon CRM: this homepage with a real business's
 * name, phone, address, hours and rating. The site is bilingual, so a English-speaking business gets this
 * root and the other language is sent to /for. i18n/en-preview generalises Ondine's local lines.
 */
export default async function PreviewLayout({ children, params }: { children: ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  const biz = await previewBiz(token);
  if (!biz) notFound();
  if (biz.lang !== "en") redirect(`/for/${token}`);
  return (
    <BizProvider biz={biz}>
      {Object.keys(enPreview).length > 0 && (
        <>
          <style>{translateGateCss}</style>
          <Translate dict={enPreview} />
        </>
      )}
      <SiteChrome locale="en" biz={biz}>
        {children}
      </SiteChrome>
      <PreviewGuard />
    </BizProvider>
  );
}
