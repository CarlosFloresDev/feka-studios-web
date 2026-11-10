import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { BufferGeometry, Group, Mesh, MeshBasicMaterial, NearestFilter, PointLight, ShaderMaterial, SRGBColorSpace, TextureLoader, Vector3 } from 'three';

function Art({ art }: { art: string }) {
  const texture = useLoader(TextureLoader, `/media/vacas/${art}`);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.colorSpace = SRGBColorSpace;
  const portrait = art.includes('ret_');
  return <mesh position={[2, portrait ? -0.2 : 0, -4.4]}>
    <planeGeometry args={portrait ? [3.5, 5] : [7.7, 5.8]} />
    <meshBasicMaterial map={texture} transparent={portrait} toneMapped={false} />
  </mesh>;
}

function Hook({ x, z, phase }: { x: number; z: number; phase: number }) {
  const group = useRef<Group>(null);
  useFrame(({ clock }) => { if (group.current) group.current.rotation.z = Math.sin(clock.elapsedTime * 0.55 + phase) * 0.07; });
  return <group ref={group} position={[x, 3.3, z]}>
    <mesh position={[0, -0.8, 0]}><cylinderGeometry args={[0.025, 0.025, 1.6, 6]} /><meshStandardMaterial color="#6c7673" roughness={0.65} metalness={0.7} /></mesh>
    <mesh position={[0.12, -1.67, 0]} rotation={[0, 0, 0.65]}><torusGeometry args={[0.16, 0.027, 6, 14, Math.PI * 1.65]} /><meshStandardMaterial color="#6c7673" roughness={0.7} metalness={0.65} /></mesh>
  </group>;
}

const fogFragment = `varying vec2 vUv; uniform float time;
void main() { vec2 p = vUv - .5; p.x += sin(time * .12 + p.y * 3.) * .08;
float a = exp(-dot(p * vec2(2., 3.), p * vec2(2., 3.)) * 3.) * .065;
gl_FragColor = vec4(.58, .63, .60, a); }`;

function World({ art }: { art: string }) {
  const light = useRef<PointLight>(null);
  const tube = useRef<Mesh<BufferGeometry, MeshBasicMaterial>>(null);
  const fog = useRef<Mesh<BufferGeometry, ShaderMaterial>>(null);
  const pointer = useRef([0, 0]);
  const target = useMemo(() => new Vector3(), []);
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);
  const dust = useMemo(() => {
    const positions = new Float32Array(120 * 3);
    for (let i = 0; i < positions.length; i++) positions[i] = (Math.sin(i * 127.1 + 17) * 43758.5453 % 1) * 6;
    return positions;
  }, []);
  const motes = useRef<Group>(null);
  useEffect(() => {
    const move = (e: PointerEvent) => { pointer.current = [e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1]; };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  useFrame(({ camera, clock }, delta) => {
    const t = clock.elapsedTime;
    target.set(pointer.current[0] * 0.18, pointer.current[1] * -0.1, 5.5);
    camera.position.lerp(target, 1 - Math.exp(-delta * 2));
    camera.lookAt(0.3, 0, -4);
    // Una caída leve, sin destellos rápidos ni cambios de color.
    const dim = Math.sin(t * 0.67) > 0.997;
    if (light.current) light.current.intensity = 16 + Math.sin(t * 1.7) * 0.6 - (dim ? 5 : 0);
    if (tube.current) tube.current.material.color.set('#d8dfd1').multiplyScalar(dim ? 0.6 : 1);
    if (fog.current) fog.current.material.uniforms.time.value = t;
    if (motes.current) motes.current.position.y = Math.sin(t * 0.08) * 0.25;
  });
  return <>
    <color attach="background" args={['#101719']} />
    <fogExp2 attach="fog" args={['#111719', 0.043]} />
    <ambientLight intensity={0.6} color="#b6b6a2" />
    <pointLight ref={light} position={[0, 2.4, 0]} intensity={16} color="#e1e8de" distance={17} decay={2} />
    <mesh position={[0, -3.2, -3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[14, 24]} /><meshStandardMaterial color="#272c29" roughness={0.94} /></mesh>
    {/* Juntas oscuras entre azulejos: geometría compartida por filas. */}
    {[-1, 1].map(side => <group key={side} position={[side * 6, 0, -4]} rotation={[0, side * -Math.PI / 2, 0]}>
      <mesh><planeGeometry args={[20, 7]} /><meshStandardMaterial color="#2d3636" /></mesh>
      {Array.from({ length: 8 }, (_, row) => <mesh key={row} position={[0, row * 0.85 - 3, 0.015]}><boxGeometry args={[20, 0.024, 0.01]} /><meshStandardMaterial color="#0f1819" /></mesh>)}
      {Array.from({ length: 21 }, (_, col) => <mesh key={col} position={[col - 10, 0, 0.02]}><boxGeometry args={[0.025, 7, 0.01]} /><meshStandardMaterial color="#10191a" /></mesh>)}
    </group>)}
    {[-1, -4, -8].map((z, i) => <group key={z}>
      <mesh position={[0, 3.25, z]}><boxGeometry args={[12.2, 0.14, 0.18]} /><meshStandardMaterial color="#454c49" roughness={0.9} /></mesh>
      <Hook x={-3.6} z={z} phase={i} /><Hook x={4.1} z={z} phase={i + 2} />
    </group>)}
    <mesh ref={tube} position={[1.9, 2.25, -3]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.035, 0.035, 3, 8]} /><meshBasicMaterial color="#d8dfd1" /></mesh>
    <Suspense fallback={null}><Art art={art} /></Suspense>
    <mesh ref={fog} position={[1, -1.2, -0.5]} rotation={[-0.2, 0, 0]}><planeGeometry args={[18, 6]} /><shaderMaterial transparent depthWrite={false} uniforms={uniforms} vertexShader="varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}" fragmentShader={fogFragment} /></mesh>
    <group ref={motes}><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[dust, 3]} /></bufferGeometry><pointsMaterial color="#c1c6b5" size={0.018} transparent opacity={0.35} depthWrite={false} sizeAttenuation /></points></group>
  </>;
}

export default function VacasScene({ art, active }: { art: string; active: boolean }) {
  return <Canvas className="vhero__canvas" aria-hidden camera={{ position: [0, 0, 5.5], fov: 46 }} dpr={[1, 1.35]} frameloop={active ? 'always' : 'never'} gl={{ antialias: false, alpha: false, powerPreference: 'low-power' }} fallback={<span />}><World art={art} /></Canvas>;
}
