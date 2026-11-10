/* Página propia de Vacas (/vacas).
   Estética del juego, no la del estudio: piso con nicotina, matadero de azulejo
   y alcantarillas. Nada de neón. Los textos viven en src/content.ts (vacasPage). */
import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowDown, EyeSlash, Warning } from '@phosphor-icons/react';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource/stardos-stencil/400.css';
import '@fontsource/stardos-stencil/700.css';
import '@fontsource/special-elite/400.css';
import './vacas.css';
import { vacasPage as vp, type VacasImg, vacasViews, vacasArchive, vacasInterface as vi, vacasProcess, devlog } from '../content';
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

/* ------------------------------------------------------------ estado */
function Status({ reveal, onDevlog }: { reveal: Reveal; onDevlog: (event: MouseEvent<HTMLAnchorElement>) => void }) {
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
            <a className="vbtn vbtn--primary" href="/vacas/bitacora" onClick={onDevlog}>{t(s.devlog)}</a>
            <a className="vbtn" href="/">{t(s.home)}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ vistas */
const Scene = lazy(() => import('./VacasScene'));
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function HeroArt({ art }: { art: string }) {
  const reduced = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [capable, setCapable] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
    const mq = window.matchMedia('(max-width: 720px), (prefers-reduced-motion: reduce)');
    const check = () => setCapable(!mq.matches && !nav.connection?.saveData && !/2g/.test(nav.connection?.effectiveType || '') && (nav.deviceMemory ?? 8) >= 4);
    check();
    mq.addEventListener('change', check);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => { observer.disconnect(); mq.removeEventListener('change', check); };
  }, []);
  return <div ref={host} className="vhero__visual" aria-hidden>
    <img className="vhero__still" src={`/media/vacas/${art}`} alt="" fetchPriority="high" />
    {capable && !reduced && <SceneBoundary key={art}><Suspense fallback={null}><Scene art={art} active={visible} /></Suspense></SceneBoundary>}
  </div>;
}

const pathFor = (id: string) => `/vacas${id ? '/' + id : ''}`;
const currentView = () => window.location.pathname.replace(/^\/vacas\/?/i, '').replace(/\/$/, '').toLowerCase();

function Page({ reveal }: { reveal: Reveal }) {
  const { t, lang, setLang } = useLang();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const navigating = useRef(false);
  const [view, setView] = useState(currentView);
  const selected = vacasViews.find(v => v.id === view);
  const v = selected || vacasViews[0];
  const routeTween = useRef<gsap.core.Tween | null>(null);
  useEffect(() => {
    const back = () => { routeTween.current?.kill(); navigating.current = false; setView(currentView()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('popstate', back);
    return () => { window.removeEventListener('popstate', back); routeTween.current?.kill(); };
  }, []);
  useEffect(() => { document.title = `${t(v.label)} · ${t(vp.meta.title)}`; }, [v, t]);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (id === view || navigating.current) return;
    navigating.current = true;
    const change = () => {
      window.history.pushState({}, '', pathFor(id));
      setView(id);
      window.scrollTo({ top: 0, behavior: 'instant' });
      navigating.current = false;
      requestAnimationFrame(() => main.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true }));
    };
    if (reduced) change();
    else routeTween.current = gsap.to(main.current, { opacity: 0, y: -12, duration: 0.18, onComplete: change });
  };

  useGSAP(() => {
    gsap.set(main.current, { opacity: 1, y: 0 });
    root.current?.style.setProperty('--veneno', '0');
    const sanity = root.current?.querySelector('[data-sanity]');
    if (sanity) sanity.textContent = '100';
    if (!reduced) {
      gsap.fromTo('.vhero__copy > *', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out' });
      gsap.fromTo('.vhero__visual', { opacity: 0 }, { opacity: 1, duration: 0.9 });
    }
    ScrollTrigger.create({ trigger: main.current, start: 'top top', end: 'bottom bottom', onUpdate: self => {
      root.current?.style.setProperty('--veneno', String(self.progress));
      const number = root.current?.querySelector('[data-sanity]');
      if (number) number.textContent = String(Math.round(100 - self.progress * 88));
    } });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, { scope: root, dependencies: [view, reduced], revertOnUpdate: true });

  const Link = ({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) => <a href={pathFor(id)} className={className} onClick={e => navigate(e, id)}>{children}</a>;
  return <div className="vp" ref={root} data-zone-now={v.zone}>
    <a className="vskip" href="#contenido">{t(vi.skip)}</a>
    <header className="vbar">
      <a className="vbar__back" href="/" aria-label={t(vp.bar.back)}><ArrowLeft size={16} aria-hidden /><span>Feka Studios</span></a>
      <p className="vbar__zone">VACAS <span className="vbar__n">/ {t(v.label)}</span></p>
      <div className="vbar__sanity" role="img" aria-label={t(vp.bar.sanity)}><span className="vbar__label">{t(vp.bar.sanity)}</span><span className="vbar__track"><span className="vbar__fill" /><span className="vbar__poison" /></span><span className="vbar__num" data-sanity>100</span></div>
      <div className="vlang" role="group" aria-label="Idioma / Language"><button onClick={() => setLang('es')} aria-pressed={lang === 'es'}>ES</button><button onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button></div>
      <nav className="vtabs" aria-label={t(vi.navigation)}>
        {vacasViews.map((tab, i) => <a key={tab.id} href={pathFor(tab.id)} aria-current={view === tab.id ? 'page' : undefined} onClick={e => navigate(e, tab.id)}><span aria-hidden>{String(i).padStart(2, '0')}</span>{t(tab.label)}</a>)}
      </nav>
    </header>
    <div className="fx fx--fog" aria-hidden><span /><span /></div><div className="fx fx--vignette" aria-hidden /><div className="fx fx--grain" aria-hidden />
    <main id="contenido" ref={main}>
      <section className={`zone zone--${v.zone} vhero`} aria-labelledby="vacas-h1">
        <HeroArt art={v.art} />
        <div className="vhero__shade" aria-hidden />
        <div className="vwrap vhero__inner"><div className="vhero__copy">
          <p className="vhero__eyebrow">VACAS / {t(v.label)} <span>+18</span></p>
          <h1 id="vacas-h1" tabIndex={-1} className={view === '' ? 'vhero__title vhero__title--home' : 'vhero__title'}>{selected ? t(v.title) : t(vi.missing)}</h1>
          <p className="vhero__line">{t(v.line)}</p><p className="vhero__lead">{t(v.lead)}</p>
          <div className="vhero__actions"><a className="vbtn" href="#archivo">{t(vi.enter)}<ArrowDown size={16} aria-hidden /></a>{view === '' && <span className="vhero__status">{t(vp.hero.stamp)}</span>}</div>
        </div></div>
        <p className="vhero__folio" aria-hidden>FEKA STUDIOS / {String(vacasViews.indexOf(v)).padStart(2, '0')} — VI</p>
      </section>
      <div id="archivo" className={`zone zone--${v.zone} vcontent`}>
        <div className="vwrap">
          {view === '' && <>
            <header className="zone__head"><h2>{t(vp.tag.title)}</h2><p className="zone__body">{t(vp.hero.pitch)}</p></header>
            <dl className="tag__rows vfacts">{vp.tag.rows.map(r => <div key={r.label.es}><dt>{t(r.label)}</dt><dd>{t(r.value)}</dd></div>)}</dl>
            <div className="vdoors">{vacasViews.slice(1).map((tab, i) => <Link key={tab.id} id={tab.id}><span className="vdoors__n">0{i + 1}</span><h2>{t(tab.label)}</h2><p>{t(tab.line)}</p><span aria-hidden>↗</span></Link>)}</div>
          </>}
          {view === 'historia' && vp.zones.map((z, i) => <article className="vstory" key={z.id}><header className="zone__head"><p className="zone__sign"><span>{i + 1}</span>{t(z.name)}</p><h2>{t(z.title)}</h2><div className="zone__body">{z.body.map(p => <p key={p.es}>{t(p)}</p>)}</div></header><Pic img={z.gallery[0]} reveal={reveal} /></article>)}
          {view === 'jugabilidad' && <><div className="feats">{vp.zones.flatMap(z => z.features).map(f => <article className={f.img ? 'feat' : 'note'} key={f.title.es}><div className="feat__copy"><h3>{t(f.title)}</h3><p>{t(f.body)}</p></div>{f.img && <Pic img={f.img} reveal={reveal} />}</article>)}</div><Link id="galeria" className="vbtn vmore">{t(vp.labels.visions)} ↗</Link></>}
          {view === 'galeria' && <>
            <h2 className="vsection-title">{t(vi.actFive)}</h2><div className="gallery">{vacasArchive.map(img => <Pic key={img.id} img={img} reveal={reveal} />)}</div>
            <h2 className="zone__label">{t(vp.labels.visions)}</h2><p className="zone__lead">{t(vp.labels.visionsLead)}</p><div className="visions">{vp.visions.map(img => <Pic key={img.id} img={img} reveal={reveal} className="pic--vision" />)}</div>
            {vp.zones.map(z => <section className="varchive" key={z.id}><h2 className="zone__label">{t(z.name)}</h2><div className="gallery">{z.gallery.map(img => <Pic key={img.id} img={img} reveal={reveal} />)}</div></section>)}
          </>}
          {view === 'personajes' && vp.zones.map(z => <section key={z.id}><h2 className="zone__label">{t(z.name)}</h2><ul className="cast vportraits">{z.cast.map(c => <li className="cast__item" key={c.img.id}><div className="cast__portrait"><img src={c.img.src} alt={t(c.img.alt)} width={c.img.w} height={c.img.h} loading="lazy" /></div><div><h3 className="cast__name">{t(c.name)}</h3><p className="cast__line">{t(c.line)}</p></div></li>)}</ul></section>)}
          {view === 'personajes' && <section><h2 className="zone__label">{t(vi.process)}</h2><div className="vprocess"><Pic img={vacasProcess} reveal={reveal} /></div></section>}
          {view === 'bitacora' && <ol className="vlog">{devlog.filter(p => p.title.es.startsWith('Vacas:')).map((post, i) => <li key={i}><time dateTime={post.date || undefined}>{post.date?.split('-').reverse().join(' / ')}</time><h2>{t(post.title)}</h2><p>{t(post.body)}</p></li>)}</ol>}
          {!selected && <Link id="" className="vbtn">{t(vacasViews[0].label)}</Link>}
        </div>
      </div>
      {(view === '' || view === 'bitacora') && <Status reveal={reveal} onDevlog={e => navigate(e, 'bitacora')} />}
    </main>
    <footer className="vfoot zone zone--alcantarillas"><div className="vwrap vfoot__inner"><a href="/"><img src="/press/feka-logo.svg" alt="Feka Studios" width="130" height="44" /></a><p>{t(vp.footer.note)}</p><p>© {new Date().getFullYear()} Feka Studios</p></div></footer>
  </div>;
}

export default function VacasPage() {
  const { t } = useLang();
  const [adult, setAdult] = useState(readAdult);
  const [revealed, setRevealed] = useState(readRevealed);

  useEffect(() => { if (!adult) document.title = t(vp.meta.title); }, [t, adult]);

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
