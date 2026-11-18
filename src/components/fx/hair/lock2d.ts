/**
 * The /v2 hero's lock of hair, in canvas 2D (no three.js, no WebGL). The same lock the 3D hero pours over the
 * masthead: ~280 fine strands follow one curve across the type, darker underneath and lighter on top, with a
 * hair-style highlight (Kajiya-Kay, from the lock's tilt) that glides along it as it sways. On load it lays
 * itself across the paper from the root, settles and its soft shadow tightens; the cursor parts it like a
 * comb drawn through. The scroll scene lifts it towards the viewer and away.
 *
 * Coordinates are the masthead SVG's viewBox (1600 × 1000, y down, "meet"), so the canvases line up with the
 * letters at any window shape. Heights above the paper (z) give a little perspective and the shadow's offset.
 */

const VB = { w: 1600, h: 1000 };
/** The 3D hero's camera distance at rest, for the same perspective. */
const D0 = 500 / Math.tan((17.5 * Math.PI) / 180);
/** Its resting path: x, y and height above the paper, root (off the top right) → cut ends (left). */
const PATH: [number, number, number][] = [
  [1960, 170, 300],
  [1660, 270, 205],
  [1380, 410, 120],
  [1100, 548, 64],
  [840, 604, 44],
  [620, 580, 56],
  [455, 505, 84],
  [350, 400, 116],
];
/** Points along each strand. */
const N = 72;
const STRANDS = 380;
const HALF_W = 46;
/** Half vector between the light (upper left, in front) and the eye, y down. */
const H = (() => {
  const k = [-0.36, -0.42, 0.84];
  const v = [k[0], k[1], k[2] + 1];
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
})();

export type LockState = { progress: number };

export type Lock2D = {
  /** Cursor in viewBox units. */
  setPointer(x: number, y: number, inside: boolean): void;
  setVisible(v: boolean): void;
  resize(): void;
  /** The lock lays itself across the type. */
  intro(): void;
  dispose(): void;
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3);

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Full at the root, a little fuller through the middle, tapering to the cut ends (the 3D lock's profile). */
const profile = (t: number) => (t < 0.45 ? 0.8 + 0.2 * Math.sin((t / 0.45) * Math.PI * 0.5) : 1 - 0.8 * Math.pow((t - 0.45) / 0.55, 1.15));

function catmull(u: number, out: number[]) {
  const n = PATH.length - 1;
  const x = Math.min(n - 1e-6, Math.max(0, u * n));
  const i = Math.floor(x);
  const f = x - i;
  const p0 = PATH[Math.max(0, i - 1)];
  const p1 = PATH[i];
  const p2 = PATH[i + 1];
  const p3 = PATH[Math.min(n, i + 2)];
  const f2 = f * f;
  const f3 = f2 * f;
  for (let k = 0; k < 3; k++) {
    out[k] = 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * f + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * f2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * f3);
  }
  return out;
}

type Strand = { o: number; clump: number; len: number; layer: number; amp: number; freq: number; phase: number; drift: number; dfreq: number; delay: number; hi: boolean; gain: number; dark: boolean; fly: number };

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
/** The body under the strands: dull copper → in the light. */
const BODY: [RGB, RGB] = [[132, 44, 12], [204, 108, 62]];

/** Strands, underside → top: deep brown to bright copper, roots a little darker than the ends. Drawn
 *  translucent over the body, so its gloss shows through and the strands give it grain. */
const LAYERS: [string, string, number][] = [
  ["#2a0c05", "#4a1606", 1.3],
  ["#561d08", "#8a2c0b", 1.05],
  ["#7a2b0c", "#ad3e10", 0.95],
  ["#8f3d17", "#c44d14", 0.85],
  ["#b06030", "#da7238", 0.75],
];

export function createLock2D(opts: { front: HTMLCanvasElement; shadow: HTMLCanvasElement; state: () => LockState; still?: boolean }): Lock2D {
  const fc = opts.front.getContext("2d")!;
  const sc = opts.shadow.getContext("2d")!;
  const rand = rng(21);

  // Strands: an offset across the lock, a clump the ends gather into, a length and a layer (depth)
  const clumps = Array.from({ length: 28 }, () => rand() * 2 - 1);
  const strands: Strand[] = Array.from({ length: STRANDS }, () => {
    const o = rand() * 2 - 1;
    const top = (1 + o) / 2; // +o is the upper edge, which catches the light
    const layer = Math.min(LAYERS.length - 1, Math.floor(clamp(rand() * 0.7 + top * 0.45) * LAYERS.length));
    return {
      o,
      clump: clumps[Math.floor(rand() * clumps.length)],
      len: 0.66 + 0.34 * Math.sqrt(rand()),
      layer,
      amp: 0.4 + rand() * 2.2,
      freq: 3 + rand() * 10,
      phase: rand() * Math.PI * 2,
      // Strands wander across one another along the lock, as real hair does
      drift: (rand() - 0.5) * 0.3,
      dfreq: 2 + rand() * 5,
      delay: rand() * 0.16,
      hi: layer >= 2 && rand() < 0.62,
      gain: 0.7 + rand() * 0.6,
      dark: layer >= 1 && rand() < 0.16,
      fly: rand() < 0.05 ? 0.5 + rand() : 0,
    };
  });

  // Per frame: the centreline (projected), its normal, half width, shine and the shadow's line
  const cx = new Float32Array(N);
  const cy = new Float32Array(N);
  const cz = new Float32Array(N);
  const nx = new Float32Array(N);
  const ny = new Float32Array(N);
  const hw = new Float32Array(N);
  const shine = new Float32Array(N);
  const sx = new Float32Array(N);
  const sy = new Float32Array(N);
  const px = new Float32Array(N);
  const py = new Float32Array(N);
  const tmp = [0, 0, 0];

  let dpr = 1;
  let W = 1;
  let Hh = 1;
  let k = 1;
  let ox = 0;
  let oy = 0;
  let sized = "";
  const resize = () => {
    const w = Math.max(1, opts.front.clientWidth);
    const h = Math.max(1, opts.front.clientHeight);
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    if (sized === `${w}x${h}x${dpr}`) return;
    sized = `${w}x${h}x${dpr}`;
    W = w;
    Hh = h;
    k = Math.min(w / VB.w, h / VB.h);
    ox = (w - VB.w * k) / 2;
    oy = (h - VB.h * k) / 2;
    opts.front.width = Math.round(w * dpr);
    opts.front.height = Math.round(h * dpr);
    // The shadow is blurred by CSS: a quarter of the pixels is plenty
    opts.shadow.width = Math.round(w * 0.5);
    opts.shadow.height = Math.round(h * 0.5);
    if (!running) draw(performance.now());
  };

  let pointerX = 800;
  let pointerY = 500;
  let combX = 800;
  let combY = 500;
  let inside = false;
  let power = 0;
  let introAt = opts.still ? -1 : Infinity;
  let time = 0;
  let last = performance.now();
  let visible = true;
  let running = false;
  let raf = 0;
  let dead = false;

  const gradients = new Map<string, CanvasGradient>();
  const grad = (ctx: CanvasRenderingContext2D, a: string, b: string) => {
    let g = gradients.get(a + b);
    if (!g) {
      // Roots (right) → ends (left), in viewBox units
      g = ctx.createLinearGradient(1700, 0, 350, 0);
      g.addColorStop(0, a);
      g.addColorStop(1, b);
      gradients.set(a + b, g);
    }
    return g;
  };

  const draw = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!opts.still) time += dt;
    const t = time;
    const p = opts.state().progress;
    const since = (now - introAt) / 1000;
    const reveal = opts.still ? 1 : introAt === Infinity ? 0 : ease(since / 2.4);
    const settle = opts.still ? 1 : introAt === Infinity ? 0 : ease((since - 0.2) / 2.9);
    const drop = 1 - settle;
    const lift = smooth(0.02, 0.45, p);
    const fade = 1 - smooth(0.3, 0.55, p);

    // The comb: smoothed, stronger while the cursor moves through the hair
    const a = 1 - Math.exp(-dt * 9);
    const speed = Math.hypot(pointerX - combX, pointerY - combY) / Math.max(dt, 1e-3);
    combX += (pointerX - combX) * a;
    combY += (pointerY - combY) * a;
    power += ((inside ? Math.min(1, 0.35 + speed / 900) : 0) - power) * (1 - Math.exp(-dt * 4));

    // Centreline: wind along its length (the ends move most), dropped in from above, lifted by the scroll
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      catmull(u, tmp);
      const wind = u * u;
      let x = tmp[0] + Math.cos(u * 3.1 - t * 0.5) * 10 * wind;
      let y = tmp[1] - Math.sin(u * 4.2 - t * 0.63 + 1.3) * 16 * wind - drop * 180 * u;
      let z = tmp[2] + Math.sin(u * 5.5 - t * 0.85) * 22 * wind + drop * (260 * u + 40);
      // The free end reaches a little towards the cursor, like hair after a brush
      const reach = 0.08 * u * u * u * power;
      x += (combX - x) * reach;
      y += (combY - y) * reach;
      z += lift * (520 + 260 * u);
      x += lift * 120 * u;
      // Perspective about the window's centre; the shadow falls down-right of the light
      const s = D0 / (D0 - z);
      cx[i] = VB.w / 2 + (x - VB.w / 2) * s;
      cy[i] = VB.h / 2 + (y - VB.h / 2) * s;
      cz[i] = z;
      sx[i] = x + z * 0.43;
      sy[i] = y + z * 0.5;
      hw[i] = HALF_W * profile(u) * s;
    }
    for (let i = 0; i < N; i++) {
      const i0 = Math.max(0, i - 1);
      const i1 = Math.min(N - 1, i + 1);
      const dx = cx[i1] - cx[i0];
      const dy = cy[i1] - cy[i0];
      const dz = cz[i1] - cz[i0];
      const l2 = Math.hypot(dx, dy) || 1;
      nx[i] = -dy / l2;
      ny[i] = dx / l2;
      // The ribbon turns a little as it travels: narrower where it's edge-on, brighter where it faces the light
      const u = i / (N - 1);
      const turn = 0.9 * Math.sin(u * 3.4 - t * 0.3 + 0.4);
      const face = Math.abs(Math.cos(turn));
      hw[i] *= 0.6 + 0.4 * face;
      const l3 = Math.hypot(dx, dy, dz) || 1;
      const d = (dx * H[0] + dy * H[1] + dz * H[2]) / l3;
      const sinTH = Math.sqrt(Math.max(0, 1 - d * d));
      shine[i] = (Math.pow(sinTH, 120) * 0.95 + Math.pow(sinTH, 16) * 0.16) * (0.35 + 0.65 * face * face);
    }

    // ── Shadow: the ribbon's outline on the paper, softer and lighter the higher it floats
    sc.setTransform(0.5 * k, 0, 0, 0.5 * k, 0.5 * ox, 0.5 * oy);
    sc.clearRect(-ox / k, -oy / k, W / k, Hh / k);
    const shown = Math.max(2, Math.round(reveal * (N - 1)) + 1);
    if (fade > 0.01) {
      for (let i = 0; i < shown - 1; i++) {
        const z = (cz[i] + cz[i + 1]) / 2;
        const w0 = hw[i] * 1.05;
        const w1 = hw[i + 1] * 1.05;
        sc.globalAlpha = fade * clamp(0.42 - z / 1300, 0.04, 0.42);
        sc.beginPath();
        sc.moveTo(sx[i] + nx[i] * w0, sy[i] + ny[i] * w0);
        sc.lineTo(sx[i + 1] + nx[i + 1] * w1, sy[i + 1] + ny[i + 1] * w1);
        sc.lineTo(sx[i + 1] - nx[i + 1] * w1, sy[i + 1] - ny[i + 1] * w1);
        sc.lineTo(sx[i] - nx[i] * w0, sy[i] - ny[i] * w0);
        sc.closePath();
        sc.fillStyle = "#4a2618";
        sc.fill();
      }
    }

    // ── Lock
    fc.setTransform(dpr * k, 0, 0, dpr * k, dpr * ox, dpr * oy);
    fc.clearRect(-ox / k, -oy / k, W / k, Hh / k);
    if (fade <= 0.01) return;
    fc.globalAlpha = fade;
    fc.lineCap = "round";
    fc.lineJoin = "round";

    // Body under the strands, so no paper shows between them (to where most strands have reached). Its light
    // follows the lock's length through one gradient sampled from the shine (the lock runs right → left, so x
    // works as its length), which keeps it smooth; bands across the width darken the underside and lift the top.
    const body = Math.max(2, Math.round(clamp(reveal * 1.12 - 0.16) * 0.7 * (N - 1)) + 1);
    const x0 = cx[N - 1] - 60;
    const span = cx[0] + 60 - x0;
    const along = (color: (s: number) => string, shift = 0) => {
      const g = fc.createLinearGradient(x0 + shift, 0, x0 + shift + span, 0);
      let lastOff = -1;
      for (let i = N - 1; i >= 0; i -= 2) {
        const off = clamp((cx[i] - x0) / span);
        if (off <= lastOff) continue;
        lastOff = off;
        g.addColorStop(off, color(Math.min(1, shine[i] * 1.1)));
      }
      return g;
    };
    const band = (a: number, b: number) => {
      fc.beginPath();
      for (let i = 0; i < body; i++) fc.lineTo(cx[i] + nx[i] * hw[i] * a, cy[i] + ny[i] * hw[i] * a);
      for (let i = body - 1; i >= 0; i--) fc.lineTo(cx[i] + nx[i] * hw[i] * b, cy[i] + ny[i] * hw[i] * b);
      fc.closePath();
    };
    band(0.86, -0.86);
    fc.fillStyle = along((sh) => mix(BODY[0], BODY[1], sh * 0.9));
    fc.fill();
    fc.fillStyle = "rgba(40,10,3,0.28)";
    band(-0.2, -0.86);
    fc.fill();
    band(-0.5, -0.86);
    fc.fill();
    fc.fillStyle = along((sh) => `rgba(255,200,160,${(0.05 + 0.2 * sh).toFixed(3)})`);
    band(0.86, 0.25);
    fc.fill();

    const R = 60;
    const reach = R * 1.9;
    const combing = power > 0.01;
    // Where the comb is across the lock: each strand passes it on one side for its whole length (no strand
    // jumps across the parting)
    let kc = 0;
    let best = Infinity;
    if (combing)
      for (let i = 0; i < N; i++) {
        const d = (cx[i] - combX) ** 2 + (cy[i] - combY) ** 2;
        if (d < best) {
          best = d;
          kc = i;
        }
      }
    const cOff = (combX - cx[kc]) * nx[kc] + (combY - cy[kc]) * ny[kc];
    const uc = kc / (N - 1);
    const paths = LAYERS.map(() => new Path2D());
    const lights = [new Path2D(), new Path2D()];
    const darks = new Path2D();
    for (const st of strands) {
      const end = clamp(reveal * 1.16 - st.delay) * st.len;
      const n = Math.min(N, Math.floor(end * (N - 1)) + 1);
      if (n < 2) continue;
      let side = 1;
      if (combing) {
        const o0 = st.o + st.drift * Math.sin(uc * st.dfreq + st.phase);
        side = (o0 + (st.clump - o0) * 0.72 * smooth(0.45, 1, uc)) * hw[kc] >= cOff ? 1 : -1;
      }
      // Strand points: across the lock, gathering into clumps towards the ends
      for (let i = 0; i < n; i++) {
        const u = i / (N - 1);
        const o0 = st.o + st.drift * Math.sin(u * st.dfreq + st.phase);
        const o = o0 + (st.clump - o0) * 0.72 * smooth(0.45, 1, u);
        let off = o * hw[i] + st.amp * Math.sin(u * st.freq + st.phase + t * 0.35);
        if (st.fly) off += st.fly * 16 * smooth(0.62, 1, u) * Math.sin(st.phase + t * 0.7 + u * 4);
        let x = cx[i] + nx[i] * off;
        let y = cy[i] + ny[i] * off;
        if (combing) {
          // A comb drawn through: strands near the cursor are pushed apart across the lock
          const rx = x - combX;
          const ry = y - combY;
          const s = rx * nx[i] + ry * ny[i];
          const al = rx * ny[i] - ry * nx[i];
          if (Math.abs(s) < R && Math.abs(al) < reach) {
            const f = (1 - (al / reach) ** 2) ** 2 * (R - Math.abs(s)) * 0.5 * power;
            x += nx[i] * side * f;
            y += ny[i] * side * f;
          }
        }
        px[i] = x;
        py[i] = y;
      }
      const path = st.dark ? darks : paths[st.layer];
      path.moveTo(px[0], py[0]);
      for (let i = 1; i < n; i++) path.lineTo(px[i], py[i]);

      // Highlights: these strands again, lit by the same gradient (two groups, a little apart along the lock)
      if (!st.hi) continue;
      const hl = lights[st.gain > 1 ? 1 : 0];
      hl.moveTo(px[0], py[0]);
      for (let i = 1; i < n; i++) hl.lineTo(px[i], py[i]);
    }
    fc.globalAlpha = fade * 0.7;
    LAYERS.forEach(([root, tip, w], i) => {
      fc.strokeStyle = grad(fc, root, tip);
      fc.lineWidth = w;
      fc.stroke(paths[i]);
    });
    // A few darker strands on top break up the sheet
    fc.globalAlpha = fade;
    fc.strokeStyle = "rgba(42,12,4,0.5)";
    fc.lineWidth = 0.7;
    fc.stroke(darks);
    fc.lineWidth = 0.7;
    lights.forEach((path, i) => {
      fc.strokeStyle = along((sh) => `rgba(246,186,146,${(0.6 * clamp((sh - 0.2) * 1.25)).toFixed(3)})`, i ? 18 : -14);
      fc.stroke(path);
    });
    fc.globalAlpha = 1;
  };

  const loop = (now: number) => {
    raf = 0;
    if (!running || dead) return;
    draw(now);
    raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const want = visible && !opts.still && !dead && introAt !== Infinity;
    if (want === running) return;
    running = want;
    if (running) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  resize();
  return {
    setPointer(x, y, isIn) {
      pointerX = x;
      pointerY = y;
      inside = isIn;
    },
    setVisible(v) {
      visible = v;
      sync();
    },
    resize,
    intro() {
      if (opts.still) return draw(performance.now());
      introAt = performance.now();
      sync();
    },
    dispose() {
      dead = true;
      running = false;
      if (raf) cancelAnimationFrame(raf);
    },
  };
}

/** Client coordinates → the masthead's viewBox, for a canvas laid over the whole hero. */
export function toViewBox(rect: DOMRect, clientX: number, clientY: number) {
  const k = Math.min(rect.width / VB.w, rect.height / VB.h);
  return { x: (clientX - rect.left - (rect.width - VB.w * k) / 2) / k, y: (clientY - rect.top - (rect.height - VB.h * k) / 2) / k };
}
