"use client";

import { useEffect, useState, type RefObject } from "react";
import type { Lock2D, LockState } from "@/components/fx/hair/lock2d";
import { whenIdle } from "@/components/fx/live3d";
import { PHONE_QUERY, prefersReducedMotion } from "@/lib/motion";

/**
 * The /v2 hero's lock of hair, drawn in canvas 2D (fx/hair/lock2d.ts): no three.js and no WebGL anywhere.
 * Desktops only (phones keep their photo); its code is fetched once the page has loaded, then the lock
 * lays itself across the masthead. Reduced motion gets it drawn once, at rest. Frames are drawn only while
 * the hero is on screen and the tab is visible.
 */
export function useHeroLock(o: {
  enabled: boolean;
  root: RefObject<HTMLElement | null>;
  front: RefObject<HTMLCanvasElement | null>;
  shadow: RefObject<HTMLCanvasElement | null>;
  state: RefObject<LockState>;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = o.root.current;
    const front = o.front.current;
    const shadow = o.shadow.current;
    if (!o.enabled || !root || !front || !shadow || window.matchMedia(PHONE_QUERY).matches) return;

    const abort = new AbortController();
    const off: (() => void)[] = [];
    let lock: Lock2D | undefined;

    void (async () => {
      if (!(await whenIdle(abort.signal, 300))) return;
      const { createLock2D, toViewBox } = await import("@/components/fx/hair/lock2d");
      if (abort.signal.aborted) return;
      const still = prefersReducedMotion();
      const l = createLock2D({ front, shadow, state: () => o.state.current, still });
      lock = l;
      setOn(true);
      l.intro();

      let onScreen = true;
      const sync = () => l.setVisible(onScreen && document.visibilityState === "visible");
      const io = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        sync();
      });
      io.observe(root);
      const ro = new ResizeObserver(() => l.resize());
      ro.observe(root);
      document.addEventListener("visibilitychange", sync);
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", sync);
      });
      if (still) return;
      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const p = toViewBox(r, e.clientX, e.clientY);
        l.setPointer(p.x, p.y, e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom);
      };
      const onLeave = () => l.setPointer(800, 500, false);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      off.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      });
    })();

    return () => {
      abort.abort();
      off.forEach((f) => f());
      lock?.dispose();
    };
    // Mounted once; the props never change for a mounted hero
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return on;
}
