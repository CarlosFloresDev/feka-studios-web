/* =====================================================================
   FEKA STUDIOS · CONTENIDO EDITABLE
   ---------------------------------------------------------------------
   Todo el texto, enlaces, juegos, equipo y tráileres de la web viven aquí.
   Cada texto tiene versión { es, en }. Si no quieres traducir algo, copia
   el mismo texto en ambos campos.

   Busca "PROVISIONAL" para ver los valores pendientes de confirmar.

   Rutas de imágenes y vídeos: relativas a /public (por ejemplo
   "/media/ceniza/citadel.webp" = public/media/ceniza/citadel.webp).
   Límite de Cloudflare: 25 MiB por archivo. Los tráileres grandes, mejor
   en YouTube (campo `youtube`).
   ===================================================================== */

export type L = { es: string; en: string };
export type Lang = keyof L;

export type Trailer = {
  /** ID o URL de YouTube. Si está, tiene prioridad sobre mp4. */
  youtube?: string | null;
  /** Ruta a un .mp4 en /public (menos de 25 MiB) o URL externa. */
  mp4?: string | null;
  /** Subtítulos .vtt opcionales para el mp4. */
  captions?: string | null;
  /** Imagen que se ve antes de reproducir (o siempre, si no hay vídeo). */
  poster: string;
};

export type Shot = { src: string; alt: L; w: number; h: number };

export type Link = { label: L; href: string | null };

// ---------------------------------------------------------------------
// ESTUDIO
// ---------------------------------------------------------------------
export const studio = {
  name: 'Feka Studios',
  tagline: {
    es: 'Terror que se juega a oscuras.',
    en: 'Horror meant to be played in the dark.',
  },
  intro: {
    es: 'Estudio independiente de tres personas. Hacemos juegos de terror, supervivencia y rol bajo luz de neón.',
    en: 'A three-person independent studio. We make horror, survival and role-playing games under neon light.',
  },
  about: {
    es: 'Feka Studios nace de tres programadores que quieren hacer los juegos que les quitaban el sueño. Cada proyecto prueba un motor y una forma distinta de asustar: la gestión bajo asedio, el horror psicológico de pasillo estrecho y el combate por turnos de los clásicos de los noventa.',
    en: 'Feka Studios is three programmers making the kind of games that used to keep them awake. Each project tries a different engine and a different way to scare you: management under siege, narrow-corridor psychological horror and the turn-based combat of nineties classics.',
  },
  boilerplate: {
    es: 'Feka Studios es un estudio independiente de videojuegos de terror. Su primer título, Ceniza Neón, está disponible en alfa para Windows, Android y navegador.',
    en: 'Feka Studios is an independent horror game studio. Its first title, Ceniza Neón, is available in alpha for Windows, Android and the browser.',
  },
};

// ---------------------------------------------------------------------
// CONTACTO Y REDES
// ---------------------------------------------------------------------
export const contact = {
  /** PROVISIONAL: pon aquí el correo real del estudio. Mientras sea null,
      la web muestra "Correo en camino" y no inventa ninguna dirección. */
  email: 'fekastudios@gmail.com' as string | null,
  /** PROVISIONAL: correo para prensa (si es distinto). */
  pressEmail: null as string | null,
  /** PROVISIONAL: URL de un formulario de boletín (Buttondown, Mailchimp,
      etc.). Mientras sea null, la sección de boletín no muestra formulario. */
  newsletterAction: null as string | null,
  /** Donde se publican las versiones mientras no haya boletín. */
  releasesUrl: 'https://github.com/chefsitturchey-web/Ceniza-ne-n/releases',
};

/** Redes. href: null = se muestra como "Pronto" sin enlace. PROVISIONAL. */
export const socials: Link[] = [
  { label: { es: 'GitHub', en: 'GitHub' }, href: 'https://github.com/chefsitturchey-web' },
  { label: { es: 'itch.io', en: 'itch.io' }, href: null },
  { label: { es: 'YouTube', en: 'YouTube' }, href: null },
  { label: { es: 'TikTok', en: 'TikTok' }, href: null },
  { label: { es: 'X / Twitter', en: 'X / Twitter' }, href: null },
  { label: { es: 'Discord', en: 'Discord' }, href: null },
];

// ---------------------------------------------------------------------
// EQUIPO
// ---------------------------------------------------------------------
export type Member = {
  name: string;
  /** Apodo opcional (se muestra entre comillas). */
  alias?: string | null;
  role: L;
  /** Tono del avatar: 'neon' | 'sodium' | 'signal' */
  tone: 'neon' | 'sodium' | 'signal';
};

export const team: Member[] = [
  {
    name: 'Carlos',
    role: { es: 'Programación, dirección, arte y diseño', en: 'Programming, direction, art and design' },
    tone: 'neon',
  },
  {
    name: 'Alexandre',
    role: { es: 'Programación, narrativa e historia', en: 'Programming, narrative and story' },
    tone: 'signal',
  },
  {
    name: 'Ithalo',
    alias: 'Ander', // PROVISIONAL: confirmar que "Ander" es el apodo de Ithalo
    role: { es: 'Programación, sonido y música', en: 'Programming, sound and music' },
    tone: 'sodium',
  },
];

// ---------------------------------------------------------------------
// JUEGOS
// ---------------------------------------------------------------------
export type Game = {
  id: string;
  title: string;
  status: L;
  /** Frase corta bajo el título. */
  pitch: L;
  description: L;
  facts: { label: L; value: L }[];
  trailer: Trailer;
  shots: Shot[];
  links: { label: L; href: string | null; primary?: boolean }[];
};

export const ceniza: Game = {
  id: 'ceniza-neon',
  title: 'Ceniza Neón',
  status: { es: 'Alfa 0.2 disponible', en: 'Alpha 0.2 available' },
  pitch: {
    es: 'Construye la colonia de día. Defiéndela de noche.',
    en: 'Build the colony by day. Hold it by night.',
  },
  description: {
    es: 'Una ciudad industrial lleva diecisiete años pagando una deuda que no recuerda. Levanta una colonia entre chimeneas y agua negra, reparte oficios, resiste los asedios nocturnos y enfréntate a los jefes que cobran en baterías y en personas.',
    en: 'An industrial city has spent seventeen years paying a debt it cannot remember. Raise a colony among smokestacks and black water, assign trades, survive the night sieges and face the bosses who collect in batteries and in people.',
  },
  facts: [
    { label: { es: 'Género', en: 'Genre' }, value: { es: 'Colonia, asedio y supervivencia 2D', en: '2D colony, siege and survival' } },
    { label: { es: 'Motor', en: 'Engine' }, value: { es: 'Godot 4', en: 'Godot 4' } },
    { label: { es: 'Versión', en: 'Version' }, value: { es: '0.2.0 alfa', en: '0.2.0 alpha' } },
    { label: { es: 'Plataformas', en: 'Platforms' }, value: { es: 'Windows, Android y navegador', en: 'Windows, Android and browser' } },
  ],
  trailer: {
    youtube: null,
    mp4: '/media/ceniza/trailer-alfa.mp4',
    poster: '/media/ceniza/trailer-alfa-poster.webp',
  },
  shots: [
    { src: '/media/ceniza/colonia_vigente.webp', w: 1600, h: 900, alt: { es: 'La colonia de día, entre chimeneas, con el aviso de construir un generador', en: 'The colony by day among smokestacks, prompting you to build a generator' } },
    { src: '/media/ceniza/madre_arena.webp', w: 1600, h: 900, alt: { es: 'Combate contra Madre Cero en una arena circular', en: 'Boss fight against Madre Cero in a circular arena' } },
    { src: '/media/ceniza/foundry.webp', w: 1600, h: 900, alt: { es: 'La fundición en llamas bajo un cielo de humo', en: 'The foundry burning under a smoky sky' } },
    { src: '/media/ceniza/caldera_arena.webp', w: 1600, h: 900, alt: { es: 'Combate contra Santa Caldera sobre rejillas al rojo', en: 'Boss fight against Santa Caldera on glowing grates' } },
    { src: '/media/ceniza/novela_visual.webp', w: 1600, h: 900, alt: { es: 'Escena de diálogo con Mara a la llegada', en: 'Dialogue scene with Mara on arrival' } },
    { src: '/media/ceniza/network.webp', w: 1600, h: 900, alt: { es: 'La red, una catedral de cables y luz verde', en: 'The network, a cathedral of cables and green light' } },
    { src: '/media/ceniza/flooded.webp', w: 1600, h: 900, alt: { es: 'Muelles inundados al anochecer', en: 'Flooded docks at dusk' } },
  ],
  links: [
    { label: { es: 'Descargar la alfa', en: 'Download the alpha' }, href: 'https://github.com/chefsitturchey-web/Ceniza-ne-n/releases/tag/v0.2.0-alpha', primary: true },
    { label: { es: 'Web del juego', en: 'Game website' }, href: 'https://ceniza-neon.chefsitturchey.workers.dev/' },
    { label: { es: 'Jugar en itch.io', en: 'Play on itch.io' }, href: 'https://chefsitturchey.itch.io/ceniza-neon' },
  ],
};

export const vacas: Game = {
  id: 'vacas',
  title: 'Vacas',
  status: { es: 'En desarrollo', en: 'In development' },
  pitch: {
    es: 'Terror psicológico inspirado en una novela de culto.',
    en: 'Psychological horror inspired by a cult novel.',
  },
  description: {
    es: 'Steven trabaja en un matadero y vuelve cada noche a un piso donde manda su madre. Bajo la ciudad, en las alcantarillas, una vaca le habla por una rejilla. Un juego de exploración, sigilo y cordura que se rompe poco a poco.',
    en: 'Steven works at a slaughterhouse and comes home every night to a flat ruled by his mother. Beneath the city, in the sewers, a cow speaks to him through a vent. A game of exploration, stealth and slowly breaking sanity.',
  },
  facts: [
    { label: { es: 'Género', en: 'Genre' }, value: { es: 'Terror psicológico', en: 'Psychological horror' } },
    { label: { es: 'Motor', en: 'Engine' }, value: { es: 'RPG Maker XP', en: 'RPG Maker XP' } },
    { label: { es: 'Progreso', en: 'Progress' }, value: { es: 'Actos I y II construidos', en: 'Acts I and II built' } },
    { label: { es: 'Contenido', en: 'Content' }, value: { es: 'Violencia y temas adultos', en: 'Violence and mature themes' } },
  ],
  trailer: {
    youtube: null, // PROVISIONAL: añadir cuando exista
    mp4: null,
    poster: '/media/vacas/mapa3_la_escalera.webp',
  },
  shots: [
    { src: '/media/vacas/mapa4_la_calle.webp', w: 1280, h: 640, alt: { es: 'La calle frente al edificio de la madre', en: "The street outside the mother's building" } },
    { src: '/media/vacas/mapa2_el_piso.webp', w: 960, h: 704, alt: { es: 'El piso de la madre visto desde arriba', en: "The mother's flat seen from above" } },
    { src: '/media/vacas/acto2_mapa8.webp', w: 1280, h: 768, alt: { es: 'La línea de despiece del matadero', en: 'The slaughterhouse cutting line' } },
    { src: '/media/vacas/acto2_mapa7.webp', w: 960, h: 640, alt: { es: 'Los corrales del matadero', en: 'The slaughterhouse pens' } },
    { src: '/media/vacas/acto2_mapa11.webp', w: 960, h: 480, alt: { es: 'Las cámaras frías', en: 'The cold rooms' } },
  ],
  links: [],
};

/** Tercer juego. Rellena name/description/images cuando haya material:
    con `images` vacío se muestra la tarjeta "Próximamente". */
export const proyecto3 = {
  codename: 'Proyecto 3',
  /** PROVISIONAL: nombre real cuando exista (null = se usa el codename). */
  name: null as string | null,
  status: { es: 'Próximamente', en: 'Coming soon' },
  pitch: {
    es: 'Rol por turnos y terror en pixel art HD-2D.',
    en: 'Turn-based horror RPG in HD-2D pixel art.',
  },
  description: {
    es: 'Un RPG de terror por turnos con combate cinematográfico al estilo de los clásicos japoneses de los noventa, en pixel art con profundidad y luz al estilo HD-2D.',
    en: 'A turn-based horror RPG with cinematic combat in the style of nineties Japanese classics, in pixel art with HD-2D depth and lighting.',
  },
  tags: [
    { es: 'Rol por turnos', en: 'Turn-based RPG' },
    { es: 'Pixel art HD-2D', en: 'HD-2D pixel art' },
    { es: 'Terror', en: 'Horror' },
  ] as L[],
  images: [] as Shot[],
  trailer: { youtube: null, mp4: null, poster: '' } as Trailer,
};

// ---------------------------------------------------------------------
// DIARIO / NOTICIAS (lo más nuevo arriba)
// ---------------------------------------------------------------------
export type Post = { date: string | null; title: L; body: L; href?: string | null };

export const devlog: Post[] = [
  {
    date: '2026-11-06',
    title: { es: 'Ceniza Neón 0.2 alfa: Boss Rush y jefes más duros', en: 'Ceniza Neón 0.2 alpha: Boss Rush and tougher bosses' },
    body: {
      es: 'Boss Rush con ranking de tiempos, jefes con ataques cuerpo a cuerpo, novela visual al empezar y ganar cada jefe, fondos animados en los cinco distritos y un tutorial con flecha guía.',
      en: 'Boss Rush with a time ranking, bosses with melee attacks, visual novel scenes before and after each boss, animated backdrops in all five districts and a guided tutorial.',
    },
    href: 'https://github.com/chefsitturchey-web/Ceniza-ne-n/releases/tag/v0.2.0-alpha',
  },
  {
    date: '2026-11-01',
    title: { es: 'Ceniza Neón 0.1 alfa ya se puede jugar', en: 'Ceniza Neón 0.1 alpha is out' },
    body: {
      es: 'Primera versión pública para Windows, Android y navegador. Colonia, asedios nocturnos y los primeros jefes.',
      en: 'First public build for Windows, Android and the browser. Colony, night sieges and the first bosses.',
    },
    href: 'https://github.com/chefsitturchey-web/Ceniza-ne-n/releases/tag/v0.1.0-alpha',
  },
  {
    date: null,
    title: { es: 'Vacas: actos I y II construidos', en: 'Vacas: acts I and II built' },
    body: {
      es: 'El piso, la escalera, la calle y el matadero ya se recorren de principio a fin. Seguimos con el tercer acto.',
      en: 'The flat, the stairwell, the street and the slaughterhouse are playable end to end. Act III is next.',
    },
  },
  {
    date: null,
    title: { es: 'Proyecto 3 en preproducción', en: 'Project 3 in pre-production' },
    body: {
      es: 'Un RPG de terror por turnos. Pronto, las primeras imágenes.',
      en: 'A turn-based horror RPG. First images soon.',
    },
  },
];

// ---------------------------------------------------------------------
// PRENSA
// ---------------------------------------------------------------------
export const press = {
  facts: [
    { label: { es: 'Estudio', en: 'Studio' }, value: { es: 'Feka Studios', en: 'Feka Studios' } },
    { label: { es: 'Equipo', en: 'Team' }, value: { es: 'Tres personas', en: 'Three people' } },
    { label: { es: 'Juegos', en: 'Games' }, value: { es: 'Ceniza Neón (alfa), Vacas (en desarrollo), Proyecto 3', en: 'Ceniza Neón (alpha), Vacas (in development), Project 3' } },
    { label: { es: 'Idiomas', en: 'Languages' }, value: { es: 'Español', en: 'Spanish' } },
  ] as { label: L; value: L }[],
  downloads: [
    { label: { es: 'Kit completo (.zip)', en: 'Full kit (.zip)' }, note: { es: 'Logos y capturas', en: 'Logos and screenshots' }, href: '/press/feka-presskit.zip' },
    { label: { es: 'Logo horizontal', en: 'Horizontal logo' }, note: { es: 'SVG', en: 'SVG' }, href: '/press/feka-logo.svg' },
    { label: { es: 'Logo horizontal', en: 'Horizontal logo' }, note: { es: 'PNG 2400 px', en: 'PNG 2400 px' }, href: '/press/feka-logo-2400.png' },
    { label: { es: 'Logo blanco', en: 'White logo' }, note: { es: 'PNG transparente', en: 'Transparent PNG' }, href: '/press/feka-logo-transparente.png' },
    { label: { es: 'Logo negro', en: 'Black logo' }, note: { es: 'SVG', en: 'SVG' }, href: '/press/feka-logo-negro.svg' },
    { label: { es: 'Marca', en: 'Mark' }, note: { es: 'SVG', en: 'SVG' }, href: '/press/feka-marca.svg' },
    { label: { es: 'Marca', en: 'Mark' }, note: { es: 'PNG 1024 px', en: 'PNG 1024 px' }, href: '/press/feka-marca-1024.png' },
  ],
};

// ---------------------------------------------------------------------
// TEXTOS DE INTERFAZ
// ---------------------------------------------------------------------
export const ui = {
  nav: {
    games: { es: 'Juegos', en: 'Games' },
    devlog: { es: 'Diario', en: 'Devlog' },
    studio: { es: 'Estudio', en: 'Studio' },
    press: { es: 'Prensa', en: 'Press' },
    contact: { es: 'Contacto', en: 'Contact' },
    skip: { es: 'Saltar al contenido', en: 'Skip to content' },
  },
  hero: {
    cta: { es: 'Ver los juegos', en: 'See the games' },
    cta2: { es: 'Jugar Ceniza Neón', en: 'Play Ceniza Neón' },
  },
  trailer: {
    play: { es: 'Ver tráiler', en: 'Watch trailer' },
    pending: { es: 'Tráiler en producción', en: 'Trailer in production' },
  },
  sections: {
    featured: { es: 'Nuestro primer juego', en: 'Our first game' },
    shotsHint: { es: 'Capturas de la alfa 0.1', en: 'Screenshots from alpha 0.1' },
    devlog: { es: 'Diario de desarrollo', en: 'Devlog' },
    studio: { es: 'Tres programadores y una linterna', en: 'Three programmers and a flashlight' },
    team: { es: 'Equipo', en: 'Team' },
    press: { es: 'Kit de prensa', en: 'Press kit' },
    pressLead: {
      es: 'Datos, logos y capturas listos para usar. Si necesitas algo más, escríbenos.',
      en: 'Facts, logos and screenshots ready to use. If you need anything else, get in touch.',
    },
    downloads: { es: 'Descargas', en: 'Downloads' },
    contact: { es: 'Hablemos', en: 'Talk to us' },
    contactLead: {
      es: 'Prensa, creadores de contenido, festivales o jugadores con algo que contar.',
      en: 'Press, content creators, festivals or players with something to say.',
    },
    emailPending: { es: 'Correo en camino', en: 'Email coming soon' },
    newsletterLead: {
      es: 'Recibe un aviso cuando salga cada versión.',
      en: 'Get a heads-up when each build ships.',
    },
    newsletterLabel: { es: 'Tu correo', en: 'Your email' },
    newsletterBtn: { es: 'Avisarme', en: 'Notify me' },
    follow: { es: 'Síguenos', en: 'Follow us' },
    newsletterFallback: { es: 'El boletín está en preparación. Mientras tanto, cada versión se publica en GitHub.', en: 'The newsletter is on its way. Meanwhile, every build is published on GitHub.' },
    releases: { es: 'Ver versiones', en: 'See releases' },
    soon: { es: 'Pronto', en: 'Soon' },
    undated: { es: 'En curso', en: 'Ongoing' },
    readMore: { es: 'Ver más', en: 'Read more' },
  },
  footer: {
    rights: { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
    top: { es: 'Volver arriba', en: 'Back to top' },
  },
};
