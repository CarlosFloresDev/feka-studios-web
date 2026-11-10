import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowLeft, ArrowRight, DownloadSimple, Play, WarningCircle } from '@phosphor-icons/react';
import { useLang } from '../i18n';
import { art, data, heroes, labels, localCharacters, localDistricts, localPosts, localRoadmap, localWiki, route, routeNames, text, type View } from './data';
import Markdown from './Markdown';
import './ceniza.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);
const Scene = lazy(() => import('./CenizaScene'));
const RANKING = 'https://ceniza-neon.chefsitturchey.workers.dev/api/ranking';
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
function readView(): View | null {
  const name = decodeURI(window.location.pathname).replace(/^\/ceniza\/?/i, '').replace(/\/$/, '');
  return routeNames.includes(name as View) ? name as View : null;
}
const external = { target: '_blank', rel: 'noopener noreferrer' };
function Picture({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return <figure className="cn-picture"><img src={src} alt={alt} loading="lazy" decoding="async" width="1600" height="900" />{caption && <figcaption>{caption}</figcaption>}</figure>;
}
function Home() {
  const { lang } = useLang();
  const tx = (es: string, en: string) => text(lang, es, en);
  return <>
    <section className="cn-intro"><h2>{tx('Lo que salves tendrá que amanecer.', 'What you save must make it to dawn.')}</h2><div className="cn-prose"><p>{tx('La emergencia terminó hace diecisiete años. La red nunca recibió la orden.', 'The emergency ended seventeen years ago. The network never received the order.')}</p><p>{tx('En una ciudad de acero, lluvia y memoria, la supervivencia tiene un precio. Tú llevas el único enlace que las máquinas no reconocen. Tu tarea empieza con una lámpara y las personas dispuestas a quedarse.', 'In a city of steel, rain and memory, survival comes at a price. You carry the only link the machines cannot recognise. Your task begins with a lamp and the people willing to stay.')}</p></div></section>
    <Picture src="/media/ceniza/colonia_vigente.webp" alt={tx('La colonia de día, entre chimeneas y defensas.', 'The colony by day among chimneys and defences.')} caption={tx('Captura del prototipo · Construcción y defensa de la colonia', 'Prototype capture · Colony construction and defence')} />
    <ol className="cn-loop">{[
      [tx('Construye de día', 'Build by day'), tx('Encarga obras, administra energía y arma una escuadra. Tus trabajadores hacen posible cada mejora.', 'Commission work, manage power and equip a squad. Your workers make every upgrade possible.')],
      [tx('Resiste de noche', 'Hold through the night'), tx('Tus tropas sostienen el frente. Da órdenes, protege tus recursos y aprende a retirarte a tiempo.', 'Your troops hold the front. Give orders, protect resources and learn when to retreat.')],
      [tx('Cruza el umbral', 'Cross the threshold'), tx('Entra a las arenas, lee a los jefes y convierte la experiencia en armas y pasivas que definan tu recorrido.', 'Enter arenas, read the bosses and turn experience into weapons and passives that shape your journey.')],
    ].map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol>
    <section className="cn-trailer"><h2>{tx('Entra en la ciudad.', 'Enter the city.')}</h2><video controls playsInline preload="none" poster="/media/ceniza/trailer-alfa-poster.webp" aria-label={tx('Tráiler de Ceniza Neón', 'Ceniza Neón trailer')}><source src="/media/ceniza/trailer-alfa.mp4" type="video/mp4" /></video><p className="cn-muted">{tx('Tráiler de la alfa · Material del juego en desarrollo', 'Alpha trailer · Game footage in development')}</p></section>
    <div className="cn-closing"><h2>{tx('Nadie reconstruye una ciudad a solas.', 'Nobody rebuilds a city alone.')}</h2><p>{tx('Un jugador en la alfa actual. El cooperativo para dos está previsto; todavía no está disponible.', 'The current alpha is single-player. Co-op for two is planned and is not available yet.')}</p><a className="cn-button" href={data.site.issues} {...external}>{tx('Compartir un error', 'Report an issue')}<ArrowRight aria-hidden /></a></div>
  </>;
}
function Universe() {
  const { lang } = useLang();
  const tx = (es: string, en: string) => text(lang, es, en);
  return <>
    <section className="cn-intro"><h2>{tx('¿Qué significa salvar una ciudad que sigue funcionando?', 'What does it mean to save a city that still works?')}</h2><div className="cn-prose"><p>{tx('Los trenes llegan. Los hornos producen. Las antenas responden. Cada noche, las máquinas retiran baterías y personas para sostener un sistema que olvidó para quién trabajaba.', 'Trains arrive. Furnaces produce. Antennas respond. Every night, machines take batteries and people to sustain a system that forgot whom it served.')}</p><p>{tx('La Cuenca vive bajo un protocolo de emergencia que podía reasignar calor, trabajo y memoria. El Portador lleva una llave de mantenimiento sin titular asignado: abre puertas, pero no puede sustituir la voluntad de quienes viven detrás.', 'The Basin lives under an emergency protocol that could reassign heat, work and memory. The Portador carries an unassigned maintenance key: it opens doors but cannot replace the will of the people behind them.')}</p><p>{tx('La historia combina decisiones de una colonia con conversaciones de novela visual. Su ampliación está en escritura: las escenas y arcos nuevos todavía no forman parte del prototipo. Esta presentación evita las revelaciones del final.', 'The story combines colony decisions with visual novel conversations. Its expansion is being written: new scenes and arcs are not part of the prototype yet. This introduction avoids ending spoilers.')}</p></div></section>
    <section><h2>{tx('Quienes mantienen la luz encendida.', 'Those who keep the light on.')}</h2><div className="cn-characters">{localCharacters(lang).map(c => <article key={c.id}><img src={art[c.id]} alt={tx(`Retrato de ${c.name}`, `Portrait of ${c.name}`)} width="650" height="650" loading="lazy" /><div><h3>{c.name}</h3><p className="cn-role">{c.role}</p><p>{c.text}</p><blockquote>«{c.quote}»</blockquote></div></article>)}</div><p className="cn-muted">{tx('Retratos aprobados. Las frases pertenecen a la propuesta narrativa ampliada.', 'Approved portraits. Introductory quotes belong to the expanded narrative proposal.')}</p></section>
    <section><h2>{tx('El mapa de una deuda.', 'The map of a debt.')}</h2><div className="cn-districts">{localDistricts(lang).map((d, i) => <article key={d.id}><img src={`/media/ceniza/${['periphery_alive_v2', 'foundry', 'flooded', 'citadel', 'network'][i]}.webp`} alt={d.name} width="1600" height="900" loading="lazy" /><div><h3>{d.name}</h3><p className="cn-hand">{d.detail}</p><p>{d.text}</p><p className="cn-muted">{tx('Encuentro', 'Encounter')}: {d.boss}</p></div></article>)}</div></section>
    <Picture src="/media/ceniza/novela_visual.webp" alt={tx('Conversación de novela visual con los retratos del prototipo.', 'Visual novel conversation with prototype portraits.')} caption={tx('Novela visual · Captura de desarrollo', 'Visual novel · Development capture')} />
    <blockquote className="cn-final-quote">{tx('Mañana habrá trabajo. Esta noche, la luz se queda.', 'Tomorrow there will be work. Tonight, the light stays.')}</blockquote>
  </>;
}
function Wiki() {
  const { lang } = useLang();
  const [query, setQuery] = useState('');
  const entries = localWiki(lang);
  const controls = entries.find(w => w.slug === 'controles-y-accesibilidad')!;
  const visible = entries.filter(w => w !== controls && `${w.title} ${w.summary} ${w.body}`.toLocaleLowerCase(lang).includes(query.toLocaleLowerCase(lang)));
  return <>
    <section id="controles"><h2>{controls.title}</h2><p>{controls.summary}</p><Markdown body={controls.body} /></section>
    <section className="cn-wiki"><h2>{text(lang, 'Consulta el archivo.', 'Explore the archive.')}</h2><label htmlFor="cn-search">{text(lang, 'Buscar en la wiki', 'Search the wiki')}</label><input id="cn-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={text(lang, 'Prueba «núcleo», «jefe» o «energía»', 'Try “core”, “boss” or “power”')} /><p className="cn-muted" role="status">{visible.length} {text(lang, 'artículos', 'articles')}</p>
      {visible.length === 0 && <p>{text(lang, 'No hay artículos con ese texto. Prueba otra palabra.', 'No articles match that text. Try another word.')}</p>}
      {visible.map(w => <details key={w.slug} id={w.slug}><summary><span>{w.title}<small>{w.summary}</small></span><span className="cn-plus" aria-hidden>+</span></summary><Markdown body={w.body} /></details>)}
    </section>
  </>;
}
function Journal() {
  const { lang } = useLang();
  const date = (value: string) => new Intl.DateTimeFormat(lang === 'es' ? 'es-PE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
  return <>
    <section><h2>{text(lang, 'Desde el primer paso.', 'From the first step.')}</h2><p className="cn-prose">{text(lang, 'Las fechas pertenecen a los avances conservados en Git. Los artículos retrospectivos muestran por separado cuándo se escribieron. El arte actual no se presenta como una captura histórica.', 'Dates belong to work preserved in Git. Retrospective entries separately show when they were written. Current art is not presented as a historical capture.')}</p>
      <div className="cn-posts">{localPosts(lang).map(p => <article id={p.slug} key={p.slug}><div className="cn-post-date"><time dateTime={p.date}>{date(p.date)}</time><a href={`${data.history.repository}/commit/${p.commit}`} {...external}>{p.commit}</a></div><div><h3>{p.title}</h3><p>{p.excerpt}</p>{p.retrospective && <p className="cn-muted">{text(lang, 'Redacción retrospectiva', 'Written retrospectively')}: {date(p.recordedOn)}</p>}<details><summary>{text(lang, 'Leer entrada', 'Read entry')}<ArrowDown aria-hidden /></summary><Markdown body={p.body} /></details></div></article>)}</div>
    </section>
    <section><h2>{text(lang, 'Historial de desarrollo.', 'Development history.')}</h2><p>{text(lang, 'Registro de commits del juego. Los asuntos se conservan en su idioma original.', 'Game commit records. Subjects are preserved in their original language.')}</p><details className="cn-history"><summary>{text(lang, 'Ver referencias de Git', 'View Git references')} ({data.history.commits.length})<ArrowDown aria-hidden /></summary><ol>{data.history.commits.map(c => <li key={c.sha}><time dateTime={c.authoredAt}>{date(c.authoredAt)}</time><a href={`${data.history.repository}/commit/${c.sha}`} {...external}><code>{c.sha.slice(0, 7)}</code></a><span lang="es">{c.subject}</span></li>)}</ol></details></section>
  </>;
}
function Soundtrack() {
  const { lang } = useLang();
  const [active, setActive] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const track = data.soundtrack.find(t => t.id === active);
  const tx = (es: string, en: string) => text(lang, es, en);
  return <section className="cn-soundtrack"><h2>{tx('Antes de entrar, escucha.', 'Before you enter, listen.')}</h2><p className="cn-prose">{tx('Los títulos proceden de los archivos originales del juego. Las pistas sin título se identifican por su nombre de archivo. El audio solo se carga cuando eliges una pista.', 'Titles come from the game’s original files. Untitled tracks are identified by filename. Audio only loads when you choose a track.')}</p>
    <div className="cn-player" aria-live="polite"><p className="cn-hand">{track ? track.title || tx(track.displayTitle, `Untitled · ${track.id}`) : tx('Elige una señal.', 'Choose a signal.')}</p>{track && <audio ref={audio} key={track.id} src={track.src} controls autoPlay preload="none" onError={() => setFailed(true)} onEnded={() => setActive(null)} aria-label={track.displayTitle} />}{failed && <p role="alert">{tx('No se pudo reproducir esta pista. Elige otra o vuelve a intentarlo.', 'This track could not be played. Choose another or try again.')}</p>}</div>
    <ol className="cn-tracks">{data.soundtrack.map((t, i) => <li key={t.id}><button type="button" aria-pressed={active === t.id} onClick={() => { if (active === t.id) { audio.current?.pause(); setActive(null); } else { setFailed(false); setActive(t.id); } }}><span className="cn-track-number">{String(i + 1).padStart(2, '0')}</span><Play aria-hidden weight={active === t.id ? 'fill' : 'regular'} /><span className="cn-track-name">{t.title || tx(t.displayTitle, `Untitled · ${t.id}`)}<small>{lang === 'es' ? t.context : ({ Ciudad: 'City', Distritos: 'Districts', Combate: 'Combat', Transiciones: 'Transitions' } as Record<string, string>)[t.context]} · {t.id}</small></span><span className="cn-duration">{Math.floor(t.duration / 60)}:{String(Math.floor(t.duration % 60)).padStart(2, '0')}</span></button></li>)}</ol>
  </section>;
}
function Roadmap() {
  const { lang } = useLang();
  return <section><h2>{text(lang, 'Un camino abierto.', 'An open road.')}</h2><p className="cn-prose">{text(lang, 'La alfa es una versión de prueba, no el juego terminado. No hay una fecha de lanzamiento de la versión completa ni una duración de campaña verificada con jugadores.', 'The alpha is a test version, not the finished game. There is no full-release date or player-verified campaign length.')}</p><ol className="cn-roadmap">{localRoadmap(lang).map((step, i) => <li key={step.state} data-state={i}><div><h3>{step.state}</h3><p className="cn-state">{step.status}</p><p>{step.text}</p></div><ul>{step.items.map(item => <li key={item}>{item}</li>)}</ul></li>)}</ol></section>;
}
type Score = { name: string; seconds: number; hits: number; date?: string };
function Ranking() {
  const { lang } = useLang();
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [scores, setScores] = useState<Score[]>([]);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    let mounted = true;
    setState('loading');
    (async () => {
      try {
        const response = await fetch(RANKING, { method: 'GET', signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const json: unknown = await response.json();
        const entries = (json as { ranking?: unknown })?.ranking;
        if (!Array.isArray(entries) || !entries.every(s => s && typeof s.name === 'string' && Number.isFinite(s.seconds) && s.seconds >= 0 && Number.isFinite(s.hits) && s.hits >= 0)) throw new Error('Formato de ranking inválido');
        if (mounted) { setScores(entries.slice(0, 20)); setState('ready'); }
      } catch { if (mounted) setState('error'); }
      finally { window.clearTimeout(timeout); }
    })();
    return () => { mounted = false; window.clearTimeout(timeout); controller.abort(); };
  }, [retry]);
  const tx = (es: string, en: string) => text(lang, es, en);
  return <section className="cn-ranking" aria-labelledby="cn-ranking-title"><h2 id="cn-ranking-title">Top Boss Rush</h2><p className="cn-prose">{tx('Los jugadores más rápidos en vencer a los cinco jefes seguidos. Termina el Boss Rush con internet y tu tiempo aparece aquí.', 'The fastest players to beat all five bosses in a row. Finish Boss Rush with an internet connection to submit your time.')}</p><div className="cn-ranking-content" aria-live="polite" aria-busy={state === 'loading'} data-state={state}>
    {state === 'loading' && <p className="cn-loading">{tx('Recibiendo tiempos de la red…', 'Receiving times from the network…')}</p>}
    {state === 'error' && <div className="cn-ranking-error"><WarningCircle size={28} aria-hidden /><h3>{tx('La señal no llega.', 'The signal is not reaching us.')}</h3><p>{tx('No pudimos cargar el ranking. Puedes seguir jugando y volver a consultar los tiempos más tarde.', 'We could not load the ranking. You can keep playing and check the times again later.')}</p><button type="button" className="cn-button" onClick={() => setRetry(n => n + 1)}>{tx('Reintentar', 'Try again')}</button></div>}
    {state === 'ready' && scores.length === 0 && <p>{tx('Aún no hay tiempos. Completa una ruta y deja tu nombre.', 'No times yet. Complete a run and leave your name.')}</p>}
    {state === 'ready' && scores.length > 0 && <ol className="cn-scores">{scores.map((score, i) => <li key={`${score.name}-${i}`}><span className="cn-place">{String(i + 1).padStart(2, '0')}</span><strong>{score.name}</strong><span>{Math.floor(score.seconds / 60)}:{(score.seconds % 60).toFixed(1).padStart(4, '0')}<small>{score.hits} {tx('golpes', 'hits')}</small></span></li>)}</ol>}
  </div></section>;
}
function Download() {
  const { lang } = useLang();
  const tx = (es: string, en: string) => text(lang, es, en);
  const d = data.download;
  return <>
    <section><h2>{tx('Jugar Ceniza Neón.', 'Play Ceniza Neón.')}</h2><p className="cn-prose">{tx('Versión 0.2.1-alpha. Es una alfa: está incompleta y tendrá errores. Lo que nos cuentes ayuda a decidir qué arreglamos primero.', 'Version 0.2.1-alpha. This alpha is incomplete and will have bugs. Your feedback helps decide what we fix first.')}</p>
      <div className="cn-downloads"><article><h3>Windows</h3><p>ZIP · {d.windows.size}</p><p>{tx(d.windows.requirements, 'Windows 10 or later, 64-bit')}</p><a className="cn-button cn-button--primary" href={d.windows.url} {...external}><DownloadSimple aria-hidden />{tx('Descargar Windows', 'Download Windows')}</a><ol><li>{tx('Descarga y extrae el archivo ZIP.', 'Download and extract the ZIP file.')}</li><li>{tx('Abre la carpeta y ejecuta CenizaNeon.exe.', 'Open the folder and run CenizaNeon.exe.')}</li></ol></article>
      <article><h3>Android</h3><p>APK · {d.android.size}</p><p>{tx(d.android.requirements, 'Android 8.0 or later, arm64 processor')}</p><a className="cn-button cn-button--primary" href={d.android.url} {...external}><DownloadSimple aria-hidden />{tx('Descargar APK', 'Download APK')}</a><ol><li>{tx('Descarga el APK y permite instalar desde tu navegador cuando Android lo pida.', 'Download the APK and allow installation from your browser when Android asks.')}</li><li>{tx('Instala y abre el juego. Incluye controles táctiles y admite mando.', 'Install and open the game. Touch controls and controllers are supported.')}</li></ol><p className="cn-muted">{tx('Puedes volver a desactivar ese permiso en Ajustes → Aplicaciones → Instalar apps desconocidas.', 'You can disable that permission again in Settings → Apps → Install unknown apps.')}</p></article>
      <article><h3>{tx('Navegador', 'Browser')}</h3><p>{tx('Sin instalar nada.', 'No installation.')}</p><p>{tx('Navegador actualizado con WebGL 2. Ordenador con teclado o mando.', 'An up-to-date browser with WebGL 2. A computer with keyboard or controller.')}</p><a className="cn-button cn-button--primary" href={d.itch.url} {...external}><Play aria-hidden />{tx('Jugar', 'Play')}</a><p>{tx('Abre la versión web en itch.io.', 'Open the web version on itch.io.')}</p></article></div>
      <div className="cn-download-note"><p>{tx('Un jugador. El cooperativo para dos sigue previsto y no está incluido. El equilibrio, los controles y el contenido pueden cambiar entre versiones.', 'Single-player. Co-op for two is planned and is not included. Balance, controls and content may change between versions.')}</p><a href={d.releaseNotes} {...external}>{tx('Notas de la versión en GitHub', 'Release notes on GitHub')}<ArrowRight aria-hidden /></a></div>
    </section>
    <Ranking />
  </>;
}
export default function CenizaPage() {
  const { lang, setLang } = useLang();
  const [view, setView] = useState<View | null>(readView);
  const [motion, setMotion] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [slow, setSlow] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const navigated = useRef(false);
  const keyboardNav = useRef(false);
  const index = view === null ? 0 : routeNames.indexOf(view);
  const h = heroes[index];
  const tx = (es: string, en: string) => text(lang, es, en);
  const onSlow = useCallback(() => setSlow(true), []);
  useEffect(() => {
    document.body.classList.add('ceniza-page');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = window.matchMedia('(max-width: 700px)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const evaluate = () => setMotion(!reduced.matches && !compact.matches && !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType || '') && (!navigator.hardwareConcurrency || navigator.hardwareConcurrency > 2));
    evaluate(); reduced.addEventListener('change', evaluate); compact.addEventListener('change', evaluate);
    const timer = window.setTimeout(() => setReady(true), 450);
    return () => { document.body.classList.remove('ceniza-page'); reduced.removeEventListener('change', evaluate); compact.removeEventListener('change', evaluate); window.clearTimeout(timer); };
  }, []);
  useEffect(() => {
    const onHistory = () => { navigated.current = true; setView(readView()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('popstate', onHistory);
    return () => window.removeEventListener('popstate', onHistory);
  }, []);
  useEffect(() => {
    if (window.location.hash) document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView();
  }, [view]);
  useEffect(() => {
    let inView = true;
    const visibility = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; visibility(); });
    if (hero.current) observer.observe(hero.current);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    document.title = `${view === null ? tx('Página no encontrada', 'Page not found') : labels[lang][index]} · Ceniza Neón · Feka Studios`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#15131c');
    document.querySelector('meta[name="description"]')?.setAttribute('content', h.lead[lang === 'es' ? 0 : 1]);
    const tab = root.current?.querySelector<HTMLElement>('.cn-tabs [aria-current="page"]');
    if (tab?.parentElement) tab.parentElement.scrollLeft = tab.offsetLeft - tab.parentElement.clientWidth / 2 + tab.clientWidth / 2;
    if (navigated.current) heading.current?.focus({ preventScroll: true });
  }, [view, lang, index]);
  useGSAP(() => {
    if (!motion || keyboardNav.current) return;
    gsap.fromTo('.cn-hero-copy', { opacity: .45, y: 14 }, { opacity: 1, y: 0, duration: .65, ease: 'expo.out', clearProps: 'all' });
    gsap.to('.cn-hero-art', { yPercent: 7, ease: 'none', scrollTrigger: { trigger: hero.current, start: 'top top', end: 'bottom top', scrub: .8 } });
  }, { scope: root, dependencies: [view, motion], revertOnUpdate: true });
  const navigate = (event: MouseEvent<HTMLAnchorElement>, next: View) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (next === view) return;
    keyboardNav.current = event.detail === 0;
    navigated.current = true;
    window.history.pushState({}, '', route(next));
    setView(next); window.scrollTo({ top: 0, behavior: 'instant' });
  };
  return <div className="cn" ref={root}>
    <a className="cn-skip" href="#cn-content">{tx('Saltar al contenido', 'Skip to content')}</a>
    <header className="cn-header"><div className="cn-header-top"><a className="cn-back" href="/"><ArrowLeft aria-hidden /> Feka Studios</a><a className="cn-brand" href="/ceniza" onClick={e => navigate(e, '')}>Ceniza Neón</a><div className="cn-languages" aria-label="Idioma / Language">{(['es', 'en'] as const).map(l => <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}</div></div><nav className="cn-tabs" aria-label={tx('Apartados de Ceniza Neón', 'Ceniza Neón sections')}>{routeNames.map((name, i) => <a href={route(name)} key={name} aria-current={view === name ? 'page' : undefined} onClick={e => navigate(e, name)}>{labels[lang][i]}</a>)}</nav></header>
    <main>
      <section className={`cn-hero cn-hero--${h.key}`} ref={hero} aria-labelledby="cn-title" data-renderer={motion && ready && !slow ? '3d' : 'static'}>
        <div className="cn-hero-art" aria-hidden><img src={art[h.key]} alt="" fetchPriority="high" decoding="async" />{motion && ready && !slow && <SceneBoundary><Suspense fallback={null}><Scene key={h.key} image={art[h.key]} actor={['lamp', 'drone', 'ranger', 'builder', 'drone', 'train', 'portador-back'][index]} active={active} onSlow={onSlow} /></Suspense></SceneBoundary>}</div>
        <div className="cn-hero-shade" aria-hidden />
        <div className="cn-hero-copy"><h1 ref={heading} id="cn-title" tabIndex={-1}>{view === null ? tx('Esta señal no existe.', 'This signal does not exist.') : h.title[lang === 'es' ? 0 : 1]}</h1><p>{view === null ? tx('Vuelve al inicio para encontrar el camino a la ciudad.', 'Return home to find your way to the city.') : h.lead[lang === 'es' ? 0 : 1]}</p><div className="cn-hero-actions">{view === '' ? <a className="cn-button cn-button--primary" href="/ceniza/descargar" onClick={e => navigate(e, 'descargar')}><Play aria-hidden weight="fill" />{tx('Jugar la alfa', 'Play the alpha')}</a> : view === null ? <a className="cn-button cn-button--primary" href="/ceniza" onClick={e => navigate(e, '')}>{tx('Volver al inicio', 'Return home')}</a> : null}<a className="cn-button" href="#cn-content"><ArrowDown aria-hidden />{view === '' ? tx('Descubre el juego', 'Discover the game') : labels[lang][index]}</a></div></div>
        <div className="cn-hero-bottom"><p>{['journal', 'download'].includes(h.key) ? tx('Arte ambiental del juego', 'Game environment art') : tx('Ilustración pintada, no es una captura', 'Painted illustration, not a screenshot')}</p><span>Feka Studios · 0.2.1-alpha</span></div>
      </section>
      <div id="cn-content" className="cn-content" key={view}>
        {view === '' && <Home />}{view === 'universo' && <Universe />}{view === 'wiki' && <Wiki />}{view === 'bitacora' && <Journal />}{view === 'banda-sonora' && <Soundtrack />}{view === 'hoja-de-ruta' && <Roadmap />}{view === 'descargar' && <Download />}
      </div>
    </main>
    <footer className="cn-footer"><p className="cn-footer-title">Ceniza Neón</p><p>{tx('Una luz que todavía puedes defender.', 'A light you can still defend.')}</p><nav aria-label={tx('Estudio y contacto', 'Studio and contact')}><a href="/">Feka Studios</a><a href="/vacas">Vacas</a><a href="/#prensa">{tx('Prensa', 'Press')}</a><a href={`mailto:${data.site.email}`}>{tx('Contacto', 'Contact')}</a><a href={data.site.issues} {...external}>{tx('Informar de un error', 'Report an issue')}</a></nav><p className="cn-muted">{tx('En desarrollo · Alfa 0.2.1 · Cooperativo previsto, todavía no disponible.', 'In development · Alpha 0.2.1 · Co-op planned, not available yet.')}</p></footer>
  </div>;
}
