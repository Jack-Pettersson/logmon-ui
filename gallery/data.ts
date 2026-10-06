const BASE = Date.UTC(2026, 9, 1, 12, 0, 0);

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function metricSeries(points = 60, stepMs = 60_000) {
  const r = rng(7);
  let cpu = 35;
  let mem = 58;
  return Array.from({ length: points }, (_, i) => {
    cpu = Math.min(98, Math.max(4, cpu + (r() - 0.48) * 14));
    mem = Math.min(95, Math.max(30, mem + (r() - 0.5) * 3));
    return { time: BASE + i * stepMs, cpu: +cpu.toFixed(1), memory: +mem.toFixed(1) };
  });
}

export const LEVELS = ['FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'] as const;

export function logHistogram(points = 48, stepMs = 300_000) {
  const r = rng(11);
  return Array.from({ length: points }, (_, i) => {
    const burst = i > 30 && i < 36 ? 6 : 1;
    return {
      time: BASE + i * stepMs,
      FATAL: r() > 0.95 ? 1 : 0,
      ERROR: Math.round(r() * 4 * burst),
      WARN: Math.round(r() * 9),
      INFO: Math.round(20 + r() * 40),
      DEBUG: Math.round(r() * 25),
      TRACE: Math.round(r() * 10),
    };
  });
}

export const AGENTS = [
  { id: 'a1', host: 'web-01.eu-north', ip: '10.0.1.12', profile: 'production', status: 'adopted', conn: 'connected', seen: BASE - 4_000 },
  { id: 'a2', host: 'web-02.eu-north', ip: '10.0.1.13', profile: 'production', status: 'adopted', conn: 'connected', seen: BASE - 9_000 },
  { id: 'a3', host: 'db-primary', ip: '10.0.2.4', profile: 'database', status: 'adopted', conn: 'disconnected', seen: BASE - 3_600_000 },
  { id: 'a4', host: 'build-runner-7', ip: '10.0.9.77', profile: 'default', status: 'pending', conn: 'connected', seen: BASE - 2_000 },
  {
    id: 'a5',
    host: 'edge-cache-3',
    ip: '10.0.4.31',
    profile: 'default',
    status: 'adoption_failed',
    conn: 'never_connected',
    seen: BASE - 86_400_000,
  },
] as const;

export const NOW = BASE;
