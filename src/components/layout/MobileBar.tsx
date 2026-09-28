"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/** Sticky bottom bar on phones: Call + Book. */
export function MobileBar({ callLabel, bookLabel, phoneHref, bookHref }: { callLabel: string; bookLabel: string; phoneHref: string; bookHref: string }) {
  const pathname = usePathname();
  const onBooking = pathname.startsWith(bookHref);
  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] border-t border-ink/10 bg-cream/92 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <div className={clsx("grid gap-2", onBooking ? "grid-cols-1" : "grid-cols-[1fr_1.4fr]")}>
        <a href={phoneHref} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/25 text-[0.95rem] font-medium text-ink">
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
          </svg>
          {callLabel}
        </a>
        {!onBooking && (
          <Link href={bookHref} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-wine text-[0.95rem] font-medium text-cream">
            {bookLabel} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
