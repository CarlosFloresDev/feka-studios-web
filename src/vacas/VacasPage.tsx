/* Página propia de Vacas (/vacas).
   Estética del juego, no la del estudio: piso con nicotina, matadero de azulejo
   y alcantarillas. Nada de neón. Los textos viven en src/content.ts (vacasPage). */
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowDown, EyeSlash, Warning } from '@phosphor-icons/react';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource/stardos-stencil/400.css';
import '@fontsource/stardos-stencil/700.css';
import '@fontsource/special-elite/400.css';
import './vacas.css';
import { vacasPage as vp, type VacasImg, type VacasZone } from '../content';
import { useLang } from '../i18n';

gsap.registerPlugin(ScrollTrigger, useGSAP);

document.documentElement.classList.add('vp-root');

/* ------------------------------------------------------------ almacenamiento */
const KEY_ADULT = 'feka-vacas-adulto';
const KEY_GORE = 'feka-vacas-gore';

function readAdult(): boolean {
  try { return localStorage.getItem(KEY_ADULT) === '1'; } catch { return false; }
}
function writeAdult() {
  try { localStorage.setItem(KEY_ADULT, '1'); } catch { /* almacenamiento bloqueado: se pregunta otra vez */ }
}
function readRevealed(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY_GORE) || '[]');
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : [];
  } catch { return []; }
}
function writeRevealed(ids: string[]) {
  try { localStorage.setItem(KEY_GORE, JSON.stringify(ids)); } catch { /* nada */ }
}

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

type Reveal = { revealed: string[]; toggle: (id: string) => void };

/* ------------------------------------------------------------ imagen */
function Pic({ img, reveal, className = '', eager = false }: { img: VacasImg; reveal: Reveal; className?: string; eager?: boolean }) {
  const { t } = useLang();
  const covered = Boolean(img.gore) && !reveal.revealed.includes(img.id);
  const btn = useRef<HTMLButtonElement>(null);
  const touched = useRef(false);
  // al destapar o tapar, el foco sigue en el botón que ocupa su lugar
  useEffect(() => { if (touched.current) btn.current?.focus({ preventScroll: true }); }, [covered]);
  const flip = () => { touched.current = true; reveal.toggle(img.id); };

  return (
    <figure className={`pic ${img.pixel ? 'pic--pixel' : ''} ${img.gore ? 'pic--gore' : ''} ${className}`} data-covered={covered}>
      <div className="pic__frame" style={{ aspectRatio: `${img.w} / ${img.h}` }}>
        {covered ? (
          <div className="pic__cover">
            <Warning size={26} weight="fill" aria-hidden />
            <p className="pic__warn">{t(img.gore!)}</p>
            <button ref={btn} type="button" className="vbtn vbtn--small" onClick={flip}>{t(vp.cover.show)}</button>
          </div>
        ) : (
          <img src={img.src} alt={t(img.alt)} width={img.w} height={img.h} loading={eager ? 'eager' : 'lazy'} decoding="async" />
        )}
      </div>
      {(img.caption || (img.gore && !covered)) && (
        <figcaption>
          {img.caption ? <span>{t(img.caption)}</span> : <span />}
          {img.gore && !covered ? (
            <button ref={btn} type="button" className="pic__hide" onClick={flip}><EyeSlash size={15} aria-hidden /> {t(vp.cover.hide)}</button>
          ) : null}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------ aviso +18 */
function Gate({ onAccept }: { onAccept: () => void }) {
  const { t, lang, setLang } = useLang();
  const accept = useRef<HTMLButtonElement>(null);
  useEffect(() => { accept.current?.focus(); }, []);
  return (
    <main className="gate zone zone--piso" aria-labelledby="gate-title">
      <div className="gate__card" role="group">
        <p className="gate__badge" aria-hidden>{t(vp.gate.badge)}</p>
        <p className="gate__game">Vacas</p>
        <h1 id="gate-title">{t(vp.gate.title)}</h1>
        <p className="gate__body">{t(vp.gate.body)}</p>
        <div className="gate__actions">
          <button ref={accept} type="button" className="vbtn vbtn--primary" onClick={onAccept}>{t(vp.gate.accept)}</button>
          <a className="vbtn" href="/">{t(vp.gate.leave)}</a>
        </div>
        <div className="vlang" role="group" aria-label="Idioma / Language">
          <button type="button" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------ barra superior */
function Bar({ zone }: { zone: VacasZone['id'] }) {
  const { t, lang, setLang } = useLang();
  const z = vp.zones.find((x) => x.id === zone)!;
  const n = vp.zones.indexOf(z) + 1;
  return (
    <header className="vbar">
      <a className="vbar__back" href="/"><ArrowLeft size={16} aria-hidden /> <span>{t(vp.bar.back)}</span></a>
      <p className="vbar__zone" aria-live="polite"><span className="vbar__n">{n}/{vp.zones.length}</span> {t(z.name)}</p>
      <div className="vbar__sanity" role="img" aria-label={t(vp.bar.sanity)}>
        <span className="vbar__label">{t(vp.bar.sanity)}</span>
        <span className="vbar__track"><span className="vbar__fill" /><span className="vbar__poison" /></span>
        <span className="vbar__num" data-sanity>100</span>
      </div>
      <div className="vlang" role="group" aria-label="Idioma / Language">
        <button type="button" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
        <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------ umbral entre zonas */
const DRIPS = [
  { x: 7, w: 5, h: 46 }, { x: 19, w: 3, h: 78 }, { x: 31, w: 7, h: 30 }, { x: 44, w: 4, h: 92 },
  { x: 58, w: 6, h: 54 }, { x: 69, w: 3, h: 38 }, { x: 81, w: 5, h: 84 }, { x: 92, w: 4, h: 60 },
];

function Threshold({ to }: { to: VacasZone['id'] }) {
  return (
    <div className={`threshold threshold--${to}`} aria-hidden>
      <div className="threshold__beam" />
      {DRIPS.map((d) => (
        <span key={d.x} className="drip" style={{ left: `${d.x}%`, width: d.w, height: `${d.h}%` }} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ zona */
function Zone({ zone, index, reveal }: { zone: VacasZone; index: number; reveal: Reveal }) {
  const { t } = useLang();
  const withImg = zone.features.filter((f) => f.img);
  const notes = zone.features.filter((f) => !f.img);
  return (
    <section className={`zone zone--${zone.id}`} id={zone.id} data-zone={zone.id} aria-labelledby={`${zone.id}-title`}>
      <div className="vwrap">
        <header className="zone__head">
          <p className="zone__sign"><span>{index + 1}</span>{t(zone.name)}</p>
          {zone.id === 'matadero' ? <div className="tube tube--zone lit" aria-hidden /> : null}
          <h2 id={`${zone.id}-title`}>{t(zone.title)}</h2>
          <div className="zone__body">{zone.body.map((p) => <p key={p.es}>{t(p)}</p>)}</div>
        </header>

        <h3 className="zone__label">{t(vp.labels.cast)}</h3>
        <ul className="cast">
          {zone.cast.map((c) => (
            <li className="cast__item" key={c.img.id}>
              <div className="cast__portrait">
                <img src={c.img.src} alt={t(c.img.alt)} width={c.img.w} height={c.img.h} loading="lazy" decoding="async" />
              </div>
              <div>
                <p className="cast__name">{t(c.name)}</p>
                <p className="cast__line">{t(c.line)}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="feats">
          {withImg.map((f) => (
            <article className="feat" key={f.title.es}>
              <div className="feat__copy">
                <h3>{t(f.title)}</h3>
                <p>{t(f.body)}</p>
              </div>
              <Pic img={f.img!} reveal={reveal} />
            </article>
          ))}
        </div>
        {notes.length > 0 && (
          <div className="notes">
            {notes.map((f) => (
              <article className="note" key={f.title.es}>
                <h3>{t(f.title)}</h3>
                <p>{t(f.body)}</p>
              </article>
            ))}
          </div>
        )}

        {zone.id === 'matadero' && (
          <>
            <h3 className="zone__label">{t(vp.labels.visions)}</h3>
            <p className="zone__lead">{t(vp.labels.visionsLead)}</p>
            <div className="visions">
              {vp.visions.map((v) => <Pic key={v.id} img={v} reveal={reveal} className="pic--vision" />)}
            </div>
          </>
        )}

        <h3 className="zone__label">{t(vp.labels.gallery)}</h3>
        <div className="gallery">
          {zone.gallery.map((g) => <Pic key={g.id} img={g} reveal={reveal} className={g.w / g.h > 1.8 ? 'pic--wide' : ''} />)}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ estado */
function Status({ reveal }: { reveal: Reveal }) {
  const { t } = useLang();
  const s = vp.status;
  return (
    <section className="zone zone--alcantarillas status" id="estado" aria-labelledby="estado-title">
      <div className="vwrap">
        <h2 id="estado-title">{t(s.title)}</h2>
        <p className="zone__lead">{t(s.lead)}</p>
        <ol className="acts">
          {s.acts.map((a) => (
            <li className="act" key={a.n} data-state={a.state}>
              <span className="act__hook" aria-hidden />
              <span className="act__n">{a.n}</span>
              <span className="act__name">{t(a.name)}</span>
              <span className="act__state">{t(s.states[a.state])}</span>
            </li>
          ))}
        </ol>
        <div className="status__grid">
          <div className="status__notes">
            {s.notes.map((n) => (
              <article className="note" key={n.title.es}>
                <h3>{t(n.title)}</h3>
                <p>{t(n.body)}</p>
              </article>
            ))}
          </div>
          <Pic img={s.titleImg} reveal={reveal} />
        </div>
        <div className="soon">
          <p className="stamp">{t(s.soonTitle)}</p>
          <p className="soon__body">{t(s.soonBody)}</p>
          <div className="soon__actions">
            <a className="vbtn vbtn--primary" href="/#diario">{t(s.devlog)}</a>
            <a className="vbtn" href="/">{t(s.home)}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ página */
function Page({ reveal }: { reveal: Reveal }) {
  const { t } = useLang();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [zone, setZone] = useState<VacasZone['id']>('piso');

  useGSAP(() => {
    const el = root.current!;
    const num = el.querySelector<HTMLElement>('[data-sanity]');

    // 1. Zona activa: la sección que cruza el centro de la pantalla
    gsap.utils.toArray<HTMLElement>('[data-zone]', el).forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => { if (self.isActive) setZone(sec.dataset.zone as VacasZone['id']); },
      });
    });

    // 2. La cordura baja con el scroll: barra, grano y viñeta
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        el.style.setProperty('--veneno', self.progress.toFixed(3));
        if (num) num.textContent = String(Math.round(100 - self.progress * 88));
      },
    });

    if (reduced) return;

    // 3. Entrada: el tubo arranca a tirones y el rótulo queda estampado
    gsap.set('.lit', { '--tube': 0 });
    const intro = gsap.timeline({ delay: 0.15 });
    intro
      .to('.lit', { '--tube': 0.7, duration: 0.05 })
      .to('.lit', { '--tube': 0.1, duration: 0.09 })
      .to('.lit', { '--tube': 0.9, duration: 0.04 })
      .to('.lit', { '--tube': 0.25, duration: 0.14 })
      .to('.lit', { '--tube': 1, duration: 0.5, ease: 'power2.out' })
      .from('.hero__title span', { autoAlpha: 0, scale: 1.12, duration: 0.45, ease: 'power3.out', stagger: 0.07 }, 0.25)
      .from('.hero__art', { autoAlpha: 0, duration: 1.4, ease: 'power1.out' }, 0.45)
      .from('.hero__reveal', { autoAlpha: 0, y: 10, duration: 0.8, ease: 'power2.out', stagger: 0.1 }, 0.8);

    // 4. Fluorescente viejo: parpadeo breve cada pocos segundos
    const flicker = gsap.timeline({ repeat: -1, repeatDelay: 5.3, delay: 4 });
    flicker
      .to('.lit', { '--tube': 0.62, duration: 0.04 })
      .to('.lit', { '--tube': 1, duration: 0.05 })
      .to('.lit', { '--tube': 0.8, duration: 0.03 }, '+=0.12')
      .to('.lit', { '--tube': 1, duration: 0.09 })
      .to('.lit', { '--tube': 0.5, duration: 0.03 }, '+=2.4')
      .to('.lit', { '--tube': 0.95, duration: 0.06 })
      .to('.lit', { '--tube': 0.7, duration: 0.04 })
      .to('.lit', { '--tube': 1, duration: 0.3, ease: 'power1.out' });

    // 5. El ojo de la rejilla se acerca apenas al bajar
    gsap.fromTo('.hero__art img', { scale: 1 }, {
      scale: 1.08, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // 6. Goteos: la sangre baja del dintel al cruzar cada umbral
    gsap.utils.toArray<HTMLElement>('.threshold', el).forEach((th) => {
      gsap.fromTo(th.querySelectorAll('.drip'), { scaleY: 0.04 }, {
        scaleY: 1, ease: 'none', stagger: 0.06,
        scrollTrigger: { trigger: th, start: 'top 85%', end: 'bottom 35%', scrub: 0.8 },
      });
    });
  }, { scope: root, dependencies: [reduced] });

  useEffect(() => {
    // fuentes e imágenes cambian alturas: recalcular disparadores
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  // destapar una imagen no cambia la altura (la caja reserva su proporción)

  const h = vp.hero;
  return (
    <div className="vp" ref={root} data-zone-now={zone}>
      <a className="vskip" href="#contenido">{lang_skip(t)}</a>
      <Bar zone={zone} />
      <div className="fx fx--fog" aria-hidden><span /><span /></div>
      <div className="fx fx--vignette" aria-hidden />
      <div className="fx fx--grain" aria-hidden />

      <main id="contenido">
        <section className="zone zone--piso hero lit" data-zone="piso" aria-labelledby="vacas-h1">
          <div className="tube tube--hero" aria-hidden />
          <div className="hero__cone" aria-hidden />
          <div className="vwrap hero__grid">
            <div className="hero__copy">
              <h1 id="vacas-h1" className="hero__title" aria-label="Vacas">
                {'VACAS'.split('').map((ch, i) => <span key={i} aria-hidden>{ch}</span>)}
              </h1>
              <p className="hero__tagline hero__reveal">{t(h.tagline)}</p>
              <p className="hero__pitch hero__reveal">{t(h.pitch)}</p>
              <p className="hero__lead hero__reveal">{t(h.lead)}</p>
              <div className="hero__actions hero__reveal">
                <p className="stamp">{t(h.stamp)}</p>
                <span className="vbtn" aria-disabled="true">{t(h.download)}</span>
                <a className="vbtn vbtn--ghost" href="#estado">{t(h.progress)} <ArrowDown size={16} aria-hidden /></a>
              </div>
            </div>
            <figure className="hero__art">
              <div className="hero__vent">
                <img src={h.img.src} alt={t(h.img.alt)} width={h.img.w} height={h.img.h} fetchPriority="high" decoding="async" />
              </div>
            </figure>
          </div>

          <div className="vwrap">
            <section className="tag" aria-labelledby="ficha-title">
              <span className="tag__hole" aria-hidden />
              <header className="tag__head">
                <h2 id="ficha-title">{t(vp.tag.title)}</h2>
                <p>Vacas</p>
                <p className="tag__age" aria-label={t(vp.gate.title)}>{t(vp.gate.badge)}</p>
              </header>
              <dl className="tag__rows">
                {vp.tag.rows.map((r) => (
                  <div key={r.label.es}><dt>{t(r.label)}</dt><dd>{t(r.value)}</dd></div>
                ))}
              </dl>
            </section>
          </div>
        </section>

        <Zone zone={vp.zones[0]} index={0} reveal={reveal} />
        <Threshold to="matadero" />
        <Zone zone={vp.zones[1]} index={1} reveal={reveal} />
        <Threshold to="alcantarillas" />
        <Zone zone={vp.zones[2]} index={2} reveal={reveal} />
        <Status reveal={reveal} />
      </main>

      <footer className="vfoot zone zone--alcantarillas">
        <div className="vwrap vfoot__inner">
          <a href="/" aria-label="Feka Studios"><img src="/press/feka-logo.svg" alt="Feka Studios" width="130" height="44" /></a>
          <p>{t(vp.footer.note)}</p>
          <p>© {new Date().getFullYear()} Feka Studios</p>
        </div>
      </footer>
    </div>
  );
}

const lang_skip = (t: ReturnType<typeof useLang>['t']) => t({ es: 'Saltar al contenido', en: 'Skip to content' });

export default function VacasPage() {
  const { t } = useLang();
  const [adult, setAdult] = useState(readAdult);
  const [revealed, setRevealed] = useState(readRevealed);

  useEffect(() => { document.title = t(vp.meta.title); }, [t]);

  const toggle = useCallback((id: string) => {
    setRevealed((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeRevealed(next);
      return next;
    });
  }, []);

  if (!adult) {
    return <div className="vp"><Gate onAccept={() => { writeAdult(); setAdult(true); window.scrollTo(0, 0); }} /></div>;
  }
  return <Page reveal={{ revealed, toggle }} />;
}
