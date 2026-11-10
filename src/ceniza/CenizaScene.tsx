import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { AdditiveBlending, DataTexture, Group, Points, RGBAFormat, ShaderMaterial, SRGBColorSpace, TextureLoader } from 'three';
import { art } from './data';

function World({ image, actor, onSlow }: { image: string; actor: string; onSlow: () => void }) {
  const [background, sprite] = useLoader(TextureLoader, image.includes('/archivo/') ? [image] : [image, art[actor]]);
  background.colorSpace = SRGBColorSpace;
  if (sprite) sprite.colorSpace = SRGBColorSpace;
  const group = useRef<Group>(null);
  const ash = useRef<Points>(null);
  const haze = useRef<ShaderMaterial>(null);
  const hazeUniforms = useMemo(() => ({ time: { value: 0 } }), []);
  const viewport = useThree(s => s.viewport);
  const elapsed = useRef({ seconds: 0, frames: 0, checked: false });
  const foregroundMask = useMemo(() => {
    const pixels = new Uint8Array(64 * 4);
    for (let y = 0; y < 64; y++) {
      const value = Math.round(Math.max(0, 1 - y / 18) * 255);
      pixels.set([value, value, value, 255], y * 4);
    }
    const texture = new DataTexture(pixels, 1, 64, RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }, []);
  useEffect(() => () => foregroundMask.dispose(), [foregroundMask]);
  const particles = useMemo(() => {
    const p = new Float32Array(180 * 3);
    // Semilla fija: el montaje de StrictMode y los cambios de idioma no cambian la escena.
    for (let i = 0; i < p.length; i++) p[i] = (Math.sin(i * 127.1 + 8) * 43758.5453 % 1) * 8;
    return p;
  }, []);
  useFrame((state, delta) => {
    const dt = Math.min(delta, .05);
    if (haze.current) haze.current.uniforms.time.value += dt;
    if (group.current) {
      group.current.position.x += (state.pointer.x * .16 - group.current.position.x) * dt * 3;
      group.current.position.y += (state.pointer.y * .08 - group.current.position.y) * dt * 3;
      group.current.rotation.y += (state.pointer.x * .012 - group.current.rotation.y) * dt * 3;
    }
    if (ash.current) {
      const position = ash.current.geometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        let y = position.getY(i) - dt * (.09 + (i % 7) * .018);
        if (y < -5) y = 5;
        position.setY(i, y);
      }
      position.needsUpdate = true;
    }
    const probe = elapsed.current;
    if (!probe.checked) {
      probe.seconds += delta; probe.frames++;
      if (probe.seconds > 6) { probe.checked = true; if (probe.frames / probe.seconds < 18) onSlow(); }
    }
  });
  const aspect = background.image.width / background.image.height;
  // El plano lejano cubre el frustum a z=-3, con margen para el movimiento de cámara.
  const h = Math.max(viewport.height * 1.65, viewport.width * 1.65 / aspect);
  return <>
    <fogExp2 attach="fog" args={['#4a3d63', .042]} />
    <ambientLight intensity={1.2} />
    <pointLight position={[3, 1, 2]} color="#9cc3d9" intensity={9} />
    <pointLight position={[-2, 0, 1]} color="#f2a94e" intensity={12} />
    <group ref={group}>
      <mesh position={[0, 0, -3]}><planeGeometry args={[h * aspect, h]} /><meshBasicMaterial map={background} fog={false} toneMapped={false} /></mesh>
      <mesh position={[0, 0, -1.3]}>
        <planeGeometry args={[h * aspect * .7875, h * .7875]} />
        <meshBasicMaterial map={background} alphaMap={foregroundMask} transparent depthWrite={false} fog={false} toneMapped={false} />
      </mesh>
      {sprite && <mesh position={[viewport.width * .32, -viewport.height * .3, .5]}>
        <planeGeometry args={[1.45 * sprite.image.width / sprite.image.height, 1.45]} />
        <meshStandardMaterial map={sprite} transparent alphaTest={.05} roughness={1} emissive="#9cc3d9" emissiveIntensity={.12} depthWrite={false} />
      </mesh>}
      <points ref={ash}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry>
        <pointsMaterial color="#f4ebdf" size={.019} transparent opacity={.5} depthWrite={false} blending={AdditiveBlending} />
      </points>
      <mesh position={[viewport.width * .22, -viewport.height * .17, 1]}>
        <planeGeometry args={[viewport.width * .7, viewport.height * .5]} />
        <shaderMaterial ref={haze} uniforms={hazeUniforms} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}
          vertexShader="varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
          fragmentShader="varying vec2 vUv; uniform float time; void main(){float drift=sin(vUv.x*12.0+time*.12)*.04+sin(vUv.x*23.0-time*.09)*.02;float mist=1.0-smoothstep(.06,.43,abs(vUv.y-.4-drift));float edge=smoothstep(0.0,.3,vUv.x)*(1.0-smoothstep(.65,1.0,vUv.x));vec3 light=mix(vec3(.32,.65,.8),vec3(.94,.5,.2),vUv.x);gl_FragColor=vec4(light,mist*edge*.12);}"
        />
      </mesh>
    </group>
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={1} intensity={.35} mipmapBlur />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  </>;
}
export default function CenizaScene({ image, actor, active, onSlow }: { image: string; actor: string; active: boolean; onSlow: () => void }) {
  return <Canvas aria-hidden camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.35]} frameloop={active ? 'always' : 'never'} gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }} fallback={null}>
    <Suspense fallback={null}><World image={image} actor={actor} onSlow={onSlow} /></Suspense>
  </Canvas>;
}
