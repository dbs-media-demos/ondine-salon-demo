// Stills rendered from the live 3D hair (src/components/fx/hair), for everyone who doesn't get it live
// (phones, tablets, reduced motion, Save-Data) and for desktops to show before the canvas fades in:
//   - public/images/hair/river-{1600,2400}.{avif,webp}  the room behind the masthead's letters, framed at
//     1.5 × the masthead's box (HeroMasthead lays it out at that size, so it lines up at any window shape)
//   - public/images/hair/lock-{750,1125}.webp           the lock alone with its shadow, on transparent
//   - public/images/hair/shades-*.{avif,webp}           the shade card's tresses (see shadeScene.ts)
//
//   ESBUILD=<path to esbuild> PLAYWRIGHT=<path to playwright-core> node scripts/render-hair-stills.mjs [--preview]
//
// --preview writes scripts/.preview-*.png instead: the whole hero (river, the masthead paper, the lock)
// at a few moments, for checking the scene by eye. Needs Google Chrome (a real GPU).
// Nothing is served: the page and its files are answered by the browser's request interception.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const load = async (name, env) => {
  const mod = await import(pathToFileURL(createRequire(import.meta.url).resolve(process.env[env] || name)).href);
  return mod.default ?? mod;
};
const esbuild = await load("esbuild", "ESBUILD");
const { chromium } = await load("playwright-core", "PLAYWRIGHT");
setTimeout(() => {
  console.error("timed out");
  process.exit(3);
}, 240000).unref();

const preview = process.argv.includes("--preview");
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const out = (f) => path.join(ROOT, "public/images/hair", f);
fs.mkdirSync(path.dirname(out("x")), { recursive: true });

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "hair-"));
const entry = path.join(tmp, "entry.ts");
const src = (f) => JSON.stringify(path.join(ROOT, f).replace(/\\/g, "/"));
fs.writeFileSync(
  entry,
  `import { createHeroHair } from ${src("src/components/fx/hair/heroScene")};
import { createShades } from ${src("src/components/fx/hair/shadeScene")};
import { MASTHEAD } from ${src("src/components/brand/hero-paths")};
const q = new URLSearchParams(location.search);
const D = { s: 1500 / MASTHEAD.width, x: 50, y: 350 };
const origin = { x: D.x + MASTHEAD.zoomX * D.s, y: D.y + MASTHEAD.zoomY * D.s };
(window as any).__masthead = { d: MASTHEAD.d, D };
const back = document.getElementById("back") as HTMLCanvasElement;
const front = document.getElementById("front") as HTMLCanvasElement;
(async () => {
  if (q.get("scene") === "shades") {
    const h = await createShades(back, { still: !q.has("live"), dpr: 1 });
    (window as any).__h = h;
    (window as any).__ready = true;
    return;
  }
  const h = await createHeroHair({ back, front, origin, still: !q.has("live"), dpr: 1 });
  (window as any).__h = h;
  if (q.has("live")) { h.onReady(() => ((window as any).__ready = true)); if (q.has("intro")) h.intro(); }
  else (window as any).__ready = true;
})().catch((e) => { console.error(e && e.stack || e); });`,
);
await esbuild.build({ entryPoints: [entry], bundle: true, outfile: path.join(tmp, "entry.js"), nodePaths: [path.join(ROOT, "node_modules")], tsconfig: path.join(ROOT, "tsconfig.json"), logLevel: "warning", define: { "process.env.NODE_ENV": '"production"' } });

const page = (bg) => `<!doctype html><style>html,body{margin:0;background:${bg};overflow:hidden}canvas,svg{position:fixed;inset:0;width:100vw;height:100vh;display:block}</style>
<body><canvas id="back"></canvas><svg id="paper" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid meet" style="display:none"></svg><canvas id="front"></canvas><script src="/__entry.js"></script>`;

const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-angle=d3d11", "--enable-unsafe-swiftshader"] });
const open = async (query, w, h, bg = "transparent") => {
  const tab = await browser.newPage({ viewport: { width: w, height: h } });
  tab.on("pageerror", (e) => console.error("pageerror", e));
  tab.on("console", (m) => (m.type() === "error" || m.type() === "warning") && console.error(m.type(), m.text()));
  await tab.route("**/*", async (route) => {
    const p = new URL(route.request().url()).pathname;
    if (p === "/") return route.fulfill({ body: page(bg), headers: { "content-type": "text/html" } });
    if (p === "/__entry.js") return route.fulfill({ body: fs.readFileSync(path.join(tmp, "entry.js")), headers: { "content-type": "text/javascript" } });
    const file = path.join(ROOT, "public", p);
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ body: fs.readFileSync(file) });
  });
  await tab.goto("http://hair.local/" + query);
  await tab.waitForFunction(() => window.__ready, null, { timeout: 60000 });
  return tab;
};

// The masthead's paper, drawn as the page draws it (cream, letters cut out)
const paperSvg = (tab) =>
  tab.evaluate(() => {
    const { d, D } = window.__masthead;
    const svg = document.getElementById("paper");
    const big = 'x="-20000" y="-20000" width="40000" height="40000"';
    svg.innerHTML = `<defs><mask id="m" maskUnits="userSpaceOnUse" ${big}><rect ${big} fill="#fff"/><g transform="translate(${D.x} ${D.y}) scale(${D.s})"><path d="${d}" fill="#000"/></g></mask></defs><rect ${big} fill="#f4ede4" mask="url(#m)"/>`;
    svg.style.display = "block";
  });

if (preview) {
  const views = [
    { name: "rest", w: 1440, h: 900, wait: 400 },
    { name: "intro-0.8s", w: 1440, h: 900, intro: true, wait: 800 },
    { name: "settled", w: 1440, h: 900, intro: true, wait: 3600 },
    { name: "cursor", w: 1440, h: 900, intro: true, wait: 3000, pointer: [0.1, 0.18] },
    { name: "wide", w: 1920, h: 1080, wait: 400 },
    { name: "zoom-3", w: 1440, h: 900, intro: true, wait: 3000, scroll: { zoom: 3, progress: 0.2 } },
    { name: "zoom-12", w: 1440, h: 900, intro: true, wait: 3000, scroll: { zoom: 12, progress: 0.45 } },
    { name: "zoom-70", w: 1440, h: 900, intro: true, wait: 3000, scroll: { zoom: 70, progress: 0.85 } },
  ].filter((v) => !only || only.split(",").includes(v.name));
  for (const v of views) {
    const tab = await open(`?live${v.intro ? "&intro" : ""}`, v.w, v.h, "#120b0b");
    await paperSvg(tab);
    if (v.scroll) {
      await tab.evaluate((s) => {
        window.__h.setScroll(s);
        const g = document.querySelector("#paper g");
        const { D } = window.__masthead;
        const ox = 50 + 5430 * D.s;
        const oy = 350 + 750 * D.s;
        g.setAttribute("transform", `translate(${ox} ${oy}) scale(${s.zoom}) translate(${-ox} ${-oy}) translate(${D.x} ${D.y}) scale(${D.s})`);
      }, v.scroll);
    }
    if (v.pointer) await tab.waitForTimeout(v.wait);
    if (v.pointer) {
      // Sweep the cursor through the lock, then rest
      for (let i = 0; i <= 20; i++) {
        await tab.evaluate(([x, y]) => window.__h.setPointer(x, y, true), [v.pointer[0] - 0.3 + i * 0.015, v.pointer[1]]);
        await tab.waitForTimeout(30);
      }
    }
    await tab.waitForTimeout(v.pointer ? 120 : v.wait);
    await tab.screenshot({ path: path.join(ROOT, `scripts/.preview-${v.name}.png`) });
    await tab.close();
    console.log("preview", v.name);
  }
  await browser.close();
  process.exit(0);
}

const save = async (png, base, sizes, { alpha = false, avif = true } = {}) => {
  for (const w of sizes) {
    const img = () => sharp(png).resize({ width: w });
    if (avif) {
      const a = await img().avif({ quality: 50, effort: 6 }).toFile(out(`${base}-${w}.avif`));
      console.log(`${base}-${w}.avif`, Math.round(a.size / 1024), "KB");
    }
    const b = await img().webp({ quality: alpha ? 70 : 72, alphaQuality: 75, effort: 6 }).toFile(out(`${base}-${w}.webp`));
    console.log(`${base}-${w}.webp`, Math.round(b.size / 1024), "KB");
  }
};

if (!only || only.includes("river")) {
  const tab = await open("", 2400, 1500);
  await tab.evaluate(() => window.__h.renderStill("river", 2400, 1500));
  const png = await tab.locator("#back").screenshot();
  await save(png, "river", [1600, 2400]);
  await tab.close();
}
if (!only || only.includes("lock")) {
  const tab = await open("", 1125, 470);
  await tab.evaluate(() => window.__h.renderStill("lock", 1125, 470));
  const png = await tab.locator("#front").screenshot({ omitBackground: true });
  fs.writeFileSync(path.join(ROOT, "scripts/.preview-lock.png"), png);
  await save(png, "lock", [750, 1125], { alpha: true, avif: false });
  await tab.close();
}
if (!only || only.includes("shades")) {
  const tab = await open("?scene=shades", 1400, 1000);
  for (const [i, name] of [[-1, "all"], [2, "sel"]]) {
    await tab.evaluate((i) => window.__h.renderStill(i, 1400, 1000), i);
    const png = await tab.locator("#back").screenshot({ omitBackground: true });
    fs.writeFileSync(path.join(ROOT, `scripts/.preview-shades-${name}.png`), png);
    await save(png, `shades-${name}`, [700, 1400], { alpha: true, avif: false });
  }
  await tab.close();
}
await browser.close();
