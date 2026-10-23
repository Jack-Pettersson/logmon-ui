import { describe, expect, it } from 'vitest';
import { usageHints, usageMeterHint, usagePercentRows, type InstanceUsage, type UsageResource } from '../../src/charts/InstanceUsage.tsx';

const res = (over: Partial<UsageResource>): UsageResource => ({
  kind: 'memory',
  component: 'server',
  unit: 'bytes',
  level: 'ok',
  points: [],
  ...over,
});

const usage = (resources: UsageResource[]): InstanceUsage => ({
  range: '24h',
  step_seconds: 300,
  instance_class: 'small',
  resources,
  ingest: [],
});

describe('usageHints', () => {
  it('keeps only hinted resources, critical first', () => {
    const hints = usageHints(
      usage([
        res({ component: 'server', level: 'warn', hint: 'w' }),
        res({ component: 'postgres', level: 'ok' }),
        res({ component: 'influxdb', level: 'critical', hint: 'c' }),
      ]),
    );
    expect(hints.map((r) => r.hint)).toEqual(['c', 'w']);
  });
  it('is empty before data arrives', () => {
    expect(usageHints(undefined)).toEqual([]);
  });
});

describe('usagePercentRows', () => {
  it('puts each component on its own limit, merged by time and sorted', () => {
    const rows = usagePercentRows([
      res({ component: 'server', limit: 200, points: [{ time: '2026-10-01T12:05:00Z', value: 50 }] }),
      res({
        component: 'postgres',
        limit: 1000,
        points: [
          { time: '2026-10-01T12:05:00Z', value: 900 },
          { time: '2026-10-01T12:00:00Z', value: 100 },
        ],
      }),
      res({ component: 'influxdb', points: [{ time: '2026-10-01T12:00:00Z', value: 5 }] }),
    ]);
    expect(rows).toEqual([
      { time: Date.parse('2026-10-01T12:00:00Z'), postgres: 10 },
      { time: Date.parse('2026-10-01T12:05:00Z'), server: 25, postgres: 90 },
    ]);
  });
});

describe('usageMeterHint', () => {
  it('shows CPU in millicores and bytes humanised', () => {
    expect(usageMeterHint(res({ kind: 'cpu', unit: 'cores', current: 0.25, limit: 0.5 }))).toBe('250m CPU of 500m CPU');
    expect(usageMeterHint(res({ current: 512 * 1024 ** 2, limit: 1024 ** 3 }))).toBe('512 MB of 1.00 GB');
  });
  it('says when the limit is unknown or nothing is measured', () => {
    expect(usageMeterHint(res({ current: 1024 }))).toBe('1.00 KB, limit unknown');
    expect(usageMeterHint(res({ limit: 1024 }))).toBe('not measured yet');
  });
});
