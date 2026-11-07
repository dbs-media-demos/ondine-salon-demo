"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";

/** Phones and touch devices: stacked layout, no pinned scenes. Same condition as the `phone:` variant in globals.css. */
export const PHONE_QUERY = "(max-width: 767px), (hover: none), (pointer: coarse)";

export const isPhone = () => typeof window !== "undefined" && window.matchMedia(PHONE_QUERY).matches;

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Motion = typeof import("./gsap");

let chunk: Promise<Motion> | undefined;
/** GSAP is its own chunk, so phones never download it. */
export const loadGsap = () => (chunk ??= import("./gsap"));

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * useGSAP for the desktop scenes: fetches GSAP, runs `setup` in a gsap.context and reverts it on unmount.
 * Never runs on phones. Dragging a window across the phone breakpoint starts or reverts the scene.
 */
export function useDesktopMotion(setup: (m: Motion) => void | (() => void), scope?: RefObject<Element | null>) {
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    let revert: (() => void) | undefined;
    let run = 0;
    const sync = () => {
      const id = ++run;
      revert?.();
      revert = undefined;
      if (mq.matches) return;
      loadGsap().then((m) => {
        if (id !== run) return;
        const ctx = m.gsap.context(() => setup(m), scope?.current ?? undefined);
        revert = () => ctx.revert();
      });
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      run++;
      mq.removeEventListener("change", sync);
      revert?.();
    };
    // Runs once per mount, like useGSAP without dependencies.
  }, []);
}
