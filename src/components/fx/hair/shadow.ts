import * as THREE from "three";

const quadVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const blurFrag = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uDir;
  varying vec2 vUv;
  void main() {
    vec4 c = texture2D(uTex, vUv) * 0.2270270270;
    c += texture2D(uTex, vUv + uDir * 1.3846153846) * 0.3162162162;
    c += texture2D(uTex, vUv - uDir * 1.3846153846) * 0.3162162162;
    c += texture2D(uTex, vUv + uDir * 3.2307692308) * 0.0702702703;
    c += texture2D(uTex, vUv - uDir * 3.2307692308) * 0.0702702703;
    gl_FragColor = c;
  }
`;

/**
 * Soft shadows for hair on a flat surface. The hair is drawn from the light (orthographic) into a
 * coverage map, the map is blurred, and a catcher plane darkens by it. Strands higher above the
 * surface land further along the light, so the shadow shows how high the hair floats.
 */
export function softShadow(renderer: THREE.WebGLRenderer, cast: THREE.Scene, o: { w: number; h: number; frustum: [number, number, number, number] }) {
  const cam = new THREE.OrthographicCamera(...o.frustum, 1, 8000);
  const opts = { type: THREE.HalfFloatType, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter };
  const rtA = new THREE.WebGLRenderTarget(o.w, o.h, opts);
  const rtB = new THREE.WebGLRenderTarget(o.w / 2, o.h / 2, opts);
  const rtC = new THREE.WebGLRenderTarget(o.w / 2, o.h / 2, opts);
  const blur = new THREE.ShaderMaterial({ uniforms: { uTex: { value: null }, uDir: { value: new THREE.Vector2() } }, vertexShader: quadVert, fragmentShader: blurFrag, depthTest: false, depthWrite: false });
  const quadScene = new THREE.Scene();
  quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blur));
  const quadCam = new THREE.Camera();
  const matrix = new THREE.Matrix4();

  const catcher = (color: string, soft: number, sharp: number) =>
    new THREE.ShaderMaterial({
      uniforms: { uSoft: { value: rtB.texture }, uSharp: { value: rtA.texture }, uM: { value: matrix }, uColor: { value: new THREE.Color(color) }, uOpacity: { value: 1 }, uK: { value: new THREE.Vector2(soft, sharp) } },
      vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform sampler2D uSoft; uniform sampler2D uSharp; uniform mat4 uM; uniform vec3 uColor; uniform float uOpacity; uniform vec2 uK; varying vec3 vW;
        void main(){
          vec4 l = uM * vec4(vW, 1.0);
          vec2 uv = l.xy / l.w * 0.5 + 0.5;
          if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) discard;
          float a = (1.0 - exp(-texture2D(uSoft, uv).r * 0.35)) * uK.x + (1.0 - exp(-texture2D(uSharp, uv).r * 0.12)) * uK.y;
          gl_FragColor = vec4(uColor, a * uOpacity);
          #include <colorspace_fragment>
        }`,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });

  /** Light from `dir` (towards the light) onto `target`. */
  const render = (dir: THREE.Vector3, target: THREE.Vector3, spread = [1.6, 2.6]) => {
    cam.position.copy(target).addScaledVector(dir, 3000);
    cam.up.set(0, 1, 0);
    cam.lookAt(target);
    cam.updateMatrixWorld(true);
    matrix.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(rtA);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(cast, cam);
    const passes: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget, number, number][] = [
      [rtA, rtB, spread[0], 0],
      [rtB, rtC, 0, spread[0]],
      [rtC, rtB, spread[1], 0],
      [rtB, rtC, 0, spread[1]],
      [rtC, rtB, 1, 1],
    ];
    for (const [src, dst, dx, dy] of passes) {
      blur.uniforms.uTex.value = src.texture;
      blur.uniforms.uDir.value.set(dx / src.width, dy / src.height);
      renderer.setRenderTarget(dst);
      renderer.render(quadScene, quadCam);
    }
    renderer.setRenderTarget(prev);
  };

  /**
   * Compile the cast and blur programs for the render targets they draw into: three keys a program by
   * its target's colour space and tone mapping, so compiling them for the canvas would miss.
   */
  const compileAsync = () => {
    const prev = renderer.getRenderTarget();
    renderer.setRenderTarget(rtA);
    const shadows = renderer.compileAsync(cast, cam);
    renderer.setRenderTarget(rtB);
    const blurs = renderer.compileAsync(quadScene, quadCam);
    renderer.setRenderTarget(prev);
    return Promise.all([shadows, blurs]);
  };

  return {
    cam,
    render,
    compileAsync,
    catcher,
    size: new THREE.Vector2(o.w, o.h),
    dispose() {
      [rtA, rtB, rtC].forEach((r) => r.dispose());
      blur.dispose();
    },
  };
}
