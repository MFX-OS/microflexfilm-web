"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ============================================================================
   Microflex 3D Packaging Configurator
   Self-contained client component (imperative Three.js inside refs).
   Imported with next/dynamic({ ssr:false }) from /configurator.
   ============================================================================ */

type FormatKind = "pouch" | "roll" | "sleeve" | "label";
type Fmt = {
  label: string;
  kind: FormatKind;
  profile?: "standup" | "pillow" | "bag";
  power?: number;
  depth?: number;
  narrow?: number;
  wide?: number;
  zipperOk?: boolean;
};

const FORMATS: Record<string, Fmt> = {
  standup: { label: "Stand-Up Pouch", kind: "pouch", profile: "standup", power: 2.3, depth: 0.42, zipperOk: true },
  flat: { label: "Flat Pouch", kind: "pouch", profile: "pillow", power: 2.0, depth: 0.18 },
  quad: { label: "Quad-Seal Bag", kind: "pouch", profile: "bag", power: 3.6, depth: 0.6, zipperOk: true },
  box: { label: "Box-Bottom Bag", kind: "pouch", profile: "bag", power: 3.2, depth: 0.64, zipperOk: true },
  spout: { label: "Spouted Pouch", kind: "pouch", profile: "standup", power: 2.3, depth: 0.42 },
  stick: { label: "Stick Pack", kind: "pouch", profile: "pillow", power: 2.3, depth: 0.55, narrow: 0.32 },
  sachet: { label: "Sachet", kind: "pouch", profile: "pillow", power: 2.0, depth: 0.14, wide: 1.25 },
  roll: { label: "Rollstock", kind: "roll" },
  sleeve: { label: "Shrink Sleeve", kind: "sleeve" },
  label: { label: "Label", kind: "label" },
};

const PRESETS: Record<string, { label: string; format: string; finish: string; color: string; w: number; h: number }> = {
  coffee: { label: "Coffee Bag", format: "box", finish: "matte", color: "#1a1a1a", w: 130, h: 220 },
  supplement: { label: "Supplement Pouch", format: "standup", finish: "gloss", color: "#1f8a4c", w: 150, h: 210 },
  sample: { label: "Sample Sachet", format: "sachet", finish: "metallic", color: "#c0c4c8", w: 80, h: 90 },
  liquid: { label: "Liquid Spouted", format: "spout", finish: "gloss", color: "#00a8cf", w: 120, h: 190 },
  stickpack: { label: "Stick Pack", format: "stick", finish: "matte", color: "#e1a93a", w: 120, h: 180 },
};

const FINISHES = ["matte", "gloss", "metallic", "kraft"] as const;
const SWATCHES = ["#00d8f2", "#0c2133", "#eef1f5", "#1f8a4c", "#c0392b", "#e1a93a", "#1a1a1a"];

/* ---------- estimate (transparent heuristic — swap for real OS pricing) ---------- */
function estimate(format: string, w: number, h: number, finish: string) {
  const F = FORMATS[format];
  const frontArea = (w * h) / 100; // cm² (one face)
  const faces = F.kind === "label" ? 1 : 2;
  const areaCm2 = frontArea * faces * 1.15; // + seals/gusset
  let perUnitMaterial = areaCm2 * 0.00055; // $/cm² film, rough
  if (finish === "metallic") perUnitMaterial *= 1.22;
  if (finish === "gloss") perUnitMaterial *= 1.08;
  const moq =
    format === "roll" ? 25000 : ["stick", "sachet", "sleeve", "label"].includes(format) ? 10000 : 5000;
  const setup = 950; // plates/dies amortized
  const unit = perUnitMaterial + setup / moq;
  const unitLo = unit * 0.82, unitHi = unit * 1.28; // indicative band
  return { moq, unitLo, unitHi, totalLo: unitLo * moq, totalHi: unitHi * moq, lead: "~15 business days from proof approval" };
}

/* ---------- capacity ---------- */
function capacity(format: string, w: number, h: number) {
  const F = FORMATS[format];
  if (F.kind === "label" || F.kind === "roll" || F.kind === "sleeve") return null;
  const d = w * (F.depth ?? 0.4); // mm
  const volMl = (w * h * d * 0.32) / 1000; // fill factor → ml
  const coffeeG = Math.round(volMl * 0.4);
  return { volMl: Math.round(volMl), coffeeG };
}

/* ---------- geometry helpers ---------- */
function smooth(a: number) { return a * a * (3 - 2 * a); }
type Profile = { ts: number; bg: number; rx: (t: number) => number; rz: (t: number) => number };
function profile(type: string): Profile {
  const ts = type === "bag" ? 0.91 : 0.89;
  const bg = type === "standup" ? 0.16 : type === "bag" ? 0.12 : 0.1;
  return {
    ts, bg,
    rx(t) { let r = 1; if (t > ts) r = 1 - 0.1 * smooth((t - ts) / (1 - ts)); if (type === "standup" && t < bg) r = 1 + 0.05 * smooth(1 - t / bg); return r; },
    rz(t) {
      if (t > ts) return 0.05;
      if (type === "pillow") { if (t < bg) return 0.06; const u = (t - bg) / (ts - bg); return 0.12 + 0.5 * Math.pow(Math.sin(Math.PI * u), 0.9); }
      if (type === "bag") { if (t < bg) return 0.3 + 0.45 * smooth(t / bg); const u = (t - bg) / (ts - bg); return 0.55 + 0.45 * Math.pow(Math.sin(Math.PI * u), 1.3); }
      if (t < bg) { const u = t / bg; return 0.16 + 0.42 * smooth(u); }
      const u = (t - bg) / (ts - bg); return 0.14 + 0.62 * Math.pow(Math.sin(Math.PI * u), 0.9);
    },
  };
}
function se(rx: number, rz: number, a: number, p: number): [number, number] {
  const ca = Math.cos(a), sa = Math.sin(a), e = 2 / p;
  return [rx * Math.sign(ca) * Math.pow(Math.abs(ca), e), rz * Math.sign(sa) * Math.pow(Math.abs(sa), e)];
}
function buildPouchGeo(W: number, H: number, D: number, F: Fmt): THREE.BufferGeometry {
  const P = profile(F.profile ?? "standup"), R = 58, S = 72, rxB = W / 2, p = F.power ?? 2;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= R; i++) {
    const t = i / R, y = (t - 0.5) * H, rx = rxB * P.rx(t), rz = (D / 2) * P.rz(t);
    for (let j = 0; j <= S; j++) { const a = (j / S) * Math.PI * 2; const [x, z] = se(rx, rz, a, p); pos.push(x, y, z); uv.push(j / S, t); }
  }
  const W1 = S + 1;
  for (let i = 0; i < R; i++) for (let j = 0; j < S; j++) { const q = i * W1 + j; idx.push(q, q + 1, q + W1, q + 1, q + W1 + 1, q + W1); }
  const cap = (ring: number, yc: number, flip: boolean) => {
    const ci = pos.length / 3; pos.push(0, yc, 0); uv.push(0.5, flip ? 1 : 0);
    for (let j = 0; j < S; j++) { const a = ring * W1 + j, b = ring * W1 + j + 1; if (flip) idx.push(ci, b, a); else idx.push(ci, a, b); }
  };
  cap(R, 0.5 * H, true); cap(0, -0.5 * H, false);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function buildArtGeo(W: number, H: number, D: number, F: Fmt): THREE.BufferGeometry {
  const P = profile(F.profile ?? "standup"), gx = 30, gy = 42, cov = 0.82, p = F.power ?? 2;
  const tLo = P.bg + 0.05, tHi = P.ts - 0.05, rxB = W / 2;
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let r = 0; r <= gy; r++) {
    const t = tLo + (tHi - tLo) * (r / gy), y = (t - 0.5) * H, rxBody = rxB * P.rx(t), rz = (D / 2) * P.rz(t);
    for (let c = 0; c <= gx; c++) {
      const f = (c / gx) * 2 - 1, x = rxBody * cov * f;
      const k = Math.min(1, Math.abs(cov * f)), zf = rz * Math.pow(Math.max(0, 1 - Math.pow(k, p)), 1 / p);
      pos.push(x, y, zf + 0.015); uv.push(c / gx, r / gy);
    }
  }
  const W1 = gx + 1;
  for (let r = 0; r < gy; r++) for (let c = 0; c < gx; c++) { const q = r * W1 + c; idx.push(q, q + W1, q + 1, q + 1, q + W1, q + W1 + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2); s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r); s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}
function defaultArtCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas"); c.width = 560; c.height = 720; const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, 0, 720); g.addColorStop(0, "#102a40"); g.addColorStop(1, "#06121d"); x.fillStyle = g; x.fillRect(0, 0, 560, 720);
  x.strokeStyle = "rgba(0,216,242,0.55)"; x.lineWidth = 6; x.strokeRect(28, 28, 504, 664);
  x.fillStyle = "#00d8f2"; x.font = "800 34px Arial"; x.textAlign = "center"; x.fillText("YOUR ARTWORK", 280, 350);
  x.fillStyle = "#a9b9c8"; x.font = "600 19px Arial"; x.fillText("upload to preview", 280, 388);
  return c;
}

type Engine = {
  scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer;
  group: THREE.Group; env: THREE.Texture; raf: number; loader: THREE.TextureLoader;
  defaultTex: THREE.CanvasTexture; ro?: ResizeObserver;
};

export default function PackageConfigurator() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engRef = useRef<Engine | null>(null);

  const [format, setFormat] = useState("standup");
  const [finish, setFinish] = useState("matte");
  const [color, setColor] = useState("#00d8f2");
  const [w, setW] = useState(130);
  const [h, setH] = useState(200);
  const [units, setUnits] = useState<"mm" | "in">("mm");
  const [artFront, setArtFront] = useState<string | null>(null);
  const [artBack, setArtBack] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<"fill" | "stretch">("fill");
  const [guides, setGuides] = useState(false);
  const [zipper, setZipper] = useState(true);
  const [hang, setHang] = useState(false);
  const [locked, setLocked] = useState(false);

  const est = useMemo(() => estimate(format, w, h, finish), [format, w, h, finish]);
  const cap = useMemo(() => capacity(format, w, h), [format, w, h]);
  const toDisp = (mm: number) => (units === "mm" ? `${mm} mm` : `${(mm / 25.4).toFixed(2)} in`);

  /* material builders use current finish/color via closure refs */
  const finishRef = useRef(finish); finishRef.current = finish;
  const colorRef = useRef(color); colorRef.current = color;

  const bodyMaterial = useCallback((env: THREE.Texture) => {
    const f = finishRef.current, kraft = f === "kraft";
    const m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(kraft ? "#c2a06a" : colorRef.current), envMap: env, side: THREE.DoubleSide });
    if (f === "matte") { m.roughness = 0.86; m.metalness = 0; m.envMapIntensity = 0.5; }
    else if (f === "gloss") { m.roughness = 0.16; m.clearcoat = 0.9; m.clearcoatRoughness = 0.12; m.envMapIntensity = 1.2; }
    else if (f === "metallic") { m.roughness = 0.25; m.metalness = 0.95; m.envMapIntensity = 1.4; }
    else { m.roughness = 0.97; m.metalness = 0; m.envMapIntensity = 0.35; }
    return m;
  }, []);

  const artTexture = useCallback((dataUrl: string | null, panelAspect: number, wrap: boolean): THREE.Texture => {
    const eng = engRef.current!;
    if (!dataUrl) { eng.defaultTex.colorSpace = THREE.SRGBColorSpace; return eng.defaultTex; }
    const tex = eng.loader.load(dataUrl, (t: THREE.Texture) => {
      t.colorSpace = THREE.SRGBColorSpace;
      const img = t.image as { width?: number; height?: number } | undefined;
      if (!wrap && fitMode === "fill" && img && img.width && img.height) {
        const ia = img.width / img.height;
        if (ia > panelAspect) { t.repeat.set(panelAspect / ia, 1); t.offset.set((1 - panelAspect / ia) / 2, 0); }
        else { t.repeat.set(1, ia / panelAspect); t.offset.set(0, (1 - ia / panelAspect) / 2); }
        t.needsUpdate = true;
      }
    });
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = wrap ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
    return tex;
  }, [fitMode]);

  const artMaterial = useCallback((env: THREE.Texture, dataUrl: string | null, panelAspect: number, wrap: boolean) => {
    const f = finishRef.current;
    const m = new THREE.MeshPhysicalMaterial({ map: artTexture(dataUrl, panelAspect, wrap), envMap: env, side: THREE.DoubleSide });
    if (f === "gloss") { m.roughness = 0.16; m.clearcoat = 0.85; m.clearcoatRoughness = 0.12; m.envMapIntensity = 0.9; }
    else if (f === "metallic") { m.roughness = 0.32; m.metalness = 0.15; m.envMapIntensity = 0.7; }
    else if (f === "kraft") { m.roughness = 0.95; m.envMapIntensity = 0.25; }
    else { m.roughness = 0.7; m.envMapIntensity = 0.4; }
    return m;
  }, [artTexture]);

  /* ---- mount once ---- */
  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.3, 8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // studio cube → PMREM env
    const face = (kind: string) => {
      const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d")!;
      if (kind === "top") { const g = x.createRadialGradient(128, 128, 10, 128, 128, 150); g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#cfe6ef"); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }
      else if (kind === "bottom") { x.fillStyle = "#0a1622"; x.fillRect(0, 0, 256, 256); }
      else { const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, "#cfe6ef"); g.addColorStop(0.45, "#7fa7bb"); g.addColorStop(0.55, "#ffffff"); g.addColorStop(0.62, "#5d7e90"); g.addColorStop(1, "#0c1c28"); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }
      return c;
    };
    const cubeTex = new THREE.CubeTexture([face("s"), face("s"), face("top"), face("bottom"), face("s"), face("s")]);
    cubeTex.needsUpdate = true; cubeTex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromCubemap(cubeTex).texture;
    scene.environment = env;

    scene.add(new THREE.HemisphereLight(0xbfe9ff, 0x0a1622, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.0); key.position.set(4, 7, 6); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.camera.near = 1; key.shadow.camera.far = 30;
    key.shadow.camera.left = -7; key.shadow.camera.right = 7; key.shadow.camera.top = 8; key.shadow.camera.bottom = -8; key.shadow.bias = -0.0004; scene.add(key);
    const fill = new THREE.DirectionalLight(0x66d9ff, 0.32); fill.position.set(-6, 2, 4); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(0, 3, -7); scene.add(rim);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.3 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -2.5; floor.receiveShadow = true; floor.name = "floor"; scene.add(floor);

    const group = new THREE.Group(); group.rotation.y = -0.45; group.rotation.x = 0.05; scene.add(group);

    const dc = defaultArtCanvas(); const defaultTex = new THREE.CanvasTexture(dc); defaultTex.colorSpace = THREE.SRGBColorSpace;
    const loader = new THREE.TextureLoader();

    // interaction
    let drag = false, px = 0, py = 0, idle = 0;
    const down = (e: PointerEvent) => { drag = true; px = e.clientX; py = e.clientY; idle = 0; };
    const up = () => { drag = false; };
    const move = (e: PointerEvent) => { if (!drag) return; idle = 0; group.rotation.y += (e.clientX - px) * 0.01; group.rotation.x += (e.clientY - py) * 0.01; group.rotation.x = Math.max(-0.7, Math.min(0.7, group.rotation.x)); px = e.clientX; py = e.clientY; };
    const wheel = (e: WheelEvent) => { e.preventDefault(); camera.position.z = Math.max(4.5, Math.min(13, camera.position.z + e.deltaY * 0.01)); };
    renderer.domElement.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("wheel", wheel, { passive: false });

    let raf = 0;
    const tick = () => { raf = requestAnimationFrame(tick); idle++; if (idle > 110 && !drag) group.rotation.y += 0.0032; renderer.render(scene, camera); };
    tick();

    const ro = new ResizeObserver(() => { if (!mount.clientWidth) return; camera.aspect = mount.clientWidth / mount.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(mount.clientWidth, mount.clientHeight); });
    ro.observe(mount);

    engRef.current = { scene, camera, renderer, group, env, raf, loader, defaultTex, ro };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("wheel", wheel);
      pmrem.dispose(); renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      engRef.current = null;
    };
  }, []);

  /* ---- rebuild on any change ---- */
  useEffect(() => {
    const eng = engRef.current; if (!eng) return;
    const { group, env } = eng;
    while (group.children.length) { const c = group.children.pop()!; const mesh = c as THREE.Mesh; if (mesh.geometry) mesh.geometry.dispose(); }
    const F = FORMATS[format];
    const floor = eng.scene.getObjectByName("floor") as THREE.Mesh | undefined;
    let Wmm = w, Hmm = h;
    let W = Wmm / 55, H = Hmm / 55;

    if (F.kind === "roll") {
      const Rr = Math.max(W, H) * 0.34, L = Math.min(W, H) * 1.1;
      const m = new THREE.Mesh(new THREE.CylinderGeometry(Rr, Rr, L, 80, 1, false), [artMaterial(env, artFront, 2.2, true), bodyMaterial(env), bodyMaterial(env)]);
      m.rotation.z = Math.PI / 2; m.castShadow = true; group.add(m); if (floor) floor.position.y = -Rr - 0.05; return;
    }
    if (F.kind === "sleeve") {
      const Rr = W * 0.4;
      const m = new THREE.Mesh(new THREE.CylinderGeometry(Rr * 0.92, Rr, H, 80, 1, true), artMaterial(env, artFront, 2.0, true));
      m.castShadow = true; group.add(m); if (floor) floor.position.y = -H / 2 - 0.05; return;
    }
    if (F.kind === "label") {
      const shape = roundedRectShape(W, H, Math.min(W, H) * 0.12);
      const back = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false }), bodyMaterial(env)); back.castShadow = true; group.add(back);
      const front = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.96, H * 0.96), artMaterial(env, artFront, (W * 0.96) / (H * 0.96), false)); front.position.z = 0.07; group.add(front);
      if (floor) floor.position.y = -H / 2 - 0.2; return;
    }

    // pouch family
    if (F.narrow) W *= F.narrow;
    if (F.wide) W *= F.wide;
    const D = W * (F.depth ?? 0.4);
    const P = profile(F.profile ?? "standup");
    const panelAspect = (W * 0.82) / ((P.ts - P.bg - 0.1) * H);
    const bodyMesh = new THREE.Mesh(buildPouchGeo(W, H, D, F), bodyMaterial(env)); bodyMesh.castShadow = true; group.add(bodyMesh);
    const frontMesh = new THREE.Mesh(buildArtGeo(W, H, D, F), artMaterial(env, artFront, panelAspect, false)); group.add(frontMesh);
    // back artwork
    const backMesh = new THREE.Mesh(buildArtGeo(W, H, D, F), artMaterial(env, artBack ?? artFront, panelAspect, false));
    backMesh.scale.z = -1; group.add(backMesh);

    // seams
    const seamMat = new THREE.MeshPhysicalMaterial({ color: 0x000000, transparent: true, opacity: 0.16, roughness: 0.6, envMap: env, envMapIntensity: 0.3 });
    const sg = new THREE.PlaneGeometry(0.035, H * 0.92);
    const sL = new THREE.Mesh(sg, seamMat); sL.position.set((-W / 2) * 0.99, 0, 0); sL.rotation.y = Math.PI / 2; group.add(sL);
    const sR = new THREE.Mesh(sg.clone(), seamMat); sR.position.set((W / 2) * 0.99, 0, 0); sR.rotation.y = Math.PI / 2; group.add(sR);

    // zipper
    if (zipper && F.zipperOk) {
      const zMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.4, envMap: env, envMapIntensity: 0.5, transparent: true, opacity: 0.55 });
      const zip = new THREE.Mesh(new THREE.BoxGeometry(W * 0.86, H * 0.018, D * 0.5), zMat);
      zip.position.set(0, H * (P.ts - 0.5) - H * 0.03, 0); group.add(zip);
    }
    // hang hole (euro slot)
    if (hang) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(W * 0.05, W * 0.012, 12, 28), new THREE.MeshPhysicalMaterial({ color: 0x223040, roughness: 0.7, envMap: env }));
      ring.position.set(0, H * 0.5 - H * 0.02, 0); group.add(ring);
    }
    // spout + cap
    if (format === "spout") {
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.07, W * 0.08, H * 0.12, 28), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.35, envMap: env, envMapIntensity: 0.7 }));
      neck.position.set(W * 0.22, H * 0.55, 0); neck.castShadow = true; group.add(neck);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(W * 0.085, W * 0.085, H * 0.09, 28), new THREE.MeshPhysicalMaterial({ color: new THREE.Color(colorRef.current), roughness: 0.3, envMap: env, envMapIntensity: 0.8 }));
      cap.position.set(W * 0.22, H * 0.64, 0); cap.castShadow = true; group.add(cap);
    }
    // safe-area guide
    if (guides) {
      const gMat = new THREE.LineBasicMaterial({ color: 0x00d8f2, transparent: true, opacity: 0.7 });
      const gw = W * 0.7, gh = (P.ts - P.bg - 0.16) * H, zf = D * 0.5 + 0.03;
      const pts = [new THREE.Vector3(-gw / 2, -gh / 2, zf), new THREE.Vector3(gw / 2, -gh / 2, zf), new THREE.Vector3(gw / 2, gh / 2, zf), new THREE.Vector3(-gw / 2, gh / 2, zf), new THREE.Vector3(-gw / 2, -gh / 2, zf)];
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gMat); group.add(line);
    }
    if (floor) floor.position.y = -H / 2 - 0.05;
  }, [format, finish, color, w, h, artFront, artBack, fitMode, guides, zipper, hang, artMaterial, bodyMaterial]);

  /* ---- handlers ---- */
  const onUpload = (side: "front" | "back") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const url = String(reader.result); if (side === "front") setArtFront(url); else setArtBack(url); };
    reader.readAsDataURL(file);
  };
  const snapshot = () => {
    const eng = engRef.current; if (!eng) return;
    eng.renderer.render(eng.scene, eng.camera);
    const url = eng.renderer.domElement.toDataURL("image/png");
    const a = document.createElement("a"); a.href = url; a.download = `microflex-${format}-mockup.png`; a.click();
  };
  const applyPreset = (key: string) => { const p = PRESETS[key]; setFormat(p.format); setFinish(p.finish); setColor(p.color); setW(p.w); setH(p.h); };
  const lockSpec = () => {
    const spec = { format: FORMATS[format].label, finish, color, w, h, units };
    try { sessionStorage.setItem("mfx_spec", JSON.stringify(spec)); } catch {}
    setLocked(true);
    setTimeout(() => { window.location.href = "/#quote-form"; }, 1200);
  };

  /* ---- UI ---- */
  const Btn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" onClick={onClick}
      className="rounded-[9px] px-2.5 py-2 text-[11.5px] font-bold transition"
      style={{ border: `1px solid ${active ? "rgba(0,216,242,0.7)" : "rgba(255,255,255,0.14)"}`, background: active ? "linear-gradient(135deg, rgba(0,216,242,0.2), rgba(0,168,207,0.1))" : "rgba(255,255,255,0.03)", color: active ? "#34e3f5" : "#a9b9c8" }}>
      {children}
    </button>
  );
  const lbl = "mb-2 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-muted";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
      {/* stage */}
      <div className="relative overflow-hidden rounded-4xl" style={{ border: "1px solid rgba(0,216,242,0.25)", background: "radial-gradient(circle at 50% 30%, #112536, #050b12 72%)", minHeight: 520 }}>
        <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-muted">Drag to rotate · scroll to zoom</div>
        <button type="button" onClick={snapshot} className="absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ border: "1px solid rgba(0,216,242,0.4)", background: "rgba(6,18,29,0.7)", color: "#34e3f5" }}>↓ Snapshot</button>
      </div>

      {/* panel */}
      <div className="rounded-4xl p-5" style={{ border: "1px solid rgba(0,216,242,0.2)", background: "rgba(255,255,255,0.03)" }}>
        <div className="mb-4">
          <span className={lbl}>Presets</span>
          <div className="flex flex-wrap gap-2">{Object.keys(PRESETS).map((k) => <Btn key={k} active={false} onClick={() => applyPreset(k)}>{PRESETS[k].label}</Btn>)}</div>
        </div>

        <div className="mb-4">
          <span className={lbl}>Format</span>
          <div className="grid grid-cols-2 gap-2">{Object.keys(FORMATS).map((k) => <Btn key={k} active={format === k} onClick={() => setFormat(k)}>{FORMATS[k].label}</Btn>)}</div>
        </div>

        <div className="mb-4">
          <span className={lbl}>Finish</span>
          <div className="flex flex-wrap gap-2">{FINISHES.map((f) => <Btn key={f} active={finish === f} onClick={() => setFinish(f)}>{f[0].toUpperCase() + f.slice(1)}</Btn>)}</div>
        </div>

        <div className="mb-4">
          <span className={lbl}>Base color</span>
          <div className="flex flex-wrap items-center gap-2">
            {SWATCHES.map((c) => <button key={c} type="button" onClick={() => setColor(c)} aria-label={c} className="h-7 w-7 rounded-lg" style={{ background: c, border: color === c ? "2px solid #fff" : "2px solid transparent" }} />)}
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-7 w-7 cursor-pointer border-0 bg-transparent p-0" />
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className={lbl} style={{ margin: 0 }}>Dimensions</span>
            <button type="button" onClick={() => setUnits(units === "mm" ? "in" : "mm")} className="text-[10px] font-bold text-cyan">{units.toUpperCase()} ⇄</button>
          </div>
          <div className="mb-1 flex justify-between text-[11px] text-muted"><span>Width</span><span>{toDisp(w)}</span></div>
          <input type="range" min={60} max={240} value={w} onChange={(e) => setW(+e.target.value)} className="w-full" style={{ accentColor: "#00d8f2" }} />
          <div className="mb-1 mt-2 flex justify-between text-[11px] text-muted"><span>Height</span><span>{toDisp(h)}</span></div>
          <input type="range" min={80} max={320} value={h} onChange={(e) => setH(+e.target.value)} className="w-full" style={{ accentColor: "#00d8f2" }} />
        </div>

        <div className="mb-4">
          <span className={lbl}>Artwork</span>
          <div className="grid grid-cols-2 gap-2">
            <label className="cursor-pointer rounded-[10px] border border-dashed px-2 py-2 text-center text-[11px] font-bold text-cyan" style={{ borderColor: "rgba(0,216,242,0.5)", background: "rgba(0,216,242,0.05)" }}>{artFront ? "Front ✓" : "Front art"}<input type="file" accept="image/*" onChange={onUpload("front")} className="hidden" /></label>
            <label className="cursor-pointer rounded-[10px] border border-dashed px-2 py-2 text-center text-[11px] font-bold text-cyan" style={{ borderColor: "rgba(0,216,242,0.5)", background: "rgba(0,216,242,0.05)" }}>{artBack ? "Back ✓" : "Back art"}<input type="file" accept="image/*" onChange={onUpload("back")} className="hidden" /></label>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Btn active={fitMode === "fill"} onClick={() => setFitMode("fill")}>Fill</Btn>
            <Btn active={fitMode === "stretch"} onClick={() => setFitMode("stretch")}>Stretch</Btn>
            <Btn active={guides} onClick={() => setGuides(!guides)}>Safe area</Btn>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Btn active={zipper} onClick={() => setZipper(!zipper)}>Zipper</Btn>
            <Btn active={hang} onClick={() => setHang(!hang)}>Hang hole</Btn>
          </div>
        </div>

        {/* estimate + capacity */}
        <div className="mb-4 rounded-2xl p-3" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(2,5,9,0.35)" }}>
          <div className="flex justify-between text-[12px]"><span className="text-muted">Indicative unit price</span><span className="font-bold text-paper">${est.unitLo.toFixed(2)}–${est.unitHi.toFixed(2)}</span></div>
          <div className="flex justify-between text-[12px]"><span className="text-muted">Typical MOQ</span><span className="font-bold text-paper">{est.moq.toLocaleString()}</span></div>
          <div className="flex justify-between text-[12px]"><span className="text-muted">Indicative total</span><span className="font-bold text-cyan">${Math.round(est.totalLo).toLocaleString()}–${Math.round(est.totalHi).toLocaleString()}</span></div>
          {cap && <div className="flex justify-between text-[12px]"><span className="text-muted">Capacity</span><span className="font-bold text-paper">~{cap.coffeeG} g coffee</span></div>}
          <div className="mt-1 text-[10px] text-muted-dark">{est.lead} · indicative range — confirmed on quote</div>
        </div>

        <button type="button" onClick={lockSpec} className="block w-full rounded-full py-3 text-[13px] font-extrabold" style={{ background: "linear-gradient(135deg,#00d8f2,#00a8cf)", color: "#001018" }}>
          {locked ? "Spec saved — opening quote…" : "Lock this spec → Get a quote"}
        </button>
        <p className="mt-3 text-[10px] leading-relaxed text-muted-dark">Live prototype. Price/MOQ/lead are estimates; production wires these to your real pricing and saves the configured spec to the client portal.</p>
      </div>
    </div>
  );
}
