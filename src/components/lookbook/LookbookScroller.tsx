"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition, useRef, useState } from "react";
import clsx from "clsx";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export type LookSlide = {
  id: string;
  title: string;
  technique: string;
  stylist: string;
  service: string;
  image: string;
  alt: string;
  href: string;
  /** Shared-element name when this look is the first one for its service. */
  morph?: string;
};

// Where the photo ends up on each spread: full bleed, right half, left half, centred portrait.
const LAYOUTS = [
  { end: "inset(0% 0% 0% 0%)", cap: "left" },
  { end: "inset(0% 0% 0% 42%)", cap: "left" },
  { end: "inset(0% 42% 0% 0%)", cap: "right" },
  { end: "inset(8% 30% 8% 30%)", cap: "left" },
] as const;

/**
 * The lookbook: every look is a pinned spread. The photo opens from a small
 * window to its final crop, the oversized serif title rises letter by letter
 * and the issue counter ticks. Clicking a look opens the service it uses
 * (morphing the photo into the service hero where supported).
 */
export function LookbookScroller({ looks, labels }: { looks: LookSlide[]; labels: { look: string; by: string; open: string } }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;
      el.querySelectorAll<HTMLElement>("[data-spread]").forEach((spread, i) => {
        const layout = LAYOUTS[i % LAYOUTS.length];
        const frame = spread.querySelector("[data-frame]");
        const img = spread.querySelector("[data-img]");
        const chars = spread.querySelectorAll("[data-char]");
        const meta = spread.querySelectorAll("[data-meta]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: spread,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            onToggle: (self) => self.isActive && setActive(i),
          },
        });
        tl.fromTo(frame, { clipPath: "inset(30% 38% 30% 38%)" }, { clipPath: layout.end, duration: 0.55, ease: "power2.inOut" }, 0)
          .fromTo(img, { scale: 1.45 }, { scale: 1.02, duration: 0.8 }, 0)
          .fromTo(chars, { yPercent: 110 }, { yPercent: 0, stagger: 0.02, duration: 0.25, ease: "power3.out" }, 0.25)
          .fromTo(meta, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.2 }, 0.4)
          .to(img, { scale: 1.1, duration: 0.2 }, 0.8);
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="theme-ink relative">
      {/* Issue counter */}
      <div aria-hidden className="pointer-events-none sticky top-0 z-20 h-0">
        <div className="wrap flex justify-end pt-[calc(var(--header-h)+1rem)]">
          <p className="t-eyebrow flex items-center gap-3 text-cream mix-blend-difference">
            {labels.look}
            <span className="relative inline-block h-[1.2em] w-[2ch] overflow-hidden">
              <span className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-[var(--ease-out-expo)]" style={{ transform: `translateY(${-active * 1.2}em)` }}>
                {looks.map((_, i) => (
                  <span key={i} className="h-[1.2em] leading-[1.2em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                ))}
              </span>
            </span>
            / {String(looks.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      {looks.map((l, i) => {
        const layout = LAYOUTS[i % LAYOUTS.length];
        const photo = (
          <div data-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: layout.end }}>
            <div data-img className="absolute inset-0">
              <Image src={l.image} alt={l.alt} fill sizes="100vw" quality={75} className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          </div>
        );
        return (
          <section key={l.id} data-spread className="relative h-[220vh]" aria-labelledby={`look-${l.id}`}>
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <Link href={l.href} data-cursor={labels.open} className="absolute inset-0 block" aria-label={`${l.title} — ${labels.open}`}>
                {l.morph ? (
                  <ViewTransition name={l.morph} share="morph" default="none">
                    {photo}
                  </ViewTransition>
                ) : (
                  photo
                )}
              </Link>
              <div
                className={clsx(
                  "pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-24 md:pb-14",
                  layout.cap === "right" && "text-right",
                )}
              >
                <div className="wrap">
                  <p data-meta className="t-eyebrow mb-4 text-blush">
                    Look {String(i + 1).padStart(2, "0")} · {l.technique}
                  </p>
                  <h2 id={`look-${l.id}`} className="font-serif text-[clamp(4.2rem,15vw,17rem)] italic leading-[0.8] tracking-[-0.04em] text-cream" aria-label={l.title}>
                    {l.title.split("").map((ch, k) => (
                      <span key={k} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
                        <span data-char className="inline-block">
                          {ch === " " ? " " : ch}
                        </span>
                      </span>
                    ))}
                  </h2>
                  <p data-meta className="mt-5 text-[0.95rem] text-cream/80">
                    {labels.by} {l.stylist} · <span className="underline underline-offset-4">{l.service}</span> →
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
