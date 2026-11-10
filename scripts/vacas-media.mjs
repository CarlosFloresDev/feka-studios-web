// Genera las imágenes de /vacas a partir del proyecto del juego (solo lectura).
// Arte a resolución de juego: se amplía ×2 con vecino más próximo y se guarda en webp.
// Uso: node scripts/vacas-media.mjs "D:/ruta/a/Vacas"
import sharp from 'sharp';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const src = process.argv[2];
if (!src) throw new Error('Falta la ruta del proyecto Vacas');
const out = path.resolve('public/media/vacas');
await mkdir(out, { recursive: true });
const P = 'Graphics/Pictures/', B = 'Graphics/Battlers/', C = 'diseno/capturas/';

// prefijo v_ = se ve normal · prefijo g_ = gore, va tras el aviso
const lista = [
  [P + 'screamer_5.png', 'v_rejilla'],
  [P + 'screamer_1.png', 'v_susto_cristal'],
  [P + 'screamer_3.png', 'g_susto_vaca'],
  [C + 'ui_titulo.png', 'v_titulo'],
  [C + 'ui_vn.png', 'v_dialogo'],
  [C + 'ui_estado.png', 'v_estado'],
  [C + 'ui_hud.png', 'v_linterna'],
  [C + 'ui_combate_acto1_normal.png', 'v_combate_salon'],
  [C + 'ui_combate_acto4_jefe.png', 'v_combate_tunel'],
  [C + 'ui_combate_acto2_normal.png', 'g_combate_matadero'],
  [C + 'ui_combate_acto3_jefe.png', 'g_combate_tarro'],
  [B + 'enemigo_cencerro.png', 'v_vision_cencerro'],
  [B + 'enemigo_factura.png', 'v_vision_factura'],
  [B + 'enemigo_pastor.png', 'v_vision_pastor'],
  [B + 'enemigo_moscas.png', 'v_vision_moscas'],
  [B + 'enemigo_canal.png', 'g_vision_canal'],
  [B + 'enemigo_vaca.png', 'g_vision_vaca'],
  [B + 'enemigo_madre.png', 'g_vision_madre'],
  [B + 'enemigo_tarro.png', 'g_vision_tarro'],
  [P + 'retrato_steven_neutral.png', 'v_ret_steven'],
  [P + 'retrato_madre_ira.png', 'v_ret_madre'],
  [P + 'retrato_dog_neutral.png', 'v_ret_perro'],
  [P + 'retrato_cripps_neutral.png', 'v_ret_capataz'],
  [P + 'retrato_lucy_neutral.png', 'v_ret_vecina'],
  [P + 'retrato_guernsey_susurro.png', 'v_ret_vaca'],
];

// Material reciente: se lee del juego y solo se escribe dentro de esta web.
const recientes = [
  ['Graphics/Titles/vacas_titulo.png', 'v_portada'],
  ...[22, 23, 24, 25, 26, 27].map(n => [C + `acto5_${n}.png`, `v_acto5_${n}`]),
];
for (const [de, a] of recientes) {
  const info = await sharp(path.join(src, de))
    .resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true, kernel: 'nearest' })
    .webp({ quality: 82, effort: 6 }).toFile(path.join(out, a + '.webp'));
  console.log(a, info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
}
// Detalle de la lámina fase2: Steven, sin rótulos internos ni otros personajes.
await sharp(path.join(src, C + 'fase2_personajes_detalle.png'))
  .extract({ left: 0, top: 30, width: 1800, height: 690 })
  .resize(1600, null, { kernel: 'nearest' })
  .webp({ quality: 82, effort: 6 }).toFile(path.join(out, 'v_proceso_steven.webp'));

for (const [de, a] of lista) {
  const img = sharp(path.join(src, de));
  const { width, height } = await img.metadata();
  const info = await img
    .resize(width * 2, height * 2, { kernel: 'nearest' })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(path.join(out, a + '.webp'));
  console.log(a, info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
}
