// Ejecutar contra `wrangler dev --port 8787`. El original se sirve solo en lectura.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import files from '../worker/ceniza-assets.mjs';

const base = process.argv[2] || 'http://127.0.0.1:8787';
const source = path.resolve('../Ceniza-Neon-Web/dist');
const output = 'capturas/ceniza-original';
await fs.mkdir(output, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.webp': 'image/webp', '.mp4': 'video/mp4' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/ranking') {
      res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ranking":[]}'); return;
    }
    const name = decodeURIComponent(url.pathname).replace(/^\//, '') + (url.pathname.endsWith('/') ? 'index.html' : '');
    assert(files.has(name));
    res.writeHead(200, { 'Content-Type': mime[path.extname(name)] || 'application/octet-stream' });
    res.end(await fs.readFile(path.join(source, name)));
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(8790, '127.0.0.1', resolve));
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = { pages: [], resources: 0, regression: [], errors: [], ranking: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await context.route('**/api/ceniza/ranking', route => {
    report.ranking.push(route.request().url());
    return route.fulfill({ json: { ranking: [] } });
  });
  const migrated = await context.newPage();
  const original = await context.newPage();
  for (const page of [original, migrated]) {
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
    page.on('requestfailed', request => report.errors.push(`${request.failure()?.errorText} ${request.url()}`));
  }
  for (const file of files) {
    const response = await context.request.get(`${base}/ceniza/${file}`);
    assert.equal(response.status(), 200, file);
    assert.deepEqual(await response.body(), await fs.readFile(`public/ceniza/${file}`), file);
    report.resources++;
  }
  for (const file of [...files].filter(file => file.endsWith('index.html'))) {
    const route = file.replace(/index.html$/, '');
    await Promise.all([
      original.goto(`http://127.0.0.1:8790/${route}`, { waitUntil: 'networkidle' }),
      migrated.goto(`${base}/ceniza/${route}`, { waitUntil: 'networkidle' }),
    ]);
    for (const page of [original, migrated]) {
      await page.evaluate(async () => {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => img.loading = 'eager');
        await document.fonts.ready;
        await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
      });
    }
    const name = route.replaceAll('/', '-') || 'inicio';
    const a = await original.screenshot({ path: `${output}/${name}-original.png`, fullPage: true, animations: 'disabled' });
    const b = await migrated.screenshot({ path: `${output}/${name}-feka.png`, fullPage: true, animations: 'disabled' });
    const difference = a.equals(b) ? 0 : await original.evaluate(async images => {
      const pixels = await Promise.all(images.map(async src => {
        const img = new Image(); img.src = src; await img.decode();
        const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height).data;
      }));
      if (pixels[0].length !== pixels[1].length) return 1;
      let changed = 0;
      for (let i = 0; i < pixels[0].length; i += 4) {
        if ([0, 1, 2, 3].some(c => Math.abs(pixels[0][i+c] - pixels[1][i+c]) > 8)) changed++;
      }
      return changed / (pixels[0].length / 4);
    }, [a, b].map(buffer => 'data:image/png;base64,' + buffer.toString('base64')));
    report.pages.push({ route: `/ceniza/${route}`, identicalScreenshot: a.equals(b), pixelDifference: difference });
    // Tolerancia de 8/255 por canal y 0,1 % de píxeles para rasterizado subpíxel.
    assert(difference < 0.001, `Capturas distintas: ${route}: ${difference}`);
    assert.equal(await migrated.locator('body').innerText(), await original.locator('body').innerText());
    console.log(`Captura comprobada: /ceniza/${route} (${(difference * 100).toFixed(5)} %)`);
  }
  // Interacción real de audio y búsqueda, sin alterar el contenido.
  await migrated.goto(`${base}/ceniza/banda-sonora/`, { waitUntil: 'networkidle' });
  await migrated.locator('[data-track]').first().click();
  await migrated.waitForFunction(() => document.querySelector('audio').readyState >= 2);
  assert((await migrated.locator('audio').getAttribute('src')).startsWith('/ceniza/audio/'));
  await migrated.goto(`${base}/ceniza/wiki/`, { waitUntil: 'networkidle' });
  await migrated.locator('#wiki-query').fill('boss');
  assert(await migrated.locator('.wiki-row:visible').count() > 0);
  assert(report.ranking.length > 0);
  for (const route of ['/ceniza', '/ceniza/wiki', '/ceniza/descargar']) {
    const response = await context.request.get(base + route, { maxRedirects: 0 });
    assert.equal(response.status(), 308);
    assert(new URL(response.headers().location).pathname === route + '/');
  }
  for (const route of ['/ceniza/no-existe/', '/ceniza/wiki/no-existe/', '/ceniza/media/no-existe.webp']) {
    const response = await context.request.get(base + route);
    assert.equal(response.status(), 404);
    assert.deepEqual(await response.body(), await fs.readFile('public/ceniza/404.html'));
  }
  const headers = (await context.request.get(base + '/ceniza/')).headers();
  assert.equal(headers['x-content-type-options'], 'nosniff');
  assert(headers['content-security-policy'].includes("default-src 'self'"));
  for (const route of ['/', '/vacas/', '/vacas/historia', '/vacas/jugabilidad', '/vacas/archivo', '/vacas/personajes', '/vacas/bitacora']) {
    await migrated.goto(base + route, { waitUntil: 'networkidle' });
    assert(await migrated.locator('#root').innerText());
    await migrated.screenshot({ path: `${output}/regresion-${route.replaceAll('/', '-') || 'inicio'}.png` });
    if (route === '/') assert.equal(await migrated.getByRole('link', { name: 'Web del juego', exact: true }).getAttribute('href'), '/ceniza/');
    report.regression.push(route);
  }
  assert.deepEqual(report.errors, []);
} finally {
  await fs.writeFile(`${output}/informe.json`, JSON.stringify(report, null, 2));
  await browser.close();
  server.close();
}
console.log(JSON.stringify(report, null, 2));
