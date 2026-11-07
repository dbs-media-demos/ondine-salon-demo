"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/** Sticky bottom bar on phones: Call, showing the number, + Book. */
export function MobileBar({ callLabel, phone, bookLabel, phoneHref, bookHref }: { callLabel: string; phone: string; bookLabel: string; phoneHref: string; bookHref: string }) {
  const pathname = usePathname();
  const onBooking = pathname.startsWith(bookHref);
  const full = onBooking || !phoneHref;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] hidden border-t border-ink/10 bg-cream px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 phone:block">
      <div className={clsx("mx-auto grid max-w-xl gap-2", full ? "grid-cols-1" : "grid-cols-[1.35fr_1fr]")}>
        {phoneHref && (
          <a href={phoneHref} aria-label={`${callLabel} ${phone}`} className="flex min-h-12 min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-ink/25 px-2 text-[0.88rem] font-medium tabular-nums text-ink">
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
            </svg>
            {phone}
          </a>
        )}
        {!onBooking && (
          <Link href={bookHref} prefetch={false} className="flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-wine text-[0.95rem] font-medium text-cream">
            {bookLabel} <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
