import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";

/** High-contrast Didone display. Variable, with an optical-size axis so large sizes get hairline serifs. */
export const bodoni = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

export const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-hanken",
  display: "swap",
  // Body text renders in the metric-matched fallback until it arrives; keeps bandwidth for the display face.
  preload: false,
});

export const fontVariables = `${bodoni.variable} ${hanken.variable}`;
