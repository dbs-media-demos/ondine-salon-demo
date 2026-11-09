"use client";

import { useEffect, useState, type RefObject } from "react";
import type { HeroHair, HeroState } from "@/components/fx/hair/heroScene";

/** Live 3D only on a big screen with a mouse. Everything else keeps the still. */
export const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

/** The same check every live 3D scene on the site makes before it fetches any of its code. */
export function canRun3D() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(DESK_3D).matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !conn?.saveData;
}

/** Runs `cb` once the page has loaded and the browser is idle, never before `minMs` after navigation start. */
export function afterLoad(cb: () => void, minMs = 1200) {
  let t = 0;
  const idle = () => {
    const ric = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 120));
    t = window.setTimeout(() => ric(cb, { timeout: 1200 }), Math.max(0, minMs - performance.now()));
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  return () => {
    window.clearTimeout(t);
    window.removeEventListener("load", idle);
  };
}

/**
 * The hero's live hair. The server HTML carries a still rendered from this scene (scripts/render-hair-stills.mjs),
 * so phones and every other device show it at once. On a desktop with a mouse, after load, the scene's code is
 * fetched with `await import()` (three.js never reaches a phone), both canvases fade in over the still and the
 * lock pours in over the masthead. Frames are drawn only while the hero is on screen and the tab is visible.
 */
export function useHeroHair(o: {
  root: RefObject<HTMLElement | null>;
  back: RefObject<HTMLCanvasElement | null>;
  front: RefObject<HTMLCanvasElement | null>;
  state: RefObject<HeroState>;
  origin: { x: number; y: number };
  named: boolean;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = o.root.current;
    const back = o.back.current;
    const front = o.front.current;
    if (!root || !back || !front || !canRun3D()) return;

    let cancelled = false;
    let h: HeroHair | undefined;
    const off: (() => void)[] = [];

    const start = async () => {
      try {
        const { createHeroHair } = await import("@/components/fx/hair/heroScene");
        if (cancelled) return;
        h = await createHeroHair({ back, front, origin: o.origin, named: o.named, state: () => o.state.current });
        if (cancelled) return h.dispose();
      } catch {
        return; // no WebGL: the still stays
      }
      const scene = h;
      scene.onReady(() => {
        if (cancelled) return;
        setOn(true);
        scene.intro();
      });

      let onScreen = true;
      const sync = () => scene.setVisible(onScreen && document.visibilityState === "visible");
      const io = new IntersectionObserver(([e]) => {
        onScreen = e.isIntersecting;
        sync();
      });
      io.observe(root);
      const ro = new ResizeObserver(() => scene.resize());
      ro.observe(root);
      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        scene.setPointer(x * 2 - 1, y * 2 - 1, x >= 0 && x <= 1 && y >= 0 && y <= 1);
      };
      const onLeave = () => scene.setPointer(0, 0, false);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      document.addEventListener("visibilitychange", sync);
      off.push(() => {
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        document.removeEventListener("visibilitychange", sync);
      });
    };

    off.push(afterLoad(() => void start()));
    return () => {
      cancelled = true;
      off.forEach((f) => f());
      h?.dispose();
    };
    // Mounted once; the props never change for a mounted hero
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return on;
}
