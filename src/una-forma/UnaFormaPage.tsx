/* Página propia de «Una forma de querer» (/una-forma-de-querer/<vista>).
   Misma arquitectura que Vacas: vistas por ruta con pushState, cabecera con
   pestañas (menú desplegable en móvil), idioma ES/EN y foco al título al cambiar.
   Mundo del juego, no el del estudio: papel de cuaderno, grafito y acuarela de
   Arequipa. Momento de autor: en Inicio la tarde avanza con el scroll.
   Es promocional: no se cuentan los giros del guion. Textos en src/content.ts. */
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowDown, ArrowUpRight, List, X } from '@phosphor-icons/react';
import '@fontsource-variable/schibsted-grotesk';
import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource/caveat/400.css';
import '@fontsource/caveat/600.css';
import './una-forma.css';
import { unaFormaPage as p, unaFormaViews as views, unaForma, gameMenu, type UfqViewId } from '../content';
import { useLang } from '../i18n';
import { useMobileMenu } from '../components/useMobileMenu';
import { Diorama } from './Diorama';

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

const BASE = '/una-forma-de-querer';
const pathFor = (id: string) => `${BASE}${id ? '/' + id : ''}`;
const currentView = () => window.location.pathname.replace(/^\/una-forma-de-querer\/?/i, '').replace(/\/$/, '').toLowerCase();

/* ------------------------------------------------------------ piezas */
function Phone() {
  const { t } = useLang();
  const ph = p.phone;
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

function WaitCounter() {
  const { t } = useLang();
  const host = useRef<HTMLParagraphElement>(null);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let visible = false;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (host.current) io.observe(host.current);
    const id = window.setInterval(() => { if (visible && !document.hidden) setSeconds((s) => s + 1); }, 1000);
    return () => { io.disconnect(); window.clearInterval(id); };
  }, []);
  return (
    <p className="ufq-wait" ref={host}>
      {t(p.mechanics.wait.waiting)} <strong className="ufq-wait__n">{seconds}</strong> {t(p.mechanics.wait.seconds)}
    </p>
  );
}

function Lens() {
  const { t } = useLang();
  const l = p.mechanics.lens;
  const [warm, setWarm] = useState(false);
  return (
    <div className="ufq-lens" data-warm={warm}>
      <p className="ufq-lens__bubble" aria-live="polite">
        {t(l.before)}{' '}<span className="ufq-lens__word">{warm ? t(l.warm) : t(l.plain)}</span>{t(l.after)}
      </p>
      <div className="ufq-lens__choices" role="group" aria-label={t(l.hint)}>
        <button type="button" aria-pressed={!warm} onClick={() => setWarm(false)}>{t(l.friend)}</button>
        <button type="button" aria-pressed={warm} onClick={() => setWarm(true)}>{t(l.more)}</button>
      </div>
    </div>
  );
}

function Notebook() {
  const { t } = useLang();
  const n = p.notebook;
  return (
    <section className="ufq-block ufq-notebook" aria-labelledby="ufq-notebook-title">
      <h2 id="ufq-notebook-title">{t(n.title)}</h2>
      <p className="ufq-prose ufq-notebook__lead">{t(n.lead)}</p>
      <div className="ufq-notebook__spread">
        <p className="ufq-notebook__cover" aria-hidden>{n.cover}</p>
        <ol className="ufq-notebook__pages">
          {n.pages.map((pg) => (
            <li className="ufq-page" key={pg.quote.es}>
              <blockquote className="ufq-page__quote">{t(pg.quote)}</blockquote>
              <p className="ufq-page__place">{t(pg.place)}</p>
            </li>
          ))}
        </ol>
        <p className="ufq-notebook__question">{t(n.question)}</p>
      </div>
    </section>
  );
}

function Facts({ rows }: { rows: { label: { es: string; en: string }; value: { es: string; en: string } }[] }) {
  const { t } = useLang();
  return (
    <dl className="ufq-facts">
      {rows.map((r) => <div key={r.label.es}><dt>{t(r.label)}</dt><dd>{t(r.value)}</dd></div>)}
    </dl>
  );
}

/* ------------------------------------------------------------ página */
export default function UnaFormaPage() {
  const { t, lang, setLang } = useLang();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const pendingFocus = useRef(false);
  const keyboardNavigation = useRef(false);
  const routeTween = useRef<gsap.core.Tween | null>(null);
  const [view, setView] = useState(currentView);
  const selected = views.find((x) => x.id === view);
  const v = selected || views[0];
  const menu = useMobileMenu('ufq-secciones', '(min-width: 861px)');

  useEffect(() => {
    document.documentElement.classList.add('ufq-root');
    const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousTheme = theme?.content;
    const previousDescription = description?.content;
    if (theme) theme.content = '#f5efe3';
    const back = () => { routeTween.current?.kill(); pendingFocus.current = true; keyboardNavigation.current = true; setView(currentView()); window.scrollTo({ top: 0, behavior: 'instant' }); };
    window.addEventListener('popstate', back);
    return () => {
      document.documentElement.classList.remove('ufq-root');
      if (theme && previousTheme) theme.content = previousTheme;
      if (description && previousDescription) description.content = previousDescription;
      window.removeEventListener('popstate', back);
      routeTween.current?.kill();
    };
  }, []);

  useEffect(() => {
    document.title = v.id ? `${t(v.label)} · ${t(p.meta.title)}` : t(p.meta.title);
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = t(p.meta.description);
  }, [v, t]);

  useEffect(() => {
    if (!pendingFocus.current) return;
    main.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    pendingFocus.current = false;
  }, [view]);

  const { contextSafe } = useGSAP(() => {
    const host = root.current!;
    let mounted = true;
    gsap.set(main.current, { opacity: 1 });
    const hero = host.querySelector('.ufq-hero');

    if (view === '') {
      // Momento de autor: la tarde avanza mientras el diorama sale de pantalla.
      const dusk = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: reduced ? true : 0.6 } });
      dusk.to('.ufq-hero .ufq-sky--dusk', { opacity: 1, ease: 'none' }, 0)
        .to('.ufq-hero .ufq-dusk-wash', { opacity: 1, ease: 'none' }, 0);
      if (!reduced) dusk.to('.ufq-hero .ufq-sun', { y: 250, ease: 'none' }, 0);
    } else if (!reduced) {
      gsap.to('.ufq-hero .ufq-scene', { yPercent: 10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    }
    if (!reduced && !keyboardNavigation.current) {
      gsap.fromTo('.ufq-hero__copy > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'expo.out', clearProps: 'transform,opacity' });
    }
    keyboardNavigation.current = false;

    // Cuaderno: el dorado se apaga hasta el color del papel; queda la pregunta.
    if (host.querySelector('.ufq-notebook')) {
      gsap.fromTo('.ufq-notebook', { '--gilt': 1 }, {
        '--gilt': 0, ease: 'none',
        scrollTrigger: { trigger: '.ufq-notebook__pages', start: 'top 35%', end: 'bottom 45%', scrub: reduced ? true : 0.5 },
      });
    }
    // Ciudades: cada lavado de color se extiende como acuarela sobre el papel.
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
  }, { scope: root, dependencies: [view, reduced, lang], revertOnUpdate: true });

  const navigate = (event: MouseEvent<HTMLAnchorElement>, id: UfqViewId) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    menu.close();
    if (id === view) return;
    routeTween.current?.kill();
    keyboardNavigation.current = event.detail === 0;
    const change = () => {
      window.history.pushState({}, '', pathFor(id));
      pendingFocus.current = true;
      setView(id);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    if (reduced || event.detail === 0) change();
    else contextSafe(() => { routeTween.current = gsap.to(main.current, { opacity: 0, duration: 0.14, ease: 'power2.out', onComplete: change }); })();
  };

  const Link = ({ id, children, className = '' }: { id: UfqViewId; children: ReactNode; className?: string }) =>
    <a href={pathFor(id)} className={className} onClick={(e) => navigate(e, id)}>{children}</a>;

  const isHome = v.id === '';
  return (
    <div className="ufq" ref={root} data-view={v.id || 'inicio'}>
      <a className="ufq-skip" href="#contenido">{t(p.bar.skip)}</a>
      <header className="ufq-bar" data-menu={menu.open ? 'open' : 'closed'}>
        <a className="ufq-bar__back" href="/" aria-label={t(p.bar.back)}><ArrowLeft size={16} aria-hidden /><span>Feka Studios</span></a>
        <p className="ufq-bar__title"><span>{unaForma.title}</span><span className="ufq-bar__view">{t(v.label)}</span></p>
        <div className="ufq-lang" role="group" aria-label="Idioma / Language">
          <button type="button" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
          <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
        </div>
        <button {...menu.buttonProps} className="ufq-bar__menu" aria-label={t(menu.open ? gameMenu.close : gameMenu.open)}>
          {menu.open ? <X size={20} aria-hidden /> : <List size={20} aria-hidden />}<span>{t(gameMenu.label)}</span>
        </button>
        <nav ref={menu.panel} id="ufq-secciones" className="ufq-tabs" aria-label={t(p.bar.navigation)}>
          {views.map((tab) => (
            <a key={tab.id} href={pathFor(tab.id)} aria-current={view === tab.id ? 'page' : undefined} onClick={(e) => navigate(e, tab.id)}>{t(tab.label)}</a>
          ))}
        </nav>
      </header>

      <main id="contenido" ref={main}>
        <section className={`ufq-hero ${isHome ? 'ufq-hero--home' : ''}`} aria-labelledby="ufq-h1">
          <Diorama time={v.time} />
          <div className="ufq-wrap ufq-hero__copy">
            {isHome ? <p className="ufq-hero__status"><span>{t(p.hero.status)}</span><span>{t(p.hero.platform)}</span></p> : null}
            <h1 id="ufq-h1" tabIndex={-1} className="ufq-hero__title">{selected ? t(v.title) : t(views[0].title)}</h1>
            <p className="ufq-hero__line">{t(v.line)}</p>
            {isHome ? <p className="ufq-hero__lead">{t(p.hero.lead)}</p> : null}
            <div className="ufq-hero__ctas">
              <a className="ufq-btn ufq-btn--ink" href="#seccion">{t(p.hero.enter)} <ArrowDown size={16} aria-hidden /></a>
              {isHome ? <Link id="historia" className="ufq-btn">{t(views[1].label)}</Link> : null}
            </div>
          </div>
          {isHome ? <p className="ufq-hero__hint" aria-hidden>{t(p.hero.scroll)}</p> : null}
        </section>

        <div id="seccion" className="ufq-content">
          {isHome && <>
            <section className="ufq-block ufq-wrap ufq-split" aria-labelledby="ufq-pitch">
              <div>
                <h2 id="ufq-pitch">{t(p.home.pitchTitle)}</h2>
                {p.home.pitch.map((b) => <p className="ufq-prose" key={b.es}>{t(b)}</p>)}
                <h3 className="ufq-subhead">{t(p.home.factsTitle)}</h3>
                <Facts rows={unaForma.facts} />
              </div>
              <Phone />
            </section>
            <nav className="ufq-block ufq-wrap ufq-doors" aria-label={t(p.bar.navigation)}>
              {views.slice(1).map((tab) => (
                <Link key={tab.id} id={tab.id}><span className="ufq-doors__label">{t(tab.label)}</span><span className="ufq-doors__line">{t(tab.line)}</span><ArrowUpRight size={20} aria-hidden /></Link>
              ))}
            </nav>
          </>}

          {view === 'historia' && <div className="ufq-wrap">
            {p.story.blocks.map((b, i) => (
              <section className="ufq-block ufq-chapter" key={b.title.es} aria-labelledby={`ufq-story-${i}`}>
                <h2 id={`ufq-story-${i}`}>{t(b.title)}</h2>
                <div>{b.body.map((x) => <p className={x.es.startsWith('«') ? 'ufq-quote' : 'ufq-prose'} key={x.es}>{t(x)}</p>)}</div>
              </section>
            ))}
            <section className="ufq-block ufq-split" aria-label={t(p.phone.label)}>
              <p className="ufq-tone">{t(p.story.tone)}</p>
              <Phone />
            </section>
          </div>}

          {view === 'jugabilidad' && <div className="ufq-wrap">
            <Notebook />
            <section className="ufq-block" aria-labelledby="ufq-mech-title">
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
            </section>
            <section className="ufq-block ufq-split ufq-split--even" aria-labelledby="ufq-life-title">
              <div>
                <h2 id="ufq-life-title">{t(p.life.title)}</h2>
                <p className="ufq-prose">{t(p.life.lead)}</p>
              </div>
              <ul className="ufq-list">{p.life.items.map((x) => <li key={x.es}>{t(x)}</li>)}</ul>
            </section>
            <section className="ufq-block ufq-choices" aria-labelledby="ufq-choices-title">
              <h2 id="ufq-choices-title">{t(p.choices.title)}</h2>
              <p className="ufq-tone">{t(p.choices.body)}</p>
            </section>
          </div>}

          {view === 'arte' && <div className="ufq-wrap">
            <section className="ufq-block ufq-pillars" aria-label={t(v.title)}>
              {p.art.pillars.map((b) => (
                <article key={b.title.es}><h2 className="ufq-pillar__title">{t(b.title)}</h2>{b.body.map((x) => <p className="ufq-prose" key={x.es}>{t(x)}</p>)}</article>
              ))}
            </section>
            <section className="ufq-block" aria-labelledby="ufq-studies-title">
              <h2 id="ufq-studies-title">{t(p.art.studiesTitle)}</h2>
              <p className="ufq-prose">{t(p.art.studiesLead)}</p>
              <div className="ufq-studies">
                {p.art.studies.map((s) => (
                  <figure className="ufq-study" key={s.time}>
                    <div className="ufq-study__frame"><Diorama time={s.time} /></div>
                    <figcaption>{t(s.caption)}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
            <section className="ufq-block" aria-labelledby="ufq-palette-title">
              <h2 id="ufq-palette-title">{t(p.art.paletteTitle)}</h2>
              <ul className="ufq-palette">
                {p.route.cities.map((c) => (
                  <li key={c.id} className={`ufq-swatch ufq-swatch--${c.id}`}><span className="ufq-swatch__chip" aria-hidden /><span className="ufq-swatch__name">{c.name}</span><span className="ufq-swatch__mood">{t(c.mood)}</span></li>
                ))}
              </ul>
            </section>
            <section className="ufq-block ufq-split ufq-split--even" aria-labelledby="ufq-music-title">
              <h2 id="ufq-music-title">{t(p.art.music.title)}</h2>
              <div>{p.art.music.body.map((x) => <p className="ufq-prose" key={x.es}>{t(x)}</p>)}</div>
            </section>
          </div>}

          {view === 'personajes' && <div className="ufq-wrap">
            <ul className="ufq-block ufq-people">
              {p.cast.people.map((person) => (
                <li className="ufq-person" data-tone={person.tone} key={person.name}>
                  <span className="ufq-person__wash" aria-hidden />
                  <h2 className="ufq-person__name">{person.name}{person.age ? <span className="ufq-person__age">{person.age}</span> : null}</h2>
                  <p className="ufq-person__line">{t(person.line)}</p>
                </li>
              ))}
            </ul>
          </div>}

          {view === 'ciudades' && <>
            <div className="ufq-wrap"><p className="ufq-prose ufq-route__lead">{t(p.route.lead)}</p></div>
            <ol className="ufq-cities">
              {p.route.cities.map((c) => (
                <li className={`ufq-city ufq-city--${c.id}`} key={c.id}>
                  <div className="ufq-city__wash" aria-hidden />
                  <div className="ufq-wrap ufq-city__inner">
                    <p className="ufq-city__when">{t(c.when)}</p>
                    <h2 className="ufq-city__name">{c.name}</h2>
                    <p className="ufq-city__mood">{t(c.mood)}</p>
                    <p className="ufq-city__body">{t(c.body)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </>}

          {view === 'bitacora' && <div className="ufq-wrap ufq-split ufq-block">
            <ol className="ufq-log">
              {p.log.entries.map((e) => (
                <li key={e.date}>
                  <time dateTime={e.date}>{new Date(e.date + 'T12:00:00').toLocaleDateString(lang === 'es' ? 'es-PE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                  <h2>{t(e.title)}</h2>
                  {e.body.map((x) => <p className="ufq-prose" key={x.es}>{t(x)}</p>)}
                </li>
              ))}
            </ol>
            <aside aria-labelledby="ufq-status-title">
              <h2 id="ufq-status-title" className="ufq-subhead">{t(p.log.statusTitle)}</h2>
              <Facts rows={p.log.rows} />
            </aside>
          </div>}

          {!selected && <div className="ufq-wrap ufq-block"><Link id="" className="ufq-btn">{t(views[0].label)}</Link></div>}
        </div>
      </main>

      <footer className="ufq-foot">
        <div className="ufq-wrap ufq-foot__inner">
          <a href="/"><img src="/press/feka-logo-negro.svg" alt="Feka Studios" width="130" height="44" /></a>
          <p className="ufq-foot__note">{t(p.footer.note)}</p>
          <a className="ufq-foot__home" href="/#juegos">{t(p.footer.home)} <ArrowUpRight size={14} aria-hidden /></a>
          <p>© {new Date().getFullYear()} Feka Studios</p>
        </div>
      </footer>
    </div>
  );
}
