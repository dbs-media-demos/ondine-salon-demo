import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ondine — atelje za kosu i lepotu",
    short_name: "Ondine",
    description: "Atelje za kosu i lepotu u Dorćolu, Beograd. Cenovnik online i zakazivanje za minut.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4ede4",
    theme_color: "#5a1a29",
    lang: "sr-Latn",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
