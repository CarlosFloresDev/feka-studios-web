import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import files from '../worker/ceniza-assets.mjs';

const base = process.argv[2] || 'http://127.0.0.1:8787';
const output = 'capturas/ceniza-original';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = { pages: [], errors: [], ranking: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
  page.on('response', response => {
    if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`);
    if (new URL(response.url()).pathname === '/api/ceniza/ranking') report.ranking.push(response.status());
  });
  page.on('requestfailed', request => report.errors.push(`${request.failure()?.errorText} ${request.url()}`));
  for (const file of [...files].filter(file => file.endsWith('index.html'))) {
    const route = '/ceniza/' + file.replace(/index.html$/, '');
    const response = await page.goto(base + route, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    await page.mouse.move(1100, 450);
    await page.evaluate(() => window.scrollTo(0, Math.min(900, document.body.scrollHeight)));
    await page.waitForTimeout(250);
    await page.evaluate(() => window.scrollTo(0, 0));
    if (route.split('/').length <= 4) {
      await page.screenshot({ path: `${output}/movimiento-${route.replaceAll('/', '-')}.png` });
    }
    report.pages.push(route);
    console.log(`Movimiento y red: ${route}`);
  }
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.ranking, [200]);
} finally {
  await fs.writeFile(`${output}/informe-movimiento.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
