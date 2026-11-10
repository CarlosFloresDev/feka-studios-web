# Ceniza Neón: mantenimiento

Integración de una identidad existente en Feka Studios. Las siete rutas son `/ceniza`, `/ceniza/universo`, `/ceniza/wiki`, `/ceniza/bitacora`, `/ceniza/banda-sonora`, `/ceniza/hoja-de-ruta` y `/ceniza/descargar`. `CenizaPage.tsx` resuelve la navegación, el historial, los estados y los textos de interfaz; `data.ts` reúne los datos y la selección ES/EN.

## Contenido y procedencia

El proyecto de origen `D:/descargas/Proyectos personales/Ceniza-Neon-Web` se trata exclusivamente como fuente de lectura. `scripts/ceniza-import.mjs` importa contenido editorial, wiki, historial, descargas y banda sonora en `original.json`; `english.ts` mantiene las traducciones editoriales. Revisar ambos al actualizar contenido, conservando nombres propios y títulos originales de pistas.

`procedencia.json` registra los archivos originales y manifiestos de las 13 imágenes WebP seleccionadas, aproximadamente 1.58 MB en conjunto, guardadas en `public/media/ceniza/archivo`. La importación convierte con FFmpeg: ancho máximo de 1600 px para pinturas, 512 px para sprites y 650 px para personajes, calidad WebP 83. Bitácora y descarga reutilizan arte ambiental del juego; los rótulos distinguen ilustraciones de capturas. Las fuentes y sus licencias se sirven localmente desde `public/media/ceniza/fonts`. Las 21 pistas están en `public/media/ceniza/audio` y solo se solicitan al elegir una pista (`preload="none"`); no hay reproducción inicial automática.

## Identidad vigente y movimiento

La referencia visual vigente es la hoja `00-tokens` del origen, materializada aquí en `ceniza.css`: Permanent Marker para títulos, Caveat para notas manuscritas e Inter para lectura. La paleta principal conserva `#15131c`, `#f4ebdf`, `#f2a94e`, `#9cc3d9` y `#4a3d63`. La guía de documentación original que describe tipografía industrial pertenece a una etapa anterior. Mantener esta identidad al extender la integración; no generar ni modificar `DESIGN.md` o `PRODUCT.md` raíz para redefinirla.

`CenizaScene.tsx` carga una escena compartida transparente sobre el arte HTML permanente a tama?o cover. A?ade una capa del arte en Z, luces de ne?n, part?culas de ceniza y niebla. DPR [1, 1.5], 55 part?culas en m?vil y 150 en escritorio, sin postprocesado. El scroll y el dedo controlan la c?mara; no se necesita permiso de giroscopio. Movimiento reducido conserva el 3D con velocidad al 16 %, c?mara estable y sin destellos; saveData, errores de WebGL o p?rdida de contexto conservan la imagen. Se pausa fuera del viewport y con la pesta?a oculta. GSAP a?ade parallax, barridos de luz, m?scaras, enfoque y revelado por l?neas; useGSAP limpia efectos al cambiar de ruta o idioma.

`verify-experience.mjs after` guarda capturas temporales a 0, 300, 1000 y 2500 ms y a tres alturas de scroll en las trece rutas, tanto a 1440 px como a 390?844 con DPR 3 y toque. `experience-check.mjs` confirma p?xeles WebGL en el framebuffer transparente, DPR, cover, m?scaras de texto, parallax, Cordura, sangre, las tres zonas, vuelta al inicio, ES/EN/ES y los respaldos saveData/WebGL. Prueba movimiento reducido en m?vil y escritorio. Las capturas `confirmed-*` y `assertions.json` recogen esa comprobaci?n con contextos nuevos para cada modo.
