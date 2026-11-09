"use client";

/**
 * When the live 3D may run, and when it gives up. No three.js in here: this decides whether three.js is
 * fetched at all. Every scene shows its still first; the canvas fades in only once the scene is built,
 * its shaders are compiled and one frame has been drawn unseen. Scenes warm up one at a time, the next
 * one only after the one before has passed its first 2 s on screen. A scene that can't hold about
 * 45 fps over those 2 s (or drops one frame of 100 ms) fades back to its still, and so does every other
 * scene for the rest of the visit.
 */

/** Live 3D only on a big screen with a mouse. Everything else keeps the still. */
export const DESK_3D = "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

const STILL_KEY = "ondine:3d-still";
let still = false;
const giveUps = new Set<() => void>();

const remembered = () => {
  try {
    return sessionStorage.getItem(STILL_KEY) === "1";
  } catch {
    return false;
  }
};

/** This visit has already shown the 3D is too slow here (or there's no proper graphics chip). */
export const stillsOnly = () => still || (still = remembered());

/** Every scene falls back to its still, now and for the rest of the visit. */
export function fallBack(why: string) {
  still = true;
  try {
    sessionStorage.setItem(STILL_KEY, "1");
  } catch {}
  performance.mark(`3d:still:${why}`);
  giveUps.forEach((f) => f());
  giveUps.clear();
}

/** Called once if the scenes fall back to their stills. */
export function onFallBack(cb: () => void) {
  giveUps.add(cb);
  return () => void giveUps.delete(cb);
}

/** The same check every live 3D scene on the site makes before it fetches any of its code. */
export function canRun3D() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia(DESK_3D).matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !conn?.saveData && !stillsOnly();
}

let gpu: boolean | undefined;
/**
 * A real graphics chip: WebGL 2 without a major performance caveat and not a software renderer
 * (SwiftShader, llvmpipe, Microsoft Basic Render). Probed once, on a throwaway canvas, before three.js.
 */
export function hasGpu() {
  if (gpu !== undefined) return gpu;
  let ok = false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true, powerPreference: "high-performance" });
    if (gl) {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const name = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
      ok = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {}
  gpu = ok;
  if (!ok) fallBack("no-gpu");
  return ok;
}

/** Runs `cb` once the page has loaded and the browser is idle, never before `minMs` after navigation start. */
export function afterLoad(cb: () => void, minMs = 1200) {
  let t = 0;
  let id = 0;
  const idle = () => {
    t = window.setTimeout(() => {
      if (window.requestIdleCallback) id = window.requestIdleCallback(cb, { timeout: 1200 });
      else t = window.setTimeout(cb, 120);
    }, Math.max(0, minMs - performance.now()));
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
  return () => {
    window.clearTimeout(t);
    if (id) window.cancelIdleCallback(id);
    window.removeEventListener("load", idle);
  };
}

/** Resolves true once the page has loaded and the browser is idle, or false if `signal` aborts first. */
export const whenIdle = (signal: AbortSignal, minMs = 0) =>
  new Promise<boolean>((resolve) => {
    if (signal.aborted) return resolve(false);
    const off = afterLoad(() => resolve(!signal.aborted), minMs);
    signal.addEventListener(
      "abort",
      () => {
        off();
        resolve(false);
      },
      { once: true },
    );
  });

/**
 * Let the page paint a frame between the steps of a warm-up. Most of a warm-up is the main thread waiting
 * on the GPU process (a context, buffers, a program's uniforms), so no single step may hold it for long.
 */
export const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));

let turn: Promise<unknown> = Promise.resolve();
/** Scenes warm up one at a time, in the order they ask (the hero first): two scenes never compile at once. */
export function inTurn(job: () => Promise<unknown>) {
  const run = turn.then(job).catch(() => {});
  turn = run;
  return run;
}

export type FrameWatch = {
  /** At the start of every frame the scene draws on screen. */
  tick(now: number): void;
  /** The loop stopped (off screen, settled, tab hidden): the pause isn't a slow frame. */
  gap(): void;
};

/**
 * Watches a scene's first 2 s of frames on screen (paused gaps don't count). Below ~45 fps on average,
 * or any frame over 100 ms once the first two are past, and `verdict(false)` is called; else `verdict(true)`.
 */
export function frameWatch(verdict: (ok: boolean) => void, o = { span: 2000, fps: 45, worst: 100, skip: 2 }): FrameWatch {
  let prev = 0;
  let skip = o.skip;
  let total = 0;
  let frames = 0;
  let done = false;
  return {
    tick(now) {
      if (done) return;
      const dt = prev ? now - prev : 0;
      prev = now;
      if (!dt || skip-- > 0) return;
      total += dt;
      frames++;
      const slow = dt > o.worst || (total >= o.span && (frames * 1000) / total < o.fps);
      if (slow || total >= o.span) {
        done = true;
        verdict(!slow);
      }
    },
    gap() {
      prev = 0;
    },
  };
}
