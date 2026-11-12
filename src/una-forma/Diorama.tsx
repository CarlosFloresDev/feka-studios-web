/* Diorama de acuarela de Arequipa: el Misti, la ciudad de sillar, buganvillas y
   los arcos de Yanahuara, con Mateo sentado en el pretil. Lo usan la portada del
   estudio y la página del juego. `time` fija la hora; en el hero de la página la
   tarde avanza con el scroll (UnaFormaPage anima .ufq-sky--dusk y .ufq-dusk-wash). */
import { useId } from 'react';
import './diorama.css';

export type DioramaTime = 'noon' | 'afternoon' | 'dusk' | 'night';

// Casas de sillar con medidas fijas: el dibujo no cambia entre visitas.
const HOUSES = [
  [0, 120, 92], [112, 96, 70], [200, 140, 104], [334, 84, 62], [410, 128, 88], [532, 104, 120],
  [628, 150, 76], [770, 92, 96], [856, 132, 70], [982, 110, 112], [1086, 146, 82], [1226, 96, 100],
  [1316, 138, 74], [1448, 152, 94],
] as const;

const ARCADE = (() => {
  const top = 640, bottom = 900, archTop = 690, w = 1600, n = 7, pier = 46;
  const span = (w - pier * (n + 1)) / n;
  let d = `M0 ${top} H${w} V${bottom} H0 Z`;
  for (let i = 0; i < n; i++) {
    const x = pier + i * (span + pier);
    const r = span / 2;
    d += ` M${x} ${bottom} V${archTop + r} A${r} ${r} 0 0 1 ${x + span} ${archTop + r} V${bottom} Z`;
  }
  return d;
})();

const BLOOMS = [[60, 660, 70], [150, 640, 54], [230, 668, 46], [1420, 650, 64], [1510, 630, 72], [1350, 676, 40]] as const;
const FIREWORKS = [[300, 170, '#f3c66b'], [520, 110, '#ef8fb2'], [1320, 150, '#9fd6e8'], [1480, 230, '#f3c66b']] as const;

export function Diorama({ time = 'noon', className = '' }: { time?: DioramaTime; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const wc = `wc-${uid}`, bloom = `bloom-${uid}`, misti = `misti-${uid}`, sillar = `sillar-${uid}`;
  return (
    <div className={`ufq-scene ${className}`} data-time={time} aria-hidden>
      <div className="ufq-sky ufq-sky--noon" />
      <div className="ufq-sky ufq-sky--dusk" />
      <div className="ufq-sky ufq-sky--night" />
      <svg className="ufq-diorama" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" focusable="false">
        <defs>
          <filter id={wc} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id={bloom} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
          <linearGradient id={misti} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8f9fbd" /><stop offset="1" stopColor="#b9c1cf" /></linearGradient>
          <linearGradient id={sillar} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf7f0" /><stop offset="1" stopColor="#e9dfcf" /></linearGradient>
        </defs>

        <g className="ufq-sun">
          <circle cx="1060" cy="230" r="96" fill="#fff3d6" filter={`url(#${bloom})`} opacity="0.8" />
          <circle cx="1060" cy="230" r="54" fill="#fff8e8" />
        </g>
        <g className="ufq-moon"><circle cx="300" cy="150" r="34" fill="#f6efdc" /><circle cx="314" cy="140" r="30" fill="#2c2f5a" /></g>
        <g className="ufq-fireworks">
          {FIREWORKS.map(([x, y, c]) => (
            <g key={`${x}-${y}`} stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.9">
              {Array.from({ length: 10 }, (_, k) => {
                const a = (k / 10) * Math.PI * 2;
                return <line key={k} x1={x + Math.cos(a) * 14} y1={y + Math.sin(a) * 14} x2={x + Math.cos(a) * 42} y2={y + Math.sin(a) * 42} />;
              })}
            </g>
          ))}
        </g>

        <g filter={`url(#${wc})`}>
          <path className="ufq-far" fill="#aab8cb" opacity="0.85" d="M-20 600 L-20 470 C80 450 150 420 230 395 C290 376 330 380 380 360 C430 340 470 352 520 372 C600 404 660 430 760 470 L760 600 Z" />
          <path className="ufq-far" fill="#a9b6c7" opacity="0.8" d="M1230 600 L1250 500 C1300 478 1350 470 1400 456 C1450 444 1490 452 1540 446 C1580 442 1600 448 1620 452 L1620 600 Z" />
          <path fill={`url(#${misti})`} d="M640 610 C760 520 880 380 958 286 C978 262 1002 254 1024 256 C1046 258 1066 270 1084 292 C1160 384 1280 520 1390 610 Z" />
          <path fill="#f7f9fc" d="M958 286 C978 262 1002 254 1024 256 C1046 258 1066 270 1084 292 C1070 302 1056 296 1044 308 C1030 320 1018 300 1004 314 C990 326 978 306 964 318 C955 312 950 300 958 286 Z" />
        </g>

        <g filter={`url(#${wc})`}>
          {HOUSES.map(([x, w, h], i) => (
            <g key={x}>
              <rect x={x} y={640 - h} width={w} height={h + 20} fill={`url(#${sillar})`} />
              <rect x={x} y={640 - h} width={w} height="6" fill="#d9ccb8" />
              {Array.from({ length: Math.max(1, Math.floor(w / 46)) }, (_, k) => (
                <path key={k} className="ufq-win" fill="#b8a993" opacity="0.55" d={`M${x + 16 + k * 44} ${640 - h + 34} h16 v26 h-16 Z M${x + 16 + k * 44} ${640 - h + 34} a8 8 0 0 1 16 0`} />
              ))}
              {i % 4 === 1 && <path fill="#f1e8da" d={`M${x + w / 2 - 22} ${640 - h} a22 22 0 0 1 44 0 Z`} />}
            </g>
          ))}
          <path fill="#f6f0e6" d="M690 532 h40 v-70 l-20 -26 l-20 26 Z M800 532 h40 v-70 l-20 -26 l-20 26 Z M676 532 h180 v40 h-180 Z" />
        </g>

        <g filter={`url(#${wc})`}>
          {BLOOMS.map(([cx, cy, r]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r={r} fill="#c43b78" opacity="0.85" />
              <circle cx={cx + r * 0.4} cy={cy - r * 0.3} r={r * 0.62} fill="#de5c98" opacity="0.8" />
              <circle cx={cx - r * 0.5} cy={cy + r * 0.2} r={r * 0.45} fill="#7c8f4a" opacity="0.7" />
            </g>
          ))}
        </g>

        <path fillRule="evenodd" fill={`url(#${sillar})`} filter={`url(#${wc})`} d={ARCADE} />
        <path fill="#d8cab4" opacity="0.6" d="M0 640 H1600 V652 H0 Z" />

        <g transform="translate(1012 600)">
          <rect x="-11" y="-6" width="22" height="34" rx="9" fill="#55603c" />
          <circle cx="0" cy="-16" r="10" fill="#3b302a" />
          <rect x="8" y="2" width="14" height="10" fill="#f7f1e4" transform="rotate(-18 8 2)" />
        </g>
      </svg>
      <div className="ufq-dusk-wash" />
      <div className="ufq-night-wash" />
      <div className="ufq-paper-grain" />
    </div>
  );
}
