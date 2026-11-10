// npm run preview -- --host 127.0.0.1; node scripts/ceniza-check.mjs
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.argv[2] || 'http://127.0.0.1:4173';
const dir = process.argv[3] || 'capturas/ceniza';
const paths = ['', 'universo', 'wiki', 'bitacora', 'banda-sonora', 'hoja-de-ruta', 'descargar'];
const endpoint = 'https://ceniza-neon.chefsitturchey.workers.dev/api/ranking';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const report = {};
try {
  for (const [name, width, height] of [['escritorio', 1440, 900], ['movil', 390, 844]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390, deviceScaleFactor: 1 });
    let mode = 'ready';
    // Datos sintéticos solo en la prueba. Nunca se envían a la API real.
    await context.route(endpoint, async route => {
      await new Promise(resolve => setTimeout(resolve, 700));
      if (mode === 'offline') return route.abort('internetdisconnected');
      const body = mode === 'empty' ? { ranking: [] } : mode === 'invalid' ? { error: 'test' } : { ranking: [{ name: '<Test>', seconds: 125.3, hits: 4, date: '2026-11-06' }, { name: 'Prueba', seconds: 147, hits: 8 }] };
      return route.fulfill({ json: body });
    });
    const page = await context.newPage();
    const errors = [], expectedNetworkErrors = [], requests = [];
    page.on('pageerror', error => errors.push(String(error)));
    page.on('console', message => { if (message.type() === 'error') { if (mode === 'offline' && /net::ERR_INTERNET_DISCONNECTED/.test(message.text())) expectedNetworkErrors.push(message.text()); else errors.push(message.text()); } });
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    page.on('request', request => requests.push(request.url()));
    const shot = tag => page.screenshot({ path: `${dir}/${name}-${tag}.jpg`, type: 'jpeg', quality: 80 });
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const routes = {};
    for (const id of paths) {
      const path = '/ceniza' + (id ? '/' + id : '');
      const response = await page.goto(base + path, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      await page.locator('#cn-title').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1000);
      assert.equal(await page.locator('.cn-tabs a[aria-current="page"]').getAttribute('href'), path);
      assert.equal(await overflow(), 0, path);
      const hero = await page.locator('.cn-hero').boundingBox();
      assert.ok(hero.height >= height - 1);
      if (width === 390) assert.equal(await page.locator('canvas').count(), 0);
      else assert.ok(await page.locator('canvas').count() === 1 || await page.locator('.cn-hero').getAttribute('data-renderer') === 'static', 'R3F o respaldo por rendimiento');
      await shot(id || 'inicio');
      await page.evaluate(() => window.scrollTo({ top: document.getElementById('cn-content').offsetTop - 125, behavior: 'instant' }));
      await page.locator('#cn-content img').evaluateAll(async imgs => Promise.all(imgs.map(async img => { img.loading = 'eager'; await img.decode(); })));
      await page.waitForTimeout(250);
      assert.equal(await overflow(), 0);
      await shot(`${id || 'inicio'}-contenido`);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.screenshot({ path: `${dir}/${name}-${id || 'inicio'}-completa.jpg`, type: 'jpeg', quality: 75, fullPage: true });
      console.log(`${name}: ${path}`);
      if (id === 'wiki') {
        const content = await page.locator('#controles').innerText();
        for (const button of ['L1', 'L3', 'R1', 'Options', '\u25a1', '\u2715', '\u25cb']) assert.ok(content.includes(button), button);
        assert.match(content, /[\u25b3\u25b5\u25b2]/, 'Triangulo PlayStation');
        await page.locator('#cn-search').fill('zz-no-existe');
        assert.equal(await page.locator('.cn-wiki details').count(), 0);
        await page.locator('#cn-search').fill('');
        await page.locator('.cn-wiki summary').first().click();
        await shot('wiki-abierta');
      }
      if (id === 'banda-sonora') {
        assert.equal(requests.some(url => url.includes('/audio/')), false, 'No audio antes de pedirlo');
        await page.locator('.cn-tracks button').first().click();
        await page.locator('audio').waitFor();
        assert.ok((await page.locator('audio').getAttribute('src')).endsWith('/menu.mp3'));
        await page.locator('.cn-tracks button').nth(1).click();
        assert.equal(await page.locator('audio').count(), 1);
        await page.locator('.cn-tracks button').nth(1).click();
        assert.equal(await page.locator('audio').count(), 0);
      }
      if (id === 'descargar') {
        await page.locator('.cn-ranking-content[data-state="ready"]').waitFor();
        assert.equal(await page.locator('.cn-scores li').count(), 2);
        assert.equal(await page.locator('.cn-scores strong').first().innerText(), '<Test>');
        assert.ok(await page.locator('a[href$="CenizaNeon-0.2.1-alpha-windows.zip"]').count());
        assert.ok(await page.locator('a[href="https://chefsitturchey.itch.io/ceniza-neon"]').count());
      }
      routes[path] = { status: response.status(), overflow: await overflow(), hero: Math.round(hero.height) };
    }
    for (const lang of ['en', 'es']) {
      await page.getByRole('button', { name: lang.toUpperCase(), exact: true }).click();
      for (const id of paths) {
        await page.goto(base + '/ceniza' + (id ? '/' + id : ''), { waitUntil: 'networkidle' });
        assert.equal(await page.locator('html').getAttribute('lang'), lang);
        assert.equal(await overflow(), 0);
        if (lang === 'en') await shot(`english-${id || 'inicio'}`);
      }
    }
    await page.evaluate(() => { window.__sentinel = 1; });
    await page.locator('.cn-tabs a[href="/ceniza/universo"]').click();
    await page.waitForURL('**/ceniza/universo');
    assert.equal(await page.evaluate(() => window.__sentinel), 1);
    assert.equal(await page.locator('#cn-title').evaluate(el => el === document.activeElement), true);
    await page.goBack(); await page.waitForURL('**/ceniza/descargar');
    await page.goForward(); await page.waitForURL('**/ceniza/universo');
    for (const next of ['empty', 'invalid', 'offline']) {
      mode = next;
      await page.goto(base + '/ceniza/descargar', { waitUntil: 'domcontentloaded' });
      await page.locator('.cn-ranking-content[data-state="loading"]').waitFor();
      await page.locator(`.cn-ranking-content[data-state="${next === 'empty' ? 'ready' : 'error'}"]`).waitFor();
      await page.locator('.cn-ranking').scrollIntoViewIfNeeded();
      await shot(`ranking-${next}`);
    }
    mode = 'ready';
    await page.getByRole('button', { name: 'Reintentar' }).click();
    await page.locator('.cn-ranking-content[data-state="ready"]').waitFor();
    await page.goto(base + '/ceniza/no-existe', { waitUntil: 'networkidle' });
    assert.match(await page.locator('h1').innerText(), /señal/);
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    assert.ok(await page.locator('a[href="/ceniza"]').count());
    assert.equal(await overflow(), 0);
    assert.deepEqual(errors, []);
    report[name] = { routes, errors, expectedNetworkErrors };
    await context.close();
    console.log(`${name}: rutas, ES/EN, historial, wiki, audio y ranking correctos`);
  }
  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await reduced.newPage(), requests = [];
  page.on('request', request => requests.push(request.url()));
  await page.goto(base + '/ceniza', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('canvas').count(), 0);
  assert.equal(requests.some(url => /CenizaScene-|dist-.*\.js/.test(url)), false);
  await page.screenshot({ path: `${dir}/movimiento-reducido.jpg`, type: 'jpeg' });
  await reduced.close();
  await writeFile(`${dir}/resultado.json`, JSON.stringify(report, null, 2));
} finally { await browser.close(); }
