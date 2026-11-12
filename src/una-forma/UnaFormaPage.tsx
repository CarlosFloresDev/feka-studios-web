/* Página propia de «Una forma de querer» (/una-forma-de-querer).
   Mundo del juego, no el del estudio: papel de cuaderno, grafito y acuarela de
   Arequipa. Un único momento de autor: al bajar, la tarde avanza en el diorama
   (el sillar pasa de blanco a rosado). Los textos viven en src/content.ts
   (unaFormaPage). Es promocional: no se cuentan los giros del guion. */
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowDown, ArrowUpRight } from '@phosphor-icons/react';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/600.css';
import './una-forma.css';
import { unaFormaPage as p } from '../content';
import { useLang } from '../i18n';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function useReducedMotion() {
  const [reduced, set] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => set(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------ diorama */
// Casas de sillar con medidas fijas (no aleatorias: el dibujo no cambia entre visitas).
const HOUSES = [
  [0, 120, 92], [112, 96, 70], [200, 140, 104], [334, 84, 62], [410, 128, 88], [532, 104, 120],
  [628, 150, 76], [770, 92, 96], [856, 132, 70], [982, 110, 112], [1086, 146, 82], [1226, 96, 100],
  [1316, 138, 74], [1448, 152, 94],
] as const;

// Muro de arcos de Yanahuara: rectángulo con siete vanos (regla evenodd).
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

function Diorama() {
  return (
    <svg className="ufq-diorama" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden focusable="false">
      <defs>
        <filter id="ufq-wc" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="12" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ufq-bloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="ufq-misti" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8f9fbd" />
          <stop offset="1" stopColor="#b9c1cf" />
        </linearGradient>
        <linearGradient id="ufq-sillar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf7f0" />
          <stop offset="1" stopColor="#e9dfcf" />
        </linearGradient>
      </defs>

      <g className="ufq-sun">
        <circle cx="1060" cy="230" r="96" fill="#fff3d6" filter="url(#ufq-bloom)" opacity="0.8" />
        <circle cx="1060" cy="230" r="54" fill="#fff8e8" />
      </g>

      <g filter="url(#ufq-wc)">
        {/* Chachani, a la izquierda y más lejos */}
        <path fill="#aab8cb" opacity="0.85" d="M-20 600 L-20 470 C80 450 150 420 230 395 C290 376 330 380 380 360 C430 340 470 352 520 372 C600 404 660 430 760 470 L760 600 Z" />
        {/* Pichu Pichu, a la derecha, bajo y largo */}
        <path fill="#a9b6c7" opacity="0.8" d="M1230 600 L1250 500 C1300 478 1350 470 1400 456 C1450 444 1490 452 1540 446 C1580 442 1600 448 1620 452 L1620 600 Z" />
        {/* El Misti */}
        <path fill="url(#ufq-misti)" d="M640 610 C760 520 880 380 958 286 C978 262 1002 254 1024 256 C1046 258 1066 270 1084 292 C1160 384 1280 520 1390 610 Z" />
        {/* nieve en la cumbre */}
        <path fill="#f7f9fc" d="M958 286 C978 262 1002 254 1024 256 C1046 258 1066 270 1084 292 C1070 302 1056 296 1044 308 C1030 320 1018 300 1004 314 C990 326 978 306 964 318 C955 312 950 300 958 286 Z" />
      </g>

      <g filter="url(#ufq-wc)">
        {/* ciudad de sillar */}
        {HOUSES.map(([x, w, h], i) => (
          <g key={x}>
            <rect x={x} y={640 - h} width={w} height={h + 20} fill="url(#ufq-sillar)" />
            <rect x={x} y={640 - h} width={w} height="6" fill="#d9ccb8" />
            {Array.from({ length: Math.max(1, Math.floor(w / 46)) }, (_, k) => (
              <path key={k} fill="#b8a993" opacity="0.55" d={`M${x + 16 + k * 44} ${640 - h + 34} h16 v26 h-16 Z M${x + 16 + k * 44} ${640 - h + 34} a8 8 0 0 1 16 0`} />
            ))}
            {i % 4 === 1 && <path fill="#f1e8da" d={`M${x + w / 2 - 22} ${640 - h} a22 22 0 0 1 44 0 Z`} />}
          </g>
        ))}
        {/* torres de la Catedral */}
        <path fill="#f6f0e6" d="M690 532 h40 v-70 l-20 -26 l-20 26 Z M800 532 h40 v-70 l-20 -26 l-20 26 Z M676 532 h180 v40 h-180 Z" />
      </g>

      {/* buganvillas */}
      <g className="ufq-buganvilla" filter="url(#ufq-wc)">
        {[[60, 660, 70], [150, 640, 54], [230, 668, 46], [1420, 650, 64], [1510, 630, 72], [1350, 676, 40]].map(([cx, cy, r]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r={r} fill="#c43b78" opacity="0.85" />
            <circle cx={cx + r * 0.4} cy={cy - r * 0.3} r={r * 0.62} fill="#de5c98" opacity="0.8" />
            <circle cx={cx - r * 0.5} cy={cy + r * 0.2} r={r * 0.45} fill="#7c8f4a" opacity="0.7" />
          </g>
        ))}
      </g>

      {/* arcos de Yanahuara, en primer plano */}
      <path className="ufq-arcade" fillRule="evenodd" fill="url(#ufq-sillar)" filter="url(#ufq-wc)" d={ARCADE} />
      <path fill="#d8cab4" opacity="0.6" d="M0 640 H1600 V652 H0 Z" />

      {/* Mateo, sentado en el pretil con su cuaderno */}
      <g className="ufq-figure" transform="translate(1012 600)">
        <rect x="-11" y="-6" width="22" height="34" rx="9" fill="#55603c" />
        <circle cx="0" cy="-16" r="10" fill="#3b302a" />
        <rect x="8" y="2" width="14" height="10" fill="#f7f1e4" transform="rotate(-18 8 2)" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ celular */
function Phone() {
  const { t } = useLang();
  const ph = p.premise.phone;
  return (
    <figure className="ufq-phone" aria-label={t(ph.label)}>
      <div className="ufq-phone__screen">
        <p className="ufq-phone__head"><span className="ufq-phone__avatar" aria-hidden>A</span>{ph.contact}<span className="ufq-phone__time">{ph.time}</span></p>
        <p className="ufq-bubble ufq-bubble--in">{t(ph.incoming)}</p>
        <p className="ufq-bubble ufq-bubble--draft">{t(ph.draft)}<span className="ufq-caret" aria-hidden /></p>
        <p className="ufq-typing"><span className="ufq-typing__dots" aria-hidden><i /><i /><i /></span>{t(ph.typing)}</p>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------ la espera */
function WaitCounter() {
  const { t } = useLang();
  const host = useRef<HTMLParagraphElement>(null);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (host.current) io.observe(host.current);
    const id = window.setInterval(() => { if (visible && !document.hidden) setSeconds(s => s + 1); }, 1000);
    return () => { io.disconnect(); window.clearInterval(id); };
  }, []);
  return (
    <p className="ufq-wait" ref={host}>
      {t(p.mechanics.wait.waiting)} <strong className="ufq-wait__n">{seconds}</strong> {t(p.mechanics.wait.seconds)}
    </p>
  );
}

/* ------------------------------------------------------------ la lente */
function Lens() {
  const { t } = useLang();
  const l = p.mechanics.lens;
  const [warm, setWarm] = useState(false);
  return (
    <div className="ufq-lens" data-warm={warm}>
      <p className="ufq-lens__bubble" aria-live="polite">
        {t(l.before)}{' '}
        <span className="ufq-lens__word">{warm ? t(l.warm) : t(l.plain)}</span>{t(l.after)}
      </p>
      <div className="ufq-lens__choices" role="group" aria-label={t(l.hint)}>
        <button type="button" aria-pressed={!warm} onClick={() => setWarm(false)}>{t(l.friend)}</button>
        <button type="button" aria-pressed={warm} onClick={() => setWarm(true)}>{t(l.more)}</button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ página */
export default function UnaFormaPage() {
  const { t, lang, setLang } = useLang();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('ufq-root');
    const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousTheme = theme?.content;
    const previousDescription = description?.content;
    if (theme) theme.content = '#f5efe3';
    return () => {
      document.documentElement.classList.remove('ufq-root');
      if (theme && previousTheme) theme.content = previousTheme;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, []);

  useEffect(() => {
    document.title = t(p.meta.title);
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = t(p.meta.description);
  }, [t]);

  useGSAP(() => {
    const host = root.current!;
    const hero = host.querySelector('.ufq-hero');
    let mounted = true;

    // El momento de autor: la tarde avanza mientras el diorama sale de pantalla.
    const dusk = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: reduced ? true : 0.6 } });
    dusk.to('.ufq-sky--dusk', { opacity: 1, ease: 'none' }, 0)
      .to('.ufq-dusk-wash', { opacity: 1, ease: 'none' }, 0);
    if (!reduced) {
      dusk.to('.ufq-sun', { y: 250, ease: 'none' }, 0)
        .to('.ufq-hero__copy', { yPercent: -16, opacity: 0.15, ease: 'none' }, 0);
      gsap.fromTo('.ufq-hero__copy > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'expo.out' });
    }

    // El cuaderno: el dorado se apaga hasta el color del papel; queda la pregunta.
    gsap.fromTo('.ufq-notebook', { '--gilt': 1 }, {
      '--gilt': 0, ease: 'none',
      scrollTrigger: { trigger: '.ufq-notebook__pages', start: 'top 35%', end: 'bottom 45%', scrub: reduced ? true : 0.5 },
    });

    // Recorrido: cada lavado de color se extiende como acuarela sobre el papel.
    if (!reduced) {
      gsap.utils.toArray<HTMLElement>('.ufq-city').forEach((city) => {
        gsap.fromTo(city.querySelector('.ufq-city__wash'), { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)', ease: 'none',
          scrollTrigger: { trigger: city, start: 'top 85%', end: 'top 40%', scrub: 0.5 },
        });
      });
    }

    document.fonts.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; };
  }, { scope: root, dependencies: [reduced, lang], revertOnUpdate: true });

  const h = p.hero;
  return (
    <div className="ufq" ref={root}>
      <a className="ufq-skip" href="#contenido">{t(p.bar.skip)}</a>
      <header className="ufq-bar">
        <a className="ufq-bar__back" href="/" aria-label={t(p.bar.back)}><ArrowLeft size={16} aria-hidden /><span>Feka Studios</span></a>
        <p className="ufq-bar__title">{h.title}</p>
        <div className="ufq-lang" role="group" aria-label="Idioma / Language">
          <button type="button" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
        </div>
      </header>

      <main id="contenido">
        <section className="ufq-hero" aria-labelledby="ufq-title">
          <div className="ufq-sky ufq-sky--noon" aria-hidden />
          <div className="ufq-sky ufq-sky--dusk" aria-hidden />
          <Diorama />
          <div className="ufq-dusk-wash" aria-hidden />
          <div className="ufq-paper-grain" aria-hidden />
          <div className="ufq-wrap ufq-hero__copy">
            <p className="ufq-hero__status"><span>{t(h.status)}</span><span>{t(h.platform)}</span></p>
            <h1 id="ufq-title" className="ufq-hero__title">{h.title}</h1>
            <p className="ufq-hero__line">{t(h.line)}</p>
            <p className="ufq-hero__lead">{t(h.lead)}</p>
            <div className="ufq-hero__ctas">
              <a className="ufq-btn ufq-btn--ink" href="#cuaderno">{t(h.cta)} <ArrowDown size={16} aria-hidden /></a>
              <a className="ufq-btn" href="#recorrido">{t(h.cta2)}</a>
            </div>
          </div>
          <p className="ufq-hero__hint" aria-hidden>{t(h.scroll)}</p>
        </section>

        <section className="ufq-section ufq-premise" aria-labelledby="ufq-premise-title">
          <div className="ufq-wrap ufq-premise__grid">
            <div>
              <h2 id="ufq-premise-title">{t(p.premise.title)}</h2>
              {p.premise.body.map((b) => <p className="ufq-prose" key={b.es}>{t(b)}</p>)}
            </div>
            <Phone />
          </div>
        </section>

        <section className="ufq-section ufq-notebook" id="cuaderno" aria-labelledby="ufq-notebook-title">
          <div className="ufq-wrap">
            <h2 id="ufq-notebook-title">{t(p.notebook.title)}</h2>
            <p className="ufq-prose ufq-notebook__lead">{t(p.notebook.lead)}</p>
            <div className="ufq-notebook__spread">
              <p className="ufq-notebook__cover" aria-hidden>{p.notebook.cover}</p>
              <ol className="ufq-notebook__pages">
                {p.notebook.pages.map((pg) => (
                  <li className="ufq-page" key={pg.quote.es}>
                    <blockquote className="ufq-page__quote">{t(pg.quote)}</blockquote>
                    <p className="ufq-page__place">{t(pg.place)}</p>
                  </li>
                ))}
              </ol>
              <p className="ufq-notebook__question">{t(p.notebook.question)}</p>
            </div>
          </div>
        </section>

        <section className="ufq-section ufq-mechanics" aria-labelledby="ufq-mech-title">
          <div className="ufq-wrap">
            <h2 id="ufq-mech-title">{t(p.mechanics.title)}</h2>
            <div className="ufq-mech">
              <article className="ufq-mech__row">
                <h3 className="ufq-mech__name">{t(p.mechanics.signals.name)}</h3>
                <p className="ufq-prose">{t(p.mechanics.signals.body)}</p>
                <p className="ufq-keep" aria-hidden><span className="ufq-keep__heart" />{t(p.mechanics.signals.name)}</p>
              </article>
              <article className="ufq-mech__row">
                <h3 className="ufq-mech__name">{t(p.mechanics.lens.name)}</h3>
                <p className="ufq-prose">{t(p.mechanics.lens.body)}</p>
                <Lens />
              </article>
              <article className="ufq-mech__row">
                <h3 className="ufq-mech__name">{t(p.mechanics.wait.name)}</h3>
                <p className="ufq-prose">{t(p.mechanics.wait.body)}</p>
                <WaitCounter />
              </article>
            </div>
          </div>
        </section>

        <section className="ufq-section ufq-route" id="recorrido" aria-labelledby="ufq-route-title">
          <div className="ufq-wrap">
            <h2 id="ufq-route-title">{t(p.route.title)}</h2>
            <p className="ufq-prose">{t(p.route.lead)}</p>
          </div>
          <ol className="ufq-cities">
            {p.route.cities.map((c) => (
              <li className={`ufq-city ufq-city--${c.id}`} key={c.id}>
                <div className="ufq-city__wash" aria-hidden />
                <div className="ufq-wrap ufq-city__inner">
                  <p className="ufq-city__when">{t(c.when)}</p>
                  <h3 className="ufq-city__name">{c.name}</h3>
                  <p className="ufq-city__mood">{t(c.mood)}</p>
                  <p className="ufq-city__body">{t(c.body)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="ufq-section ufq-cast" aria-labelledby="ufq-cast-title">
          <div className="ufq-wrap">
            <h2 id="ufq-cast-title">{t(p.cast.title)}</h2>
            <ul className="ufq-people">
              {p.cast.people.map((person) => (
                <li className="ufq-person" data-tone={person.tone} key={person.name}>
                  <span className="ufq-person__wash" aria-hidden />
                  <h3 className="ufq-person__name">{person.name} <span className="ufq-person__age">{person.age}</span></h3>
                  <p className="ufq-person__line">{t(person.line)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ufq-section ufq-status" aria-labelledby="ufq-status-title">
          <div className="ufq-wrap ufq-status__grid">
            <div>
              <h2 id="ufq-status-title">{t(p.status.title)}</h2>
              <p className="ufq-prose">{t(p.status.lead)}</p>
              <a className="ufq-btn" href="/#juegos">{t(p.status.home)} <ArrowUpRight size={16} aria-hidden /></a>
            </div>
            <dl className="ufq-facts">
              {p.status.rows.map((r) => (
                <div key={r.label.es}><dt>{t(r.label)}</dt><dd>{t(r.value)}</dd></div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="ufq-foot">
        <div className="ufq-wrap ufq-foot__inner">
          <a href="/"><img src="/press/feka-logo-negro.svg" alt="Feka Studios" width="130" height="44" /></a>
          <p>{t(p.footer.note)}</p>
          <p>© {new Date().getFullYear()} Feka Studios</p>
        </div>
      </footer>
    </div>
  );
}
