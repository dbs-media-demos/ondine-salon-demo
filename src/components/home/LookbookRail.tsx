"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, isTouch, prefersReducedMotion } from "@/lib/gsap";

export type RailLook = { id: string; n: string; title: string; technique: string; image: string; alt: string; href: string };

/**
 * "Issue 07" rail: a pinned horizontal scroll on desktop, where each photo
 * slides against its frame (inner parallax) and captions drift at their own
 * pace. Phones get a native swipe rail with scroll-snap.
 */
export function LookbookRail({
  looks,
  heading,
  eyebrow,
  allHref,
  allLabel,
  cursorLabel,
}: {
  looks: RailLook[];
  heading: React.ReactNode;
  eyebrow: string;
  allHref: string;
  allLabel: string;
  cursorLabel: string;
}) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const tr = track.current;
      if (!el || !tr || isTouch() || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const dist = () => tr.scrollWidth - window.innerWidth;
        const tween = gsap.to(tr, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${dist()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        tr.querySelectorAll<HTMLElement>("[data-inner]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            { xPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
        tr.querySelectorAll<HTMLElement>("[data-cap]").forEach((cap) => {
          gsap.fromTo(
            cap,
            { x: 80, opacity: 0.2 },
            { x: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: cap, containerAnimation: tween, start: "left 95%", end: "left 55%", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="theme-ink relative overflow-hidden" aria-labelledby="rail-title">
      <div className="flex min-h-[100svh] flex-col justify-center py-20 md:py-0">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory items-end gap-5 overflow-x-auto px-[var(--gutter)] md:w-max md:snap-none md:gap-[4vw] md:overflow-visible"
        >
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-end self-stretch pb-4 md:w-[34vw]">
            <p className="t-eyebrow mb-6 text-champagne">{eyebrow}</p>
            <h2 id="rail-title" className="t-h1">
              {heading}
            </h2>
          </div>
          {looks.map((l, i) => (
            <Link
              key={l.id}
              href={l.href}
              data-cursor={cursorLabel}
              className="group w-[72vw] shrink-0 snap-start md:w-auto"
              style={{ marginBottom: i % 2 ? "0" : "6vh" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden md:h-[62vh] md:w-auto">
                <div data-inner className="absolute -inset-x-[10%] inset-y-0">
                  <Image src={l.image} alt={l.alt} fill sizes="(min-width: 768px) 40vw, 72vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
                </div>
                <span className="t-eyebrow absolute left-4 top-4 text-cream mix-blend-difference">Look {l.n}</span>
              </div>
              <div data-cap className="mt-5 flex items-baseline justify-between gap-6">
                <p className="font-serif text-[clamp(1.8rem,2.6vw,2.8rem)] leading-none transition-[font-style] group-hover:italic">{l.title}</p>
                <p className="text-right text-[0.85rem] text-muted">{l.technique}</p>
              </div>
            </Link>
          ))}
          <Link
            href={allHref}
            className="group flex aspect-[3/4] w-[60vw] shrink-0 snap-start flex-col items-center justify-center gap-6 rounded-full border border-line text-center transition-colors duration-700 hover:bg-cream hover:text-ink md:h-[48vh] md:w-auto"
          >
            <span className="font-serif text-[clamp(2rem,3vw,3.2rem)] italic leading-none">{allLabel}</span>
            <span aria-hidden className="text-2xl transition-transform duration-700 group-hover:translate-x-2">→</span>
          </Link>
          <div className="w-px shrink-0 md:w-[4vw]" aria-hidden />
        </div>
      </div>
    </section>
  );
}
