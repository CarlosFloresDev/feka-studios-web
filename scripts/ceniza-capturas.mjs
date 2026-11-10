// Planchas de revisión: solo las capturas producidas por ceniza-check.mjs.
import { chromium } from 'playwright';
import { readdir, readFile } from 'node:fs/promises';
const dir = 'capturas/ceniza';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  for (const group of ['heroes', 'lectura']) {
    const names = (await readdir(dir)).filter(name => name.endsWith('.jpg') && (group === 'heroes' ? /^(escritorio|movil)-(inicio|universo|wiki|bitacora|banda-sonora|hoja-de-ruta|descargar)\.jpg$/.test(name) : /^(escritorio|movil)-(inicio|universo|wiki|bitacora|banda-sonora|hoja-de-ruta|descargar)-contenido\.jpg$/.test(name)));
    const cells = await Promise.all(names.map(async name => `<figure><figcaption>${name}</figcaption><img src="data:image/jpeg;base64,${(await readFile(`${dir}/${name}`)).toString('base64')}"></figure>`));
    await page.setContent(`<html><style>body{margin:0;padding:20px;background:#e5e5e5;font:14px system-ui}main{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}figure{margin:0;background:white;padding:10px}figcaption{margin:0 0 8px}img{width:100%;height:300px;object-fit:contain;object-position:top;background:#17141d}</style><main>${cells.join('')}</main></html>`);
    await page.screenshot({ path: `${dir}/revision-${group}.jpg`, fullPage: true, type: 'jpeg', quality: 85 });
  }
  for (const [name, width, height] of [['escritorio', 1440, 900], ['movil', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:4173/ceniza/wiki', { waitUntil: 'networkidle' });
    await page.evaluate(() => { const el = document.querySelector('#controles .cn-table-scroll'); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 145, behavior: 'instant' }); });
    await page.screenshot({ path: `${dir}/${name}-controles.jpg`, type: 'jpeg', quality: 85 });
    if (width === 390) {
      const scroll = await page.locator('#controles .cn-table-scroll').evaluate(el => { el.scrollLeft = el.scrollWidth; return el.scrollLeft; });
      if (scroll !== 0) throw new Error('Los controles deben caber completos en móvil');
      await page.screenshot({ path: `${dir}/${name}-controles-playstation.jpg`, type: 'jpeg', quality: 85 });
    }
  }
} finally { await browser.close(); }
