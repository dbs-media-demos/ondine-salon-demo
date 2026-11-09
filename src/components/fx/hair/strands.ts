import * as THREE from "three";

/**
 * Hair, drawn the way film hair is: thousands of separate strands, each a thin ribbon a pixel or two
 * wide, lit with a Kajiya-Kay model (two highlights along the strand: a white one and a tinted one
 * shifted towards the tip), darker inside the lock than on its surface, with clumping towards the ends.
 *
 * The CPU only moves a guide curve per lock (a few hundred numbers a frame, in a float texture); every
 * strand is placed, combed and shaded on the GPU from that curve, so a lock of 2,000 strands costs
 * nothing on the main thread.
 *
 * The guide texture has GUIDE samples per row and three rows per lock: position, the lock's width
 * direction and its thickness direction (both unit vectors).
 */
export const GUIDE = 128;

export type LockShape = {
  /** Strands in the lock. */
  strands: number;
  /** Segments per strand. */
  segments: number;
  /** Half the lock's width and thickness at its widest, in world units. */
  width: number;
  thickness: number;
  /** Width along the lock, t = 0 (root) → 1 (tip). */
  profile: (t: number) => number;
  /** Shortest strand as a share of the longest (uneven ends). */
  minLength: number;
  /** How strongly the strands gather into clumps towards the tips, and how many clumps. */
  clump: number;
  clumps: number;
  /** Root and tip colour (sRGB hex); each strand varies its lightness around them. */
  root: string;
  tip: string;
  /** Lightness spread between strands (0.3 = ±15 %). */
  spread: number;
  seed: number;
};

/** Small deterministic random, so the still and the live scene place every strand identically. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

const gauss = (r: () => number) => Math.sqrt(-2 * Math.log(Math.max(1e-6, r()))) * Math.cos(2 * Math.PI * r());

/** One lock as instanced ribbons: one strand template, one instance per strand. */
export function lockGeometry(shape: LockShape, row: number) {
  const seg = shape.segments;
  const geo = new THREE.InstancedBufferGeometry();
  const t = new Float32Array((seg + 1) * 2 * 2);
  for (let i = 0; i <= seg; i++) {
    for (let s = 0; s < 2; s++) {
      const k = (i * 2 + s) * 2;
      t[k] = i / seg;
      t[k + 1] = s ? 1 : -1;
    }
  }
  const index: number[] = [];
  for (let i = 0; i < seg; i++) {
    const a = i * 2;
    index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  geo.setAttribute("aT", new THREE.BufferAttribute(t, 2));
  // three needs a position attribute to count vertices; the shader ignores it
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((seg + 1) * 2 * 3), 3));
  geo.setIndex(index);

  const r = rng(shape.seed);
  const n = shape.strands;
  const cross = new Float32Array(n * 4); // u, v, clump u, clump v
  const rand = new Float32Array(n * 4); // phase, phase, lightness, length
  const meta = new Float32Array(n * 2); // row, unused
  const centres: [number, number][] = [];
  for (let c = 0; c < shape.clumps; c++) {
    // Clump centres spread over the cross-section (an ellipse, -1..1)
    let u = 0;
    let v = 0;
    do {
      u = r() * 2 - 1;
      v = r() * 2 - 1;
    } while (u * u + v * v > 1);
    centres.push([u, v]);
  }
  for (let i = 0; i < n; i++) {
    let u = 0;
    let v = 0;
    do {
      u = r() * 2 - 1;
      v = r() * 2 - 1;
    } while (u * u + v * v > 1);
    // Nearest clump
    let best = 0;
    let bd = 9;
    for (let c = 0; c < centres.length; c++) {
      const d = (centres[c][0] - u) ** 2 + (centres[c][1] - v) ** 2;
      if (d < bd) {
        bd = d;
        best = c;
      }
    }
    cross.set([u, v, centres[best][0], centres[best][1]], i * 4);
    const len = shape.minLength + (1 - shape.minLength) * Math.pow(r(), 0.35);
    rand.set([r() * Math.PI * 2, r() * Math.PI * 2, Math.max(-1.6, Math.min(1.6, gauss(r))) * 0.5, len], i * 4);
    meta.set([row, r()], i * 2);
  }
  geo.setAttribute("aCross", new THREE.InstancedBufferAttribute(cross, 4));
  geo.setAttribute("aRand", new THREE.InstancedBufferAttribute(rand, 4));
  geo.setAttribute("aMeta", new THREE.InstancedBufferAttribute(meta, 2));
  geo.instanceCount = n;
  return geo;
}

/** Guide curves for `locks` locks, uploaded each frame they move. */
export class Guides {
  readonly data: Float32Array;
  readonly tex: THREE.DataTexture;
  readonly pos: THREE.Vector3[][];
  private readonly twist: number[][];
  constructor(readonly locks: number) {
    this.data = new Float32Array(GUIDE * locks * 3 * 4);
    this.tex = new THREE.DataTexture(this.data, GUIDE, locks * 3, THREE.RGBAFormat, THREE.FloatType);
    this.tex.minFilter = this.tex.magFilter = THREE.NearestFilter;
    this.pos = Array.from({ length: locks }, () => Array.from({ length: GUIDE }, () => new THREE.Vector3()));
    this.twist = Array.from({ length: locks }, () => new Array(GUIDE).fill(0));
  }

  /** Set lock `l`'s centre line (fill `pos[l]` first) and its twist along the length (radians, per sample). */
  commit(l: number, up: THREE.Vector3, twist?: (t: number) => number) {
    const P = this.pos[l];
    const T = new THREE.Vector3();
    const N = new THREE.Vector3();
    const B = new THREE.Vector3();
    const q = new THREE.Quaternion();
    for (let i = 0; i < GUIDE; i++) {
      const a = P[Math.max(0, i - 1)];
      const b = P[Math.min(GUIDE - 1, i + 1)];
      T.subVectors(b, a).normalize();
      // Width runs across the lock, perpendicular to its direction and to `up` (the lock lies "flat" to up)
      N.crossVectors(T, up);
      if (N.lengthSq() < 1e-6) N.set(1, 0, 0);
      N.normalize();
      const tw = twist ? twist(i / (GUIDE - 1)) : 0;
      if (tw) N.applyQuaternion(q.setFromAxisAngle(T, tw));
      B.crossVectors(T, N).normalize();
      this.twist[l][i] = tw;
      const o = (l * 3 * GUIDE + i) * 4;
      this.data[o] = P[i].x;
      this.data[o + 1] = P[i].y;
      this.data[o + 2] = P[i].z;
      const on = o + GUIDE * 4;
      this.data[on] = N.x;
      this.data[on + 1] = N.y;
      this.data[on + 2] = N.z;
      const ob = o + GUIDE * 8;
      this.data[ob] = B.x;
      this.data[ob + 1] = B.y;
      this.data[ob + 2] = B.z;
    }
    this.tex.needsUpdate = true;
  }
}

export type HairUniforms = {
  uGuide: { value: THREE.Texture };
  uRes: { value: THREE.Vector2 };
  uTime: { value: number };
  uWidthPx: { value: number };
  /** Lock size per row: x = width, y = thickness, z = clump strength, w = wiggle (world units). */
  uLock: { value: THREE.Vector4[] };
  /** Strands grow to this length (0..1), for the intro. */
  uReveal: { value: number };
  /** Comb: xyz = point, w = strength; uCombR = radius. Strands part around it and lift. */
  uComb: { value: THREE.Vector4 };
  uCombR: { value: number };
  /** A second, larger parting (the camera's way through on scroll). */
  uPart: { value: THREE.Vector4 };
  uPartR: { value: number };
  uLightDir: { value: THREE.Vector3 };
  uLightColor: { value: THREE.Color };
  uRimDir: { value: THREE.Vector3 };
  uRimColor: { value: THREE.Color };
  uAmbient: { value: THREE.Color };
  uSpec: { value: THREE.Vector4 };
  uFog: { value: THREE.Vector4 };
  uFogColor: { value: THREE.Color };
};

const vert = /* glsl */ `
  #define GUIDE ${GUIDE}.0
  uniform sampler2D uGuide;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uWidthPx;
  uniform vec4 uLock[LOCKS];
  uniform float uReveal;
  uniform vec4 uComb;
  uniform float uCombR;
  uniform vec4 uPart;
  uniform float uPartR;
  uniform vec3 uRoot[LOCKS];
  uniform vec3 uTip[LOCKS];
  uniform float uProfile[LOCKS * 8];
  uniform float uFan;
  uniform vec4 uWave;

  attribute vec2 aT;
  attribute vec4 aCross;
  attribute vec4 aRand;
  attribute vec2 aMeta;

  varying vec3 vTan;
  varying vec3 vPos;
  varying vec3 vCol;
  varying float vAo;
  varying float vT;
  varying float vSeed;

  vec3 fetchRow(float row, float t) {
    float x = clamp(t, 0.0, 1.0) * (GUIDE - 1.0);
    float i = floor(x);
    vec3 a = texelFetch(uGuide, ivec2(int(i), int(row)), 0).xyz;
    vec3 b = texelFetch(uGuide, ivec2(int(min(i + 1.0, GUIDE - 1.0)), int(row)), 0).xyz;
    return mix(a, b, x - i);
  }

  float profileAt(int lock, float t) {
    float x = clamp(t, 0.0, 1.0) * 7.0;
    int i = int(floor(x));
    int j = min(i + 1, 7);
    return mix(uProfile[lock * 8 + i], uProfile[lock * 8 + j], x - float(i));
  }

  // One point of this strand at length t, and the strand's local frame there
  vec3 strandAt(float t, out vec3 T, out vec3 N, out vec3 B) {
    int lock = int(aMeta.x + 0.5);
    float row = aMeta.x * 3.0;
    vec3 P = fetchRow(row, t);
    vec3 P2 = fetchRow(row, t + 0.004);
    vec3 P0 = fetchRow(row, t - 0.004);
    T = normalize(P2 - P0);
    N = normalize(fetchRow(row + 1.0, t));
    B = normalize(fetchRow(row + 2.0, t));
    vec4 L = uLock[lock];
    float w = profileAt(lock, t);
    // Strands gather into their clump towards the tip
    float k = L.z * smoothstep(0.25, 1.0, t);
    vec2 uv = mix(aCross.xy, aCross.zw, k);
    // ...and the clumps part from each other at the ends
    uv += aCross.zw * uFan * smoothstep(0.55, 1.0, t);
    // A slow, individual wave, stronger at the free end
    float amp = L.w * (0.25 + 0.75 * t * t);
    // A few flyaways leave the lock towards the ends
    amp *= aMeta.y > 0.965 ? 1.0 + 9.0 * smoothstep(0.35, 1.0, t) : 1.0;
    float ph = aRand.x + t * (7.0 + 3.0 * aRand.z) - uTime * 0.9;
    float ph2 = aRand.y + t * 11.0 - uTime * 0.6;
    vec3 off = N * (uv.x * L.x * w + sin(ph) * amp) + B * (uv.y * L.y * w + cos(ph2) * amp * 0.6);
    // Blow-dried waves across the lock: slanted a little across its width, so the highlights do not stripe
    float wv = sin(t * uWave.x - uTime * uWave.z + uv.x * uWave.w) + 0.55 * sin(t * uWave.x * 0.41 + 1.7 - uTime * uWave.z * 0.6 - uv.x * uWave.w * 0.6);
    off += B * wv * uWave.y * min(1.0, t * 4.0);
    return P + off;
  }

  vec3 comb(vec3 p, vec3 T, vec4 c, float r, float lift) {
    vec3 d = p - c.xyz;
    d.z *= 0.35;
    float f = exp(-dot(d, d) / (r * r)) * c.w;
    // Push sideways (across the strand) and up towards the viewer
    vec3 side = d - T * dot(d, T);
    side.z = 0.0;
    float sl = length(side);
    side = sl > 1e-3 ? side / sl : vec3(0.0);
    return p + side * f * r * 0.9 + vec3(0.0, 0.0, f * lift);
  }

  void main() {
    float len = aRand.w;
    float tMax = min(len, uReveal * (1.0 + 0.06 * aMeta.y));
    float t = aT.x * tMax;
    vec3 T; vec3 N; vec3 B;
    vec3 p = strandAt(t, T, N, B);
    vec3 Ta; vec3 Na; vec3 Ba;
    vec3 pa = strandAt(t + 0.01, Ta, Na, Ba);
    p = comb(p, T, uComb, uCombR, uCombR * 0.8);
    pa = comb(pa, T, uComb, uCombR, uCombR * 0.8);
    p = comb(p, T, uPart, uPartR, uPartR * 1.4);
    pa = comb(pa, T, uPart, uPartR, uPartR * 1.4);
    vec3 tan = normalize(pa - p);

    int lock = int(aMeta.x + 0.5);
    vPos = p;
    vT = aT.x;
    vSeed = aMeta.y;
    // A strand is never perfectly straight: tilt the tangent a little so highlights break up
    vTan = normalize(tan + N * sin(aRand.x * 3.0 + t * 40.0) * 0.06 + B * cos(aRand.y * 5.0 + t * 23.0) * 0.06);

    // Self-shadowing: strands on the lock's far side and deep inside are darker
    vec3 V = normalize(cameraPosition - p);
    float facing = aCross.y * sign(dot(B, V));
    float depth = length(aCross.xy);
    vAo = mix(0.22, 1.0, smoothstep(-0.9, 0.9, facing)) * mix(1.0, 0.7, (1.0 - depth) * 0.6);
    // Clumps differ a little in shade, the banding real hair has
    float ch = fract(sin(dot(aCross.zw, vec2(12.9898, 78.233))) * 43758.5453);
    vAo *= 0.68 + 0.32 * ch;
    // Melanin: roots darker, tips lighter, each strand its own shade
    float light = 1.0 + aRand.z * SPREAD;
    vCol = mix(uRoot[lock], uTip[lock], smoothstep(0.0, 1.0, t)) * light;

    vec4 c0 = projectionMatrix * viewMatrix * vec4(p, 1.0);
    vec4 c1 = projectionMatrix * viewMatrix * vec4(pa, 1.0);
    vec2 s0 = c0.xy / c0.w;
    vec2 s1 = c1.xy / c1.w;
    vec2 dir = (s1 - s0) * uRes;
    dir = length(dir) > 1e-5 ? normalize(dir) : vec2(1.0, 0.0);
    vec2 nrm = vec2(-dir.y, dir.x);
    // Thinner towards the tip; a strand cut short ends in a point
    float wpx = uWidthPx * (1.0 - 0.55 * aT.x * aT.x);
    #ifdef SHADOW
      wpx = uWidthPx;
    #endif
    c0.xy += nrm * aT.y * wpx / uRes * c0.w;
    gl_Position = c0;
  }
`;

const frag = /* glsl */ `
  uniform vec3 uLightDir;
  uniform vec3 uLightColor;
  uniform vec3 uRimDir;
  uniform vec3 uRimColor;
  uniform vec3 uAmbient;
  uniform vec4 uSpec;
  uniform vec4 uFog;
  uniform vec3 uFogColor;

  varying vec3 vTan;
  varying vec3 vPos;
  varying vec3 vCol;
  varying float vAo;
  varying float vT;
  varying float vSeed;

  float kk(vec3 T, vec3 H, float p) {
    float th = dot(T, H);
    return pow(sqrt(max(0.0, 1.0 - th * th)), p);
  }

  void main() {
    #ifdef SHADOW
      gl_FragColor = vec4(1.0);
      return;
    #endif
    vec3 T = normalize(vTan);
    vec3 V = normalize(cameraPosition - vPos);
    vec3 L = normalize(uLightDir);
    vec3 Nv = normalize(V - T * dot(V, T));

    float tl = dot(T, L);
    float diff = sqrt(max(0.0, 1.0 - tl * tl));
    diff = mix(0.18, 1.0, diff) * (0.55 + 0.45 * max(0.0, dot(Nv, L) * 0.5 + 0.5));

    vec3 H = normalize(L + V);
    // Primary: white, shifted towards the root; secondary: the hair's own colour, shifted towards the tip
    float s1 = kk(normalize(T + Nv * uSpec.z), H, 180.0);
    float glint = 0.35 + 0.65 * pow(0.5 + 0.5 * sin(vSeed * 91.0 + vT * 37.0), 2.0);
    float s2 = kk(normalize(T - Nv * uSpec.z * 1.6), H, 26.0) * glint;

    vec3 R = normalize(uRimDir);
    float rim = kk(T, normalize(R + V), 30.0) * 0.6;

    vec3 col = vCol * (uAmbient + uLightColor * diff) * vAo;
    col += uLightColor * vec3(1.0, 0.86, 0.7) * s1 * uSpec.x * vAo * glint;
    col += vCol * uLightColor * s2 * uSpec.y * (0.4 + 0.6 * vAo);
    col += uRimColor * rim * vAo;

    float dist = length(cameraPosition - vPos);
    col = mix(col, uFogColor, smoothstep(uFog.x, uFog.y, dist) * uFog.z);

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/** The material for `locks` locks sharing one guide texture. */
export function hairMaterial(guides: Guides, looks: LockShape[], opts: { spread?: number; shadow?: boolean } = {}) {
  const n = looks.length;
  const toLinear = (hex: string) => new THREE.Color(hex);
  const profile: number[] = [];
  looks.forEach((l) => {
    for (let i = 0; i < 8; i++) profile.push(l.profile(i / 7));
  });
  const uniforms = {
    uGuide: { value: guides.tex },
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uWidthPx: { value: 1.4 },
    uLock: { value: looks.map((l) => new THREE.Vector4(l.width, l.thickness, l.clump, 1.2)) },
    uRoot: { value: looks.map((l) => toLinear(l.root)) },
    uTip: { value: looks.map((l) => toLinear(l.tip)) },
    uProfile: { value: profile },
    uFan: { value: 0 },
    uWave: { value: new THREE.Vector4(0, 0, 0, 0) },
    uReveal: { value: 1 },
    uComb: { value: new THREE.Vector4(0, 0, 0, 0) },
    uCombR: { value: 60 },
    uPart: { value: new THREE.Vector4(0, 0, 0, 0) },
    uPartR: { value: 100 },
    uLightDir: { value: new THREE.Vector3(-0.45, 0.55, 0.7).normalize() },
    uLightColor: { value: new THREE.Color(1, 0.95, 0.88) },
    uRimDir: { value: new THREE.Vector3(0.5, 0.3, -0.8).normalize() },
    uRimColor: { value: new THREE.Color(0.9, 0.55, 0.35) },
    uAmbient: { value: new THREE.Color(0.16, 0.12, 0.11) },
    uSpec: { value: new THREE.Vector4(0.55, 0.9, 0.12, 0) },
    uFog: { value: new THREE.Vector4(1e6, 2e6, 0, 0) },
    uFogColor: { value: new THREE.Color(0, 0, 0) },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    defines: { LOCKS: n, SPREAD: (opts.spread ?? 0.3).toFixed(3), ...(opts.shadow ? { SHADOW: 1 } : {}) },
    side: THREE.DoubleSide,
    toneMapped: true,
  });
  if (opts.shadow) {
    mat.blending = THREE.AdditiveBlending;
    mat.depthTest = false;
    mat.depthWrite = false;
    mat.transparent = true;
  }
  return mat as THREE.ShaderMaterial & { uniforms: HairUniforms & Record<string, THREE.IUniform> };
}

/** Build a lock mesh (one draw call) for lock row `row` of `guides`. */
export function lockMesh(shape: LockShape, row: number, material: THREE.Material) {
  const mesh = new THREE.Mesh(lockGeometry(shape, row), material);
  mesh.frustumCulled = false;
  return mesh;
}
