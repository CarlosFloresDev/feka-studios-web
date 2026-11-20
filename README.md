# Feka Studios — sitio web

Sitio del estudio independiente **Feka Studios** (Arequipa, Perú): presentación del equipo, páginas de los juegos (Ceniza Neón, Vacas y Una forma de querer), bitácora y kit de prensa.

**En línea:** https://feka-studios.pages.dev

## Stack

- **React 19 + Vite** para el sitio.
- **Cloudflare Workers** (`worker/`) para servir el sitio y la API, con **D1** (`worker/schema.sql`).
- Todo el contenido editable está en `src/content.ts`.

## Desarrollo

```bash
npm install
npm run dev       # servidor local de Vite
npm run build     # genera dist/
npx wrangler deploy
```
