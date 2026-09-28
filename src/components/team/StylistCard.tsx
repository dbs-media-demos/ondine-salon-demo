"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

export type StylistCardData = {
  id: string;
  name: string;
  role: string;
  years: string;
  portrait: string;
  portraitAlt: string;
  specialties: string[];
  works: { src: string; alt: string }[];
  bookHref: string;
  bookLabel: string;
  quote: string;
};

// Fan positions for the four work photos (x%, y%, rotation).
const FAN = [
  { x: -46, y: -8, r: -14 },
  { x: -16, y: -18, r: -5 },
  { x: 16, y: -18, r: 5 },
  { x: 46, y: -8, r: 14 },
];

/**
 * Stylist card. Hover (desktop) or tap (touch) fans the portrait out into four
 * photos of their work, and slides up specialties + "Book with …".
 */
export function StylistCard({ s, index, tapHint }: { s: StylistCardData; index: number; tapHint: string }) {
  const [open, setOpen] = useState(false);

  return (
    <article
      className="group/card relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <div className="relative aspect-[3/4]">
        {/* Work fan (behind the portrait) */}
        <div aria-hidden className="absolute inset-0">
          {s.works.map((w, i) => (
            <div
              key={w.src}
              className="absolute inset-[14%] overflow-hidden shadow-[0_24px_50px_-20px_rgba(15,11,12,0.55)] transition-transform duration-[900ms] ease-[var(--ease-out-expo)]"
              style={{
                transform: open ? `translate(${FAN[i].x}%, ${FAN[i].y}%) rotate(${FAN[i].r}deg) scale(0.72)` : "translate(0,0) rotate(0) scale(0.6)",
                transitionDelay: open ? `${i * 50}ms` : "0ms",
                zIndex: i,
              }}
            >
              <Image src={w.src} alt={w.alt} fill sizes="(min-width: 1024px) 14vw, 40vw" className="object-cover" />
            </div>
          ))}
        </div>

        {/* Portrait */}
        <div
          className="absolute inset-0 z-10 overflow-hidden transition-[transform,clip-path] duration-[900ms] ease-[var(--ease-out-expo)]"
          style={{
            transform: open ? "translateY(20%) scale(0.62)" : "none",
            clipPath: open ? "inset(0 0 0 0 round 999px 999px 0 0)" : "inset(0 0 0 0 round 0)",
          }}
        >
          <Image src={s.portrait} alt={s.portraitAlt} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw" className="object-cover" />
        </div>

        <span className="t-eyebrow absolute left-3 top-3 z-20 text-cream mix-blend-difference">{String(index + 1).padStart(2, "0")}</span>

        {/* Touch toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={`${tapHint}: ${s.name}`}
          className="absolute bottom-3 right-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-ink backdrop-blur [@media(hover:hover)]:hidden"
        >
          <span aria-hidden className={clsx("text-lg transition-transform duration-500", open && "rotate-45")}>+</span>
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-[1.75rem] leading-none">{s.name}</h3>
          <span className="text-[0.8rem] text-muted">{s.years}</span>
        </div>
        <p className="mt-2 text-[0.92rem] text-muted">{s.role}</p>
        <div
          className="grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)]"
          style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0.001 }}
        >
          <div className="overflow-hidden">
            <p className="pt-4 font-serif text-[1.05rem] italic leading-snug">“{s.quote}”</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {s.specialties.map((sp) => (
                <li key={sp} className="rounded-full border border-line px-3 py-1 text-[0.8rem]">
                  {sp}
                </li>
              ))}
            </ul>
            <Link
              href={s.bookHref}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-wine px-5 text-[0.9rem] font-medium text-cream transition-colors hover:bg-ink"
            >
              {s.bookLabel} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
