"use client";

import { useSyncExternalStore } from "react";
import clsx from "clsx";
import { openState } from "@/lib/hours";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";

// Re-evaluate once a minute; the server render shows the neutral hours line.
let cached: ReturnType<typeof openState> | null = null;
const subscribe = (cb: () => void) => {
  const id = window.setInterval(() => {
    cached = openState();
    cb();
  }, 60_000);
  return () => window.clearInterval(id);
};
const getSnapshot = () => (cached ??= openState());
const getServerSnapshot = () => null;

const hh = (h: number) => `${h}:00`;

/** Live "Open now · closes at 21:00" badge, computed in Belgrade time. */
export function OpenBadge({ locale, className }: { locale: Locale; className?: string }) {
  const d = getDictionary(locale).open;
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  let label = locale === "sr" ? "Uto–sub 9–21 h" : "Tue–Sat 9 am–9 pm";
  let open: boolean | null = null;
  if (state) {
    open = state.open;
    if (state.open) label = `${d.openNow} · ${d.closesAt(hh(state.closes))}`;
    else {
      const day = state.inDays === 0 ? d.today : state.inDays === 1 ? d.tomorrow : d.days[state.nextDay];
      label = `${d.closed} · ${d.opensAt(day, hh(state.opens))}`;
    }
  }

  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className={clsx(
          "h-2 w-2 shrink-0 rounded-full",
          open === null ? "bg-current opacity-40" : open ? "live-dot bg-[#3f8f5a] text-[#3f8f5a]" : "bg-nude",
        )}
      />
      <span>{label}</span>
    </span>
  );
}
