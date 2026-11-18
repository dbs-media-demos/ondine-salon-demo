"use client";

import { useEffect, useState, type RefObject } from "react";
import type { HeroHair, HeroState } from "@/components/fx/hair/heroScene";
import { canRun3D, fallBack, frameWatch, hasGpu, inTurn, onFallBack, stillsOnly, whenIdle } from "@/components/fx/live3d";

/**
 * The hero's live hair. The server HTML carries a still rendered from this scene (scripts/render-hair-stills.mjs),
 * so phones and every other device show it at once. On a desktop with a mouse and a real graphics chip, once
 * the page has loaded and gone idle, the scene's code is fetched with `await import()` (three.js never
 * reaches a phone), built, compiled and drawn once unseen; only then do both canvases fade in over the still
 * and the lock pours in over the masthead. If its first 2 s on screen run under ~45 fps, the canvases fade
 * back to the still and the renderer is freed (live3d.ts). Frames are drawn only while the hero is on screen
 * and the tab is visible.
 */
export function useHeroHair(o: {
  root: RefObject<HTMLElement | null>;
  back: RefObject<HTMLCanvasElement | null>;
  front: RefObject<HTMLCanvasElement | null>;
  state: RefObject<HeroState>;
  origin: { x: number; y: number };
  named: boolean;
  /** false on /v2, which has no 3D: three.js is never fetched. */
  enabled?: boolean;
}) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = o.root.current;
    const back = o.back.current;
    const front = o.front.current;
    if (o.enabled === false || !root || !back || !front || !canRun3D()) return;

    const abort = new AbortController();
    const cancelled = () => abort.signal.aborted;
    let h: HeroHair | undefined;
    const off: (() => void)[] = [];
    let release = () => {};
    let gone = 0;

    // The canvases fade back to the still (CSS, 1 s), then the renderer is freed
    const giveUp = () => {
      if (!h || cancelled()) return;
      const scene = h;
      scene.stop();
      off.forEach((f) => f());
      off.length = 0;
      setOn(false);
      release();
      gone = window.setTimeout(() => {
        scene.dispose();
        if (h === scene) h = undefined;
      }, 1100);
    };

    // The next scene down the page warms up only once this one has passed its first 2 s on screen (or 5 s on)
    void inTurn(async () => {
      if (!(await whenIdle(abort.signal, 1200)) || stillsOnly() || !hasGpu()) return;
      performance.mark("3d:hero:start");
      try {
        const { createHeroHair } = await import("@/components/fx/hair/heroScene");
        if (cancelled()) return;
        const watch = frameWatch((ok) => {
          performance.mark(`3d:hero:${ok ? "smooth" : "slow"}`);
          if (!ok) fallBack("hero");
          release();
        });
        h = await createHeroHair({ back, front, origin: o.origin, named: o.named, state: () => o.state.current, watch });
        if (cancelled()) return h.dispose();
      } catch {
        return; // no WebGL, or no real graphics chip: the still stays
      }
      const scene = h;
      const turn = new Promise<void>((resolve) => (release = resolve));
      const t = window.setTimeout(release, 5000);
      off.push(() => window.clearTimeout(t), onFallBack(giveUp));
      scene.onReady(() => {
        if (cancelled() || !h) return;
        performance.mark("3d:hero:live");
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
      await turn;
    });

    return () => {
      abort.abort();
      release();
      window.clearTimeout(gone);
      off.forEach((f) => f());
      h?.dispose();
    };
    // Mounted once; the props never change for a mounted hero
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return on;
}
