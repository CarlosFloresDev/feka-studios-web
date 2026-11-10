-- Ranking online del Boss Rush. Una fila por victoria enviada desde el juego.
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  seconds REAL NOT NULL,
  hits INTEGER NOT NULL,
  version TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS runs_by_time ON runs (seconds, hits);
CREATE INDEX IF NOT EXISTS runs_by_ip ON runs (ip_hash, created_at);
