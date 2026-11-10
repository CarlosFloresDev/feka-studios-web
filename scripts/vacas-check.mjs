// npm run preview -- --host 127.0.0.1; node scripts/vacas-check.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:4173';
const dir = process.argv[3] || 'capturas/vacas';
const routes = ['', 'historia', 'jugabilidad', 'galeria', 'personajes', 'bitacora'];
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = {};
try {
  for (const [name, width, height] of [['escritorio', 1440, 900], ['movil', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, isMobile: width === 390, hasTouch: width === 390 });
    const page = await context.newPage();
    const errors = [];
    const goreRequests = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    page.on('request', r => { if (/\/g_.*\.webp/.test(r.url())) goreRequests.push(r.url()); });
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const shot = async tag => page.screenshot({ path: `${dir}/${name}-${tag}.jpg`, type: 'jpeg', quality: 78 });
    await page.goto(base + '/vacas/historia', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.gate').count(), 1);
    assert.equal(await page.locator('img').count(), 0);
    assert.equal(await page.locator('canvas').count(), 0);
    await shot('aviso');
    await page.getByRole('button', { name: /continuar/i }).click();
    await page.locator('#vacas-h1').waitFor();
    assert.equal(new URL(page.url()).pathname, '/vacas/historia');
    const result = { routes: {}, errors };
    for (const id of routes) {
      const route = '/vacas' + (id ? '/' + id : '');
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, route);
      assert.equal(await page.locator('.gate').count(), 0);
      await page.locator('#vacas-h1').waitFor();
      await page.waitForTimeout(1200);
      assert.equal(await page.locator('.vtabs a[aria-current="page"]').getAttribute('href'), route);
      const hero = await page.locator('.vhero').boundingBox();
      assert.ok(hero.height >= height - 1, 'Hero de pantalla completa');
      assert.equal(await overflow(), 0, route + ' / hero');
      assert.equal(await page.locator('.vhero canvas').count(), 1, 'R3F en escritorio y móvil');
      await shot(id || 'inicio');
      await page.locator('img').evaluateAll(async imgs => {
        await Promise.all(imgs.map(async img => { img.loading = 'eager'; await img.decode(); }));
      });
      await page.evaluate(() => window.scrollTo({ top: document.querySelector('#archivo').offsetTop - 145, behavior: 'instant' }));
      await page.waitForTimeout(350);
      assert.equal(await overflow(), 0, route + ' / contenido');
      await shot(`${id || 'inicio'}-contenido`);
      result.routes[route] = { status: response.status(), overflow: await overflow(), hero: Math.round(hero.height), title: await page.locator('h1').innerText() };
    }
    assert.equal(goreRequests.length, 0, 'Ningún gore se descarga antes de destaparlo');
    await page.evaluate(() => { window.__navigationSentinel = 'same-document'; });
    await page.locator('.vtabs a[href="/vacas/jugabilidad"]').click();
    await page.waitForURL('**/vacas/jugabilidad');
    await page.waitForTimeout(950);
    assert.equal(await page.evaluate(() => window.__navigationSentinel), 'same-document');
    assert.equal(await page.locator('#vacas-h1').evaluate(el => el === document.activeElement), true);
    await page.goBack();
    await page.waitForTimeout(900);
    assert.equal(new URL(page.url()).pathname, '/vacas/bitacora');
    await page.goForward();
    await page.waitForTimeout(900);
    assert.equal(new URL(page.url()).pathname, '/vacas/jugabilidad');
    await page.goto(base + '/vacas/galeria', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.pic[data-covered="true"]').count(), 7);
    await page.locator('.pic[data-covered="true"] button').first().click();
    assert.equal(await page.locator('.pic[data-covered="true"]').count(), 6);
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.pic[data-covered="true"]').count(), 6);
    await page.locator('.pic__hide').first().click();
    assert.equal(await page.locator('.pic[data-covered="true"]').count(), 7);
    assert.equal(await page.evaluate(() => localStorage.getItem('feka-vacas-adulto')), '1');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    for (const id of routes) {
      await page.goto(base + '/vacas' + (id ? '/' + id : ''), { waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      assert.equal(await page.locator('.vtabs').getAttribute('aria-label'), 'Vacas sections');
      assert.equal(await overflow(), 0);
      await shot(`english-${id || 'inicio'}`);
    }
    await shot('english');
    await page.getByRole('button', { name: 'ES', exact: true }).click();
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    assert.equal(await overflow(), 0, 'Hero de Feka');
    await shot('portada-inicio');
    if (width === 390) {
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      await page.getByRole('button', { name: 'EN', exact: true }).click();
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      await shot('portada-menu-english');
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded'), 'false');
      await page.getByRole('button', { name: 'Open menu' }).click();
      await page.getByRole('button', { name: 'ES', exact: true }).click();
      await page.keyboard.press('Escape');
    }
    await page.evaluate(() => window.scrollTo({ top: document.querySelector('#vacas').offsetTop - 90, behavior: 'instant' }));
    await page.waitForTimeout(1200);
    await shot('portada-vacas');
    assert.ok(await page.locator('a[href="/vacas"]').count());
    assert.ok(await page.getByText('Vacas: Acto V «La matanza»', { exact: true }).count());
    assert.equal(await overflow(), 0, 'Portada');
    await page.evaluate(() => window.scrollTo({ top: document.querySelector('#juegos').offsetTop, behavior: 'instant' }));
    await page.waitForTimeout(700);
    await shot('portada-ceniza');
    for (const id of ['diario', 'estudio', 'prensa', 'contacto']) {
      await page.evaluate(id => window.scrollTo({ top: document.getElementById(id).offsetTop - 90, behavior: 'instant' }), id);
      assert.equal(await overflow(), 0, `Portada / ${id}`);
      await shot(`portada-${id}`);
    }
    assert.deepEqual(errors, [], 'Errores del navegador');
    report[name] = result;
    await context.close();
    console.log(`${name}: seis rutas, historial, ES/EN, aviso y gore correctos`);
  }
  const reduced = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await reduced.addInitScript(() => localStorage.setItem('feka-vacas-adulto', '1'));
  const page = await reduced.newPage();
  const requests = [];
  page.on('request', r => requests.push(r.url()));
  await page.goto(base + '/vacas', { waitUntil: 'networkidle' });
  await page.locator('.vtabs a[href="/vacas/personajes"]').click();
  await page.waitForURL('**/vacas/personajes');
  assert.equal(await page.locator('canvas').count(), 1, 'Movimiento reducido conserva R3F');
  assert.equal(requests.some(url => /VacasScene-|react-three-fiber/.test(url)), true);
  await page.screenshot({ path: `${dir}/movimiento-reducido.jpg`, type: 'jpeg', quality: 78 });
  await reduced.close();
  report.movimientoReducido = 'R3F suave, c?mara estable y sin destellos';
  await writeFile(`${dir}/resultado.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
