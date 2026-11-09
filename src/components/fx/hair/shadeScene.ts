import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { Guides, GUIDE, hairMaterial, lockMesh, type LockShape } from "./strands";
import { softShadow } from "./shadow";

/**
 * The shade card: a colourist's swatch tresses hanging from a brass rod, one per shade, lit from the
 * upper left with soft shadows on the wall behind. The cursor brushes through them (each swings with
 * the pointer's speed, the tips more than the roots), scrolling stirs them, and the chosen shade swings
 * forward into the light while the others step back. Drawn on a transparent canvas over the section's
 * own colour; frames are drawn only while something moves and the card is on screen.
 */

export type Shade = { root: string; tip: string };

const N_MAX = 6;
const SPACING = 96;
const TOP = 230;
const LEN = 430;
const KEY = new THREE.Vector3(-0.38, 0.46, 0.8).normalize();

const tress = (i: number, s: Shade): LockShape => ({
  strands: 900,
  segments: 72,
  width: 31,
  thickness: 8,
  // Pinched in the clip, full below it, a little thinner at the cut ends
  profile: (t) => (t < 0.08 ? 0.55 + (t / 0.08) * 0.4 : 0.95 + 0.05 * Math.sin(t * 3) - 0.18 * Math.pow(Math.max(0, t - 0.75) / 0.25, 2)),
  minLength: 0.93,
  clump: 0.45,
  clumps: 16,
  root: s.root,
  tip: s.tip,
  spread: 0.32,
  seed: 101 + i * 13,
});

export type ShadeCard = {
  select(i: number): void;
  /** Pointer over the canvas, in canvas pixels (x right, y down); inside = over the canvas. */
  pointer(x: number, y: number, inside: boolean): void;
  /** Which tress is under canvas x (px), or -1. */
  pick(x: number, y: number): number;
  /** Scroll velocity (px per frame): stirs the tresses. */
  stir(v: number): void;
  setVisible(v: boolean): void;
  resize(): void;
  onReady(cb: () => void): void;
  renderStill(selected: number, w: number, h: number): void;
  dispose(): void;
};

const DEFAULT_SHADES: Shade[] = [
  { root: "#0b0605", tip: "#2c1a12" },
  { root: "#26120a", tip: "#6e3f22" },
  { root: "#2c0d06", tip: "#9a3d16" },
  { root: "#2a170c", tip: "#a8743a" },
  { root: "#3a2414", tip: "#cf9d58" },
  { root: "#7c6044", tip: "#d9c09a" },
];

export async function createShades(canvas: HTMLCanvasElement, o: { shades?: Shade[]; still?: boolean; dpr?: number } = {}): Promise<ShadeCard> {
  const shades = (o.shades ?? DEFAULT_SHADES).slice(0, N_MAX);
  const n = shades.length;
  const dpr = o.dpr ?? Math.min(window.devicePixelRatio || 1, 1.5);
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance", preserveDrawingBuffer: !!o.still });
  r.setPixelRatio(dpr);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NeutralToneMapping;
  r.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(r);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.7;
  const cam = new THREE.PerspectiveCamera(26, 1, 10, 6000);
  cam.position.set(0, 10, 1350);
  cam.lookAt(0, 0, 0);

  const guides = new Guides(n);
  const looks = shades.map((s, i) => tress(i, s));
  const mat = hairMaterial(guides, looks, { spread: 0.32 });
  mat.uniforms.uWidthPx.value = 1.1;
  mat.uniforms.uLightDir.value.copy(KEY);
  mat.uniforms.uLightColor.value.setRGB(1.08, 0.98, 0.88);
  mat.uniforms.uAmbient.value.setRGB(0.16, 0.13, 0.12);
  mat.uniforms.uRimColor.value.setRGB(0.5, 0.36, 0.28);
  mat.uniforms.uSpec.value.set(0.3, 0.95, 0.05, 0);
  mat.uniforms.uFan.value = 0.25;
  mat.uniforms.uWave.value.set(11, 1.6, 0.5, 0.5);
  looks.forEach((_, i) => (mat.uniforms.uLock.value[i].w = 0.9));
  const baseRoot = looks.map((l) => new THREE.Color(l.root));
  const baseTip = looks.map((l) => new THREE.Color(l.tip));
  looks.forEach((l, i) => scene.add(lockMesh(l, i, mat)));

  // The shadow: the same tresses drawn from the light
  const shadowMat = hairMaterial(guides, looks, { shadow: true });
  shadowMat.uniforms.uWidthPx.value = 1.6;
  shadowMat.uniforms.uFan.value = 0.25;
  shadowMat.uniforms.uWave.value.copy(mat.uniforms.uWave.value);
  const castScene = new THREE.Scene();
  looks.forEach((l, i) => castScene.add(lockMesh(l, i, shadowMat)));
  const shadow = softShadow(r, castScene, { w: 1024, h: 768, frustum: [-520, 520, 390, -390] });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(3000, 2000), shadow.catcher("#5a3424", 0.17, 0.05));
  wall.position.set(0, 0, -36);
  wall.renderOrder = -1;
  scene.add(wall);
  const wallCentre = new THREE.Vector3(0, 0, -36);

  // Brass rod and a lacquered clip for each tress
  const brass = new THREE.MeshStandardMaterial({ color: new THREE.Color("#b89468"), metalness: 1, roughness: 0.32 });
  const lacquer = new THREE.MeshStandardMaterial({ color: new THREE.Color("#a8845a"), metalness: 1, roughness: 0.45 });
  const width = (n - 1) * SPACING;
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 4.5, width + 120, 32), brass);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, TOP + 16, -6);
  scene.add(rod);
  const capGeo = new THREE.SphereGeometry(7, 24, 16);
  for (const sx of [-1, 1]) {
    const cap = new THREE.Mesh(capGeo, brass);
    cap.position.set(sx * (width / 2 + 60), TOP + 16, -6);
    scene.add(cap);
  }
  const clipGeo = new THREE.CylinderGeometry(9, 9, 44, 32);
  const ringGeo = new THREE.TorusGeometry(8, 1.6, 12, 32);
  const xs = Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * SPACING);
  for (const x of xs) {
    const clip = new THREE.Mesh(clipGeo, lacquer);
    clip.position.set(x, TOP - 4, 3);
    clip.rotation.z = Math.PI / 2;
    scene.add(clip);
    const ring = new THREE.Mesh(ringGeo, brass);
    ring.position.set(x, TOP + 12, -6);
    ring.rotation.y = Math.PI / 2;
    scene.add(ring);
  }
  // A soft light for the brass (the hair has its own lighting model)
  const key = new THREE.DirectionalLight(0xfff2e2, 1.6);
  key.position.copy(KEY).multiplyScalar(1000);
  scene.add(key, new THREE.AmbientLight(0xffffff, 0.25));

  // ── Motion: each tress a damped pendulum, sideways (θ) and towards the viewer (φ) ──
  const th = new Float32Array(n);
  const thV = new Float32Array(n);
  const ph = new Float32Array(n);
  const phV = new Float32Array(n);
  const pick = new Float32Array(n); // 0..1, eased selection
  let selected = -1;
  let pointer = { x: 0, y: 0, inside: false, vx: 0, px: 0 };
  let stirV = 0;
  let visible = true;
  let raf = 0;
  let time = 0;
  let last = performance.now();
  let calm = 0;
  let readyFired = false;
  const readyCbs: (() => void)[] = [];
  const v = new THREE.Vector3();
  const proj = new THREE.Vector3();

  const pose = () => {
    for (let i = 0; i < n; i++) {
      const P = guides.pos[i];
      const s = pick[i];
      const x0 = xs[i];
      let x = x0;
      let y = TOP - 10;
      let z = 4 + s * 26;
      const ds = LEN / (GUIDE - 1);
      for (let k = 0; k < GUIDE; k++) {
        const u = k / (GUIDE - 1);
        // Flexible hair: the swing grows along the tress; a slight natural bow towards the viewer
        const a = th[i] * (0.35 + 0.95 * u);
        // Out of the clip the hair bows towards the viewer, then hangs straight: that bend is where the light catches
        const b = ph[i] * (0.3 + 0.9 * u) + 0.38 * Math.pow(1 - u, 3) + 0.02 + s * 0.12 * u;
        P[k].set(x, y, z);
        x += Math.sin(a) * ds;
        y -= Math.cos(a) * Math.cos(b) * ds;
        z += Math.sin(b) * ds;
      }
      guides.commit(i, new THREE.Vector3(0, 0, 1));
      // The chosen shade steps into the light, the others back a little
      const dim = selected < 0 ? 1 : 0.8 + 0.2 * s;
      mat.uniforms.uRoot.value[i].copy(baseRoot[i]).multiplyScalar(dim);
      mat.uniforms.uTip.value[i].copy(baseTip[i]).multiplyScalar(dim);
    }
  };

  const resize = () => {
    const w = Math.max(1, canvas.clientWidth || canvas.width);
    const h = Math.max(1, canvas.clientHeight || canvas.height);
    r.setSize(w, h, false);
    cam.aspect = w / h;
    // Keep the whole card in frame on any shape
    const fitH = 540 / (2 * Math.tan(THREE.MathUtils.degToRad(13)));
    const fitW = (width + 160) / (2 * Math.tan(THREE.MathUtils.degToRad(13)) * cam.aspect);
    cam.position.z = Math.max(fitH, fitW) + 40;
    cam.updateProjectionMatrix();
    mat.uniforms.uRes.value.set(w * r.getPixelRatio(), h * r.getPixelRatio());
  };

  const step = (dt: number) => {
    for (let i = 0; i < n; i++) {
      pick[i] += ((i === selected ? 1 : 0) - pick[i]) * (1 - Math.exp(-dt * 4));
      // The cursor brushes a tress when it passes over it
      if (pointer.inside) {
        proj.set(xs[i], 0, 0).project(cam);
        const sx = (proj.x * 0.5 + 0.5) * (canvas.clientWidth || 1);
        const d = Math.abs(pointer.x - sx);
        const reach = (SPACING * 0.5 * (canvas.clientWidth || 1)) / (width + 160);
        if (d < reach * 1.2) thV[i] += pointer.vx * 0.0009 * (1 - d / (reach * 1.2));
      }
      phV[i] += stirV * 0.00022 * (0.6 + 0.4 * Math.sin(i * 1.7));
      // Springs: stiffer near rest, gently damped like real hair
      thV[i] += (-th[i] * 14 - thV[i] * 2.6) * dt;
      phV[i] += (-ph[i] * 12 - phV[i] * 2.4) * dt;
      th[i] = Math.max(-0.5, Math.min(0.5, th[i] + thV[i] * dt));
      ph[i] = Math.max(-0.4, Math.min(0.4, ph[i] + phV[i] * dt));
    }
    pointer.vx *= Math.exp(-dt * 12);
    stirV *= Math.exp(-dt * 6);
  };

  const energy = () => {
    let e = Math.abs(stirV) + Math.abs(pointer.vx) * 0.1;
    for (let i = 0; i < n; i++) e += Math.abs(th[i]) + Math.abs(thV[i]) + Math.abs(ph[i]) + Math.abs(phV[i]) + Math.abs((i === selected ? 1 : 0) - pick[i]);
    return e;
  };

  const draw = () => {
    pose();
    mat.uniforms.uTime.value = time;
    shadowMat.uniforms.uTime.value = time;
    shadowMat.uniforms.uRes.value.copy(shadow.size);
    shadow.render(KEY, wallCentre, [1.4, 2.2]);
    r.setClearColor(0x000000, 0);
    r.render(scene, cam);
  };

  const loop = (now: number) => {
    raf = 0;
    if (!visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    step(dt);
    draw();
    if (!readyFired) {
      readyFired = true;
      readyCbs.forEach((cb) => cb());
    }
    // On demand: sleep once everything has settled (the slow strand wave pauses with it)
    calm = energy() < 0.002 ? calm + dt : 0;
    if (calm < 0.6) raf = requestAnimationFrame(loop);
  };
  const wake = () => {
    calm = 0;
    if (!raf && visible && !o.still) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };

  resize();
  pose();
  await r.compileAsync(scene, cam).catch(() => {});
  await r.compileAsync(castScene, shadow.cam).catch(() => {});
  if (!o.still) wake();

  return {
    select(i) {
      selected = i;
      if (i >= 0) phV[i] += 0.8;
      wake();
    },
    pointer(x, y, inside) {
      const dx = x - pointer.px;
      pointer = { x, y, inside, vx: inside ? pointer.vx * 0.5 + dx * 30 : 0, px: x };
      if (inside) wake();
    },
    pick(x, y) {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      let best = -1;
      let bd = Infinity;
      for (let i = 0; i < n; i++) {
        v.set(xs[i], TOP - LEN * 0.45, 0).project(cam);
        const sx = (v.x * 0.5 + 0.5) * w;
        const top = (-proj.set(0, TOP + 30, 0).project(cam).y * 0.5 + 0.5) * h;
        const bottom = (-proj.set(0, TOP - LEN - 20, 0).project(cam).y * 0.5 + 0.5) * h;
        const d = Math.abs(x - sx);
        if (y >= top && y <= bottom && d < bd) {
          bd = d;
          best = i;
        }
      }
      const reach = (SPACING * 0.55 * w) / (width + 160);
      return bd < reach ? best : -1;
    },
    stir(vel) {
      stirV += vel;
      if (Math.abs(vel) > 0.5) wake();
    },
    setVisible(vis) {
      visible = vis;
      if (vis) wake();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    resize() {
      resize();
      if (!raf) draw();
    },
    onReady(cb) {
      if (readyFired) cb();
      else readyCbs.push(cb);
    },
    renderStill(sel, w, h) {
      r.setPixelRatio(1);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      resize();
      selected = sel;
      for (let i = 0; i < n; i++) pick[i] = i === sel ? 1 : 0;
      time = 0;
      draw();
    },
    dispose() {
      visible = false;
      if (raf) cancelAnimationFrame(raf);
      for (const s of [scene, castScene])
        s.traverse((obj) => {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          (m.material as THREE.Material | undefined)?.dispose?.();
        });
      shadow.dispose();
      env.dispose();
      pmrem.dispose();
      guides.tex.dispose();
      r.dispose();
      r.forceContextLoss();
    },
  };
}
