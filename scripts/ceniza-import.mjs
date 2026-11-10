// Importación reproducible. El proyecto de origen se abre exclusivamente en lectura.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
const source = process.argv[2] || 'D:/descargas/Proyectos personales/Ceniza-Neon-Web';
const read = async file => JSON.parse(await fs.readFile(path.join(source, file), 'utf8'));
const { posts, characters, districts, roadmap } = await import(pathToFileURL(path.join(source, 'content/editorial.mjs')));
const { wiki } = await import(pathToFileURL(path.join(source, 'content/wiki.mjs')));
const heroes = await read('content/hero-art.json');
const scenes = await read('content/scene-art.json');
await fs.mkdir('src/ceniza', { recursive: true });
await fs.mkdir('public/media/ceniza/archivo', { recursive: true });
await fs.mkdir('public/media/ceniza/audio', { recursive: true });
await fs.mkdir('public/media/ceniza/fonts', { recursive: true });
const provenance = [];
async function picture(file, name, width = 1600) {
  const target = `public/media/ceniza/archivo/${name}.webp`;
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(source, 'public', file), '-vf', `scale=min(${width}\\,iw):-1`, '-c:v', 'libwebp', '-quality', '83', target]);
  provenance.push({ file: target, source: file, manifest: file.includes('heroes/') ? heroes[path.basename(file, '.webp')] : undefined });
  return '/' + target.replace('public/', '');
}
const art = {};
for (const key of ['home', 'universe', 'wiki', 'music', 'roadmap']) art[key] = await picture(heroes[key].src, key);
// La bitácora y la descarga no tienen pintura propia: conservar el respaldo del juego.
art.journal = '/media/ceniza/foundry.webp';
art.download = '/media/ceniza/periphery_alive_v2.webp';
for (const key of ['portador-back', 'builder']) art[key] = await picture(scenes.sprites[key].file, key, 512);
for (const c of characters) art[c.id] = await picture(`/media/${c.id}.webp`, c.id, 650);
for (const file of ['permanent-marker.woff2', 'caveat.woff2', 'inter.woff2', 'Caveat-OFL.txt', 'Inter-OFL.txt', 'PermanentMarker-LICENSE.txt']) {
  await fs.copyFile(path.join(source, 'dist/fonts', file), `public/media/ceniza/fonts/${file}`);
}
const soundtrack = await read('content/soundtrack.json');
for (const track of soundtrack) {
  await fs.copyFile(path.join(source, 'public', track.src), `public/media/ceniza/audio/${track.id}.mp3`);
  track.src = `/media/ceniza/audio/${track.id}.mp3`;
}
// Ajustes de datos vigentes: la descarga y el worker son posteriores a estas frases.
wiki[0].body = wiki[0].body.replace(/0\.2\.0/g, '0.2.1').replace('Esta guía describe esa versión, publicada el 6 de noviembre de 2026.', 'Esta guía describe la alfa de prueba actual.');
const rush = wiki.find(w => w.slug === 'boss-rush');
rush.body = rush.body.replace('El ranking es local: se guarda en el dispositivo donde juegas. No hay una clasificación en línea.', 'El juego conserva un ranking local. La página de descarga también muestra el Top Boss Rush en línea: termina una ruta con conexión a internet para enviar tu tiempo.');
await fs.writeFile('src/ceniza/original.json', JSON.stringify({ posts, characters, districts, roadmap, wiki, soundtrack, art, download: await read('content/download.json'), site: await read('content/site.json'), history: await read('content/development-history.json') }, null, 2));
await fs.writeFile('src/ceniza/procedencia.json', JSON.stringify(provenance, null, 2));
console.log(`Importados ${posts.length} registros, ${wiki.length} artículos y ${soundtrack.length} pistas. Solo ${provenance.length} imágenes seleccionadas.`);
