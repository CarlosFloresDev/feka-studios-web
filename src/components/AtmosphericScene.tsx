import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { AdditiveBlending, Group, Points, ShaderMaterial, SRGBColorSpace, TextureLoader } from 'three';

// Permanent HTML cover; WebGL only adds transparent layers at real depths.
function ArtLayer({ image, neon }: { image: string; neon: boolean }) {
  const texture = useLoader(TextureLoader, image);
  texture.colorSpace = SRGBColorSpace;
  const { viewport } = useThree();
  const anchor = neon || matchMedia('(max-width: 720px)').matches ? .65 : .75;
  const uniforms = useMemo(() => ({ art: { value: texture }, aspect: { value: texture.image.width / texture.image.height }, screen: { value: viewport.aspect }, anchor: { value: anchor } }), [texture, viewport.aspect, anchor]);
  return <mesh position={[0, 0, 0]}>
    <planeGeometry args={[viewport.width * 1.04, viewport.height * 1.04]} />
    <shaderMaterial transparent depthWrite={false} uniforms={uniforms} toneMapped={false}
      vertexShader="varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }"
      fragmentShader="varying vec2 vUv; uniform sampler2D art; uniform float aspect, screen, anchor; void main(){vec2 uv=vUv; if(aspect>screen){float k=screen/aspect;uv.x=uv.x*k+(1.-k)*anchor;}else{float k=aspect/screen;uv.y=uv.y*k+(1.-k)*.5;} vec4 c=texture2D(art,uv); float mask=(1.-smoothstep(.05,.32,vUv.y))*.45; gl_FragColor=vec4(c.rgb,mask*c.a);}" />
  </mesh>;
}
function Sprite({ image }: { image: string }) {
  const texture = useLoader(TextureLoader, image);
  texture.colorSpace = SRGBColorSpace;
  const { viewport } = useThree();
  const height = Math.min(1.7, viewport.height * .32);
  return <mesh position={[viewport.width * .32, -viewport.height * .27, .8]}>
    <planeGeometry args={[height * texture.image.width / texture.image.height, height]} />
    <meshBasicMaterial map={texture} transparent alphaTest={.04} depthWrite={false} toneMapped={false} />
  </mesh>;
}
function Hook({ x, z, phase, reduced }: { x: number; z: number; phase: number; reduced: boolean }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * (reduced ? .12 : .65) + phase) * (reduced ? .012 : .16); });
  return <group ref={ref} position={[x, 3, z]}>
    <mesh position={[0,-1,0]}><cylinderGeometry args={[.025,.025,2,6]} /><meshStandardMaterial color="#a1aaa0" roughness={.5} metalness={.8} /></mesh>
    <mesh position={[.16,-2.15,0]} rotation={[.2,.3,.5]}><torusGeometry args={[.23,.045,8,22,Math.PI*1.7]} /><meshStandardMaterial color="#b1b4a4" roughness={.4} metalness={.8} /></mesh>
  </group>;
}
function World({ image, neon, reduced, actor }: { image: string; neon: boolean; reduced: boolean; actor?: string }) {
  const { viewport } = useThree();
  const particles = useRef<Points>(null);
  const mist = useRef<ShaderMaterial>(null);
  const input = useRef({ x: 0, y: 0, scroll: 0 });
  const mobile = matchMedia('(max-width: 720px)').matches;
  const positions = useMemo(() => {
    const p = new Float32Array((mobile ? 55 : 150) * 3);
    for (let i=0;i<p.length;i++) p[i] = ((Math.sin(i*127.1+19)*43758.5453)%1)*7;
    return p;
  }, [mobile]);
  const uniforms = useMemo(() => ({ time: { value: 0 }, neon: { value: neon ? 1 : 0 } }), [neon]);
  useEffect(() => {
    const move = (e: PointerEvent) => { input.current.x=e.clientX/innerWidth*2-1;input.current.y=e.clientY/innerHeight*2-1; };
    const scroll = () => { input.current.scroll = Math.min(1,scrollY/innerHeight); };
    window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',scroll,{passive:true});scroll();
    return () => {window.removeEventListener('pointermove',move);window.removeEventListener('scroll',scroll);};
  }, []);
  useFrame(({ camera }, delta) => {
    const dt=Math.min(delta,.05), speed=reduced ? .16 : 1;
    const {x,y,scroll}=input.current;
    camera.position.x += ((reduced ? 0 : x*.28)-camera.position.x)*dt*2;
    camera.position.y += ((reduced ? 0 : -y*.12+scroll*.35)-camera.position.y)*dt*2;
    camera.lookAt(0,0,-2);
    if(mist.current) mist.current.uniforms.time.value += dt*speed;
    if(particles.current) {
      const p=particles.current.geometry.attributes.position;
      for(let i=0;i<p.count;i++){const next=p.getY(i)+dt*speed*(neon ? -.16 : .07);p.setY(i,next < -5 ? 5 : next > 5 ? -5 : next);}
      p.needsUpdate=true;
    }
  });
  return <>
    <ambientLight intensity={1.8} /><directionalLight position={[2,4,5]} color={neon ? '#9cc3d9' : '#e1dfb9'} intensity={3} />
    <Suspense fallback={null}><ArtLayer image={image} neon={neon} /></Suspense>
    {!neon && <>{[[-.39,1.2],[.39,.5],[.26,-1.5]].map(([x,z],i)=><Hook key={i} x={viewport.width*x} z={z} phase={i*2} reduced={reduced} />)}</>}
    {neon && [0,1].map(i=><group key={i} position={[viewport.width*(.34-i*.12),viewport.height*.32,-i]} rotation={[0,.2,-.08]}>
      <mesh><boxGeometry args={[1.1,.08,.1]} /><meshStandardMaterial color="#383441" roughness={.8} /></mesh>
      <mesh position={[0,-.06,.065]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.018,.018,.95,8]} /><meshBasicMaterial color={i ? '#f2a94e' : '#9cc3d9'} /></mesh>
    </group>)}
    {actor && <Suspense fallback={null}><Sprite image={actor} /></Suspense>}
    <points ref={particles}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]} /></bufferGeometry><pointsMaterial color={neon ? '#f4d7b0' : '#d7dbbf'} size={mobile ? .035 : .024} transparent opacity={.65} depthWrite={false} blending={AdditiveBlending} /></points>
    <mesh position={[0,-viewport.height*.27,1]}><planeGeometry args={[viewport.width*1.4,viewport.height*.65]} />
      <shaderMaterial ref={mist} uniforms={uniforms} transparent depthWrite={false}
        vertexShader="varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }"
        fragmentShader="varying vec2 vUv;uniform float time,neon;void main(){float wave=sin(vUv.x*13.+time*.4)*.1+sin(vUv.x*7.-time*.25)*.08;float a=(1.-smoothstep(.02,.38,abs(vUv.y-.4-wave)))*sin(vUv.x*3.14159)*.2;gl_FragColor=vec4(mix(vec3(.55,.64,.5),vec3(.4,.65,.85),neon),a);}" />
    </mesh>
  </>;
}
export default function AtmosphericScene({ image, neon = false, active, reduced, actor }: { image: string; neon?: boolean; active: boolean; reduced: boolean; actor?: string }) {
  const [lost,setLost]=useState(false);
  const [ready,setReady]=useState(false);
  if(lost)return null;
  return <Canvas className="atmospheric-canvas" style={{position:'absolute',inset:0,opacity:ready ? 1 : 0,transition:'opacity 600ms ease'}} aria-hidden camera={{position:[0,0,5],fov:45}} dpr={[1,1.5]} frameloop={active ? 'always' : 'never'} gl={{alpha:true,antialias:false,powerPreference:'low-power'}} fallback={null} onCreated={({gl})=>{
    gl.setClearColor(0x000000,0);gl.domElement.addEventListener('webglcontextlost',()=>setLost(true),{once:true});setReady(true);
  }}><World image={image} neon={neon} reduced={reduced} actor={actor} /></Canvas>;
}
