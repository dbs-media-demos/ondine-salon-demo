"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, useGSAP, isTouch, prefersReducedMotion } from "@/lib/gsap";

export type ServiceRow = { id: string; num: string; title: string; tagline: string; href: string; image: string; alt: string; from: string };

/**
 * Editorial index of services. On desktop a photo floats after the cursor and
 * swaps (with a mask wipe) as you move between rows. Phones get inline thumbnails.
 */
export function ServiceIndex({ rows, cursorLabel }: { rows: ServiceRow[]; cursorLabel: string }) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      const f = float.current;
      if (!el || !f || isTouch()) return;
      const reduced = prefersReducedMotion();
      const xTo = gsap.quickTo(f, "x", { duration: reduced ? 0 : 0.9, ease: "power3.out" });
      const yTo = gsap.quickTo(f, "y", { duration: reduced ? 0 : 0.9, ease: "power3.out" });
      const rTo = gsap.quickTo(f, "rotation", { duration: 1.2, ease: "power3.out" });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
        if (!reduced) rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4));
        lastX = e.clientX;
      };
      el.addEventListener("pointermove", move);
      return () => el.removeEventListener("pointermove", move);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-line">
        {rows.map((r, i) => (
          <li key={r.id} className="border-b border-line">
            <Link
              href={r.href}
              data-cursor={cursorLabel}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid grid-cols-[2.2rem_1fr_auto] items-center gap-x-4 py-6 md:grid-cols-[4rem_1.1fr_1fr_auto] md:gap-x-8 md:py-9"
            >
              <span className="t-eyebrow self-start pt-3 text-muted md:pt-5">{r.num}</span>
              <span className="font-serif text-[clamp(2.1rem,6vw,6.2rem)] leading-[0.95] tracking-[-0.03em] transition-[transform,color] duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:italic group-hover:text-wine">
                {r.title}
              </span>
              <span className="hidden max-w-sm text-[0.98rem] leading-relaxed text-muted md:block">{r.tagline}</span>
              <span className="flex items-center gap-4">
                <span className="relative h-16 w-12 shrink-0 overflow-hidden md:hidden">
                  <Image src={r.image} alt="" fill sizes="96px" className="object-cover" />
                </span>
                <span className="hidden whitespace-nowrap text-[0.9rem] md:block">{r.from}</span>
                <span
                  aria-hidden
                  className="hidden h-12 w-12 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-wine group-hover:bg-wine group-hover:text-cream md:grid"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Floating preview (desktop, pointer only) */}
      <div
        ref={float}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-20 hidden [@media(hover:hover)]:md:block"
      >
        <div
          className="relative -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-[clip-path,opacity] duration-700 ease-[var(--ease-out-expo)]"
          style={{
            width: "clamp(220px, 20vw, 340px)",
            aspectRatio: "3 / 4",
            clipPath: active === null ? "inset(50% 50% 50% 50%)" : "inset(0 0 0 0)",
            opacity: active === null ? 0 : 1,
          }}
        >
          {rows.map((r, i) => (
            <div
              key={r.id}
              className={clsx(
                "absolute inset-0 transition-[clip-path,transform] duration-[900ms] ease-[var(--ease-out-expo)]",
                active === i ? "z-10 [clip-path:inset(0_0_0_0)] scale-100" : "z-0 [clip-path:inset(100%_0_0_0)] scale-110",
              )}
            >
              <Image src={r.image} alt="" fill sizes="340px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
