/* =====================================================================
   FEKA STUDIOS · CONTENIDO EDITABLE
   ---------------------------------------------------------------------
   Todo el texto, enlaces, juegos, equipo y tráileres de la web viven aquí.
   Cada texto tiene versión { es, en }. Si no quieres traducir algo, copia
   el mismo texto en ambos campos.

   Busca "PROVISIONAL" para ver los valores pendientes de confirmar.

   Rutas de imágenes y vídeos: relativas a /public (por ejemplo
   "/media/ceniza/foundry.webp" = public/media/ceniza/foundry.webp).
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
  { label: { es: 'itch.io', en: 'itch.io' }, href: 'https://chefsitturchey.itch.io' },
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
    { label: { es: 'Versión', en: 'Version' }, value: { es: '0.2.1 alfa', en: '0.2.1 alpha' } },
    { label: { es: 'Plataformas', en: 'Platforms' }, value: { es: 'Windows, Android y navegador', en: 'Windows, Android and browser' } },
  ],
  trailer: {
    youtube: null,
    mp4: '/media/ceniza/trailer-alfa.mp4',
    poster: '/media/ceniza/trailer-alfa-poster.webp',
  },
  shots: [
    { src: '/media/ceniza/bossrush_inicio_02.webp', w: 1600, h: 900, alt: { es: 'Boss Rush contra el Recaudador: la pista avisa de su zona roja', en: 'Boss Rush against the Recaudador: a hint warns about its red zone' } },
    { src: '/media/ceniza/foundry.webp', w: 1600, h: 900, alt: { es: 'La fundición industrial entre hornos, tuberías y agua negra', en: 'The industrial foundry amid furnaces, pipes and black water' } },
    { src: '/media/ceniza/colonia_vigente.webp', w: 1600, h: 900, alt: { es: 'La colonia de día, entre chimeneas, con el aviso de construir un generador', en: 'The colony by day among smokestacks, prompting you to build a generator' } },
    { src: '/media/ceniza/distrito_02.webp', w: 1600, h: 900, alt: { es: 'Escena de novela visual: Mara y el Portador al empezar el capítulo I', en: 'Visual novel scene: Mara and the Portador at the start of chapter I' } },
    { src: '/media/ceniza/bossrush_combate_02.webp', w: 1600, h: 900, alt: { es: 'Boss Rush con cronómetro y pista para golpear al jefe por los lados', en: 'Boss Rush with a timer and a hint to hit the boss from the sides' } },
    { src: '/media/ceniza/caldera_arena.webp', w: 1600, h: 900, alt: { es: 'Combate contra Santa Caldera sobre rejillas al rojo', en: 'Boss fight against Santa Caldera on glowing grates' } },
    { src: '/media/ceniza/madre_arena.webp', w: 1600, h: 900, alt: { es: 'Combate contra Madre Cero en una arena circular', en: 'Boss fight against Madre Cero in a circular arena' } },
  ],
  links: [
    { label: { es: 'Descargar la alfa', en: 'Download the alpha' }, href: 'https://github.com/chefsitturchey-web/Ceniza-ne-n/releases/tag/v0.2.1-alpha', primary: true },
    { label: { es: 'Web del juego', en: 'Game website' }, href: '/ceniza/' },
    { label: { es: 'Jugar en itch.io', en: 'Play on itch.io' }, href: 'https://chefsitturchey.itch.io/ceniza-neon' },
  ],
};

export const vacas: Game = {
  id: 'vacas',
  title: 'Vacas',
  status: { es: 'Historia completa · 6 actos y 3 finales · en pruebas', en: 'Story complete · 6 acts and 3 endings · playtesting' },
  pitch: {
    es: 'Un RPG de terror psicológico. La carne recuerda.',
    en: 'A psychological horror RPG. The flesh remembers.',
  },
  description: {
    es: 'Steven trabaja en un matadero y vuelve cada noche a un piso donde manda su madre. Bajo la ciudad, en las alcantarillas, una vaca le habla por una rejilla. Un RPG de exploración, persecuciones y combates mentales por turnos, con una cordura que se rompe poco a poco.',
    en: 'Steven works at a slaughterhouse and comes home every night to a flat ruled by his mother. Beneath the city, in the sewers, a cow speaks to him through a vent. An RPG of exploration, chases and turn-based mental battles, with a sanity that slowly breaks.',
  },
  facts: [
    { label: { es: 'Género', en: 'Genre' }, value: { es: 'RPG de terror psicológico', en: 'Psychological horror RPG' } },
    { label: { es: 'Motor', en: 'Engine' }, value: { es: 'RPG Maker XP', en: 'RPG Maker XP' } },
    { label: { es: 'Progreso', en: 'Progress' }, value: { es: 'Actos I a V construidos, de seis', en: 'Acts I to V built, out of six' } },
    { label: { es: 'Duración', en: 'Length' }, value: { es: '8 a 12 horas, 3 finales', en: '8 to 12 hours, 3 endings' } },
    { label: { es: 'Contenido', en: 'Content' }, value: { es: 'Para adultos: violencia y gore', en: 'Adults only: violence and gore' } },
    { label: { es: 'Descarga', en: 'Download' }, value: { es: 'Próximamente', en: 'Coming soon' } },
  ],
  trailer: {
    youtube: null, // PROVISIONAL: añadir cuando exista
    mp4: null,
    poster: '/media/vacas/v_portada.webp',
  },
  shots: [
    { src: '/media/vacas/v_acto5_22.webp', w: 640, h: 480, alt: { es: 'Acto V: entrada al matadero de noche', en: 'Act V: entering the slaughterhouse at night' } },
    { src: '/media/vacas/v_acto5_26.webp', w: 640, h: 480, alt: { es: 'Acto V: dependencias del matadero', en: 'Act V: slaughterhouse rooms' } },
    { src: '/media/vacas/v_acto5_27.webp', w: 640, h: 480, alt: { es: 'Acto V: la manada en el patio', en: 'Act V: the herd in the yard' } },
    { src: '/media/vacas/v_dialogo.webp', w: 1280, h: 960, alt: { es: 'Diálogo con Steven', en: 'Dialogue with Steven' } },
  ],


  links: [{ label: { es: 'Página de Vacas', en: 'Vacas game page' }, href: '/vacas', primary: true }],
};

export type Post = { date: string | null; title: L; body: L; href?: string | null };
export type VacasImg = Shot & { id: string; pixel?: boolean; caption?: L; gore?: L };
export type VacasZone = {
  id: 'piso' | 'matadero' | 'alcantarillas'; name: L; title: L; body: L[];
  cast: { img: VacasImg; name: L; line: L }[];
  features: { title: L; body: L; img?: VacasImg }[]; gallery: VacasImg[];
};

export const proyecto3 = {
  "codename": "Proyecto 3",
  "name": null,
  "status": {
    "es": "Próximamente",
    "en": "Coming soon"
  },
  "pitch": {
    "es": "Rol por turnos y terror en pixel art HD-2D.",
    "en": "Turn-based horror RPG in HD-2D pixel art."
  },
  "description": {
    "es": "Un RPG de terror por turnos con combate cinematográfico al estilo de los clásicos japoneses de los noventa, en pixel art con profundidad y luz al estilo HD-2D.",
    "en": "A turn-based horror RPG with cinematic combat in the style of nineties Japanese classics, in pixel art with HD-2D depth and lighting."
  },
  "tags": [
    {
      "es": "Rol por turnos",
      "en": "Turn-based RPG"
    },
    {
      "es": "Pixel art HD-2D",
      "en": "HD-2D pixel art"
    },
    {
      "es": "Terror",
      "en": "Horror"
    }
  ],
  "images": [] as Shot[],
  "trailer": { youtube: null, mp4: null, poster: "" } as Trailer
};

export const devlog: Post[] = [
  { date: '2026-11-10', title: { es: 'Vacas: arte propio en los 32 mapas', en: 'Vacas: original art across all 32 maps' },
    body: { es: 'Revisamos cada imagen del juego: enemigos nuevos para los actos V y VI, sustos, la madre envejecida, 50 iconos y utilería HD-2D en todos los mapas, sin mover un solo tile.', en: 'We reviewed every image in the game: new enemies for acts V and VI, scares, the aged mother, 50 icons and HD-2D props on every map, without moving a single tile.' }, href: '/vacas/galeria' },
  { date: '2026-11-10', title: { es: 'Vacas: cinemáticas y repaso completo', en: 'Vacas: cinematics and full pass' },
    body: { es: 'Apertura cinemática, tarjetas entre actos y finales reforzados. Revisamos el recorrido completo, de la partida nueva a los créditos, y ajustamos la dificultad.', en: 'Opening cinematic, act title cards and stronger endings. We checked the full run, from new game to credits, and tuned the difficulty.' }, href: '/vacas/bitacora' },
  { date: '2026-11-10', title: { es: 'Vacas: Acto VI «Rey-dios» y los tres finales', en: 'Vacas: Act VI “God-king” and the three endings' },
    body: { es: 'La historia ya se puede jugar de principio a fin: túneles profundos, la ciudad tomada, el regreso a casa y tres finales que dependen de tus decisiones.', en: 'The story is now playable from start to finish: deep tunnels, the taken city, the return home and three endings shaped by your choices.' }, href: '/vacas/bitacora' },
  { date: '2026-11-10', title: { es: 'Ceniza Neón dentro de Feka Studios', en: 'Ceniza Neón joins Feka Studios’ website' },
    body: { es: 'Alfa de prueba para Windows, Android y navegador. La página del juego reúne las descargas y el Top Boss Rush en línea.', en: 'Test alpha for Windows, Android and browser. The game page brings together downloads and the online Top Boss Rush.' }, href: '/ceniza/descargar' },
  { date: '2026-11-10', title: { es: 'Vacas: Acto V «La matanza»', en: 'Vacas: Act V “The slaughter”' },
    body: { es: 'Acto V «La matanza»: infiltración en el matadero, minijuego La noria, jefe final del acto, 6 mapas nuevos', en: 'Act V “The slaughter”: slaughterhouse infiltration, La noria minigame, final boss of the act, 6 new maps' }, href: '/vacas/bitacora' },
  {
    "date": "2026-11-10",
    "title": {
      "es": "Vacas: intro de Feka Studios",
      "en": "Vacas: Feka Studios intro"
    },
    "body": {
      "es": "El juego ya arranca con la intro animada del estudio: el logo, una gota que cae y salpica, y «presenta».",
      "en": "The game now opens with the animated studio intro: the logo, a drop that falls and splashes, and \"presents\"."
    },
    "href": "/vacas"
  },
  {
    "date": "2026-11-10",
    "title": {
      "es": "Vacas: audio integrado",
      "en": "Vacas: audio is in"
    },
    "body": {
      "es": "Ciento veinte sonidos y pistas: ambiente propio en los 21 mapas, música de persecución y de jefes, pasos distintos según el suelo y pantalla de créditos.",
      "en": "A hundred and twenty sounds and tracks: its own ambience on all 21 maps, chase and boss music, footsteps that change with the floor, and a credits screen."
    }
  },
  {
    "date": "2026-11-09",
    "title": {
      "es": "Vacas: interfaz propia",
      "en": "Vacas: a custom interface"
    },
    "body": {
      "es": "Título y fin de partida animados, pausa, ajustes que se guardan, combate rediseñado, barras de cordura y veneno, y diálogos de novela visual.",
      "en": "Animated title and game over screens, pause, settings that persist, redesigned combat, sanity and poison bars, and visual novel dialogue."
    }
  },
  {
    "date": "2026-11-09",
    "title": {
      "es": "Vacas: Acto IV, «Bajo la ciudad»",
      "en": "Vacas: Act IV, \"Beneath the city\""
    },
    "body": {
      "es": "Cinco mapas de alcantarillas, linterna con batería, reputación con la manada, persecuciones, tres visiones y un jefe.",
      "en": "Five sewer maps, a battery-powered flashlight, reputation with the herd, chases, three visions and a boss."
    }
  },
  {
    "date": "2026-11-09",
    "title": {
      "es": "Vacas: revisión de mapas",
      "en": "Vacas: map review"
    },
    "body": {
      "es": "Los 16 primeros mapas, repasados uno a uno: escala de los objetos corregida, más detalle, luz y ambiente.",
      "en": "The first 16 maps, reviewed one by one: fixed object scale, more detail, light and atmosphere."
    }
  },
  {
    "date": "2026-11-09",
    "title": {
      "es": "Vacas: Acto III",
      "en": "Vacas: Act III"
    },
    "body": {
      "es": "La vecina de arriba y su teoría del veneno: cinco mapas, puzles de inventario, una persecución, tres visiones, un jefe y una elección que pesa.",
      "en": "The upstairs neighbour and her theory of poison: five maps, inventory puzzles, a chase, three visions, a boss and a choice that matters."
    }
  },
  {
    "date": "2026-11-09",
    "title": {
      "es": "Vacas: arte HD-2D",
      "en": "Vacas: HD-2D art"
    },
    "body": {
      "es": "Guía de estilo con gore real y arte nuevo para todo el juego: personajes, retratos, enemigos, sustos, fondos de combate y ventanas.",
      "en": "A style guide with real gore and new art across the game: characters, portraits, enemies, scares, battle backdrops and windows."
    }
  },
  {
    "date": "2026-11-06",
    "title": {
      "es": "Ceniza Neón 0.2 alfa: Boss Rush y jefes más duros",
      "en": "Ceniza Neón 0.2 alpha: Boss Rush and tougher bosses"
    },
    "body": {
      "es": "Boss Rush con ranking de tiempos, jefes con ataques cuerpo a cuerpo, novela visual al empezar y ganar cada jefe, fondos animados en los cinco distritos y un tutorial con flecha guía.",
      "en": "Boss Rush with a time ranking, bosses with melee attacks, visual novel scenes before and after each boss, animated backdrops in all five districts and a guided tutorial."
    },
    "href": "https://github.com/chefsitturchey-web/Ceniza-ne-n/releases/tag/v0.2.0-alpha"
  },
  {
    "date": "2026-11-02",
    "title": {
      "es": "Vacas: Acto II, «La cadena»",
      "en": "Vacas: Act II, \"The line\""
    },
    "body": {
      "es": "El matadero entero: corrales, línea de despiece y cámaras frías, con minijuegos de trabajo, sigilo y la primera voz detrás de la rejilla.",
      "en": "The whole slaughterhouse: pens, cutting line and cold rooms, with work minigames, stealth and the first voice behind the vent."
    }
  },
  {
    "date": "2026-11-01",
    "title": {
      "es": "Vacas: Acto I, «El piso»",
      "en": "Vacas: Act I, \"The flat\""
    },
    "body": {
      "es": "Empieza el proyecto. El piso, la escalera y la calle ya se recorren, con la barra de veneno y los eventos del primer acto.",
      "en": "The project begins. The flat, the stairwell and the street are playable, with the poison bar and the events of the first act."
    }
  },
  {
    "date": "2026-11-01",
    "title": {
      "es": "Ceniza Neón 0.1 alfa ya se puede jugar",
      "en": "Ceniza Neón 0.1 alpha is out"
    },
    "body": {
      "es": "Primera versión pública para Windows, Android y navegador. Colonia, asedios nocturnos y los primeros jefes.",
      "en": "First public build for Windows, Android and the browser. Colony, night sieges and the first bosses."
    },
    "href": "https://github.com/chefsitturchey-web/Ceniza-ne-n/releases/tag/v0.1.0-alpha"
  },
  {"date":"2026-10-29","title":{"es":"Ceniza Neón: Caminar es más que mover un sprite","en":"Ceniza Neón: Walking is more than moving a sprite"},"body":{"es":"Apoyo, dirección y ritmo: una revisión del Portador, el Prefecto y Madre Cero, con fuentes independientes para seguir trabajando.","en":"Support, direction and rhythm: a review of the Portador, El Prefecto and Madre Cero, with independent working sources."},"href":"/ceniza/bitacora#caminar-es-mas-que-mover-un-sprite"},
  {"date":"2026-10-29","title":{"es":"Ceniza Neón: Una ciudad que respira","en":"Ceniza Neón: A city that breathes"},"body":{"es":"Cinco distritos, varias capas de profundidad y pequeños movimientos que cuentan dónde estás. Así estamos dando vida a los escenarios.","en":"Five districts, several depth layers and small movements that tell you where you are. This is how the environments come alive."},"href":"/ceniza/bitacora#una-ciudad-que-respira"},
  {"date":"2026-10-29","title":{"es":"Ceniza Neón: Lo que ya existe. Lo que falta.","en":"Ceniza Neón: What exists. What is missing."},"body":{"es":"Abrimos el archivo de desarrollo con una promesa sencilla: mostrar el trabajo real y distinguirlo de lo que queremos construir.","en":"We opened the development archive to show real work and distinguish it from what we hope to build."},"href":"/ceniza/bitacora#lo-que-ya-existe-y-lo-que-falta"},
  {"date":"2026-10-29","title":{"es":"Ceniza Neón: Cinco jefes, cinco lenguajes","en":"Ceniza Neón: Five bosses, five languages"},"body":{"es":"Coberturas, calor, antenas, duelo y relés. La dificultad necesita reglas que puedas aprender, no solamente más vida.","en":"Cover, heat, antennas, duelling and relays. Difficulty needs learnable rules, not simply more health."},"href":"/ceniza/bitacora#cinco-jefes-cinco-lenguajes"},
  {"date":"2026-10-29","title":{"es":"Ceniza Neón: El diseño aprobado llega al combate","en":"Ceniza Neón: Approved designs reach combat"},"body":{"es":"El 29 de octubre se renovaron el Portador y los jefes con poses ilustradas y animaciones montadas en LibreSprite.","en":"On 29 October, the Portador and bosses received illustrated poses and LibreSprite animations."},"href":"/ceniza/bitacora#el-diseno-aprobado-llega-al-combate"},
  {"date":"2026-10-28","title":{"es":"Ceniza Neón: La historia encuentra sus rostros","en":"Ceniza Neón: The story finds its faces"},"body":{"es":"Los retratos manga y las conversaciones de novela visual se integraron el 28 de octubre, junto con una revisión de coherencia de las estructuras.","en":"Manga portraits and visual novel conversations were integrated on 28 October, alongside a structure consistency review."},"href":"/ceniza/bitacora#la-historia-encuentra-sus-rostros"},
  {"date":"2026-10-28","title":{"es":"Ceniza Neón: Cinco capítulos, una ruta","en":"Ceniza Neón: Five chapters, one route"},"body":{"es":"El 28 de octubre se conectaron los cinco capítulos, sus operaciones narrativas y los encuentros finales de la Ciudadela y la Red.","en":"On 28 October the five chapters, narrative operations and final Citadel and Network encounters were connected."},"href":"/ceniza/bitacora#cinco-capitulos-una-ruta"},
  {"date":"2026-10-12","title":{"es":"Ceniza Neón: El ferrocarril llega a la arena","en":"Ceniza Neón: The railway reaches the arena"},"body":{"es":"El 12 de octubre se integró la arena cenital del Recaudador. La dirección de la colonia y el combate personal empezaban a encontrar espacios distintos.","en":"On 12 October the top-down Recaudador arena was integrated, separating colony command from personal combat."},"href":"/ceniza/bitacora#el-ferrocarril-llega-a-la-arena"},
  {"date":"2026-09-23","title":{"es":"Ceniza Neón: El Errante empieza a moverse","en":"Ceniza Neón: The Errante starts moving"},"body":{"es":"El 23 de septiembre llegaron los sprites y cinco animaciones del Errante. Un primer paso para que el enemigo tuviera presencia propia.","en":"On 23 September, sprites and five Errante animations gave the enemy its own presence."},"href":"/ceniza/bitacora#el-errante-empieza-a-moverse"},
  {"date":"2026-09-22","title":{"es":"Ceniza Neón: El primer paso","en":"Ceniza Neón: The first step"},"body":{"es":"El 22 de septiembre empezó el prototipo: movimiento, combate de práctica y las primeras reglas de una colonia que debía resistir.","en":"The prototype began on 22 September with movement, practice combat and the first rules of a colony that had to survive."},"href":"/ceniza/bitacora#el-primer-paso"},
  {
    "date": null,
    "title": {
      "es": "Proyecto 3 en preproducción",
      "en": "Project 3 in pre-production"
    },
    "body": {
      "es": "Un RPG de terror por turnos. Pronto, las primeras imágenes.",
      "en": "A turn-based horror RPG. First images soon."
    }
  }
];

export const press = {
  "facts": [
    {
      "label": {
        "es": "Estudio",
        "en": "Studio"
      },
      "value": {
        "es": "Feka Studios",
        "en": "Feka Studios"
      }
    },
    {
      "label": {
        "es": "Equipo",
        "en": "Team"
      },
      "value": {
        "es": "Tres personas",
        "en": "Three people"
      }
    },
    {
      "label": {
        "es": "Juegos",
        "en": "Games"
      },
      "value": {
        "es": "Ceniza Neón (alfa), Vacas (en desarrollo), Proyecto 3",
        "en": "Ceniza Neón (alpha), Vacas (in development), Project 3"
      }
    },
    {
      "label": {
        "es": "Idiomas",
        "en": "Languages"
      },
      "value": {
        "es": "Español",
        "en": "Spanish"
      }
    }
  ],
  "downloads": [
    {
      "label": {
        "es": "Kit completo (.zip)",
        "en": "Full kit (.zip)"
      },
      "note": {
        "es": "Logos y capturas",
        "en": "Logos and screenshots"
      },
      "href": "/press/feka-presskit.zip"
    },
    {
      "label": {
        "es": "Logo horizontal",
        "en": "Horizontal logo"
      },
      "note": {
        "es": "SVG",
        "en": "SVG"
      },
      "href": "/press/feka-logo.svg"
    },
    {
      "label": {
        "es": "Logo horizontal",
        "en": "Horizontal logo"
      },
      "note": {
        "es": "PNG 2400 px",
        "en": "PNG 2400 px"
      },
      "href": "/press/feka-logo-2400.png"
    },
    {
      "label": {
        "es": "Logo blanco",
        "en": "White logo"
      },
      "note": {
        "es": "PNG transparente",
        "en": "Transparent PNG"
      },
      "href": "/press/feka-logo-transparente.png"
    },
    {
      "label": {
        "es": "Logo negro",
        "en": "Black logo"
      },
      "note": {
        "es": "SVG",
        "en": "SVG"
      },
      "href": "/press/feka-logo-negro.svg"
    },
    {
      "label": {
        "es": "Marca",
        "en": "Mark"
      },
      "note": {
        "es": "SVG",
        "en": "SVG"
      },
      "href": "/press/feka-marca.svg"
    },
    {
      "label": {
        "es": "Marca",
        "en": "Mark"
      },
      "note": {
        "es": "PNG 1024 px",
        "en": "PNG 1024 px"
      },
      "href": "/press/feka-marca-1024.png"
    }
  ]
};

export const ui = {
  "nav": {
    "games": {
      "es": "Juegos",
      "en": "Games"
    },
    "devlog": {
      "es": "Bitácora",
      "en": "Devlog"
    },
    "studio": {
      "es": "Estudio",
      "en": "Studio"
    },
    "press": {
      "es": "Prensa",
      "en": "Press"
    },
    "contact": {
      "es": "Contacto",
      "en": "Contact"
    },
    "skip": {
      "es": "Saltar al contenido",
      "en": "Skip to content"
    }
  },
  "hero": {
    "cta": {
      "es": "Ver los juegos",
      "en": "See the games"
    },
    "cta2": {
      "es": "Jugar Ceniza Neón",
      "en": "Play Ceniza Neón"
    }
  },
  "trailer": {
    "play": {
      "es": "Ver tráiler",
      "en": "Watch trailer"
    },
    "pending": {
      "es": "Tráiler en producción",
      "en": "Trailer in production"
    }
  },
  "sections": {
    "featured": {
      "es": "Nuestro primer juego",
      "en": "Our first game"
    },
    "shotsHint": {
      "es": "Capturas de la alfa 0.2",
      "en": "Screenshots from alpha 0.2"
    },
    "devlog": {
      "es": "Bitácora",
      "en": "Devlog"
    },
    "studio": {
      "es": "Tres programadores y una linterna",
      "en": "Three programmers and a flashlight"
    },
    "team": {
      "es": "Equipo",
      "en": "Team"
    },
    "press": {
      "es": "Kit de prensa",
      "en": "Press kit"
    },
    "pressLead": {
      "es": "Datos, logos y capturas listos para usar. Si necesitas algo más, escríbenos.",
      "en": "Facts, logos and screenshots ready to use. If you need anything else, get in touch."
    },
    "downloads": {
      "es": "Descargas",
      "en": "Downloads"
    },
    "contact": {
      "es": "Hablemos",
      "en": "Talk to us"
    },
    "contactLead": {
      "es": "Prensa, creadores de contenido, festivales o jugadores con algo que contar.",
      "en": "Press, content creators, festivals or players with something to say."
    },
    "emailPending": {
      "es": "Correo en camino",
      "en": "Email coming soon"
    },
    "newsletterLead": {
      "es": "Recibe un aviso cuando salga cada versión.",
      "en": "Get a heads-up when each build ships."
    },
    "newsletterLabel": {
      "es": "Tu correo",
      "en": "Your email"
    },
    "newsletterBtn": {
      "es": "Avisarme",
      "en": "Notify me"
    },
    "follow": {
      "es": "Síguenos",
      "en": "Follow us"
    },
    "newsletterFallback": {
      "es": "El boletín está en preparación. Mientras tanto, cada versión se publica en GitHub.",
      "en": "The newsletter is on its way. Meanwhile, every build is published on GitHub."
    },
    "releases": {
      "es": "Ver versiones",
      "en": "See releases"
    },
    "soon": {
      "es": "Pronto",
      "en": "Soon"
    },
    "undated": {
      "es": "En curso",
      "en": "Ongoing"
    },
    "readMore": {
      "es": "Ver más",
      "en": "Read more"
    }
  },
  "footer": {
    "rights": {
      "es": "Todos los derechos reservados.",
      "en": "All rights reserved."
    },
    "top": {
      "es": "Volver arriba",
      "en": "Back to top"
    }
  }
};

export const vacasPage: {
  meta: {title:L}; gate:{badge:L;title:L;body:L;accept:L;leave:L}; cover:{show:L;hide:L};
  bar:{back:L;sanity:L}; hero:{tagline:L;pitch:L;lead:L;stamp:L;download:L;progress:L;img:VacasImg};
  tag:{title:L;rows:{label:L;value:L}[]}; labels:{cast:L;gallery:L;visions:L;visionsLead:L};
  zones:VacasZone[]; visions:VacasImg[];
  status:{title:L;lead:L;states:Record<'done'|'now'|'todo',L>;acts:{n:string;name:L;state:'done'|'now'|'todo'}[];
    notes:{title:L;body:L}[];titleImg:VacasImg;soonTitle:L;soonBody:L;devlog:L;home:L};footer:{note:L};
} = {
  "meta": {
    "title": {
      "es": "Vacas · Feka Studios",
      "en": "Vacas · Feka Studios"
    }
  },
  "gate": {
    "badge": {
      "es": "+18",
      "en": "18+"
    },
    "title": {
      "es": "Contenido para adultos",
      "en": "Adult content"
    },
    "body": {
      "es": "Vacas es un juego de terror para mayores de 18 años. Esta página muestra violencia, sangre y gore. Las imágenes más explícitas están tapadas y solo se ven si tú lo pides.",
      "en": "Vacas is a horror game for people aged 18 and over. This page shows violence, blood and gore. The most explicit images are covered and only shown if you ask."
    },
    "accept": {
      "es": "Tengo 18 años o más: continuar",
      "en": "I am 18 or older: continue"
    },
    "leave": {
      "es": "Volver a Feka Studios",
      "en": "Back to Feka Studios"
    }
  },
  "cover": {
    "show": {
      "es": "Ver de todos modos",
      "en": "Show anyway"
    },
    "hide": {
      "es": "Volver a tapar",
      "en": "Cover again"
    }
  },
  "bar": {
    "back": {
      "es": "Feka Studios",
      "en": "Feka Studios"
    },
    "sanity": {
      "es": "Cordura",
      "en": "Sanity"
    }
  },
  "hero": {
    "tagline": {
      "es": "La carne recuerda.",
      "en": "The flesh remembers."
    },
    "pitch": {
      "es": "Un RPG de terror psicológico. La carne recuerda.",
      "en": "A psychological horror RPG. The flesh remembers."
    },
    "lead": {
      "es": "Steven tiene veinticinco años y vive en un piso que huele a tabaco viejo, bajo el mando de su madre. Consigue trabajo en el matadero. Allí, detrás de una rejilla, algo con los ojos castaños empieza a hablarle.",
      "en": "Steven is twenty-five and lives in a flat that smells of stale tobacco, under his mother’s rule. He gets a job at the slaughterhouse. There, behind a vent, something with brown eyes starts talking to him."
    },
    "stamp": {
      "es": "Historia completa · 6 actos y 3 finales · en pruebas",
      "en": "Story complete · 6 acts and 3 endings · playtesting"
    },
    "download": {
      "es": "Descarga: próximamente",
      "en": "Download: coming soon"
    },
    "progress": {
      "es": "Ver cómo va el juego",
      "en": "See how the game is going"
    },
    "img": {
      "id": "rejilla",
      "src": "/media/vacas/v_rejilla.webp",
      "w": 1280,
      "h": 960,
      "alt": {
        "es": "El ojo castaño de una vaca que mira entre los barrotes oxidados de una rejilla",
        "en": "The brown eye of a cow looking through the rusted bars of a vent"
      }
    }
  },
  "tag": {
    "title": {
      "es": "Ficha",
      "en": "Fact sheet"
    },
    "rows": [
      {
        "label": {
          "es": "Género",
          "en": "Genre"
        },
        "value": {
          "es": "RPG de terror psicológico",
          "en": "Psychological horror RPG"
        }
      },
      {
        "label": {
          "es": "Motor",
          "en": "Engine"
        },
        "value": {
          "es": "RPG Maker XP",
          "en": "RPG Maker XP"
        }
      },
      {
        "label": {
          "es": "Arte",
          "en": "Art"
        },
        "value": {
          "es": "Pixel art HD-2D con gore real",
          "en": "HD-2D pixel art with real gore"
        }
      },
      {
        "label": {
          "es": "Estructura",
          "en": "Structure"
        },
        "value": {
          "es": "6 actos",
          "en": "6 acts"
        }
      },
      {
        "label": {
          "es": "Duración",
          "en": "Length"
        },
        "value": {
          "es": "8 a 12 horas",
          "en": "8 to 12 hours"
        }
      },
      {
        "label": {
          "es": "Finales",
          "en": "Endings"
        },
        "value": {
          "es": "3",
          "en": "3"
        }
      },
      {
        "label": {
          "es": "Estudio",
          "en": "Studio"
        },
        "value": {
          "es": "Feka Studios",
          "en": "Feka Studios"
        }
      },
      {
        "label": {
          "es": "Descarga",
          "en": "Download"
        },
        "value": {
          "es": "Próximamente",
          "en": "Coming soon"
        }
      }
    ]
  },
  "labels": {
    "cast": {
      "es": "Quién vive aquí",
      "en": "Who lives here"
    },
    "gallery": {
      "es": "El lugar",
      "en": "The place"
    },
    "visions": {
      "es": "Las visiones",
      "en": "The visions"
    },
    "visionsLead": {
      "es": "Lo que Steven no puede digerir toma forma y hay que plantarle cara. Estas son algunas.",
      "en": "What Steven cannot stomach takes shape and has to be faced. These are a few of them."
    }
  },
  "zones": [
    {
      "id": "piso",
      "name": {
        "es": "El piso",
        "en": "The flat"
      },
      "title": {
        "es": "Un piso amarillo de nicotina",
        "en": "A flat yellowed by nicotine"
      },
      "body": [
        {
          "es": "Papel pintado que se despega, una tele de los años cincuenta y una madre que lo oye todo. Aquí el juego es rutina: cumplir las tareas, esconderse a tiempo y no hacer ruido.",
          "en": "Peeling wallpaper, a television from the fifties and a mother who hears everything. Here the game is routine: do the chores, hide in time and keep quiet."
        },
        {
          "es": "La tele es el único sitio donde la cabeza descansa. También es donde se guarda la partida.",
          "en": "The television is the only place where your head gets to rest. It is also where you save the game."
        }
      ],
      "cast": [
        {
          "img": {
            "id": "ret-steven",
            "src": "/media/vacas/v_ret_steven.webp",
            "w": 480,
            "h": 680,
            "alt": {
              "es": "Retrato de Steven: joven delgado, ojeroso, con camisa gastada",
              "en": "Portrait of Steven: a thin young man with sunken eyes and a worn shirt"
            }
          },
          "name": {
            "es": "Steven",
            "en": "Steven"
          },
          "line": {
            "es": "Veinticinco años y ninguna puerta propia.",
            "en": "Twenty-five years old and not one door of his own."
          }
        },
        {
          "img": {
            "id": "ret-madre",
            "src": "/media/vacas/v_ret_madre.webp",
            "w": 480,
            "h": 680,
            "alt": {
              "es": "Retrato de la madre: mujer ancha con bata mostaza y gesto de ira",
              "en": "Portrait of the mother: a broad woman in a mustard robe, scowling"
            }
          },
          "name": {
            "es": "La madre",
            "en": "The mother"
          },
          "line": {
            "es": "En casa manda ella. Fuera de casa, también.",
            "en": "She rules the house. Outside the house, too."
          }
        },
        {
          "img": {
            "id": "ret-perro",
            "src": "/media/vacas/v_ret_perro.webp",
            "w": 480,
            "h": 680,
            "alt": {
              "es": "Retrato de Perro: un mestizo tumbado de ojos cálidos",
              "en": "Portrait of Dog: a mongrel lying down, with warm eyes"
            }
          },
          "name": {
            "es": "Perro",
            "en": "Dog"
          },
          "line": {
            "es": "No puede caminar. Es lo único que Steven quiere.",
            "en": "He cannot walk. He is the only thing Steven loves."
          }
        }
      ],
      "features": [
        {
          "title": {
            "es": "Diálogos de novela visual",
            "en": "Visual novel dialogue"
          },
          "body": {
            "es": "Las conversaciones se juegan a pantalla completa, con retratos que cambian de expresión. Lo que contestas se recuerda.",
            "en": "Conversations play out full screen, with portraits that change expression. What you answer is remembered."
          },
          "img": {
            "id": "dialogo",
            "src": "/media/vacas/v_dialogo.webp",
            "w": 1280,
            "h": 960,
            "alt": {
              "es": "Pantalla de diálogo: retrato de Steven y el texto «La luz sigue encendida»",
              "en": "Dialogue screen: Steven’s portrait and the line \"La luz sigue encendida\""
            }
          }
        },
        {
          "title": {
            "es": "Sustos que no avisan",
            "en": "Scares without warning"
          },
          "body": {
            "es": "No todos llevan sangre. A veces basta con un ojo al otro lado del cristal.",
            "en": "Not all of them carry blood. Sometimes an eye on the other side of the glass is enough."
          },
          "img": {
            "id": "susto-cristal",
            "src": "/media/vacas/v_susto_cristal.webp",
            "w": 1280,
            "h": 960,
            "alt": {
              "es": "Primer plano de un ojo que mira con rabia a través de un cristal agrietado",
              "en": "Close-up of an eye glaring through cracked glass"
            }
          }
        }
      ],
      "gallery": [
        {
          "id": "mapa-piso",
          "src": "/media/vacas/mapa2_el_piso.webp",
          "w": 960,
          "h": 704,
          "pixel": true,
          "alt": {
            "es": "Mapa del piso visto desde arriba: habitaciones, pasillo y cocina",
            "en": "Map of the flat from above: bedrooms, hallway and kitchen"
          },
          "caption": {
            "es": "El piso",
            "en": "The flat"
          }
        },
        {
          "id": "mapa-escalera",
          "src": "/media/vacas/mapa3_la_escalera.webp",
          "w": 640,
          "h": 480,
          "pixel": true,
          "alt": {
            "es": "Mapa del rellano de la escalera, con puertas de vecinos",
            "en": "Map of the stairwell landing, with the neighbours’ doors"
          },
          "caption": {
            "es": "La escalera",
            "en": "The stairwell"
          }
        },
        {
          "id": "mapa-calle",
          "src": "/media/vacas/mapa4_la_calle.webp",
          "w": 1280,
          "h": 640,
          "pixel": true,
          "alt": {
            "es": "Mapa de la calle frente al edificio, con farolas",
            "en": "Map of the street outside the building, with street lamps"
          },
          "caption": {
            "es": "La calle",
            "en": "The street"
          }
        }
      ]
    },
    {
      "id": "matadero",
      "name": {
        "es": "El matadero",
        "en": "The slaughterhouse"
      },
      "title": {
        "es": "Azulejo blanco y una cadena que no para",
        "en": "White tile and a line that never stops"
      },
      "body": [
        {
          "es": "Steven ficha, se pone el mono y aprende el oficio. El capataz quiere verlo matar. Los compañeros miran hacia otro lado.",
          "en": "Steven clocks in, puts on the overalls and learns the trade. The foreman wants to see him kill. His workmates look the other way."
        },
        {
          "es": "Por una rejilla de ventilación, una vaca le habla en voz baja. Y en el piso de arriba, una vecina busca algo dentro de los cuerpos.",
          "en": "Through a ventilation grille, a cow speaks to him in a low voice. And in the flat upstairs, a neighbour is looking for something inside bodies."
        }
      ],
      "cast": [
        {
          "img": {
            "id": "ret-capataz",
            "src": "/media/vacas/v_ret_capataz.webp",
            "w": 480,
            "h": 680,
            "alt": {
              "es": "Retrato del capataz: hombre corpulento y rapado con delantal manchado",
              "en": "Portrait of the foreman: a heavy, shaven-headed man in a stained apron"
            }
          },
          "name": {
            "es": "El capataz",
            "en": "The foreman"
          },
          "line": {
            "es": "Ocupa el pasillo entero. Quiere que aprendas.",
            "en": "He fills the whole corridor. He wants you to learn."
          }
        },
        {
          "img": {
            "id": "ret-vecina",
            "src": "/media/vacas/v_ret_vecina.webp",
            "w": 480,
            "h": 680,
            "alt": {
              "es": "Retrato de la vecina: mujer de pelo claro con un tarro vacío en las manos",
              "en": "Portrait of the neighbour: a fair-haired woman holding an empty jar"
            }
          },
          "name": {
            "es": "La vecina de arriba",
            "en": "The upstairs neighbour"
          },
          "line": {
            "es": "Cree que el sufrimiento se queda dentro, como un veneno. Y que se puede encontrar.",
            "en": "She believes suffering stays inside, like a poison. And that it can be found."
          }
        }
      ],
      "features": [
        {
          "title": {
            "es": "Minijuegos del matadero",
            "en": "Slaughterhouse minigames"
          },
          "body": {
            "es": "Cada turno es un trabajo corto de ritmo y precisión. Pagan dinero y abren zonas nuevas. Hacerlo bien también tiene un precio.",
            "en": "Every shift is a short job of rhythm and precision. They pay money and open new areas. Doing it well has a price too."
          }
        },
        {
          "title": {
            "es": "Barra de cordura",
            "en": "Sanity bar"
          },
          "body": {
            "es": "Lo que Steven ve y hace se acumula como un veneno. Cuanto más sube, más se tuercen las paredes, el sonido y lo que dice la gente.",
            "en": "What Steven sees and does builds up like a poison. The higher it gets, the more the walls, the sound and what people say begin to warp."
          },
          "img": {
            "id": "estado",
            "src": "/media/vacas/v_estado.webp",
            "w": 1280,
            "h": 960,
            "alt": {
              "es": "Pantalla de estado con salud, aliento, cordura y veneno",
              "en": "Status screen with health, breath, sanity and poison"
            }
          }
        },
        {
          "title": {
            "es": "Combates mentales por turnos",
            "en": "Turn-based mental battles"
          },
          "body": {
            "es": "Las visiones se pelean de frente y por turnos. No se gana con fuerza: se aguanta, se respira y se resiste.",
            "en": "Visions are fought head-on, in turns. Strength does not win them: you hold on, you breathe and you endure."
          },
          "img": {
            "id": "combate-salon",
            "src": "/media/vacas/v_combate_salon.webp",
            "w": 1280,
            "h": 960,
            "alt": {
              "es": "Combate en el salón contra un televisor con una familia que grita en la pantalla",
              "en": "Battle in the living room against a television with a screaming family on screen"
            }
          }
        }
      ],
      "gallery": [
        {
          "id": "mapa-corrales",
          "src": "/media/vacas/acto2_mapa7.webp",
          "w": 960,
          "h": 640,
          "pixel": true,
          "alt": {
            "es": "Mapa de los corrales del matadero",
            "en": "Map of the slaughterhouse pens"
          },
          "caption": {
            "es": "Los corrales",
            "en": "The pens"
          }
        },
        {
          "id": "mapa-cadena",
          "src": "/media/vacas/m_cadena.webp",
          "w": 1280,
          "h": 768,
          "pixel": true,
          "alt": {
            "es": "Mapa de la línea de despiece, con dos canales de sangre a lo largo de la nave",
            "en": "Map of the cutting line, with two blood gutters running the length of the hall"
          },
          "caption": {
            "es": "La cadena",
            "en": "The line"
          }
        },
        {
          "id": "mapa-camaras",
          "src": "/media/vacas/acto2_mapa9.webp",
          "w": 960,
          "h": 640,
          "pixel": true,
          "alt": {
            "es": "Mapa de las cámaras frías",
            "en": "Map of the cold rooms"
          },
          "caption": {
            "es": "Las cámaras frías",
            "en": "The cold rooms"
          }
        },
        {
          "id": "mapa-laboratorio",
          "src": "/media/vacas/m_laboratorio.webp",
          "w": 640,
          "h": 480,
          "pixel": true,
          "alt": {
            "es": "Mapa de un laboratorio improvisado con camillas y estanterías",
            "en": "Map of a makeshift laboratory with stretchers and shelves"
          },
          "caption": {
            "es": "El laboratorio",
            "en": "The laboratory"
          }
        },
        {
          "id": "combate-matadero",
          "src": "/media/vacas/g_combate_matadero.webp",
          "w": 1280,
          "h": 960,
          "alt": {
            "es": "Combate contra un enjambre de moscas en una nave del matadero cubierta de sangre",
            "en": "Battle against a swarm of flies in a blood-covered slaughterhouse hall"
          },
          "caption": {
            "es": "Combate en la nave",
            "en": "Battle in the hall"
          },
          "gore": {
            "es": "Matadero ensangrentado: sangre por el suelo y las mesas",
            "en": "Bloody slaughterhouse: blood across the floor and tables"
          }
        },
        {
          "id": "combate-tarro",
          "src": "/media/vacas/g_combate_tarro.webp",
          "w": 1280,
          "h": 960,
          "alt": {
            "es": "Combate contra un tarro gigante lleno de vísceras",
            "en": "Battle against a giant jar full of entrails"
          },
          "caption": {
            "es": "Combate contra un jefe",
            "en": "Boss battle"
          },
          "gore": {
            "es": "Gore explícito: vísceras y sangre",
            "en": "Explicit gore: entrails and blood"
          }
        }
      ]
    },
    {
      "id": "alcantarillas",
      "name": {
        "es": "Las alcantarillas",
        "en": "The sewers"
      },
      "title": {
        "es": "Bajo la ciudad hay una manada",
        "en": "Beneath the city there is a herd"
      },
      "body": [
        {
          "es": "Aquí se avanza a oscuras, con una linterna que gasta batería y un agua que no deja ver el fondo. La manada lleva mucho tiempo abajo y no olvida cómo la tratas.",
          "en": "Down here you move in the dark, with a flashlight that eats its battery and water that hides the bottom. The herd has been below for a long time and does not forget how you treat it."
        },
        {
          "es": "Hay persecuciones, escondites y un pacto que cambia lo que queda de juego.",
          "en": "There are chases, hiding places and a pact that changes the rest of the game."
        }
      ],
      "cast": [
        {
          "img": {
            "id": "ret-vaca",
            "src": "/media/vacas/v_ret_vaca.webp",
            "w": 480,
            "h": 680,
            "alt": {
              "es": "Retrato de una vaca canela que mira entre barrotes",
              "en": "Portrait of a tan cow looking through bars"
            }
          },
          "name": {
            "es": "La vaca de la rejilla",
            "en": "The cow behind the vent"
          },
          "line": {
            "es": "Habla bajo. Sabe cómo te llamas.",
            "en": "She speaks softly. She knows your name."
          }
        }
      ],
      "features": [
        {
          "title": {
            "es": "Linterna con batería",
            "en": "Battery-powered flashlight"
          },
          "body": {
            "es": "La luz dura lo que dura. Apagarla ahorra batería y sube el miedo.",
            "en": "The light lasts as long as it lasts. Switching it off saves battery and raises the fear."
          },
          "img": {
            "id": "linterna",
            "src": "/media/vacas/v_linterna.webp",
            "w": 1280,
            "h": 960,
            "alt": {
              "es": "Túnel casi a oscuras, iluminado solo por el círculo de la linterna, con las barras de cordura y batería",
              "en": "A tunnel in near darkness, lit only by the flashlight’s circle, with sanity and battery bars"
            }
          }
        },
        {
          "title": {
            "es": "Persecuciones",
            "en": "Chases"
          },
          "body": {
            "es": "La madre, el capataz, la manada con hambre. Si te ven, corre y busca dónde meterte.",
            "en": "The mother, the foreman, the hungry herd. If they see you, run and find somewhere to hide."
          }
        },
        {
          "title": {
            "es": "Tres finales",
            "en": "Three endings"
          },
          "body": {
            "es": "Lo que decides queda apuntado y cambia aliados, diálogos y desenlace. Ninguno de los tres sale gratis.",
            "en": "What you decide is written down and changes allies, dialogue and outcome. None of the three comes free."
          }
        }
      ],
      "gallery": [
        {
          "id": "mapa-alcantarilla",
          "src": "/media/vacas/m_alcantarilla.webp",
          "w": 704,
          "h": 480,
          "pixel": true,
          "alt": {
            "es": "Mapa de un tramo de alcantarilla de ladrillo verde, con agua negra alrededor",
            "en": "Map of a stretch of green-brick sewer surrounded by black water"
          },
          "caption": {
            "es": "Los túneles",
            "en": "The tunnels"
          }
        },
        {
          "id": "combate-tunel",
          "src": "/media/vacas/v_combate_tunel.webp",
          "w": 1280,
          "h": 960,
          "alt": {
            "es": "Combate en un túnel contra una figura encapuchada con el cuerpo de jaula",
            "en": "Battle in a tunnel against a hooded figure with a cage for a body"
          },
          "caption": {
            "es": "Combate contra un jefe",
            "en": "Boss battle"
          }
        },
        {
          "id": "susto-vaca",
          "src": "/media/vacas/g_susto_vaca.webp",
          "w": 1280,
          "h": 960,
          "alt": {
            "es": "Susto: una cabeza de vaca desollada y cubierta de sangre pegada a un cristal",
            "en": "Scare: a flayed, blood-covered cow head pressed against glass"
          },
          "caption": {
            "es": "Un susto",
            "en": "A scare"
          },
          "gore": {
            "es": "Susto con gore explícito: cabeza de vaca desollada y sangre",
            "en": "Scare with explicit gore: flayed cow head and blood"
          }
        }
      ]
    }
  ],
  "visions": [
    {
      "id": "vision-cencerro",
      "src": "/media/vacas/v_vision_cencerro.webp",
      "w": 640,
      "h": 600,
      "alt": {
        "es": "Un cencerro agrietado con costillas dentro",
        "en": "A cracked cowbell with ribs inside"
      },
      "caption": {
        "es": "El cencerro",
        "en": "The cowbell"
      }
    },
    {
      "id": "vision-factura",
      "src": "/media/vacas/v_vision_factura.webp",
      "w": 640,
      "h": 600,
      "alt": {
        "es": "Una máscara cosida de papel con lacres y una balanza",
        "en": "A stitched paper mask with wax seals and a pair of scales"
      },
      "caption": {
        "es": "La factura",
        "en": "The invoice"
      }
    },
    {
      "id": "vision-pastor",
      "src": "/media/vacas/v_vision_pastor.webp",
      "w": 640,
      "h": 600,
      "alt": {
        "es": "Una figura con capa, cayado y una jaula por cuerpo",
        "en": "A cloaked figure with a crook and a cage for a body"
      },
      "caption": {
        "es": "El pastor hueco",
        "en": "The hollow shepherd"
      }
    },
    {
      "id": "vision-moscas",
      "src": "/media/vacas/v_vision_moscas.webp",
      "w": 640,
      "h": 600,
      "alt": {
        "es": "Un enjambre de moscas que forma una calavera",
        "en": "A swarm of flies forming a skull"
      },
      "caption": {
        "es": "El enjambre",
        "en": "The swarm"
      }
    },
    {
      "id": "vision-canal",
      "src": "/media/vacas/g_vision_canal.webp",
      "w": 640,
      "h": 600,
      "alt": {
        "es": "Una canal colgada de un gancho con el costillar abierto",
        "en": "A carcass hanging from a hook with its ribcage open"
      },
      "caption": {
        "es": "La canal",
        "en": "The carcass"
      },
      "gore": {
        "es": "Gore explícito: costillar abierto y vísceras",
        "en": "Explicit gore: open ribcage and entrails"
      }
    },
    {
      "id": "vision-vaca",
      "src": "/media/vacas/g_vision_vaca.webp",
      "w": 640,
      "h": 600,
      "alt": {
        "es": "Una cabeza de vaca medio desollada con la lengua fuera",
        "en": "A half-flayed cow head with its tongue out"
      },
      "caption": {
        "es": "La res",
        "en": "The head of cattle"
      },
      "gore": {
        "es": "Gore explícito: cabeza desollada, hueso y sangre",
        "en": "Explicit gore: flayed head, bone and blood"
      }
    },
    {
      "id": "vision-madre",
      "src": "/media/vacas/g_vision_madre.webp",
      "w": 640,
      "h": 600,
      "alt": {
        "es": "La madre, enorme, con el cuerpo desgarrado bajo la bata",
        "en": "The mother, enormous, her body torn open under the robe"
      },
      "caption": {
        "es": "La Bestia",
        "en": "The Beast"
      },
      "gore": {
        "es": "Gore explícito: cuerpo desgarrado y sangre",
        "en": "Explicit gore: torn body and blood"
      }
    },
    {
      "id": "vision-tarro",
      "src": "/media/vacas/g_vision_tarro.webp",
      "w": 640,
      "h": 600,
      "alt": {
        "es": "Un tarro de cristal con una boca abierta entre vísceras",
        "en": "A glass jar with an open mouth among entrails"
      },
      "caption": {
        "es": "El tarro",
        "en": "The jar"
      },
      "gore": {
        "es": "Gore explícito: vísceras y dientes en un tarro",
        "en": "Explicit gore: entrails and teeth in a jar"
      }
    }
  ],
  "status": {
    "title": {
      "es": "Cómo va el juego",
      "en": "How the game is going"
    },
    "lead": {
      "es": "Cinco de los seis actos ya se juegan de principio a fin. El Acto VI está en curso.",
      "en": "Five of the six acts are playable from start to finish. Act VI is under way."
    },
    "states": {
      "done": {
        "es": "Construido",
        "en": "Built"
      },
      "now": {
        "es": "En curso",
        "en": "Under way"
      },
      "todo": {
        "es": "Pendiente",
        "en": "To do"
      }
    },
    "acts": [
      {
        "n": "I",
        "name": {
          "es": "El piso",
          "en": "The flat"
        },
        "state": "done"
      },
      {
        "n": "II",
        "name": {
          "es": "La cadena",
          "en": "The line"
        },
        "state": "done"
      },
      {
        "n": "III",
        "name": {
          "es": "La vecina de arriba",
          "en": "The upstairs neighbour"
        },
        "state": "done"
      },
      {
        "n": "IV",
        "name": {
          "es": "Bajo la ciudad",
          "en": "Beneath the city"
        },
        "state": "done"
      },
      {
        "n": "V",
        "name": {
          "es": "La matanza",
          "en": "The slaughter"
        },
        "state": "done"
      },
      {
        "n": "VI",
        "name": {
          "es": "Sin destripar",
          "en": "No spoilers"
        },
        "state": "now"
      }
    ],
    "notes": [
      {
        "title": {
          "es": "Audio integrado",
          "en": "Audio is in"
        },
        "body": {
          "es": "Ambiente propio en cada mapa, música de persecución y de jefes, y pasos que suenan distinto según el suelo.",
          "en": "Its own ambience on every map, chase and boss music, and footsteps that sound different on each floor."
        }
      },
      {
        "title": {
          "es": "Interfaz propia",
          "en": "Custom interface"
        },
        "body": {
          "es": "Título, pausa, ajustes, combate y diálogos hechos a medida para el juego.",
          "en": "Title, pause, settings, combat and dialogue built to fit the game."
        }
      },
      {
        "title": {
          "es": "Intro de Feka Studios",
          "en": "Feka Studios intro"
        },
        "body": {
          "es": "El juego arranca con la intro animada del estudio.",
          "en": "The game opens with the studio’s animated intro."
        }
      }
    ],
    "titleImg": {
      "id": "titulo",
      "src": "/media/vacas/v_titulo.webp",
      "w": 1280,
      "h": 960,
      "alt": {
        "es": "Pantalla de título de Vacas: un pasillo con un televisor encendido y el menú del juego",
        "en": "Vacas title screen: a corridor with a television switched on and the game menu"
      },
      "caption": {
        "es": "La pantalla de título",
        "en": "The title screen"
      }
    },
    "soonTitle": {
      "es": "Próximamente",
      "en": "Coming soon"
    },
    "soonBody": {
      "es": "Todavía no hay descarga ni fecha. Cada avance se apunta en la bitácora del estudio.",
      "en": "There is no download or date yet. Every step is logged in the studio devlog."
    },
    "devlog": {
      "es": "Leer la bitácora",
      "en": "Read the devlog"
    },
    "home": {
      "es": "Volver a Feka Studios",
      "en": "Back to Feka Studios"
    }
  },
  "footer": {
    "note": {
      "es": "Vacas es una obra de ficción para adultos. Contiene violencia gráfica, gore, maltrato y temas perturbadores.",
      "en": "Vacas is a work of fiction for adults. It contains graphic violence, gore, abuse and disturbing themes."
    }
  }
};

const M = "/media/vacas/";
export const vacasInterface = {
  skip: { es: 'Saltar al contenido', en: 'Skip to content' },
  navigation: { es: 'Apartados de Vacas', en: 'Vacas sections' },
  enter: { es: 'Entrar al archivo', en: 'Enter the archive' },
  missing: { es: 'Este pasillo no tiene salida.', en: 'This corridor leads nowhere.' },
  actFive: { es: 'Acto V · La matanza', en: 'Act V · The slaughter' },
  process: { es: 'Del sprite al retrato', en: 'From sprite to portrait' },
};
export const vacasProcess: VacasImg = {
  id: 'proceso-steven', src: M + 'v_proceso_steven.webp', w: 1600, h: 613, pixel: true,
  alt: { es: 'Lámina de arte de Steven: sprites de movimiento y dos escalas de su retrato', en: 'Steven art sheet: movement sprites and two scales of his portrait' },
  caption: { es: 'Fase 2 / Steven', en: 'Phase 2 / Steven' },
};
// Vistas de Vacas. Solo arte no explícito en los heroes; el gore vive en Galería.
export const vacasViews = [
  { id: '', label: { es: 'Inicio', en: 'Home' }, title: { es: 'Vacas', en: 'Vacas' }, line: vacasPage.hero.tagline, lead: vacasPage.hero.lead, art: 'v_rejilla.webp', zone: 'piso' },
  { id: 'historia', label: { es: 'Historia', en: 'Story' }, title: { es: 'Nadie sale limpio.', en: 'Nobody leaves clean.' }, line: { es: '01 / Un piso. Un turno. Una voz.', en: '01 / A flat. A shift. A voice.' }, lead: { es: 'Arriba, la madre. En el trabajo, el capataz. Bajo la ciudad, una voz que sabe tu nombre. La vida de Steven cabe entre esas tres paredes.', en: 'Upstairs, his mother. At work, the foreman. Beneath the city, a voice that knows his name. Steven’s life fits between those three walls.' }, art: 'mapa2_el_piso.webp', zone: 'piso' },
  { id: 'jugabilidad', label: { es: 'Jugabilidad', en: 'Gameplay' }, title: { es: 'Respira. Resiste.', en: 'Breathe. Endure.' }, line: { es: '02 / Lo que haces se queda dentro.', en: '02 / What you do stays inside.' }, lead: { es: 'Explora, cumple el turno y aguanta las visiones. La cordura cambia lo que ves. Las decisiones cambian lo que queda.', en: 'Explore, finish your shift and endure the visions. Sanity changes what you see. Decisions change what remains.' }, art: 'v_combate_salon.webp', zone: 'matadero' },
  { id: 'galeria', label: { es: 'Galería', en: 'Gallery' }, title: { es: 'Mira bajo la piel.', en: 'Look beneath the skin.' }, line: { es: '03 / Archivo de lugares y visiones.', en: '03 / An archive of places and visions.' }, lead: { es: 'Del papel amarillo al azulejo frío. Capturas, mapas y criaturas del juego. Las siete imágenes explícitas se abren solo si tú lo decides.', en: 'From yellow wallpaper to cold tile. Screenshots, maps and creatures from the game. The seven explicit images open only if you choose.' }, art: 'v_acto5_22.webp', zone: 'matadero' },
  { id: 'personajes', label: { es: 'Personajes', en: 'Characters' }, title: { es: 'Te están mirando.', en: 'They are watching.' }, line: { es: '04 / Los que habitan este lugar.', en: '04 / Those who live here.' }, lead: { es: 'Una casa, un matadero y una ciudad por debajo. Cada rostro tiene algo que pedirte.', en: 'A home, a slaughterhouse and a city underneath. Every face wants something from you.' }, art: 'v_ret_steven.webp', zone: 'alcantarillas' },
  { id: 'bitacora', label: { es: 'Bitácora', en: 'Devlog' }, title: { es: 'El turno continúa.', en: 'The shift goes on.' }, line: { es: '05 / Diario de desarrollo.', en: '05 / Development journal.' }, lead: { es: 'Acto V construido. Acto VI en curso. Aquí quedan apuntados los mapas, el arte y las mecánicas que van entrando en Vacas.', en: 'Act V built. Act VI under way. A record of the maps, art and mechanics being added to Vacas.' }, art: 'v_acto5_26.webp', zone: 'alcantarillas' },
] satisfies { id: string; label: L; title: L; line: L; lead: L; art: string; zone: VacasZone['id'] }[];

export const vacasArchive: VacasImg[] = [22, 23, 24, 25, 26, 27].map((n, i) => ({
  id: 'acto5-' + n, src: M + 'v_acto5_' + n + '.webp', w: 640, h: 480, pixel: true,
  alt: { es: 'Mapa del Acto V: ' + ['entrada al matadero', 'corrales', 'sala de trabajo', 'la cadena', 'dependencias', 'patio con la manada'][i], en: 'Act V map: ' + ['slaughterhouse entrance', 'pens', 'work room', 'the line', 'back rooms', 'yard with the herd'][i] },
  caption: { es: 'Acto V / ' + String(i + 1).padStart(2, '0'), en: 'Act V / ' + String(i + 1).padStart(2, '0') },
}));
