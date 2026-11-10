# Ceniza Neón original en Feka

`npm run build` ejecuta primero `scripts/importar-ceniza.mjs`. Lee el `dist/` existente del proyecto hermano `../Ceniza-Neon-Web` y lo copia en `public/ceniza/`. No ejecuta el build de origen ni escribe en esa carpeta. Para usar otra copia del build: `node scripts/importar-ceniza.mjs "ruta/al/dist"`.

La importación conserva textos, estilos y archivos binarios; solo adapta rutas al prefijo `/ceniza/`, el dominio público y `/api/ceniza/ranking`. Descubre los nombres de primer nivel del build. Genera `worker/ceniza-assets.mjs` y copia las reglas de cabeceras al bloque gestionado de `public/_headers`, limitado a Ceniza.

El worker resuelve directorios a su `index.html` explícito, redirige las páginas sin barra final y devuelve el `404.html` original con estado 404 para rutas desconocidas. Wrangler usa `html_handling: none`; el fallback SPA se mantiene para la portada y Vacas. Los componentes de atmósfera compartidos permanecen porque Vacas los utiliza.

Comprobaciones locales (sin desplegar):

```sh
npm run build
npx wrangler d1 execute ceniza-ranking --local --file worker/schema.sql
npx wrangler dev --local --port 8787
node --test scripts/ranking-worker.test.mjs
node scripts/verificar-ceniza-original.mjs
node scripts/verificar-ceniza-movimiento.mjs
```

La comparación sirve el original por separado en el puerto 8790, solo en lectura, y captura todas sus páginas a 1440 × 900. Usa movimiento reducido para estabilizar la comparación, con tolerancia de rasterizado de 8/255 por canal y hasta 0,1 % de píxeles, y comprueba igualdad de textos. También verifica todos los archivos por red y por bytes, audio, búsqueda, cabeceras, redirecciones, 404, portada y rutas de Vacas. El segundo script recorre todas las páginas con las animaciones activadas y consulta la D1 local real. Informes y capturas: `capturas/ceniza-original/`.
