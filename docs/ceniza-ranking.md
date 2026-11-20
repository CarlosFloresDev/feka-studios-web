# Ranking de Ceniza en Feka

El worker `worker/index.mjs` sirve `/api/ceniza/ranking` con la misma D1 y resuelve los archivos originales bajo `/ceniza/`, incluido su 404. La p?gina `/ceniza/descargar/` consulta el endpoint del mismo dominio. El resto de Feka conserva el fallback SPA de Wrangler.

Binding D1: `DB`, base `ceniza-ranking`, ID `727e64fc-e9e2-4aa3-82fe-bd5688627e91`. Es la misma base que usa el juego publicado; no crear ni vaciar tablas en producción. El worker de `Ceniza-Neon-Web` se utilizó únicamente como fuente de lectura.

La próxima versión del juego debe enviar puntuaciones a:

```text
https://feka-studios.pages.dev/api/ceniza/ranking
```

En un dominio personalizado de Feka, usar ese dominio con la misma ruta.

- `GET`: `{ "ranking": [{ "name": "Portador", "seconds": 60, "hits": 2, "date": "…" }] }`. Top 20 por segundos, golpes e ID, ascendentes.
- `POST`, `Content-Type: application/json`: `{ "name": "Portador", "seconds": 60, "hits": 2, "version": "0.3.0" }`. Respuesta: `{ "place": 1 }`.
- `OPTIONS`: 204. CORS `*`, métodos GET/POST/OPTIONS, cabecera Content-Type. Respuestas JSON sin caché.

Se conservan las reglas del original: entre 30 y 14400 segundos, golpes truncados entre 0 y 9999, nombre normalizado y saneado a 12 caracteres (por defecto Portador), versión limitada a 20 caracteres y hasta 20 envíos por hora por hash de IP. El tiempo se guarda redondeado a décimas. Los errores de formato devuelven 400, límite 429, método 405 y fallo de D1 503.

`node --test scripts/ranking-worker.test.mjs` verifica el contrato con D1 simulado, sin escribir puntuaciones reales. `npx wrangler dev --local` permite comprobar API y assets juntos; Vite por sí solo sirve el frontend y no ejecuta el worker. No se requiere modificar el worker antiguo para mantener compatibilidad con versiones publicadas del juego.

Para preparar la D1 de desarrollo, ejecutar `npx wrangler d1 execute ceniza-ranking --local --file worker/schema.sql`. El esquema se copió del original; este comando solo inicializa almacenamiento local. No usar `--remote` en las comprobaciones.
