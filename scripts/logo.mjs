// Genera los logos de Feka Studios (SVG + PNG) en public/press y el favicon.
// Uso: node scripts/logo.mjs
import fs from 'node:fs';
import opentype from 'opentype.js';
import { chromium } from 'playwright';

const mark = JSON.parse(fs.readFileSync('src/brand/mark.json', 'utf8'));
const font = opentype.parse(fs.readFileSync('node_modules/@fontsource/big-shoulders-display/files/big-shoulders-display-latin-900-normal.woff').buffer);
const fontB = opentype.parse(fs.readFileSync('node_modules/@fontsource/big-shoulders-display/files/big-shoulders-display-latin-800-normal.woff').buffer);

function text(f, str, x, baseline, size, tracking = 0) {
  let d = '', cx = x;
  for (const ch of str) {
    const g = f.charToGlyph(ch);
    d += g.getPath(cx, baseline, size).toPathData(2);
    cx += (g.advanceWidth / f.unitsPerEm) * size + tracking;
  }
  return { d, width: cx - x - tracking };
}

const NEON = '#ff3d57', BONE = '#efe9f2', VOID = '#08070b';
const markG = (fill, s = 1, tx = 0, ty = 0) =>
  `<path transform="translate(${tx} ${ty}) scale(${s})" fill="${fill}" fill-rule="nonzero" d="${mark.path}"/>`;

// Horizontal: marca + FEKA / STUDIOS
const feka = text(font, 'FEKA', 0, 0, 100, 2);
const stud = text(fontB, 'STUDIOS', 0, 0, 30, 9.6);
function horizontal(markFill, textFill) {
  // Bloque de texto: FEKA (altura de mayúscula = 100) + STUDIOS debajo, ambos del mismo ancho.
  const cap = font.charToGlyph('F').getPath(0, 0, 100).getBoundingBox();
  const k = 100 / (cap.y2 - cap.y1); // escala para que la mayúscula mida 100
  const size = 100 * k, gap = 16;
  const tx = 92 * 1.3 + 30;
  const a = text(font, 'FEKA', tx, 100, size, 3);
  const sCap = fontB.charToGlyph('S').getPath(0, 0, 100).getBoundingBox();
  const sk = 30 / (sCap.y2 - sCap.y1) * 100;
  const raw = text(fontB, 'STUDIOS', 0, 0, sk, 0);
  const track = (a.width - raw.width) / 6;
  const b = text(fontB, 'STUDIOS', tx, 100 + gap + 30, sk, track);
  const total = 100 + gap + 30; // altura del bloque
  const ms = total / 84, my = -8 * ms; // la marca ocupa y 8..92
  const w = tx + a.width;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -6 ${Math.ceil(w) + 6} ${total + 12}" role="img" aria-label="Feka Studios">${markG(markFill, ms, -14 * ms, my)}<path fill="${textFill}" d="${a.d}"/><path fill="${textFill}" d="${b.d}"/></svg>`;
}
function markOnly(fill, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Feka Studios">${bg ? `<rect width="100" height="100" rx="0" fill="${bg}"/>` : ''}${markG(fill, bg ? 0.78 : 1, bg ? 11 : 0, bg ? 11 : 0)}</svg>`;
}

const out = {
  'public/press/feka-logo.svg': horizontal(NEON, BONE),
  'public/press/feka-logo-negro.svg': horizontal(VOID, VOID),
  'public/press/feka-logo-blanco.svg': horizontal(BONE, BONE),
  'public/press/feka-marca.svg': markOnly(NEON),
  'public/press/feka-marca-fondo.svg': markOnly(NEON, VOID),
  'public/favicon.svg': markOnly(NEON, VOID),
};
fs.mkdirSync('public/press', { recursive: true });
for (const [f, s] of Object.entries(out)) fs.writeFileSync(f, s);
fs.writeFileSync('src/brand/wordmark.json', JSON.stringify({ feka: feka.d, featWidth: feka.width }));

// PNG
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
async function png(svgFile, pngFile, width, bg) {
  const svg = fs.readFileSync(svgFile, 'utf8');
  await page.setContent(`<html><body style="margin:0;background:${bg || 'transparent'}"><div style="width:${width}px;padding:${Math.round(width * 0.06)}px;display:inline-block">${svg.replace('<svg ', '<svg style="width:100%;display:block" ')}</div></body></html>`);
  const el = await page.$('div');
  await el.screenshot({ path: pngFile, omitBackground: !bg });
}
await png('public/press/feka-logo.svg', 'public/press/feka-logo-2400.png', 2400, VOID);
await png('public/press/feka-logo-blanco.svg', 'public/press/feka-logo-transparente.png', 2400);
await png('public/press/feka-marca-fondo.svg', 'public/press/feka-marca-1024.png', 1024, VOID);
await png('public/press/feka-marca-fondo.svg', 'public/og-marca.png', 512, VOID);
await browser.close();
console.log('logos listos');
