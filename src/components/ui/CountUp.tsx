"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Number that counts up when scrolled into view. The final value is in the HTML. */
export function CountUp({ value, decimals = 0, className, locale = "sr" }: { value: number; decimals?: number; className?: string; locale?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === "sr" ? "sr-Latn-RS" : "en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);

  useGSAP(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const obj = { n: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          n: value,
          duration: 2,
          ease: "expo.out",
          onUpdate: () => {
            el.textContent = fmt(obj.n);
          },
        }),
    });
  });

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}
