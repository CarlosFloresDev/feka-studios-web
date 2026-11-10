# Ceniza Neón: mantenimiento

Integración de una identidad existente en Feka Studios. Las siete rutas son `/ceniza`, `/ceniza/universo`, `/ceniza/wiki`, `/ceniza/bitacora`, `/ceniza/banda-sonora`, `/ceniza/hoja-de-ruta` y `/ceniza/descargar`. `CenizaPage.tsx` resuelve la navegación, el historial, los estados y los textos de interfaz; `data.ts` reúne los datos y la selección ES/EN.

## Contenido y procedencia

El proyecto de origen `D:/descargas/Proyectos personales/Ceniza-Neon-Web` se trata exclusivamente como fuente de lectura. `scripts/ceniza-import.mjs` importa contenido editorial, wiki, historial, descargas y banda sonora en `original.json`; `english.ts` mantiene las traducciones editoriales. Revisar ambos al actualizar contenido, conservando nombres propios y títulos originales de pistas.

`procedencia.json` registra los archivos originales y manifiestos de las 13 imágenes WebP seleccionadas, aproximadamente 1.58 MB en conjunto, guardadas en `public/media/ceniza/archivo`. La importación convierte con FFmpeg: ancho máximo de 1600 px para pinturas, 512 px para sprites y 650 px para personajes, calidad WebP 83. Bitácora y descarga reutilizan arte ambiental del juego; los rótulos distinguen ilustraciones de capturas. Las fuentes y sus licencias se sirven localmente desde `public/media/ceniza/fonts`. Las 21 pistas están en `public/media/ceniza/audio` y solo se solicitan al elegir una pista (`preload="none"`); no hay reproducción inicial automática.

## Identidad vigente y movimiento

La referencia visual vigente es la hoja `00-tokens` del origen, materializada aquí en `ceniza.css`: Permanent Marker para títulos, Caveat para notas manuscritas e Inter para lectura. La paleta principal conserva `#15131c`, `#f4ebdf`, `#f2a94e`, `#9cc3d9` y `#4a3d63`. La guía de documentación original que describe tipografía industrial pertenece a una etapa anterior. Mantener esta identidad al extender la integración; no generar ni modificar `DESIGN.md` o `PRODUCT.md` raíz para redefinirla.

`CenizaScene.tsx` se carga mediante React `lazy` cuando el contexto permite movimiento. R3F compone dos capas del arte, un sprite cuando corresponde, partículas de ceniza, haze, niebla, luz y bloom; limita el DPR a 1.35. La imagen HTML permanece como respaldo durante la carga, ante errores, WebGL no disponible o rendimiento inferior a 18 FPS durante la comprobación inicial. Movimiento reducido, ancho de hasta 700 px, ahorro de datos, conexiones lentas y hardware limitado favorecen el respaldo estático. El render se pausa fuera del viewport y con la pestaña oculta. GSAP usa `useGSAP` con ámbito local y `revertOnUpdate` para limpiar animaciones y ScrollTrigger al actualizar o desmontar.

En móvil, la tabla de controles mantiene Teclado, Mando y Acción visibles sin desplazamiento horizontal a 390 px; las demás tablas de la wiki conservan desplazamiento interno cuando lo necesitan.

## Ranking y comprobaciones

El ranking de descarga realiza un GET real a `https://ceniza-neon.chefsitturchey.workers.dev/api/ranking`, sin caché, con cancelación y timeout de 10 segundos. Valida la respuesta y muestra carga, resultados, vacío o error con reintento; presenta hasta 20 entradas. El producto no rellena fallos con un ranking inventado.

Desde la raíz, construir y abrir la vista previa en una terminal:

```powershell
npm.cmd run build
npm.cmd run preview -- --host 127.0.0.1
```

Con la vista previa activa, ejecutar en otra terminal:

```powershell
node scripts/ceniza-check.mjs
node scripts/vacas-check.mjs
```

`ceniza-check.mjs` comprueba las siete rutas, ES/EN, historial, búsqueda de wiki, audio bajo demanda, desbordamiento y estados del ranking, y guarda capturas e informe en `capturas/ceniza`. Intercepta el endpoint con respuestas sintéticas exclusivamente para pruebas; no envía esos resultados a la API real. `vacas-check.mjs` sirve como comprobación de regresión de la otra sección integrada.

La cobertura móvil es emulación de navegador, no una prueba en un teléfono físico. El ranking real no se ha comprobado por falta de acceso a red; las pruebas sintéticas no demuestran disponibilidad, CORS ni datos actuales del servicio. Estos comandos son de construcción y revisión local: no realizan despliegue.
