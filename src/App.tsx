import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, DownloadSimple, List, X, ArrowUp, EnvelopeSimple } from '@phosphor-icons/react';
import { ceniza, contact, devlog, press, socials, studio, team, ui, unaForma, vacas, type Game } from './content';
import { Diorama } from './una-forma/Diorama';
import { useLang } from './i18n';
import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/schibsted-grotesk';
import './styles.css';
import { Trailer } from './components/Trailer';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HeroScene = lazy(() => import('./components/HeroScene'));

function useReducedMotion() {
  const [reduced, set] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => set(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

const ext = (href: string) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {});

/* ------------------------------------------------------------------ Nav */
function Nav() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus(); }
    };
    const mq = window.matchMedia('(min-width: 861px)');
    const close = () => { if (mq.matches) setOpen(false); };
    document.addEventListener('keydown', escape);
    mq.addEventListener('change', close);
    return () => { document.removeEventListener('keydown', escape); mq.removeEventListener('change', close); };
  }, [open]);
  useEffect(() => {
    const st = ScrollTrigger.create({ start: 80, end: 'max', onToggle: (s) => setSolid(s.isActive) });
    return () => st.kill();
  }, []);
  const links = [
    ['#juegos', ui.nav.games],
    ['#diario', ui.nav.devlog],
    ['#estudio', ui.nav.studio],
    ['#prensa', ui.nav.press],
    ['#contacto', ui.nav.contact],
  ] as const;
  return (
    <header className="nav" data-solid={solid || open} data-open={open}>
      <div className="wrap nav__inner">
        <a href="#top" className="nav__logo" aria-label={lang === 'es' ? 'Feka Studios, inicio' : 'Feka Studios, home'}>
          <img src="/press/feka-logo.svg" alt="Feka Studios" width="190" height="64" />
        </a>
        <nav aria-label={lang === 'es' ? 'Principal' : 'Main'} style={{ display: 'contents' }}>
          <ul className="nav__links" id="menu">
            {links.map(([href, l]) => (
              <li key={href}><a href={href} onClick={() => setOpen(false)}>{t(l)}</a></li>
            ))}
            <li>
              <div className="lang" role="group" aria-label="Idioma / Language">
                <button type="button" aria-pressed={lang === 'es'} onClick={() => setLang('es')}>ES</button>
                <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
              </div>
            </li>
          </ul>
        </nav>
        <button ref={menuButton} type="button" className="nav__menu" aria-expanded={open} aria-controls="menu" aria-label={lang === 'es' ? (open ? 'Cerrar menú' : 'Abrir menú') : (open ? 'Close menu' : 'Open menu')} onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ Hero */
function Hero({ reduced }: { reduced: boolean }) {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(true);
  const [gl] = useState(hasWebGL);
  const [foreground, setForeground] = useState(!document.hidden);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    const visibility = () => setForeground(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: root.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (s) => { progress.current = s.progress; },
    });
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.fromTo('h1 .line > span', { yPercent: 105 }, { yPercent: 0, duration: 0.7, stagger: 0.06 })
        .fromTo('.hero__sub', { opacity: 0 }, { opacity: 1, duration: 0.35 }, '-=0.45')
        .fromTo('.hero__ctas', { opacity: 0 }, { opacity: 1, duration: 0.25 }, '-=0.25');
      gsap.to('.hero__content', {
        yPercent: -18, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 30%', scrub: true },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  const lines = t(studio.tagline).split(/(?<=\s)(?=\S)/).reduce<string[]>((acc, w, i, all) => {
    // dos líneas equilibradas
    const half = Math.ceil(all.length / 2);
    const idx = i < half ? 0 : 1;
    acc[idx] = (acc[idx] || '') + w;
    return acc;
  }, []);

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__canvas">
        {gl && !reduced ? (
          <Suspense fallback={<img className="hero__fallback" src="/press/feka-marca.svg" alt="" />}>
            <HeroScene progress={progress} reduced={reduced} active={active && foreground} />
          </Suspense>
        ) : (
          <img className="hero__fallback" src="/press/feka-marca.svg" alt="" />
        )}
      </div>
      <div className="wrap hero__content">
        <h1 id="hero-title" aria-label={t(studio.tagline)}>
          {lines.map((l, i) => (
            <span className="line" key={i} aria-hidden><span>{l.trim()}</span></span>
          ))}
        </h1>
        <p className="hero__sub">{t(studio.intro)}</p>
        <div className="hero__ctas">
          <a className="btn btn--primary" href="#juegos">{t(ui.hero.cta)}</a>
          <a className="btn" href={ceniza.links[0].href!} {...ext(ceniza.links[0].href!)}>
            {t(ui.hero.cta2)} <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Juegos */
// Los tres juegos comparten el mismo módulo (el de Vacas): estado, título, lema,
// párrafo, ficha en filas y enlace a su página; a la derecha, su arte con pie de
// foto. Cada uno conserva su acento (data-theme) y su imagen.
function GameShowcase({ game, reduced }: { game: Game; reduced: boolean }) {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);
  const video = Boolean(game.trailer.youtube || game.trailer.mp4);
  const shots = game.shots.slice(0, video ? 2 : 3);

  useGSAP((_context, contextSafe) => {
    if (reduced) return;
    // cada imagen entra una sola vez, desde ya visible (nunca desde cero)
    gsap.set(root.current!.querySelectorAll('.show__media > *'), { opacity: 0.35, y: 18 });
    ScrollTrigger.batch(root.current!.querySelectorAll('.show__media > *'), {
      start: 'top 85%',
      once: true,
      onEnter: contextSafe!((els: Element[]) => {
        gsap.to(els, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out', overwrite: 'auto' });
      }),
    });
  }, { scope: root, dependencies: [reduced], revertOnUpdate: true });

  return (
    <section className="show section" data-theme={game.theme} id={game.id} ref={root} aria-labelledby={`${game.id}-title`}>
      <div className="wrap show__grid">
        <div className="show__copy">
          <span className="pill show__status"><span className="pill__dot" aria-hidden />{t(game.status)}</span>
          <h3 id={`${game.id}-title`} className="show__title">{game.title}</h3>
          <p className="show__pitch">{t(game.pitch)}</p>
          <p className="muted show__desc">{t(game.description)}</p>
          <dl className="facts show__facts">
            {game.facts.map((f) => (
              <div key={f.label.es}><dt>{t(f.label)}</dt><dd>{t(f.value)}</dd></div>
            ))}
          </dl>
          <div className="show__ctas">
            {game.links.map((l) =>
              l.href ? (
                <a key={l.label.es} className={`btn${l.primary ? ' btn--primary' : ''}`} href={l.href} {...ext(l.href)}>
                  {l.primary && l.href.startsWith('http') ? <DownloadSimple size={18} aria-hidden /> : null}
                  {t(l.label)}
                  {!l.primary || !l.href.startsWith('http') ? <ArrowUpRight size={18} aria-hidden /> : null}
                </a>
              ) : null,
            )}
          </div>
        </div>
        <div className="show__media">
          {game.art?.kind === 'diorama' ? (
            <figure className="show__fig show__fig--art">
              <div className="show__frame show__frame--diorama"><Diorama time="noon" /></div>
              <figcaption>{t(game.art.caption)}</figcaption>
            </figure>
          ) : null}
          {video ? (
            <figure className="show__fig">
              <Trailer trailer={game.trailer} title={game.title} />
            </figure>
          ) : null}
          {shots.map((s) => (
            <figure className="show__fig" key={s.src}>
              <div className="show__frame"><img src={s.src} alt={t(s.alt)} width={s.w} height={s.h} loading="lazy" decoding="async" /></div>
              <figcaption>{t(s.alt)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Games({ reduced }: { reduced: boolean }) {
  const { t } = useLang();
  return (
    <div id="juegos" className="games">
      <div className="wrap games__head">
        <h2>{t(ui.nav.games)}</h2>
      </div>
      {[ceniza, vacas, unaForma].map((g) => <GameShowcase key={g.id} game={g} reduced={reduced} />)}
    </div>
  );
}

/* ------------------------------------------------------------------ Diario */
function Devlog() {
  const { t, lang } = useLang();
  const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <section className="section" id="diario" aria-labelledby="log-title">
      <div className="wrap">
        <h2 id="log-title">{t(ui.sections.devlog)}</h2>
        <ol className="log__list">
          {devlog.map((post) => (
            <li className="log__item" key={post.title.es}>
              {post.date ? <time className="log__date num" dateTime={post.date}>{fmt(post.date)}</time> : <span className="log__date">{t(ui.sections.undated)}</span>}
              <div>
                <h3>{t(post.title)}</h3>
                <p>{t(post.body)}</p>
              </div>
              {post.href ? (
                <a className="log__link" href={post.href} {...ext(post.href)}>{t(ui.sections.readMore)} <ArrowUpRight size={16} aria-hidden /></a>
              ) : <span />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Estudio */
function Studio() {
  const { t } = useLang();
  return (
    <section className="section" id="estudio" aria-labelledby="studio-title" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <h2 id="studio-title">{t(ui.sections.studio)}</h2>
        <p className="studio__statement">{t(studio.about)}</p>
        <h3 className="sr-only">{t(ui.sections.team)}</h3>
        <ul className="team">
          {team.map((m) => (
            <li className="team__member" key={m.name}>
              <div className="team__avatar" data-tone={m.tone} aria-hidden>
                <span className="team__initial">{m.name[0]}</span>
              </div>
              <div>
                <p className="team__name">{m.name}{m.alias ? <span className="team__alias">“{m.alias}”</span> : null}</p>
                <p className="team__role">{t(m.role)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Prensa */
function Press() {
  const { t } = useLang();
  return (
    <section className="section press" id="prensa" aria-labelledby="press-title">
      <div className="wrap">
        <h2 id="press-title">{t(ui.sections.press)}</h2>
        <p className="lead" style={{ marginTop: '1.25rem' }}>{t(ui.sections.pressLead)}</p>
        <div className="press__grid">
          <div>
            <dl className="facts">
              {press.facts.map((f) => (
                <div key={f.label.es}><dt>{t(f.label)}</dt><dd>{t(f.value)}</dd></div>
              ))}
              <div>
                <dt>{t(ui.nav.contact)}</dt>
                <dd>{contact.pressEmail || contact.email ? <a href={`mailto:${contact.pressEmail || contact.email}`}>{contact.pressEmail || contact.email}</a> : <span className="muted">{t(ui.sections.emailPending)}</span>}</dd>
              </div>
            </dl>
            <p className="press__boiler"><strong>Boilerplate</strong>{t(studio.boilerplate)}</p>
          </div>
          <div>
            <h3 className="sr-only">{t(ui.sections.downloads)}</h3>
            <ul className="dl">
              {press.downloads.map((d) => (
                <li key={d.href}>
                  <a href={d.href} download>
                    <span className="dl__label">{t(d.label)}</span>
                    <span className="dl__note">{t(d.note)}</span>
                    <DownloadSimple size={22} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
            <div className="dl__logo" aria-hidden>
              <img src="/press/feka-logo.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Contacto */
function Contact() {
  const { t } = useLang();
  return (
    <section className="section" id="contacto" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title">{t(ui.sections.contact)}</h2>
        <p className="lead" style={{ marginTop: '1.25rem' }}>{t(ui.sections.contactLead)}</p>
        {contact.email ? (
          <a className="contact__mail" href={`mailto:${contact.email}`}>{contact.email}</a>
        ) : (
          <span className="contact__mail" aria-disabled="true"><EnvelopeSimple size="0.8em" style={{ display: 'inline', verticalAlign: '-0.08em', marginRight: '0.25em' }} aria-hidden />{t(ui.sections.emailPending)}</span>
        )}
        <div className="contact__row">
          <div>
            <h3>{t(ui.sections.follow)}</h3>
            <ul className="socials">
              {socials.map((s) => (
                <li key={s.label.es}>
                  {s.href ? (
                    <a href={s.href} {...ext(s.href)}>{t(s.label)} <ArrowUpRight size={16} aria-hidden /></a>
                  ) : (
                    <span>{t(s.label)} <small>{t(ui.sections.soon)}</small></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Newsletter</h3>
            <p className="muted" style={{ marginTop: '0.75rem' }}>{t(ui.sections.newsletterLead)}</p>
            {contact.newsletterAction ? (
              <form className="newsletter" action={contact.newsletterAction} method="post" target="_blank">
                <label htmlFor="nl-email">{t(ui.sections.newsletterLabel)}</label>
                <div className="newsletter__row">
                  <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder="nombre@correo.com" />
                  <button className="btn btn--primary" type="submit">{t(ui.sections.newsletterBtn)}</button>
                </div>
              </form>
            ) : (
              <p className="muted" style={{ marginTop: '0.75rem' }}>
                {t(ui.sections.newsletterFallback)}{' '}
                <a href={contact.releasesUrl} {...ext(contact.releasesUrl)}>{t(ui.sections.releases)}</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <img src="/press/feka-logo.svg" alt="Feka Studios" width="160" height="54" />
        <p>© {new Date().getFullYear()} Feka Studios. {t(ui.footer.rights)}</p>
        <a href="#top">{t(ui.footer.top)} <ArrowUp size={14} style={{ display: 'inline', verticalAlign: '-2px' }} aria-hidden /></a>
      </div>
    </footer>
  );
}

export default function App() {
  const reduced = useReducedMotion();
  const { t } = useLang();
  useEffect(() => {
    // las fuentes cambian alturas: recalcular disparadores
    let mounted = true;
    document.fonts?.ready.then(() => { if (mounted) ScrollTrigger.refresh(); });
    return () => { mounted = false; };
  }, [t]);
  return (
    <>
      <a className="skip" href="#main">{t(ui.nav.skip)}</a>
      <Nav />
      <main id="main">
        <Hero reduced={reduced} />
        <Games reduced={reduced} />
        <Devlog />
        <Studio />
        <Press />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
