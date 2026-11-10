// Worker de la web: sirve las páginas estáticas y la API del ranking online del Boss Rush.
// GET  /api/ceniza/ranking        -> top 20 {name, seconds, hits, date}
// POST /api/ceniza/ranking        -> {name, seconds, hits, version} -> {place}
// El juego funciona sin conexión: si esta API no responde, solo deja de verse el top online.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const TOP = 20;
// Límites razonables para una ruta de cinco jefes: evita tiempos imposibles o basura.
const MIN_SECONDS = 30;
const MAX_SECONDS = 4 * 3600;
const MAX_PER_HOUR = 20;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...CORS },
  });

function cleanName(value) {
  const name = String(value ?? "")
    .normalize("NFC")
    .replace(/[^\p{L}\p{N} _.\-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12);
  return name || "Portador";
}

async function hashIp(request) {
  const ip = request.headers.get("CF-Connecting-IP") || "local";
  const data = new TextEncoder().encode("ceniza-ranking:" + ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function top(env) {
  const { results } = await env.DB.prepare(
    "SELECT name, seconds, hits, created_at AS date FROM runs ORDER BY seconds ASC, hits ASC, id ASC LIMIT ?",
  ).bind(TOP).all();
  return results;
}

async function submit(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "JSON inv?lido" }, 400);
  const seconds = Number(body.seconds);
  const hits = Math.trunc(Number(body.hits));
  if (!Number.isFinite(seconds) || seconds < MIN_SECONDS || seconds > MAX_SECONDS)
    return json({ error: "Tiempo fuera de rango" }, 400);
  if (!Number.isFinite(hits) || hits < 0 || hits > 9999) return json({ error: "Golpes fuera de rango" }, 400);
  const ipHash = await hashIp(request);
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM runs WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')",
  ).bind(ipHash).first();
  if (recent && recent.n >= MAX_PER_HOUR) return json({ error: "Demasiados envíos, prueba más tarde" }, 429);
  const name = cleanName(body.name);
  const version = String(body.version ?? "").slice(0, 20);
  await env.DB.prepare("INSERT INTO runs (name, seconds, hits, version, ip_hash) VALUES (?, ?, ?, ?, ?)")
    .bind(name, Math.round(seconds * 10) / 10, hits, version, ipHash)
    .run();
  const better = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM runs WHERE seconds < ? OR (seconds = ? AND hits < ?)",
  ).bind(seconds, seconds, hits).first();
  return json({ place: (better?.n ?? 0) + 1 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/ceniza/ranking") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
      try {
        if (request.method === "GET") return json({ ranking: await top(env) });
        if (request.method === "POST") return await submit(request, env);
      } catch {
        return json({ error: "Ranking no disponible" }, 503);
      }
      return json({ error: "Método no permitido" }, 405);
    }
    return env.ASSETS.fetch(request);
  },
};
