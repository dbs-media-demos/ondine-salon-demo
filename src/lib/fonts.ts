import localFont from "next/font/local";

/*
 * Self-hosted, subset fonts (Basic Latin + Serbian Latin + typographic marks).
 * Built from the Google Fonts variable masters with fontTools:
 * - Playfair Display: static wght 500 roman + italic (replaced Bodoni Moda, whose
 *   hairlines all but vanished at display sizes).
 * - Hanken Grotesk: weight axis limited to 400–600.
 * ~45 KB for all three files. Phones use the system sans for body text (globals.css) and
 * only ever fetch the two Playfair files, so Hanken isn't preloaded.
 */
export const playfair = localFont({
  src: [
    { path: "../app/fonts/playfair-display-500.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/playfair-display-italic-500.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-playfair",
  display: "swap",
  // Names are emitted unquoted, so no multi-word fallbacks with digits here.
  fallback: ["Georgia", "serif"],
});

export const hanken = localFont({
  src: [{ path: "../app/fonts/hanken-grotesk-400-600.woff2", weight: "400 600", style: "normal" }],
  variable: "--font-hanken",
  display: "swap",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const fontVariables = `${playfair.variable} ${hanken.variable}`;
