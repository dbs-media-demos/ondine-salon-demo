import localFont from "next/font/local";

/*
 * Self-hosted, subset fonts (Basic Latin + Serbian Latin + typographic marks).
 * Built from the Google Fonts variable masters with fontTools:
 * - Bodoni Moda: weight pinned at 400, optical-size axis kept, so large
 *   headlines still get true hairline serifs (font-optical-sizing: auto).
 * - Hanken Grotesk: weight axis limited to 400–600.
 * ~54 KB for all three files instead of ~285 KB from the full families.
 */
export const bodoni = localFont({
  src: [
    { path: "../app/fonts/bodoni-moda-opsz.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/bodoni-moda-italic-opsz.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-bodoni",
  display: "swap",
  // Names are emitted unquoted, so no multi-word fallbacks with digits (e.g. Bodoni 72) here.
  fallback: ["Didot", "Georgia", "serif"],
});

export const hanken = localFont({
  src: [{ path: "../app/fonts/hanken-grotesk-400-600.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-hanken",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const fontVariables = `${bodoni.variable} ${hanken.variable}`;
