"use client";

import Link from "next/link";
import { useRef } from "react";
import clsx from "clsx";
import { prefersReducedMotion, useDesktopMotion, PHONE_QUERY } from "@/lib/motion";
import { MASTHEAD } from "@/components/brand/hero-paths";
import { Magnetic } from "@/components/ui/Magnetic";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Stars } from "@/components/ui/Stars";
import { useHeroHair } from "@/components/home/useHeroHair";
import type { HeroState } from "@/components/fx/hair/heroScene";
import type { Locale } from "@/lib/i18n";

// Desktop: masthead laid out across a 1600×1000 stage.
const D = { s: 1500 / MASTHEAD.width, x: 50, y: 350 };
const dOrigin = { x: D.x + MASTHEAD.zoomX * D.s, y: D.y + MASTHEAD.zoomY * D.s };
// Phones: a sharp still of a real style (scripts/build-phone-hero.mjs).
const stillSizes = "100vw";
const avifStill = "/images/hero-phone-750.avif 750w, /images/hero-phone-1125.avif 1125w";
const webpStill = "/images/hero-phone-750.webp 750w, /images/hero-phone-1125.webp 1125w";
const DESKTOP_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
// Desktops: a still of the 3D scene's room behind the letters (scripts/render-hair-stills.mjs), framed at
// 1.5 × the masthead's box, so laid out at that size it lines up with the letters at any window shape.
const riverAvif = "/images/hair/river-1600.avif 1600w, /images/hair/river-2400.avif 2400w";
const riverWebp = "/images/hair/river-1600.webp 1600w, /images/hair/river-2400.webp 2400w";
const riverSizes = "150vw";

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
  /** A preview's business name, cut out of the paper instead of ONDINE. */
  name?: string;
  /** Phone first screen: the service line and the town line of the headline. */
  phoneService: string;
  phoneTown: string;
  /** "4.9 · 312 Google reviews"; undefined = the business has no rating. */
  rating?: { value: number; label: string };
  /** "Cuts from 2,200 RSD"; undefined where dinar prices don't apply. */
  fromPrice?: string;
  photoAlt: string;
  /** Desktop bar: Call shows the number ("" = no phone). */
  phone: string;
  phoneHref: string;
  callLabel: string;
};

/**
 * The hero: a giant serif masthead is cut out of the paper, and through the letters a river of copper
 * hair flows in a warm, dark room. On a desktop with a mouse that room is live 3D, and one lock of the
 * same hair pours in over the type and casts a soft shadow on the paper; the cursor combs through it
 * and the light follows. Scrolling flies the camera into the "I" and on into the hair. Everyone else
 * gets a still of the same room (phones: a real style photo). Heading, text and buttons are painted at
 * once and never animated in; the scroll scene is GSAP, skipped for reduced motion.
 */
export function HeroMasthead(p: Props) {
  const root = useRef<HTMLElement>(null);
  const spacer = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLCanvasElement>(null);
  const front = useRef<HTMLCanvasElement>(null);
  const state = useRef<HeroState>({ zoom: 1, progress: 0 });
  const live = useHeroHair({ root, back, front, state, origin: dOrigin, named: !!p.name });

  useDesktopMotion(
    ({ gsap }) => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return;

      const zoom = el.querySelector<SVGGElement>("[data-zoom='d']");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        // Our own pin-spacer: GSAP would otherwise re-parent the hero after hydration,
        // which resets the LCP candidate and delays LCP.
        scrollTrigger: { trigger: el, start: "top top", end: "+=150%", scrub: 0.8, pin: true, pinSpacer: spacer.current, anticipatePin: 1 },
      });
      tl.to("[data-hero-fade]", { opacity: 0, y: -50, duration: 0.18, stagger: 0.02 }, 0);
      // The camera flies into ONDINE's "I"; a preview's name has no fixed letter there, so its paper lifts away instead
      if (p.name) tl.to("[data-paper]", { opacity: 0, ease: "power2.in", duration: 0.6 }, 0.1);
      else tl.fromTo(zoom, { scale: 1 }, { scale: 70, svgOrigin: `${dOrigin.x} ${dOrigin.y}`, ease: "power3.in", duration: 0.72 }, 0.06);
      tl.fromTo("[data-hero-shade]", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.62).fromTo("[data-hero-after]", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.7);
      // The 3D camera follows the paper's zoom exactly
      tl.eventCallback("onUpdate", () => {
        state.current.progress = tl.progress();
        state.current.zoom = p.name || !zoom ? 1 : Number(gsap.getProperty(zoom, "scale")) || 1;
      });
    },
    root,
  );

  // A preview's name is set in the same serif, sized to fill the masthead's width
  const nameSize = p.name ? Math.min(2100, MASTHEAD.width / (p.name.length * 0.66)) : 0;
  const letters = p.name ? (
    <text
      x={MASTHEAD.width / 2}
      y={MASTHEAD.height / 2}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="var(--font-playfair), Georgia, serif"
      fontSize={nameSize}
      fill="#000"
      stroke="#000"
      strokeWidth={nameSize * 0.025}
      {...(p.name.length > 5 ? { textLength: MASTHEAD.width, lengthAdjust: "spacingAndGlyphs" } : {})}
    >
      {p.name.toUpperCase()}
    </text>
  ) : (
    <path d={MASTHEAD.d} fill="#000" />
  );
  const big = { x: -20000, y: -20000, width: 40000, height: 40000 };

  return (
    <div ref={spacer}>
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink phone:h-[calc(100svh-var(--bar-h)-5.25rem)] phone:max-h-[46rem] phone:min-h-[20rem]"
    >
      {/* One still for each device: the browser fetches only the one it shows */}
      <link rel="preload" as="image" type="image/avif" media={PHONE_QUERY} imageSrcSet={avifStill} imageSizes={stillSizes} fetchPriority="high" />
      <link rel="preload" as="image" type="image/avif" media={DESKTOP_QUERY} imageSrcSet={riverAvif} imageSizes={riverSizes} fetchPriority="high" />

      {/* The room behind the paper: a still first (phones: a real style photo), then the live 3D over it */}
      <div className="absolute inset-0 [container-type:size] phone:[container-type:normal]">
        <picture>
          <source media={PHONE_QUERY} type="image/avif" srcSet={avifStill} sizes={stillSizes} />
          <source media={PHONE_QUERY} type="image/webp" srcSet={webpStill} sizes={stillSizes} />
          <source type="image/avif" srcSet={riverAvif} sizes={riverSizes} />
          <img
            src="/images/hair/river-1600.webp"
            srcSet={riverWebp}
            sizes={riverSizes}
            width={2400}
            height={1500}
            alt={p.photoAlt}
            fetchPriority="high"
            className="absolute left-1/2 top-1/2 aspect-[1.6] w-[calc(1.5*min(100cqw,160cqh))] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover phone:inset-0 phone:aspect-auto phone:h-full phone:w-full phone:max-w-full phone:translate-x-0 phone:translate-y-0 phone:object-[50%_18%]"
          />
        </picture>
        <canvas ref={back} aria-hidden className={clsx("absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 phone:hidden", live && "opacity-100")} />
        <div data-hero-shade className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-ink/10 opacity-0 phone:hidden" />
        {/* Phones: shade so the header and the copy read over the photo */}
        <div aria-hidden className="absolute inset-0 hidden bg-[linear-gradient(to_bottom,rgb(15_11_12/0.5),transparent_22%,transparent_38%,rgb(15_11_12/0.72)_66%,rgb(15_11_12/0.92))] phone:block" />
      </div>

      {/* Paper with the masthead cut out of it */}
      <div aria-hidden className="absolute inset-0 phone:hidden">
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
          <rect data-paper {...big} fill="var(--cream)" mask="url(#hero-mask-d)" />
        </svg>
      </div>
      {/* The lock over the type, and its shadow on the paper */}
      <canvas ref={front} aria-hidden className={clsx("pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 phone:hidden", live && "opacity-100")} />

      {/* Copy on the paper: always above the 3D */}
      <div className="relative z-10 flex h-full flex-col justify-between pb-24 pt-[calc(var(--header-h)+1.25rem)] text-ink md:pb-24 phone:justify-end phone:pb-5 phone:text-cream">
        <div className="wrap phone:hidden" data-hero-fade>
          <div className="flex items-start justify-between gap-6">
            <p className="t-eyebrow max-w-[14rem] leading-relaxed md:max-w-none">{p.eyebrow}</p>
            <span className="hidden md:block">
              <OpenBadge locale={p.locale} className="t-eyebrow" />
            </span>
          </div>
        </div>

        <div className="wrap grid items-end gap-8 md:grid-cols-[1fr_auto] phone:block">
          {p.rating && (
            <p className="mb-3 hidden items-center gap-2 text-[0.85rem] font-medium phone:flex">
              <Stars value={p.rating.value} className="text-[0.95rem] text-champagne" label={`${p.rating.value} / 5`} />
              {p.rating.label}
            </p>
          )}
          <h1
            id="hero-title"
            data-hero-fade
            className="max-w-[58%] font-serif text-[clamp(2.3rem,5.4vw,5.6rem)] leading-[0.95] tracking-[-0.025em] md:max-w-[14ch] phone:max-w-none phone:text-[clamp(1.8rem,9.8vw,3.25rem)] phone:leading-[1.02] phone:[overflow-wrap:anywhere]"
          >
            <span className="sr-only phone:hidden">{p.srTitle} </span>
            <span className="block phone:hidden">{p.titleLead}</span>
            <em className="block phone:hidden">{p.titleAccent}</em>
            <span className="hidden phone:block">{p.phoneService}</span>
            <em className="hidden font-normal phone:block">{p.phoneTown}</em>
          </h1>
          <p className="mt-3 hidden max-w-[34rem] text-[0.95rem] leading-snug text-cream/85 phone:block">
            <em className="font-serif text-[1.05em]">
              {p.titleLead} {p.titleAccent}
            </em>{" "}
            {p.after}
          </p>
          {/* min-height: the live badge replaces its text after hydration, and nothing may move */}
          <div className="mt-3 hidden min-h-6 items-center gap-x-3 whitespace-nowrap text-[0.82rem] phone:flex">
            {p.fromPrice && <span className="font-medium text-blush">{p.fromPrice}</span>}
            {p.fromPrice && <span aria-hidden className="h-3 w-px shrink-0 bg-cream/30" />}
            <span className="min-w-0 truncate text-cream/85">
              <OpenBadge locale={p.locale} short />
            </span>
          </div>
          <div data-hero-fade className="max-w-[58%] md:max-w-none phone:hidden">
            {/* Desktop: the rating and the "from" price sit right above the bar */}
            {(p.rating || p.fromPrice) && (
              <p className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.86rem] md:justify-end">
                {p.rating && (
                  <span className="inline-flex items-center gap-2 font-medium">
                    <Stars value={p.rating.value} className="text-[0.92rem] text-champagne" label={`${p.rating.value} / 5`} />
                    {p.rating.label}
                  </span>
                )}
                {p.rating && p.fromPrice && <span aria-hidden className="h-3 w-px bg-ink/25" />}
                {p.fromPrice && (
                  <Link href={p.pricesHref} className="link-draw font-medium text-wine">
                    {p.fromPrice}
                  </Link>
                )}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <Magnetic>
                <Link href={p.bookHref} className="inline-flex min-h-12 items-center gap-3 rounded-full bg-wine px-7 font-medium text-cream transition-colors duration-500 hover:bg-ink">
                  {p.bookLabel} <span aria-hidden>→</span>
                </Link>
              </Magnetic>
              {p.phoneHref ? (
                <a
                  href={p.phoneHref}
                  className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-ink/25 bg-cream/70 px-6 font-medium backdrop-blur-sm transition-colors duration-500 hover:border-ink hover:bg-cream"
                >
                  <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  </svg>
                  <span className="sr-only">{p.callLabel} </span>
                  {p.phone}
                </a>
              ) : (
                <Link href={p.pricesHref} className="link-draw hidden min-h-11 items-center font-medium sm:inline-flex">
                  {p.pricesLabel}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Revealed once the camera is inside the letter */}
        <div data-hero-after className="pointer-events-none absolute inset-x-0 bottom-28 opacity-0 md:bottom-16 phone:hidden">
          <div className="wrap text-cream">
            <p className="t-eyebrow mb-5 text-blush">{p.afterSub}</p>
            <p className="t-h1 max-w-[16ch]">{p.after}</p>
          </div>
        </div>
      </div>

      <div data-hero-fade aria-hidden className="t-eyebrow absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-ink md:flex phone:hidden">
        {p.scrollLabel}
        <span className="relative h-10 w-px overflow-hidden bg-ink/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_var(--ease-in-out-quart)_infinite] bg-ink" />
        </span>
      </div>
    </section>
    </div>
  );
}
