"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Desktop cursor: a small ink dot that grows into a wine disc with a label
 * over anything marked data-cursor="Label". Native cursor stays for accessibility.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
    let current = "";
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      const next = target?.getAttribute("data-cursor") ?? "";
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to(el, { opacity: 1, duration: 0.3 });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[200]">
      <div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-wine text-cream transition-[width,height,opacity] duration-500 ease-[var(--ease-out-expo)]"
        style={{ width: label ? 104 : 8, height: label ? 104 : 8, opacity: label ? 0.95 : 0.9 }}
      >
        <span className="t-eyebrow whitespace-nowrap transition-opacity duration-300" style={{ opacity: label ? 1 : 0 }}>
          {label}
        </span>
      </div>
    </div>
  );
}
