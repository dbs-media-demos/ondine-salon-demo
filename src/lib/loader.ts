/**
 * The preview's logo loader (components/preview/LeadLoader): while it covers the page, <html> has
 * `data-loading`; when it starts to lift, that goes and `loader:done` fires on window. The hero's own
 * entrance (3D lock, /v2 lock) waits for it; CSS intros are paused under html[data-loading] in globals.css.
 */
export const LOADER_DONE = "loader:done";

export const loaderShowing = () => typeof document !== "undefined" && document.documentElement.hasAttribute("data-loading");

/** Runs `cb` once the loader has gone (at once when there is none). Returns a cancel function. */
export function whenLoaderDone(cb: () => void): () => void {
  if (!loaderShowing()) {
    cb();
    return () => {};
  }
  const on = () => cb();
  window.addEventListener(LOADER_DONE, on, { once: true });
  return () => window.removeEventListener(LOADER_DONE, on);
}
