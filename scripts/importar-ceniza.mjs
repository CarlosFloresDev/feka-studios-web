// Solo lee el build original; nunca ejecuta ni modifica el proyecto de origen.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.resolve(process.argv[2] || path.join(root, '../Ceniza-Neon-Web/dist'));
const target = path.join(root, 'public/ceniza');
const entries = await fs.readdir(source);
await fs.access(path.join(source, 'index.html'));
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const local = new RegExp(`(?<![\\w/.:~-])/(?:${entries.map(escape).join('|')})(?=[/\\s"'\x60?#<>),;}]|$)`, 'g');
const originalOrigin = /https:\/\/ceniza-neon\.chefsitturchey\.workers\.dev\/?/g;
const textFiles = /\.(?:html|css|js|json|xml|webmanifest|txt)$/i;

export function rewrite(text) {
  return text
    .replace(originalOrigin, 'https://feka-studios.chefsitturchey.workers.dev/ceniza/')
    .replace(/\/api\/ranking\b/g, '/api/ceniza/ranking')
    .replace(local, match => '/ceniza' + match)
    .replace(/(["'`])\/(?=[?#]|\1)/g, '$1/ceniza/')
    .replace(/(\b(?:href|src|srcset|poster|content|action)\s*=\s*)\/(?=[\s>])/gi, '$1/ceniza/')
    .replace(/(<loc>\s*)\/(?=\s*<\/loc>)/g, '$1/ceniza/')
    .replace(/url\(\s*\/(\s*\))/g, 'url(/ceniza/$1')
    .replace(/^(Allow:\s*)\/$/gm, '$1/ceniza/');
}

// Se verifica el origen antes de sustituir la copia anterior.
await fs.rm(target, { recursive: true, force: true });
const files = [];
async function copy(relative = '') {
  await fs.mkdir(path.join(target, relative), { recursive: true });
  for (const item of await fs.readdir(path.join(source, relative), { withFileTypes: true })) {
    const name = path.posix.join(relative, item.name);
    if (item.isDirectory()) { await copy(name); continue; }
    if (!item.isFile()) throw new Error(`Entrada no regular: ${name}`);
    files.push(name);
    if (textFiles.test(name) || name === '_headers') {
      let text = rewrite(await fs.readFile(path.join(source, name), 'utf8'));
      if (name === '_headers') text = text.replace(/^\/\*/gm, '/ceniza/*').replace(/^\/(?=\r?$)/gm, '/ceniza/');
      await fs.writeFile(path.join(target, name), text);
    } else await fs.copyFile(path.join(source, name), path.join(target, name));
  }
}
await copy();
// Cloudflare solo interpreta _headers en la raíz de assets.
// Conserva cualquier cabecera de Feka fuera del bloque gestionado.
const headersFile = path.join(root, 'public/_headers');
let headers = await fs.readFile(headersFile, 'utf8').catch(error => {
  if (error.code !== 'ENOENT') throw error;
  return '';
});
headers = headers.replace(/# BEGIN CENIZA\n[\s\S]*?# END CENIZA\n?/g, '');
const cenizaHeaders = await fs.readFile(path.join(target, '_headers'), 'utf8');
await fs.writeFile(headersFile, `${headers.trimEnd()}\n# BEGIN CENIZA\n${cenizaHeaders.trimEnd()}\n# END CENIZA\n`);
await fs.writeFile(path.join(root, 'worker/ceniza-assets.mjs'),
  `// Generado por scripts/importar-ceniza.mjs.\nexport default new Set(${JSON.stringify(files.filter(file => file !== '_headers').sort(), null, 2)});\n`);
console.log(`Ceniza original: ${files.length} archivos importados en public/ceniza/.`);
