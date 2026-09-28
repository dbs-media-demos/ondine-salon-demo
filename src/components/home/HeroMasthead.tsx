"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { MASTHEAD } from "@/components/brand/hero-paths";
import { Magnetic } from "@/components/ui/Magnetic";
import { OpenBadge } from "@/components/ui/OpenBadge";
import type { Locale } from "@/lib/i18n";

// Desktop: masthead laid out across a 1600×1000 stage.
const D = { s: 1500 / MASTHEAD.width, x: 50, y: 350 };
const dOrigin = { x: D.x + MASTHEAD.zoomX * D.s, y: D.y + MASTHEAD.zoomY * D.s };
// Phones: the masthead runs up the right edge like a magazine spine (400×860 stage).
const M = { s: 680 / MASTHEAD.width, tx: 272, ty: 770 };
const mOrigin = { x: M.tx + MASTHEAD.zoomY * M.s, y: M.ty - MASTHEAD.zoomX * M.s };

type Props = {
  locale: Locale;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  srTitle: string;
  after: string;
  afterSub: string;
  bookHref: string;
  bookLabel: string;
  pricesHref: string;
  pricesLabel: string;
  scrollLabel: string;
};

/**
 * The hero: a giant Didone masthead is cut out of the paper, with a slow-motion
 * hair video playing inside the letters. Scrolling flies the camera into the "I"
 * until the video fills the screen. The intro is CSS-only (LCP-safe); the
 * scroll scene is GSAP, skipped for reduced motion.
 */
export function HeroMasthead(p: Props) {
  const root = useRef<HTMLElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      const v = video.current;
      if (!el || !v) return;
      const reduced = prefersReducedMotion();
      const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;

      // Start the video well after first paint (or on first interaction), so it never competes with LCP.
      let idle = 0;
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        v.src = v.dataset.src!;
        v.load();
        v.play().catch(() => {});
        v.addEventListener("playing", () => v.classList.remove("opacity-0"), { once: true });
      };
      const kick = () => start();
      if (!reduced && !conn?.saveData) {
        idle = window.setTimeout(start, 3500);
        ["pointermove", "touchstart", "wheel", "keydown"].forEach((e) => window.addEventListener(e, kick, { once: true, passive: true }));
      }

      if (reduced) return;

      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop;
        const zoom = el.querySelector<SVGGElement>(desktop ? "[data-zoom='d']" : "[data-zoom='m']");
        const o = desktop ? dOrigin : mOrigin;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          // Our own pin-spacer: GSAP would otherwise re-parent the hero after hydration,
          // which resets the LCP candidate and delays LCP.
          scrollTrigger: { trigger: el, start: "top top", end: "+=150%", scrub: 0.8, pin: true, pinSpacer: spacer.current, anticipatePin: 1 },
        });
        tl.to("[data-hero-fade]", { opacity: 0, y: -50, duration: 0.18, stagger: 0.02 }, 0)
          .fromTo(zoom, { scale: 1 }, { scale: desktop ? 70 : 55, svgOrigin: `${o.x} ${o.y}`, ease: "power3.in", duration: 0.72 }, 0.06)
          .fromTo("[data-hero-shade]", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.62)
          .fromTo("[data-hero-after]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.7);
      });

      return () => {
        mm.revert();
        window.clearTimeout(idle);
        ["pointermove", "touchstart", "wheel", "keydown"].forEach((e) => window.removeEventListener(e, kick));
      };
    },
    { scope: root },
  );

  const letters = <path d={MASTHEAD.d} fill="#000" />;
  const big = { x: -20000, y: -20000, width: 40000, height: 40000 };

  return (
    <div ref={spacer}>
    <section ref={root} aria-labelledby="hero-title" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
      {/* Video layer (poster image first for a fast LCP) */}
      <div className="absolute inset-0">
        <Image src="/video/hero.jpg" alt="" fill preload sizes="100vw" quality={60} className="object-cover" />
        <video
          ref={video}
          data-src="/video/hero.mp4"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
        />
        <div data-hero-shade className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-ink/10 opacity-0" />
      </div>

      {/* Paper with the masthead cut out of it */}
      <div aria-hidden className="absolute inset-0">
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 hidden h-full w-full overflow-visible md:block">
          <defs>
            <mask id="hero-mask-d" maskUnits="userSpaceOnUse" {...big}>
              <rect {...big} fill="#fff" />
              <g data-zoom="d">
                <g transform={`translate(${D.x} ${D.y}) scale(${D.s})`}>
                  <g className="masthead-letters">{letters}</g>
                </g>
              </g>
            </mask>
          </defs>
          <rect {...big} fill="var(--cream)" mask="url(#hero-mask-d)" />
        </svg>
        <svg viewBox="0 0 400 860" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full overflow-visible md:hidden">
          <defs>
            <mask id="hero-mask-m" maskUnits="userSpaceOnUse" {...big}>
              <rect {...big} fill="#fff" />
              <g data-zoom="m">
                <g transform={`translate(${M.tx} ${M.ty}) rotate(-90) scale(${M.s})`}>
                  <g className="masthead-letters">{letters}</g>
                </g>
              </g>
            </mask>
          </defs>
          <rect {...big} fill="var(--cream)" mask="url(#hero-mask-m)" />
        </svg>
      </div>

      {/* Copy on the paper */}
      <div className="relative z-10 flex h-full flex-col justify-between pb-24 pt-[calc(var(--header-h)+1.25rem)] text-ink md:pb-10">
        <div className="wrap" data-hero-fade>
          <div className="anim-fade flex items-start justify-between gap-6" style={{ ["--d" as string]: "0.3s" }}>
            <p className="t-eyebrow max-w-[14rem] leading-relaxed md:max-w-none">{p.eyebrow}</p>
            <span className="hidden md:block">
              <OpenBadge locale={p.locale} className="t-eyebrow" />
            </span>
          </div>
        </div>

        <div className="wrap grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <h1 id="hero-title" data-hero-fade className="max-w-[58%] font-serif text-[clamp(2.3rem,5.4vw,5.6rem)] leading-[0.95] tracking-[-0.025em] md:max-w-[14ch]">
            <span className="sr-only">{p.srTitle} </span>
            <span className="anim-heading block" style={{ ["--d" as string]: "0.15s" }}>
              {p.titleLead}
            </span>
            <em className="anim-heading block" style={{ ["--d" as string]: "0.28s" }}>
              {p.titleAccent}
            </em>
          </h1>
          <div data-hero-fade className="max-w-[58%] md:max-w-none">
          <div className="anim-fade flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "0.5s" }}>
            <Magnetic>
              <Link href={p.bookHref} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-wine px-7 font-medium text-cream transition-colors duration-500 hover:bg-ink">
                {p.bookLabel} <span aria-hidden>→</span>
              </Link>
            </Magnetic>
            <Link href={p.pricesHref} className="link-draw hidden min-h-11 items-center font-medium sm:inline-flex">
              {p.pricesLabel}
            </Link>
          </div>
          </div>
        </div>

        {/* Revealed once the camera is inside the letter */}
        <div data-hero-after className="pointer-events-none absolute inset-x-0 bottom-28 opacity-0 md:bottom-16">
          <div className="wrap text-cream">
            <p className="t-eyebrow mb-5 text-blush">{p.afterSub}</p>
            <p className="t-h1 max-w-[16ch]">{p.after}</p>
          </div>
        </div>
      </div>

      <div data-hero-fade aria-hidden className="t-eyebrow absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-ink md:flex">
        {p.scrollLabel}
        <span className="relative h-10 w-px overflow-hidden bg-ink/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-in-out-quart)_infinite] bg-ink" />
        </span>
      </div>
    </section>
    </div>
  );
}
