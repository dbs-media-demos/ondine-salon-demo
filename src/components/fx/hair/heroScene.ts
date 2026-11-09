import * as THREE from "three";
import { Guides, GUIDE, hairMaterial, lockMesh, type LockShape } from "./strands";
import { softShadow } from "./shadow";

/**
 * The hero in 3D. Two canvases sandwich the masthead's paper (an SVG in the page):
 *  - behind it, a river of copper hair flows through the die-cut letters, in a warm dark room;
 *  - in front of it, one lock of the same hair floats over the type and casts a soft shadow on the paper.
 *
 * World units are the masthead SVG's viewBox units (1600 × 1000, y flipped), with the paper at z = 0,
 * so both canvases line up with the SVG at any window size. The camera can move (cursor parallax, the
 * scroll's dive into the "I") while the paper plane stays exactly where the SVG draws it: the frustum is
 * built off-axis from the paper window.
 */

const VB = { w: 1600, h: 1000 };
/** Camera distance at rest, the same at every window shape (so the pre-rendered still always matches). */
const D0 = 500 / Math.tan(THREE.MathUtils.degToRad(17.5));
/** Light from the upper left, in front of the page. */
const KEY = new THREE.Vector3(-0.36, 0.42, 0.84).normalize();

const COPPER = { root: "#250a05", tip: "#8e3b17" };

export const river: LockShape = {
  strands: 3600,
  segments: 72,
  width: 560,
  thickness: 80,
  profile: () => 1,
  minLength: 1,
  clump: 0.35,
  clumps: 220,
  root: "#2a0d07",
  tip: "#7c3317",
  spread: 0.5,
  seed: 7,
};

export const lock: LockShape = {
  strands: 2400,
  segments: 160,
  width: 62,
  thickness: 9,
  // Full at the root, a little fuller through the middle, tapering to the cut ends
  profile: (t) => (t < 0.45 ? 0.8 + 0.2 * Math.sin((t / 0.45) * Math.PI * 0.5) : 1 - 0.8 * Math.pow((t - 0.45) / 0.55, 1.15)),
  minLength: 0.66,
  clump: 0.72,
  clumps: 30,
  ...COPPER,
  spread: 0.36,
  seed: 21,
};

/** The lock's resting path in SVG coordinates (x right, y down) plus height above the paper. */
const LOCK_PATH: [number, number, number][] = [
  [1960, 170, 300],
  [1660, 270, 205],
  [1380, 410, 120],
  [1100, 548, 64],
  [840, 604, 44],
  [620, 580, 56],
  [455, 505, 84],
  [350, 400, 116],
];

export type HeroState = {
  /** The SVG's zoom into the "I" (1 = rest, 70 = through). */
  zoom: number;
  /** Progress through the pinned scroll scene, 0..1. */
  progress: number;
};

export type HeroHairOptions = {
  back: HTMLCanvasElement;
  front: HTMLCanvasElement;
  /** The zoom origin (centre of the "I") in SVG coordinates. */
  origin: { x: number; y: number };
  /** A preview's name instead of ONDINE: no letter to fly into, the camera eases forward instead. */
  named?: boolean;
  /** Render single frames on request (stills) instead of running a loop. */
  still?: boolean;
  /** Read each frame: the scroll scene's zoom and progress. */
  state?: () => HeroState;
  dpr?: number;
};

export type HeroHair = {
  setPointer(x: number, y: number, inside: boolean): void;
  setScroll(s: HeroState): void;
  setVisible(v: boolean): void;
  resize(): void;
  /** The lock pours in over the type. */
  intro(): void;
  onReady(cb: () => void): void;
  /** Stills: draw the back scene for a window `scale` × the viewBox, or the lock alone on transparent. */
  renderStill(kind: "river" | "lock", w: number, h: number): void;
  dispose(): void;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function catmull(pts: THREE.Vector3[], t: number, out: THREE.Vector3) {
  const n = pts.length - 1;
  const x = Math.min(n - 1e-6, Math.max(0, t * n));
  const i = Math.floor(x);
  const f = x - i;
  const p0 = pts[Math.max(0, i - 1)];
  const p1 = pts[i];
  const p2 = pts[i + 1];
  const p3 = pts[Math.min(n, i + 2)];
  const f2 = f * f;
  const f3 = f2 * f;
  for (const k of ["x", "y", "z"] as const) {
    out[k] = 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * f + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * f2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * f3);
  }
  return out;
}

/** The camera for a canvas of w × h px: paper window → off-axis frustum. */
function place(cam: THREE.PerspectiveCamera, w: number, h: number, o: { zoom: number; beyond: number; par: THREE.Vector2; origin: THREE.Vector2; scale?: number }) {
  const A = w / h;
  const vh = (A > VB.w / VB.h ? VB.h : VB.w / A) * (o.scale ?? 1);
  const vw = vh * A;
  const cx = VB.w / 2;
  const cy = -VB.h / 2;
  const s = o.zoom;
  const O = o.origin;
  const x0 = O.x + (cx - vw / 2 - O.x) / s;
  const x1 = O.x + (cx + vw / 2 - O.x) / s;
  const y0 = O.y + (cy - vh / 2 - O.y) / s;
  const y1 = O.y + (cy + vh / 2 - O.y) / s;
  const D = D0 / s;
  const camX = (x0 + x1) / 2 + o.par.x / s;
  const camY = (y0 + y1) / 2 + o.par.y / s;
  const z = D - o.beyond;
  const near = Math.max(0.5, Math.min(40, z * 0.05 + 2));
  const far = 12000;
  cam.position.set(camX, camY, z);
  cam.quaternion.identity();
  cam.updateMatrixWorld(true);
  cam.projectionMatrix.makePerspective(((x0 - camX) / D) * near, ((x1 - camX) / D) * near, ((y1 - camY) / D) * near, ((y0 - camY) / D) * near, near, far);
  cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
}

export async function createHeroHair(opts: HeroHairOptions): Promise<HeroHair> {
  const dpr = opts.dpr ?? Math.min(window.devicePixelRatio || 1, 1.5);
  const mk = (canvas: HTMLCanvasElement, alpha: boolean) => {
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha, premultipliedAlpha: true, powerPreference: "high-performance", preserveDrawingBuffer: !!opts.still });
    r.setPixelRatio(dpr);
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 1.0;
    return r;
  };
  const back = mk(opts.back, false);
  const front = mk(opts.front, true);
  front.setClearColor(0x000000, 0);

  const origin = new THREE.Vector2(opts.origin.x, -opts.origin.y);
  const cam = new THREE.PerspectiveCamera();

  // ── Back: the river behind the paper ───────────────────────────────────
  const backScene = new THREE.Scene();
  back.setClearColor(new THREE.Color("#120b0b"), 1);
  const riverGuides = new Guides(1);
  const riverMat = hairMaterial(riverGuides, [river], { spread: river.spread });
  riverMat.uniforms.uWidthPx.value = 1.25;
  riverMat.uniforms.uLock.value[0].w = 6;
  riverMat.uniforms.uLightDir.value.copy(KEY);
  riverMat.uniforms.uLightColor.value.setRGB(1.1, 0.95, 0.82);
  riverMat.uniforms.uAmbient.value.setRGB(0.07, 0.045, 0.04);
  riverMat.uniforms.uSpec.value.set(0.22, 0.75, 0.1, 0);
  riverMat.uniforms.uFog.value.set(D0 + 300, D0 + 900, 0.6, 0);
  riverMat.uniforms.uFogColor.value.set("#140b0b");
  backScene.add(lockMesh(river, 0, riverMat));

  // A warm glow far behind, so the room has depth instead of flat black
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(9000, 6000),
    new THREE.ShaderMaterial({
      uniforms: { uA: { value: new THREE.Color("#3a1712") }, uB: { value: new THREE.Color("#0d0808") } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uA; uniform vec3 uB; varying vec2 vUv;
        void main(){ float d = distance(vUv * vec2(1.5, 1.0), vec2(0.62, 0.62)); gl_FragColor = vec4(mix(uA, uB, smoothstep(0.0, 0.55, d)), 1.0);
        #include <colorspace_fragment>
        }`,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  glow.position.set(800, -500, -1400);
  backScene.add(glow);

  // ── Front: one lock over the type, and its shadow on the paper ─────────
  const frontScene = new THREE.Scene();
  const lockGuides = new Guides(1);
  const lockMat = hairMaterial(lockGuides, [lock], { spread: lock.spread });
  lockMat.uniforms.uWidthPx.value = 1.1;
  lockMat.uniforms.uLock.value[0].w = 1.6;
  lockMat.uniforms.uLightDir.value.copy(KEY);
  lockMat.uniforms.uLightColor.value.setRGB(1.05, 0.94, 0.84);
  lockMat.uniforms.uAmbient.value.setRGB(0.12, 0.1, 0.09);
  lockMat.uniforms.uRimColor.value.setRGB(0.55, 0.38, 0.28);
  lockMat.uniforms.uSpec.value.set(0.42, 1.5, 0.1, 0);
  lockMat.uniforms.uCombR.value = 58;
  lockMat.uniforms.uFan.value = 0.9;
  lockMat.uniforms.uWave.value.set(30, 15, 0.8, 1.1);
  lockMat.uniforms.uPartR.value = 150;
  const lockObj = lockMesh(lock, 0, lockMat);
  lockObj.renderOrder = 2;
  frontScene.add(lockObj);

  // Shadow: the lock drawn from the light into a coverage map, blurred, laid on the paper plane
  const shadowMat = hairMaterial(lockGuides, [lock], { shadow: true });
  shadowMat.uniforms.uWidthPx.value = 1.6;
  shadowMat.uniforms.uFan.value = 0.9;
  shadowMat.uniforms.uWave.value.copy(lockMat.uniforms.uWave.value);
  const shadowScene = new THREE.Scene();
  const shadowLock = lockMesh(lock, 0, shadowMat);
  shadowScene.add(shadowLock);
  const shadow = softShadow(front, shadowScene, { w: 1024, h: 704, frustum: [-1300, 1300, 900, -900] });
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(8000, 6000), shadow.catcher("#4a2a1c", 0.26, 0.07));
  catcher.position.set(800, -500, 0);
  catcher.renderOrder = 1;
  frontScene.add(catcher);
  const catcherMat = catcher.material as THREE.ShaderMaterial;

  // ── State ───────────────────────────────────────────────────────────────
  const pointer = new THREE.Vector2(0, 0); // -1..1 over the hero
  const pointerS = new THREE.Vector2(0, 0); // smoothed
  let inside = false;
  let combPower = 0;
  let lastPx = 0;
  let lastPy = 0;
  const scroll: HeroState = { zoom: 1, progress: 0 };
  let visible = true;
  let raf = 0;
  let introAt = -1;
  let reveal = opts.still ? 1 : 0;
  let time = 0;
  let last = performance.now();
  const readyCbs: (() => void)[] = [];
  let readyFired = false;
  const par = new THREE.Vector2();
  const tmp = new THREE.Vector3();
  const lockBase = LOCK_PATH.map(([x, y, z]) => new THREE.Vector3(x, -y, z));
  const raycaster = new THREE.Raycaster();
  const combPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -110);
  const combPoint = new THREE.Vector3();
  const ndc = new THREE.Vector2();

  const size = () => {
    const w = opts.front.clientWidth || opts.front.width;
    const h = opts.front.clientHeight || opts.front.height;
    return { w: Math.max(1, w), h: Math.max(1, h) };
  };

  const resize = () => {
    const { w, h } = size();
    back.setSize(w, h, false);
    front.setSize(w, h, false);
    riverMat.uniforms.uRes.value.set(w * dpr, h * dpr);
    lockMat.uniforms.uRes.value.set(w * dpr, h * dpr);
  };

  const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

  /** Move both guide curves for time `t` (seconds). */
  const pose = (t: number, k: number) => {
    // River: long slow swells travelling left → right, the whole sheet breathing
    const P = riverGuides.pos[0];
    for (let i = 0; i < GUIDE; i++) {
      const u = i / (GUIDE - 1);
      const x = -700 + u * 3000;
      P[i].set(
        x,
        -470 + Math.sin(x * 0.0031 - t * 0.32) * 70 + Math.sin(x * 0.0071 - t * 0.21 + 2) * 22,
        -230 + Math.sin(x * 0.0024 - t * 0.45 + 1) * 70 + Math.sin(x * 0.006 - t * 0.3) * 18,
      );
    }
    riverGuides.commit(0, new THREE.Vector3(0, 0, 1), (u) => Math.sin(u * 7 - t * 0.25) * 0.32);

    // Lock: lifted and straighter before the intro settles it; wind along its length; lifts away on scroll
    const L = lockGuides.pos[0];
    const drop = 1 - k;
    const p = scroll.progress;
    const lift = smooth(0.02, 0.45, p);
    for (let i = 0; i < GUIDE; i++) {
      const u = i / (GUIDE - 1);
      catmull(lockBase, u, tmp);
      const wind = u * u;
      tmp.z += Math.sin(u * 5.5 - t * 0.85) * 22 * wind + drop * (260 * u + 40);
      tmp.y += Math.sin(u * 4.2 - t * 0.63 + 1.3) * 16 * wind + drop * 180 * u;
      tmp.x += Math.cos(u * 3.1 - t * 0.5) * 10 * wind;
      // The free end reaches a little towards the cursor, like hair after a brush
      if (inside) {
        tmp.x += (combPoint.x - tmp.x) * 0.06 * Math.pow(u, 3) * combPower;
        tmp.y += (combPoint.y - tmp.y) * 0.06 * Math.pow(u, 3) * combPower;
      }
      tmp.z += lift * (520 + 260 * u);
      tmp.x += lift * 120 * u;
      L[i].copy(tmp);
    }
    lockGuides.commit(0, new THREE.Vector3(0, 0, 1), (u) => 0.35 * Math.sin(u * 3.4 - t * 0.3) - 0.15);
  };

  const paperCentre = new THREE.Vector3(800, -500, 0);
  const shadowPass = () => {
    shadowMat.uniforms.uRes.value.copy(shadow.size);
    shadow.render(KEY, paperCentre);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    if (introAt >= 0) reveal = ease((now - introAt) / 2600);
    const settle = introAt >= 0 ? ease((now - introAt - 200) / 2900) : opts.still ? 1 : 0;

    // Cursor: smoothed; the comb gets stronger while the cursor moves through the hair
    pointerS.lerp(pointer, 1 - Math.exp(-dt * 5));
    const speed = Math.hypot(pointer.x - lastPx, pointer.y - lastPy) / Math.max(dt, 1e-3);
    lastPx = pointer.x;
    lastPy = pointer.y;
    combPower += ((inside ? Math.min(1, 0.45 + speed * 0.5) : 0) - combPower) * (1 - Math.exp(-dt * 3));
    par.set(pointerS.x * 260, -pointerS.y * 150);

    if (opts.state) {
      const s = opts.state();
      scroll.zoom = s.zoom;
      scroll.progress = s.progress;
    }
    const { w, h } = size();
    const p = scroll.progress;
    const named = !!opts.named;
    const zoom = named ? 1 : scroll.zoom;
    // Past the paper: keep travelling into the river while the scene finishes
    const beyond = named ? D0 * 0.45 * smooth(0.05, 0.9, p) : smooth(0.6, 1, p) * 120;
    place(cam, w, h, { zoom, beyond, par: par.clone().multiplyScalar(1 - smooth(0, 0.3, p)), origin });

    // Cursor → a point on a plane just above the lock
    raycaster.setFromCamera(ndc.set(pointerS.x, -pointerS.y), cam);
    raycaster.ray.intersectPlane(combPlane, combPoint);

    pose(time, settle);

    // Light follows the cursor a little, so highlights slide along the strands
    const light = KEY.clone().add(new THREE.Vector3(pointerS.x * 0.22, -pointerS.y * 0.14, 0)).normalize();
    for (const m of [riverMat, lockMat]) {
      m.uniforms.uTime.value = time;
      m.uniforms.uLightDir.value.copy(light);
    }
    shadowMat.uniforms.uTime.value = time;
    lockMat.uniforms.uReveal.value = reveal;
    shadowMat.uniforms.uReveal.value = reveal;
    const comb = new THREE.Vector4(combPoint.x, combPoint.y, combPoint.z, combPower * (1 - smooth(0, 0.2, p)));
    lockMat.uniforms.uComb.value.copy(comb);
    shadowMat.uniforms.uComb.value.copy(comb);
    const part = new THREE.Vector4(origin.x, origin.y, 80, named ? 0 : smooth(0.0, 0.25, p) * 1.2);
    lockMat.uniforms.uPart.value.copy(part);
    shadowMat.uniforms.uPart.value.copy(part);
    shadowMat.uniforms.uCombR.value = lockMat.uniforms.uCombR.value;
    shadowMat.uniforms.uPartR.value = lockMat.uniforms.uPartR.value;
    catcherMat.uniforms.uOpacity.value = (1 - smooth(0.05, 0.4, p)) * Math.min(1, reveal * 1.4);

    back.render(backScene, cam);
    if (cam.position.z > 0 && reveal > 0) {
      shadowPass();
      front.setClearColor(0x000000, 0);
      front.render(frontScene, cam);
    } else {
      front.setClearColor(0x000000, 0);
      front.clear();
    }
  };

  const loop = (now: number) => {
    raf = 0;
    if (!visible) return;
    frame(now);
    raf = requestAnimationFrame(loop);
    if (!readyFired) {
      readyFired = true;
      readyCbs.forEach((cb) => cb());
    }
  };
  const run = () => {
    if (!raf && visible && !opts.still) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };

  resize();
  // Compile both programs before the first visible frame, so the fade-in never stutters
  pose(0, opts.still ? 1 : 0);
  place(cam, size().w, size().h, { zoom: 1, beyond: 0, par: new THREE.Vector2(), origin });
  await Promise.all([back.compileAsync(backScene, cam), front.compileAsync(frontScene, cam), front.compileAsync(shadowScene, shadow.cam)]).catch(() => {});
  if (!opts.still) run();

  return {
    setPointer(x, y, isIn) {
      pointer.set(x, y);
      inside = isIn;
    },
    setScroll(s) {
      scroll.zoom = s.zoom;
      scroll.progress = s.progress;
    },
    setVisible(v) {
      visible = v;
      if (v) run();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    resize,
    intro() {
      introAt = performance.now();
    },
    onReady(cb) {
      if (readyFired) cb();
      else readyCbs.push(cb);
    },
    renderStill(kind, w, h) {
      // Same camera as the live scene at rest; the still covers `w/h` around the viewBox
      back.setPixelRatio(1);
      front.setPixelRatio(1);
      back.setSize(w, h, false);
      front.setSize(w, h, false);
      riverMat.uniforms.uRes.value.set(w, h);
      lockMat.uniforms.uRes.value.set(w, h);
      time = 0;
      reveal = 1;
      pose(0, 1);
      if (kind === "river") {
        // The image is laid out at 1.5 × the masthead's box, centred, so it covers any window shape
        place(cam, w, h, { zoom: 1, beyond: 0, par: new THREE.Vector2(), origin, scale: 1.5 });
        back.render(backScene, cam);
      } else {
        // The lock alone, framed tight, for the phones' band
        const box = new THREE.Box3().setFromPoints(lockGuides.pos[0].filter((v) => v.x < 1500 && v.y > -720));
        const cx = (box.min.x + box.max.x) / 2;
        const cy = (box.min.y + box.max.y) / 2 - 30;
        const bw = box.max.x - box.min.x + 260;
        const bh = bw / (w / h);
        cam.position.set(cx - 60, cy + 40, D0);
        cam.quaternion.identity();
        cam.updateMatrixWorld(true);
        const near = 10;
        cam.projectionMatrix.makePerspective(((cx - bw / 2 - cam.position.x) / D0) * near, ((cx + bw / 2 - cam.position.x) / D0) * near, ((cy + bh / 2 - cam.position.y) / D0) * near, ((cy - bh / 2 - cam.position.y) / D0) * near, near, 12000);
        cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
        lockMat.uniforms.uComb.value.set(0, 0, 0, 0);
        shadowMat.uniforms.uComb.value.set(0, 0, 0, 0);
        catcherMat.uniforms.uOpacity.value = 1;
        shadowPass();
        front.setClearColor(0x000000, 0);
        front.render(frontScene, cam);
      }
    },
    dispose() {
      visible = false;
      if (raf) cancelAnimationFrame(raf);
      for (const s of [backScene, frontScene, shadowScene])
        s.traverse((o) => {
          const m = o as THREE.Mesh;
          m.geometry?.dispose();
          (m.material as THREE.Material | undefined)?.dispose?.();
        });
      shadow.dispose();
      riverGuides.tex.dispose();
      lockGuides.tex.dispose();
      back.dispose();
      front.dispose();
      back.forceContextLoss();
      front.forceContextLoss();
    },
  };
}
