import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { LOGO } from "@/components/brand/logo-paths";

// Brand fonts (static instances of Bodoni Moda + Hanken Grotesk), traced into the bundle.
const [bodoni, bodoniItalic, hanken] = await Promise.all([
  readFile(new URL("../../../assets/fonts/BodoniModa-96-500.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/BodoniModa-Italic-96-400.ttf", import.meta.url)),
  readFile(new URL("../../../assets/fonts/HankenGrotesk-600.ttf", import.meta.url)),
]);

/** Branded 1200×630 share image: /api/og?title=…&eyebrow=…&locale=sr|en&image=/images/…jpg */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Ondine").slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Atelje za kosu i lepotu").slice(0, 60);
  const sr = searchParams.get("locale") !== "en";
  const image = searchParams.get("image");
  const safeImage = image && /^\/images\/[a-z0-9-]+\.jpg$/.test(image) ? image : "/images/look-golden-waves.jpg";
  const photo = `${origin}/_next/image?url=${encodeURIComponent(safeImage)}&w=640&q=75`;
  const size = title.length > 70 ? 46 : title.length > 45 ? 56 : 68;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#f4ede4", fontFamily: "Hanken" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} alt="" width={460} height={630} style={{ width: 460, height: 630, objectFit: "cover" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px" }}>
          <svg width={LOGO.width * 0.026} height="44" viewBox={`-200 -60 ${LOGO.width + 260} 1640`}>
            <path d={LOGO.o} fill="#0f0b0c" />
            <path d={LOGO.wave} fill="none" stroke="#0f0b0c" strokeWidth="46" strokeLinecap="round" />
            <path d={LOGO.rest} fill="#0f0b0c" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", color: "#5a1a29", fontSize: 18, letterSpacing: 4, textTransform: "uppercase", fontWeight: 600 }}>{eyebrow}</div>
            <div style={{ display: "flex", color: "#0f0b0c", fontFamily: "Bodoni", fontSize: size, lineHeight: 1.02, letterSpacing: -1 }}>{title}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 18, color: "#6b605c" }}>
            <div style={{ display: "flex", fontFamily: "BodoniItalic", fontSize: 30, color: "#0f0b0c" }}>{sr ? "Kosa koja se kreće." : "Hair that moves."}</div>
            <div style={{ display: "flex" }}>Dorćol · {sr ? "Beograd" : "Belgrade"}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Bodoni", data: bodoni, weight: 500, style: "normal" },
        { name: "BodoniItalic", data: bodoniItalic, weight: 400, style: "normal" },
        { name: "Hanken", data: hanken, weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000" },
    },
  );
}
