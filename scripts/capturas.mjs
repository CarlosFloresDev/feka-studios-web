// Capturas (escritorio y móvil) en ./capturas
//   *-hero.png      primera pantalla con animación
//   *-completa.png  página entera (cosida a partir de pantallas, sin anclajes de scroll)
// Uso: node scripts/capturas.mjs [url]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] || 'http://localhost:4173/';
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
fs.mkdirSync('capturas/_partes', { recursive: true });

async function shoot(name, viewport, opts = {}) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, ...opts });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: `capturas/${name}-hero.png` });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.nav{position:absolute!important} .vacas__copy{position:static!important} img{content-visibility:visible}' });
  await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')));
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const parts = [];
  for (let y = 0, i = 0; y < h; y += viewport.height, i++) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(350);
    const real = await page.evaluate(() => window.scrollY);
    const f = `capturas/_partes/${name}-${String(i).padStart(2, '0')}.png`;
    await page.screenshot({ path: f });
    parts.push({ f, y: real });
  }
  fs.writeFileSync(`capturas/_partes/${name}.json`, JSON.stringify({ h, vw: viewport.width, vh: viewport.height, dpr: opts.deviceScaleFactor || 1, parts }));
  if (errors.length) console.log(name, 'errores:', errors);
  await page.close();
}

await shoot('escritorio', { width: 1440, height: 900 });
await shoot('movil', { width: 390, height: 844 }, { isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await browser.close();
console.log('partes listas; coser con: python scripts/coser.py');
