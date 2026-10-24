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

export interface GalleryAuditEntry {
  id: number;
  occurred_at: string;
  actor: string;
  action: string;
  target_type: string;
  target_id: string;
  details?: Record<string, unknown>;
  org_id?: number;
}

const audit = (
  id: number,
  minutesAgo: number,
  actor: string,
  action: string,
  target: string,
  details?: Record<string, unknown>,
  org_id?: number,
): GalleryAuditEntry => {
  const [target_type, target_id = ''] = target.split(':');
  return {
    id,
    occurred_at: new Date(NOW - minutesAgo * 60_000).toISOString(),
    actor,
    action,
    target_type: target_type!,
    target_id,
    details,
    org_id,
  };
};

export const AUDIT = [
  audit(6, 3, 'ada@acme.example', 'alert_rule.update', 'alert_rule:12', { name: 'High CPU', threshold: 90 }, 7),
  audit(5, 18, 'ada@acme.example', 'agent.adopt', 'agent:web-01', { hostname: 'web-01.prod.internal' }, 7),
  audit(4, 42, 'ops@logmon.example', 'license.extend_trial', 'license:3', { days: 14 }, 7),
  audit(3, 95, 'hank@acme.example', 'profile.create', 'profile:web', undefined, 7),
  audit(2, 240, 'ada@acme.example', 'user.login_failed', 'user:5', undefined, 7),
  audit(1, 1440, 'publish-pipeline', 'chart_versions.refresh', 'chart_versions'),
];

export const AUDIT_LABELS = new Map([
  ['alert_rule.update', 'Alert rule updated'],
  ['agent.adopt', 'Agent adopted'],
  ['license.extend_trial', 'Trial extended'],
  ['profile.create', 'Profile created'],
  ['user.login_failed', 'Failed sign-in'],
]);

const USAGE_STEP = 1_800_000;

function usageSeries(seed: number, points: number, base: number, swing: number, max: number) {
  const r = rng(seed);
  let v = base;
  return Array.from({ length: points }, (_, i) => {
    v = Math.min(max, Math.max(base * 0.3, v + (r() - 0.48) * swing));
    return { time: new Date(NOW - (points - 1 - i) * USAGE_STEP).toISOString(), value: v };
  });
}

const GiB = 1024 ** 3;

const usageResource = (
  kind: 'cpu' | 'memory' | 'storage',
  component: 'server' | 'postgres' | 'influxdb' | 'data',
  limit: number | undefined,
  points: { time: string; value: number }[],
  level: 'ok' | 'warn' | 'critical' | 'unknown' = 'ok',
  hint?: string,
) => ({
  kind,
  component,
  unit: kind === 'cpu' ? ('cores' as const) : ('bytes' as const),
  limit,
  current: points.at(-1)?.value,
  level,
  hint,
  points,
});

export const USAGE = {
  range: '24h' as const,
  step_seconds: USAGE_STEP / 1000,
  instance_class: 'small',
  resources: [
    usageResource('cpu', 'server', 0.5, usageSeries(21, 48, 0.12, 0.05, 0.45)),
    usageResource('cpu', 'postgres', 0.5, usageSeries(22, 48, 0.08, 0.03, 0.4)),
    usageResource('cpu', 'influxdb', 0.5, usageSeries(23, 48, 0.2, 0.06, 0.48)),
    usageResource('memory', 'server', GiB, usageSeries(24, 48, 0.35 * GiB, 0.04 * GiB, 0.6 * GiB)),
    usageResource('memory', 'postgres', GiB, usageSeries(25, 48, 0.5 * GiB, 0.03 * GiB, 0.7 * GiB)),
    usageResource(
      'memory',
      'influxdb',
      GiB,
      usageSeries(26, 48, 0.86 * GiB, 0.02 * GiB, 0.95 * GiB),
      'critical',
      'InfluxDB memory is over 80% of its limit.',
    ),
    usageResource(
      'storage',
      'postgres',
      10 * GiB,
      usageSeries(27, 48, 7.8 * GiB, 0.05 * GiB, 8.5 * GiB),
      'warn',
      'PostgreSQL storage is over 75% of its volume.',
    ),
    usageResource('storage', 'influxdb', undefined, usageSeries(28, 48, 2 * GiB, 0.02 * GiB, 3 * GiB), 'unknown'),
    { kind: 'storage' as const, component: 'data' as const, unit: 'bytes' as const, level: 'unknown' as const, points: [] },
  ],
  ingest: usageSeries(29, 48, 1200, 300, 4000).map((p, i) => ({
    time: p.time,
    log_lines_per_min: p.value,
    log_bytes_per_min: p.value * 180,
    metric_points_per_min: 900 + (i % 6) * 40,
    agents: i < 30 ? 4 : 5,
  })),
};
