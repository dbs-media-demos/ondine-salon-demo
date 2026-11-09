"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { PHONE_QUERY } from "@/lib/motion";
import { afterLoad, canRun3D } from "@/components/home/useHeroHair";
import type { ShadeCard as Scene } from "@/components/fx/hair/shadeScene";

export type ShadeView = {
  id: string;
  name: string;
  description: string;
  /** "Balayage · 3 h 30 min" */
  service: string;
  /** "od 10.500 RSD"; undefined where dinar prices don't apply */
  price?: string;
  /** "Kolorista: Mila Radić"; undefined on previews (the team is Ondine's) */
  stylist?: string;
  bookHref: string;
  root: string;
  tip: string;
};

/** Where each tress hangs in the still, as a share of its width (the scene's camera fits the card's height). */
const tressX = (i: number, n: number) => 0.5 + ((i - (n - 1) / 2) * 96) / 756;
const START = 2;

/**
 * "Find your shade": a colourist's swatch tresses, one per shade, and what each costs. Every device
 * gets the shade buttons and the answer as real text, over a still rendered from the 3D card
 * (scripts/render-hair-stills.mjs). On a desktop with a mouse, once the card comes near, the live 3D
 * fades in over the still: the cursor brushes through the tresses, scrolling stirs them, and the chosen
 * one swings forward into the light. Clicking a tress picks it, like the buttons.
 */
export function ShadeCard(p: { eyebrow: string; title: ReactNode; text: string; groupLabel: string; bookLabel: string; stillAlt: string; shades: ShadeView[] }) {
  const [sel, setSel] = useState(START);
  const [live, setLive] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<Scene | null>(null);
  const s = p.shades[sel];

  useEffect(() => {
    const el = stage.current;
    const cv = canvas.current;
    if (!el || !cv || !canRun3D()) return;
    let cancelled = false;
    const off: (() => void)[] = [];

    const start = async () => {
      let sc: Scene;
      try {
        const { createShades } = await import("@/components/fx/hair/shadeScene");
        if (cancelled) return;
        sc = await createShades(cv, { shades: p.shades.map((x) => ({ root: x.root, tip: x.tip })) });
        if (cancelled) return sc.dispose();
      } catch {
        return; // no WebGL: the still stays
      }
      scene.current = sc;
      sc.select(START);
      sc.onReady(() => !cancelled && setLive(true));
      const io = new IntersectionObserver(([e]) => sc.setVisible(e.isIntersecting));
      io.observe(el);
      const ro = new ResizeObserver(() => sc.resize());
      ro.observe(cv);
      let lastY = window.scrollY;
      const onScroll = () => {
        sc.stir(window.scrollY - lastY);
        lastY = window.scrollY;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("scroll", onScroll);
        sc.dispose();
        scene.current = null;
      });
    };

    // Fetched only when the card is near and the page has settled
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        off.push(afterLoad(() => void start(), 0));
      },
      { rootMargin: "800px 0px" },
    );
    near.observe(el);
    return () => {
      cancelled = true;
      near.disconnect();
      off.forEach((f) => f());
    };
    // Mounted once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (i: number) => {
    setSel(i);
    scene.current?.select(i);
  };

  const local = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  return (
    <div className="wrap grid items-center gap-x-16 gap-y-10 lg:grid-cols-[1.2fr_0.8fr] phone:gap-y-5">
      <div
        ref={stage}
        className={clsx("relative aspect-[1.4] w-full", live && "cursor-pointer")}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !scene.current) return;
          const { x, y } = local(e);
          scene.current.pointer(x, y, true);
        }}
        onPointerLeave={() => scene.current?.pointer(0, 0, false)}
        onClick={(e) => {
          if (!scene.current) return;
          const { x, y } = local(e as unknown as React.PointerEvent);
          const i = scene.current.pick(x, y);
          if (i >= 0) choose(i);
        }}
      >
        <picture>
          <source media={PHONE_QUERY} srcSet="/images/hair/shades-all-700.webp 700w, /images/hair/shades-all-1400.webp 1400w" sizes="100vw" />
          <img
            src="/images/hair/shades-sel-1400.webp"
            srcSet="/images/hair/shades-sel-700.webp 700w, /images/hair/shades-sel-1400.webp 1400w"
            sizes="(min-width: 1024px) 55vw, 100vw"
            width={1400}
            height={1000}
            alt={p.stillAlt}
            loading="lazy"
            decoding="async"
            className={clsx("absolute inset-0 h-full w-full transition-opacity duration-700", live && "opacity-0 delay-300")}
          />
        </picture>
        <canvas ref={canvas} aria-hidden className={clsx("absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700 phone:hidden", live && "opacity-100")} />
        {/* Phones: the still doesn't move, so a mark under the chosen tress says which one it is */}
        <span
          aria-hidden
          className="absolute bottom-[3%] hidden h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-wine transition-[left] duration-300 phone:block"
          style={{ left: `${tressX(sel, p.shades.length) * 100}%` }}
        />
      </div>

      <div>
        <p className="t-eyebrow mb-6 text-wine phone:mb-2">{p.eyebrow}</p>
        <h2 id="shades-title" className="t-h2 max-w-[13ch] phone:max-w-none">
          {p.title}
        </h2>
        <p className="t-lead mt-6 max-w-md text-muted phone:mt-2 phone:text-[0.92rem] phone:leading-snug">{p.text}</p>

        <div role="radiogroup" aria-label={p.groupLabel} className="mt-8 flex flex-wrap gap-2 phone:mt-4 phone:gap-1.5">
          {p.shades.map((x, i) => (
            <button
              key={x.id}
              type="button"
              role="radio"
              aria-checked={i === sel}
              onClick={() => choose(i)}
              className={clsx(
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 pr-4 text-[0.9rem] transition-colors duration-300 phone:min-h-10 phone:px-3 phone:text-[0.84rem]",
                i === sel ? "border-ink bg-ink text-cream" : "border-ink/20 hover:border-ink/60",
              )}
            >
              <span aria-hidden className="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: `linear-gradient(160deg, ${x.root}, ${x.tip})` }} />
              {x.name}
            </button>
          ))}
        </div>

        {/* The answer: always the same height, so choosing a shade never moves the page */}
        <div aria-live="polite" className="mt-8 border-t border-ink/15 pt-7 phone:mt-5 phone:pt-5">
          <p className="font-serif text-[clamp(2.4rem,3.6vw,3.4rem)] italic leading-none phone:text-[2rem]">{s.name}</p>
          <p className="mt-3 min-h-[3em] max-w-sm text-[0.98rem] leading-snug text-muted phone:min-h-[2.6em] phone:text-[0.9rem]">{s.description}</p>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[0.92rem] phone:mt-3 phone:text-[0.86rem]">
            <dt className="text-muted">{s.service.split(" · ")[0]}</dt>
            <dd className="text-right font-medium">{s.service.split(" · ")[1]}</dd>
            {s.price && (
              <>
                <dt className="text-muted">{s.stylist ?? ""}</dt>
                <dd className="text-right font-serif text-[1.35rem] leading-none text-wine">{s.price}</dd>
              </>
            )}
          </dl>
          <Link
            href={s.bookHref}
            className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-wine px-7 font-medium text-cream transition-colors duration-500 hover:bg-ink phone:mt-5 phone:w-full phone:justify-center"
          >
            {p.bookLabel} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
