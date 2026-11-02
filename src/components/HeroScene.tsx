import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import mark from '../brand/mark.json';

export type SceneProps = {
  /** 0..1, progreso de scroll del hero (lo escribe GSAP, no React). */
  progress: { current: number };
  reduced: boolean;
  active: boolean;
};

const NEON = new THREE.Color('#ff3d57');
const SODIUM = new THREE.Color('#f2a94e');
const SIGNAL = new THREE.Color('#6fd8e2');

/* Parpadeo de tubo de neón: arranque irregular y alguna caída ocasional. */
function flicker(t: number) {
  if (t < 0.35) return 0;
  if (t < 1.6) {
    const s = Math.sin(t * 61.3) * Math.sin(t * 23.7 + 1.3);
    return s > 0.15 ? 1 : 0.08;
  }
  const cycle = t % 7.3;
  if (cycle > 6.9 && cycle < 7.05) return 0.25;
  return 0.94 + Math.sin(t * 50) * 0.03;
}

function softDot() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Sigil({ progress, reduced }: { progress: { current: number }; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const faceMat = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const { size } = useThree();
  const narrow = size.width < 760;

  const { geo, tubes } = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mark.viewBox}"><path d="${mark.path}"/></svg>`;
    const data = new SVGLoader().parse(svg);
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const g = new THREE.ExtrudeGeometry(shapes, { depth: 16, bevelEnabled: true, bevelThickness: 1, bevelSize: 0.6, bevelSegments: 2, curveSegments: 18 });
    g.computeBoundingBox();
    const c = new THREE.Vector3();
    g.boundingBox!.getCenter(c);
    g.translate(-c.x, -c.y, -c.z);
    const front = g.boundingBox!.max.z - c.z + 1.8;
    // tubo de neón que recorre el contorno frontal de la marca
    const loops = shapes.flatMap((sh) => [sh.getPoints(18), ...sh.holes.map((h) => h.getPoints(18))]);
    const tubes = loops.map((pts) => {
      const path = new THREE.CurvePath<THREE.Vector3>();
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i], b = pts[(i + 1) % pts.length];
        if (a.distanceTo(b) < 0.01) continue;
        path.add(new THREE.LineCurve3(new THREE.Vector3(a.x - c.x, a.y - c.y, front), new THREE.Vector3(b.x - c.x, b.y - c.y, front)));
      }
      return new THREE.TubeGeometry(path, Math.max(64, pts.length * 6), 1.9, 10, true);
    });
    return { geo: g, tubes };
  }, []);

  useEffect(() => () => { geo.dispose(); tubes.forEach((t) => t.dispose()); }, [geo, tubes]);

  const neonBright = useMemo(() => NEON.clone().multiplyScalar(4.2), []);
  const tubeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: neonBright, toneMapped: false }), [neonBright]);
  useEffect(() => () => tubeMat.dispose(), [tubeMat]);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const p = progress.current;
    const f = reduced ? 1 : flicker(t);

    const baseX = narrow ? 0 : 1.95;
    const baseY = narrow ? 0.85 : 0.15;
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;
    const k = 1 - Math.pow(0.002, delta);
    g.rotation.y += ((reduced ? -0.35 : Math.sin(t * 0.32) * 0.22 - 0.3) + px * 0.45 + p * 1.4 - g.rotation.y) * k;
    g.rotation.x += (-py * 0.22 + p * 0.25 - g.rotation.x) * k;
    g.position.x += (baseX + px * 0.15 - g.position.x) * k;
    g.position.y = baseY + (reduced ? 0 : Math.sin(t * 0.8) * 0.06) + p * 1.2;

    tmp.copy(neonBright).multiplyScalar(Math.max(0.04, f * (1 - p * 0.6)));
    tubeMat.color.copy(tmp);
    if (faceMat.current) faceMat.current.emissiveIntensity = 0.05 * f;
    if (light.current) light.current.intensity = 18 * f * (1 - p * 0.5);
  });

  const s = narrow ? 0.018 : 0.021;
  return (
    <group ref={group}>
      <group scale={[s, -s, s]}>
        <mesh geometry={geo}>
          <meshStandardMaterial ref={faceMat} color="#100b12" metalness={0.9} roughness={0.38} emissive={NEON} emissiveIntensity={0} />
        </mesh>
        {tubes.map((t, i) => (
          <mesh key={i} geometry={t} material={tubeMat} />
        ))}
      </group>
      <pointLight ref={light} position={[0.2, -0.4, 1.6]} color={NEON} intensity={0} distance={9} decay={1.6} />
    </group>
  );
}

function Ash({ count, reduced, ember }: { count: number; reduced: boolean; ember?: boolean }) {
  const pts = useRef<THREE.Points>(null);
  const tex = useMemo(softDot, []);
  const { positions, speed, phase } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = -7 + Math.random() * 10;
      speed[i] = (ember ? 0.25 : 0.12) + Math.random() * (ember ? 0.5 : 0.25);
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speed, phase };
  }, [count, ember]);

  useEffect(() => () => tex.dispose(), [tex]);

  useFrame((state, delta) => {
    if (reduced || !pts.current) return;
    const arr = pts.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    const dir = ember ? 1 : -1;
    const d = Math.min(delta, 0.05);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += dir * speed[i] * d;
      arr[i3] += Math.sin(t * 0.6 + phase[i]) * 0.12 * d + 0.04 * d;
      if (arr[i3 + 1] < -5.5) arr[i3 + 1] = 5.5;
      if (arr[i3 + 1] > 5.5) { arr[i3 + 1] = -5.5; arr[i3] = (Math.random() - 0.5) * 18; }
      if (arr[i3] > 9) arr[i3] = -9;
    }
    pts.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pts}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={tex}
        size={ember ? 0.075 : 0.05}
        color={ember ? NEON.clone().multiplyScalar(2.2) : new THREE.Color('#bdb3c6')}
        transparent
        opacity={ember ? 0.95 : 0.55}
        depthWrite={false}
        blending={ember ? THREE.AdditiveBlending : THREE.NormalBlending}
        toneMapped={!ember}
        sizeAttenuation
      />
    </points>
  );
}

/* Nubes de niebla de neón: planos con degradado radial, aditivos, que derivan. */
function NeonFog({ reduced }: { reduced: boolean }) {
  const tex = useMemo(softDot, []);
  const refs = useRef<THREE.Mesh[]>([]);
  const clouds = useMemo(
    () => [
      { c: NEON, x: 2.6, y: 0.2, z: -3.2, s: 7.5, o: 0.16 },
      { c: SODIUM, x: -4.5, y: -1.8, z: -4.5, s: 9, o: 0.07 },
      { c: SIGNAL, x: -1.5, y: 2.6, z: -5.5, s: 10, o: 0.05 },
      { c: NEON, x: 5.5, y: -2.4, z: -2, s: 6, o: 0.09 },
    ],
    [],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.position.x = clouds[i].x + Math.sin(t * 0.07 + i * 2) * 0.8;
      m.position.y = clouds[i].y + Math.cos(t * 0.05 + i) * 0.4;
    });
  });
  return (
    <>
      {clouds.map((c, i) => (
        <mesh key={i} ref={(m) => { if (m) refs.current[i] = m; }} position={[c.x, c.y, c.z]}>
          <planeGeometry args={[c.s, c.s]} />
          <meshBasicMaterial map={tex} color={c.c} transparent opacity={c.o} blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
        </mesh>
      ))}
    </>
  );
}

function Rig({ progress, reduced }: { progress: { current: number }; reduced: boolean }) {
  useFrame((state, delta) => {
    const p = progress.current;
    const cam = state.camera;
    const k = 1 - Math.pow(0.01, delta);
    const tx = reduced ? 0 : state.pointer.x * 0.25;
    const ty = reduced ? 0.2 : 0.2 + state.pointer.y * 0.12;
    cam.position.x += (tx - cam.position.x) * k;
    cam.position.y += (ty - cam.position.y) * k;
    cam.position.z = 7 - p * 2.2;
    cam.lookAt(0, 0.2 + p * 0.6, 0);
    const fog = state.scene.fog as THREE.FogExp2 | null;
    if (fog) fog.density = 0.07 + p * 0.1;
  });
  return null;
}

export default function HeroScene({ progress, reduced, active }: SceneProps) {
  const narrow = typeof window !== 'undefined' && window.innerWidth < 760;
  return (
    <Canvas
      dpr={[1, narrow ? 1.5 : 1.75]}
      camera={{ position: [0, 0.2, 7], fov: 35, near: 0.1, far: 60 }}
      frameloop={!active ? 'never' : reduced ? 'demand' : 'always'}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor('#08070b');
        scene.fog = new THREE.FogExp2('#08070b', 0.07);
      }}
      aria-hidden
    >
      <ambientLight intensity={0.12} />
      <directionalLight position={[-6, 4, 3]} intensity={0.9} color={SIGNAL} />
      <pointLight position={[4, -2, -1]} intensity={14} color={SODIUM} distance={10} />
      <Rig progress={progress} reduced={reduced} />
      <NeonFog reduced={reduced} />
      <Sigil progress={progress} reduced={reduced} />
      <Ash count={narrow ? 380 : 900} reduced={reduced} />
      <Ash count={narrow ? 40 : 90} reduced={reduced} ember />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={1.7} luminanceThreshold={0.7} luminanceSmoothing={0.2} radius={0.75} />
        <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
