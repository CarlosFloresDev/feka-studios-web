import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, DownloadSimple, List, X, ArrowUp, EnvelopeSimple } from '@phosphor-icons/react';
import { ceniza, contact, devlog, press, proyecto3, socials, studio, team, ui, vacas } from './content';
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
        <a href="#top" className="nav__logo" aria-label="Feka Studios, inicio">
          <img src="/press/feka-logo.svg" alt="Feka Studios" width="190" height="64" />
        </a>
        <nav aria-label="Principal" style={{ display: 'contents' }}>
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
        <button type="button" className="nav__menu" aria-expanded={open} aria-controls="menu" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setOpen(!open)}>
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

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
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
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.25 });
      tl.to('.hero h1 .line > span', { y: 0, duration: 1.3, stagger: 0.09 })
        .to('.hero__sub', { opacity: 1, duration: 1 }, '-=0.9')
        .to('.hero__ctas', { opacity: 1, duration: 1 }, '-=0.8');
      gsap.to('.hero__content', {
        yPercent: -18, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 30%', scrub: true },
      });
    });
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
        {gl ? (
          <Suspense fallback={<img className="hero__fallback" src="/press/feka-marca.svg" alt="" />}>
            <HeroScene progress={progress} reduced={reduced} active={active} />
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

/* ------------------------------------------------------------------ Ceniza */
function Ceniza({ reduced }: { reduced: boolean }) {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const track = root.current!.querySelector<HTMLElement>('.pan__track')!;
      const vp = root.current!.querySelector<HTMLElement>('.pan')!;
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: vp, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
      });
      // la imagen clave se aleja levemente al entrar
      gsap.fromTo('.ceniza__key img', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.ceniza__key', start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }, { scope: root, dependencies: [reduced] });

  const [first, ...rest] = ceniza.title.split(' ');
  return (
    <section className="ceniza" id="juegos" ref={root} aria-labelledby="ceniza-title">
      <div className="ceniza__key" id={ceniza.id}>
        <img src="/media/ceniza/periphery_alive_v2.webp" alt="" width="1600" height="900" fetchPriority="high" />
        <div className="wrap ceniza__head">
          <p className="ceniza__kicker">{t(ui.sections.featured)}</p>
          <span className="pill pill--live ceniza__status"><span className="pill__dot" aria-hidden />{t(ceniza.status)}</span>
          <h2 id="ceniza-title" className="ceniza__title">{first} <span>{rest.join(' ')}</span></h2>
          <p className="ceniza__pitch">{t(ceniza.pitch)}</p>
          <div className="ceniza__ctas">
            {ceniza.links.map((l) =>
              l.href ? (
                <a key={l.label.es} className={`btn${l.primary ? ' btn--primary' : ''}`} href={l.href} {...ext(l.href)}>
                  {l.primary ? <DownloadSimple size={18} aria-hidden /> : null}
                  {t(l.label)}
                  {!l.primary ? <ArrowUpRight size={18} aria-hidden /> : null}
                </a>
              ) : (
                <span key={l.label.es} className="btn" aria-disabled="true">{t(l.label)}</span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="wrap ceniza__body">
        <Trailer trailer={ceniza.trailer} title={ceniza.title} />
        <div>
          <p className="lead">{t(ceniza.description)}</p>
          <dl className="facts">
            {ceniza.facts.map((f) => (
              <div key={f.label.es}><dt>{t(f.label)}</dt><dd>{t(f.value)}</dd></div>
            ))}
          </dl>
        </div>
      </div>

      <div className="pan">
        <div className="wrap pan__head"><h3>{t(ui.sections.shotsHint)}</h3></div>
        <div className="pan__viewport" tabIndex={0} aria-label={t(ui.sections.shotsHint)}>
          <div className="pan__track">
            {ceniza.shots.map((s) => (
              <figure className="pan__item" key={s.src}>
                <img src={s.src} alt={t(s.alt)} width={s.w} height={s.h} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Vacas */
function Vacas({ reduced }: { reduced: boolean }) {
  const { t } = useLang();
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reduced) return;
    // cada mapa se "enciende" como un fluorescente viejo al entrar en pantalla
    gsap.set('.vacas__map img', { opacity: 0.05 });
    ScrollTrigger.batch('.vacas__map', {
      start: 'top 82%',
      once: true,
      onEnter: (els) => {
        els.forEach((el, i) => {
          const img = el.querySelector('img');
          gsap.timeline({ delay: i * 0.15 })
            .to(img, { opacity: 0.7, duration: 0.05 })
            .to(img, { opacity: 0.1, duration: 0.08 })
            .to(img, { opacity: 0.85, duration: 0.04 })
            .to(img, { opacity: 0.3, duration: 0.12 })
            .to(img, { opacity: 1, duration: 0.6, ease: 'power2.out' });
        });
      },
    });
  }, { scope: root, dependencies: [reduced] });

  return (
    <section className="vacas section" id={vacas.id} ref={root} aria-labelledby="vacas-title">
      <div className="wrap vacas__grid">
        <div className="vacas__copy">
          <span className="pill vacas__status" style={{ justifySelf: 'start' }}><span className="pill__dot" aria-hidden />{t(vacas.status)}</span>
          <h2 id="vacas-title" className="vacas__title">{vacas.title}</h2>
          <p className="vacas__pitch">{t(vacas.pitch)}</p>
          <p className="muted">{t(vacas.description)}</p>
          <dl className="facts">
            {vacas.facts.map((f) => (
              <div key={f.label.es}><dt>{t(f.label)}</dt><dd>{t(f.value)}</dd></div>
            ))}
          </dl>
          <div className="vacas__ctas">
            {vacas.links.map((l) =>
              l.href ? (
                <a key={l.label.es} className={`btn${l.primary ? ' btn--primary' : ''}`} href={l.href} {...ext(l.href)}>
                  {t(l.label)} <ArrowUpRight size={18} aria-hidden />
                </a>
              ) : null,
            )}
          </div>
          <Trailer trailer={vacas.trailer} title={vacas.title} />
        </div>
        <div className="vacas__maps">
          {vacas.shots.map((s) => (
            <figure className="vacas__map" key={s.src}>
              <img src={s.src} alt={t(s.alt)} width={s.w} height={s.h} loading="lazy" decoding="async" />
              <figcaption>{t(s.alt)}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Proyecto 3 */
function Proyecto3() {
  const { t } = useLang();
  const p = proyecto3;
  return (
    <section className="p3" id="proyecto-3" aria-labelledby="p3-title">
      <div className="wrap">
        <article className="p3__card">
          {p.images.length > 0 ? (
            <div className="p3__imgs" aria-hidden>
              {p.images.map((s) => <img key={s.src} src={s.src} alt="" loading="lazy" />)}
            </div>
          ) : (
            <div className="p3__stage" aria-hidden><div className="p3__floor" /></div>
          )}
          <span className="pill p3__status"><span className="pill__dot" aria-hidden />{t(p.status)}</span>
          <h2 id="p3-title" className="p3__code">{p.name ?? p.codename}</h2>
          <p className="vacas__pitch">{t(p.pitch)}</p>
          <p className="muted">{t(p.description)}</p>
          <ul className="p3__tags">{p.tags.map((tag) => <li key={tag.es}>{t(tag)}</li>)}</ul>
          {(p.trailer.youtube || p.trailer.mp4) && (
            <div style={{ width: 'min(100%, 720px)' }}><Trailer trailer={p.trailer} title={p.name ?? p.codename} /></div>
          )}
        </article>
      </div>
    </section>
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
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);
  return (
    <>
      <a className="skip" href="#main">{t(ui.nav.skip)}</a>
      <Nav />
      <main id="main">
        <Hero reduced={reduced} />
        <Ceniza reduced={reduced} />
        <Vacas reduced={reduced} />
        <Proyecto3 />
        <Devlog />
        <Studio />
        <Press />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
