import original from './original.json';
import { characterEnglish, districtEnglish, postEnglish, roadmapEnglish, wikiEnglish } from './english';
import type { Lang } from '../content';

export const data = original;
export const text = (lang: Lang, es: string, en: string) => lang === 'es' ? es : en;
export const routeNames = ['', 'universo', 'wiki', 'bitacora', 'banda-sonora', 'hoja-de-ruta', 'descargar'] as const;
export type View = typeof routeNames[number];
export const route = (view: View) => '/ceniza' + (view ? '/' + view : '');
export const labels = {
  es: ['Inicio', 'Universo', 'Wiki', 'Bitácora', 'Banda sonora', 'Hoja de ruta', 'Descargar'],
  en: ['Home', 'Universe', 'Wiki', 'Journal', 'Soundtrack', 'Roadmap', 'Download'],
};
export const heroes = [
  { key: 'home', title: ['Ceniza Neón', 'Ceniza Neón'], lead: ['Una ciudad que cobra por existir. Una luz que todavía puedes defender.', 'A city that charges you for existing. A light you can still defend.'], action: ['Jugar la alfa', 'Play the alpha'] },
  { key: 'universe', title: ['La emergencia terminó. La orden, no.', 'The emergency ended. The order never did.'], lead: ['Diecisiete años de deuda. Cinco distritos aislados. Y un enlace que todavía puede cambiar quién decide.', 'Seventeen years of debt. Five isolated districts. And a link that can still change who decides.'] },
  { key: 'wiki', title: ['Aprende a mantener la luz.', 'Learn to keep the light alive.'], lead: ['La colonia, los jefes y las reglas del prototipo. Lo implementado y lo que todavía está por llegar.', 'The colony, the bosses and the prototype’s rules. What exists and what is still to come.'] },
  { key: 'journal', title: ['Una ciudad en construcción.', 'A city under construction.'], lead: ['El trabajo real, sus pruebas y lo que falta. El archivo de desarrollo de Ceniza Neón.', 'Real work, its tests and what remains. The Ceniza Neón development archive.'] },
  { key: 'music', title: ['El sonido de lo que queda.', 'The sound of what remains.'], lead: ['De la calma de Dusk Beacon a la tensión de Emergency Protocol. Escucha el repertorio del juego.', 'From the calm of Dusk Beacon to the tension of Emergency Protocol. Listen to the game’s repertoire.'] },
  { key: 'roadmap', title: ['Lo que existe. Lo que viene.', 'What exists. What comes next.'], lead: ['Hitos de trabajo, sin fechas prometidas. Una base jugable y una ciudad que sigue creciendo.', 'Working milestones, without promised dates. A playable foundation and a city still growing.'] },
  { key: 'download', title: ['La luz está en tus manos.', 'The light is in your hands.'], lead: ['Alfa de prueba 0.2.1. Windows, Android y navegador. Una ciudad por defender; un prototipo que sigue cambiando.', 'Test alpha 0.2.1. Windows, Android and browser. A city to defend; a prototype still changing.'] },
];
export function localWiki(lang: Lang) {
  return original.wiki.map((w, i) => ({ ...w, title: lang === 'es' ? w.title : wikiEnglish[i][0], summary: lang === 'es' ? w.summary : wikiEnglish[i][1], body: lang === 'es' ? w.body : wikiEnglish[i][2] }));
}
export function localPosts(lang: Lang) {
  return original.posts.map((p, i) => ({ ...p, title: lang === 'es' ? p.title : postEnglish[i][0], excerpt: lang === 'es' ? p.excerpt : postEnglish[i][1], body: lang === 'es' ? p.body : postEnglish[i][2] }));
}
export function localCharacters(lang: Lang) {
  return original.characters.map((c, i) => ({ ...c, role: lang === 'es' ? c.role : characterEnglish[i][0], quote: lang === 'es' ? c.quote : characterEnglish[i][1], text: lang === 'es' ? c.text : characterEnglish[i][2] }));
}
export function localDistricts(lang: Lang) {
  return original.districts.map((d, i) => ({ ...d, name: lang === 'es' ? d.name : districtEnglish[i][0], detail: lang === 'es' ? d.detail : districtEnglish[i][1], text: lang === 'es' ? d.text : districtEnglish[i][2] }));
}
export const localRoadmap = (lang: Lang) => lang === 'es' ? original.roadmap : roadmapEnglish;
export const art = original.art as Record<string, string>;
