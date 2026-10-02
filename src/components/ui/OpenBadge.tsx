"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { openStatus } from "@/lib/biz-core";
import { useBiz } from "@/components/preview/BizContext";
import type { Locale } from "@/lib/i18n";

/** Live "Open now · closes at 21:00" badge in the business's time zone; the server render shows the neutral hours line. */
export function OpenBadge({ locale, className }: { locale: Locale; className?: string }) {
  const biz = useBiz();
  const [state, setState] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const tick = () => setState(openStatus({ ...biz, lang: locale }));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [biz, locale]);

  if (!biz.hours) return null;
  const label = state?.text ?? (biz.preview ? biz.hoursSummary : locale === "sr" ? "Uto–sub 9–21 h" : "Tue–Sat 9 am–9 pm");
  const open = state ? state.open : null;
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className={clsx(
          "h-2 w-2 shrink-0 rounded-full",
          open === null ? "bg-current opacity-40" : open ? "live-dot bg-[#3f8f5a] text-[#3f8f5a]" : "bg-nude",
        )}
      />
      <span suppressHydrationWarning>{label}</span>
    </span>
  );
}
