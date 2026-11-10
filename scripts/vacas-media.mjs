// Genera las imágenes de /vacas a partir del proyecto del juego (solo lectura).
// Arte a resolución de juego: se amplía ×2 con vecino más próximo y se guarda en webp.
// Uso: node scripts/vacas-media.mjs "D:/ruta/a/Vacas"
import sharp from 'sharp';
import path from 'node:path';

const src = process.argv[2];
if (!src) throw new Error('Falta la ruta del proyecto Vacas');
const out = path.resolve('public/media/vacas');
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

for (const [de, a] of lista) {
  const img = sharp(path.join(src, de));
  const { width, height } = await img.metadata();
  const info = await img
    .resize(width * 2, height * 2, { kernel: 'nearest' })
    .webp({ quality: 80, alphaQuality: 90, effort: 6 })
    .toFile(path.join(out, a + '.webp'));
  console.log(a, info.width + 'x' + info.height, Math.round(info.size / 1024) + ' KB');
}
