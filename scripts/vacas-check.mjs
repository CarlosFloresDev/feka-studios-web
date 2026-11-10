// Comprobación de /vacas con Playwright: aviso +18, imágenes tapadas, scroll horizontal y capturas.
// Uso: node scripts/vacas-check.mjs [url base] [carpeta de capturas]
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:4173';
const dir = process.argv[3] || 'capturas/vacas';
const browser = await chromium.launch();
const out = {};
for (const [name, width, height] of [['escritorio', 1440, 900], ['movil', 390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('response', (r) => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  const r = {};
  const resp = await page.goto(base + '/vacas', { waitUntil: 'networkidle' });
  r.status = resp.status();
  r.gate = await page.locator('.gate h1').innerText();
  r.imgsAntes = await page.locator('img').count();
  await page.screenshot({ path: `${dir}/${name}-aviso.jpg`, type: 'jpeg', quality: 55 });
  await page.getByRole('button', { name: /continuar|continue/i }).click();
  await page.waitForSelector('.hero__title');
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${dir}/${name}-hero.jpg`, type: 'jpeg', quality: 55 });
  r.tapadas = await page.locator('.pic[data-covered="true"]').count();
  const over = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  r.overflowX = await over();
  for (const [sel, tag] of [['#piso', 'piso'], ['.visions', 'visiones'], ['#alcantarillas', 'alcantarillas'], ['.acts', 'estado']]) {
    await page.evaluate((s) => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 90); }, sel);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `${dir}/${name}-${tag}.jpg`, type: 'jpeg', quality: 55 });
  }
  r.zona = await page.locator('.vbar__zone').innerText();
  r.cordura = await page.locator('[data-sanity]').innerText();
  await page.evaluate(() => document.querySelector('.visions .pic[data-covered="true"] button').click());
  r.tapadasTrasVer = await page.locator('.pic[data-covered="true"]').count();
  r.ls = await page.evaluate(() => [localStorage.getItem('feka-vacas-adulto'), localStorage.getItem('feka-vacas-gore')]);
  await page.reload({ waitUntil: 'networkidle' });
  r.trasRecargar = { aviso: await page.locator('.gate').count(), tapadas: await page.locator('.pic[data-covered="true"]').count() };
  r.overflowX2 = await over();
  // portada
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  r.portada = { enlace: await page.locator('a[href="/vacas"]').count(), bitacora: await page.locator('.log__item').count(), overflowX: await over() };
  r.errs = errs;
  out[name] = r;
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
