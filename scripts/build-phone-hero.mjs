// Phone hero still: public/images/look-red-wind.jpg, cropped to the phone hero's shape and kept under 100 KB per file.
import sharp from "sharp";

const src = "public/images/look-red-wind.jpg";
const crop = { left: 0, top: 0, width: 1333, height: 2000 };

for (const [w, avif, webp] of [
  [750, 60, 70],
  [1125, 52, 60],
]) {
  const base = () => sharp(src).extract(crop).resize({ width: w }).sharpen({ sigma: 0.5 });
  const a = await base().avif({ quality: avif, effort: 6 }).toFile(`public/images/hero-phone-${w}.avif`);
  const b = await base().webp({ quality: webp, effort: 6 }).toFile(`public/images/hero-phone-${w}.webp`);
  console.log(w, "avif", Math.round(a.size / 1024), "KB", "webp", Math.round(b.size / 1024), "KB", a.width, a.height);
}
