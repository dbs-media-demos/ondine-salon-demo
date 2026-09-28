"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * A small rounded window onto a video loop that opens to full-bleed as you
 * scroll, while the headline scales down behind it. The video only loads
 * and plays while on screen (and never with reduced motion / Save-Data).
 */
export function VideoWindow({ src, poster, children, label }: { src: string; poster: string; children: ReactNode; label: string }) {
  const root = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const w = win.current;
      const v = video.current;
      if (!el || !w || !v) return;
      const reduced = prefersReducedMotion();
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

      let io: IntersectionObserver | null = null;
      if (!reduced && !conn?.saveData) {
        io = new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting) {
              if (!v.src) {
                v.src = src;
                v.load();
              }
              v.play().catch(() => {});
            } else v.pause();
          },
          { rootMargin: "200px" },
        );
        io.observe(el);
      }
      if (reduced) {
        gsap.set(w, { clipPath: "inset(0% 0% 0% 0% round 0px)" });
        return () => io?.disconnect();
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "+=110%", scrub: 0.6, pin: true, anticipatePin: 1 },
      });
      tl.fromTo(w, { clipPath: "inset(24% 34% 24% 34% round 999px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 }, 0)
        .fromTo(v, { scale: 1.35 }, { scale: 1, duration: 1 }, 0)
        .fromTo("[data-vw-text]", { scale: 1.08 }, { scale: 0.9, duration: 1 }, 0)
        .fromTo("[data-vw-text]", { color: "#0f0b0c" }, { color: "#f4ede4", duration: 0.25 }, 0.35);
      return () => io?.disconnect();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label={label} className="theme-cream relative h-[100svh] overflow-hidden">
      <div ref={win} className="absolute inset-0 overflow-hidden [clip-path:inset(0_0_0_0)]">
        <Image src={poster} alt="" fill sizes="100vw" quality={60} className="object-cover" />
        <video ref={video} muted loop playsInline preload="none" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/40" />
      </div>
      <div data-vw-text className="pointer-events-none relative z-10 flex h-full items-center justify-center px-[var(--gutter)] text-center text-cream">
        {children}
      </div>
    </section>
  );
}
