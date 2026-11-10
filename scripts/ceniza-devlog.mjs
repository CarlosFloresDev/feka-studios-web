import fs from 'node:fs';
import { postEnglish } from '../src/ceniza/english.ts';
const data = JSON.parse(fs.readFileSync('src/ceniza/original.json', 'utf8'));
const file = 'src/content.ts';
let content = fs.readFileSync(file, 'utf8');
const start = content.indexOf("  { date: '2026-10-29', title: { es: 'Ceniza Neón: una ciudad que respira'");
if (start >= 0) {
  const end = content.indexOf("  { date: '2026-11-10'", start);
  content = content.slice(0, start) + content.slice(end);
}
const entries = data.posts.slice(1).map((p, i) => ({ date: p.date, title: { es: 'Ceniza Neón: ' + p.title, en: 'Ceniza Neón: ' + postEnglish[i + 1][0] }, body: { es: p.excerpt, en: postEnglish[i + 1][1] }, href: '/ceniza/bitacora#' + p.slug }));
if (!content.includes(entries[0].href)) {
  const pos = content.indexOf('  {\n    "date": null,') >= 0 ? content.indexOf('  {\n    "date": null,') : content.indexOf('  {\r\n    "date": null,');
  if (pos < 0) throw Error('No se encontró el final de la bitácora');
  content = content.slice(0, pos) + entries.map(p => '  ' + JSON.stringify(p) + ',\n').join('') + content.slice(pos);
}
fs.writeFileSync(file, content);
