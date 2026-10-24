import { Activity, Cpu, HardDrive, MemoryStick } from 'lucide-react';
import type { ReactNode } from 'react';
import { Panel } from '../components/layout.tsx';
import { cn } from '../lib/cn.ts';
import { formatBytes } from '../lib/format.ts';
import { Legend, seriesColor } from './common.tsx';
import { Meter } from './Meter.tsx';
import { TimeSeriesChart, type Series } from './TimeSeriesChart.tsx';

// The InstanceUsage wire type that logmon-server's /api/instance/usage and
// logmon-hosting's instance usage endpoints both serve.
export type UsageRange = '24h' | '7d' | '30d';

export interface UsagePoint {
  time: string;
  value: number;
}

export interface UsageResource {
  kind: 'cpu' | 'memory' | 'storage';
  component: 'server' | 'postgres' | 'influxdb' | 'data';
  unit: 'cores' | 'bytes';
  limit?: number;
  current?: number;
  level: 'ok' | 'warn' | 'critical' | 'unknown';
  hint?: string;
  points: UsagePoint[];
}

export interface IngestPoint {
  time: string;
  log_lines_per_min: number;
  log_bytes_per_min: number;
  metric_points_per_min: number;
  agents: number;
}

export interface InstanceUsage {
  range: UsageRange;
  step_seconds: number;
  instance_class: string;
  resources: UsageResource[];
  ingest: IngestPoint[];
}

export const USAGE_RANGES: { value: UsageRange; label: string }[] = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
];

const COMPONENTS: Record<string, { label: string; color: string }> = {
  server: { label: 'Server', color: seriesColor(0) },
  postgres: { label: 'PostgreSQL', color: seriesColor(1) },
  influxdb: { label: 'InfluxDB', color: seriesColor(2) },
  data: { label: 'Server /data', color: seriesColor(3) },
};

const labelOf = (r: UsageResource) => COMPONENTS[r.component]?.label ?? r.component;

// Fixed per component, so PostgreSQL is the same colour in every panel.
const seriesOf = (r: UsageResource): Series => ({ key: r.component, label: labelOf(r), color: COMPONENTS[r.component]?.color });

const formatAmount = (r: UsageResource, v: number) => (r.unit === 'cores' ? `${(v * 1000).toFixed(0)}m CPU` : formatBytes(v));

export function usageMeterHint(r: UsageResource): string {
  if (r.current == null) return 'not measured yet';
  if (!r.limit) return `${formatAmount(r, r.current)}, limit unknown`;
  return `${formatAmount(r, r.current)} of ${formatAmount(r, r.limit)}`;
}

// The resources with a hint (warn or critical), critical first.
export function usageHints(usage: InstanceUsage | undefined): UsageResource[] {
  return (usage?.resources ?? []).filter((r) => r.hint).sort((a, b) => (a.level === b.level ? 0 : a.level === 'critical' ? -1 : 1));
}

// Each component as a share of its own limit, so different limits fit one axis.
export function usagePercentRows(resources: UsageResource[]) {
  const rows = new Map<number, { time: number } & Record<string, number | null>>();
  for (const r of resources) {
    if (!r.limit) continue;
    for (const p of r.points) {
      const t = Date.parse(p.time);
      const row = rows.get(t) ?? { time: t };
      row[r.component] = (p.value / r.limit) * 100;
      rows.set(t, row);
    }
  }
  return [...rows.values()].sort((a, b) => a.time - b.time);
}

function LegendedChart({ legend, children }: { legend: Series[]; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Legend items={legend.map((s, i) => ({ key: s.key, label: s.label, color: s.color ?? seriesColor(i) }))} />
      {children}
    </div>
  );
}

function ResourcePanel({ title, icon, resources, height }: { title: string; icon: ReactNode; resources: UsageResource[]; height: number }) {
  const charted = resources.filter((r) => r.limit).map(seriesOf);
  return (
    <Panel title={title} icon={icon}>
      <div className="grid gap-3 sm:grid-cols-3">
        {resources.map((r) => (
          <Meter
            key={r.component}
            label={labelOf(r)}
            value={r.current != null && r.limit ? (r.current / r.limit) * 100 : null}
            hint={usageMeterHint(r)}
          />
        ))}
      </div>
      <div className="mt-4">
        <LegendedChart legend={charted}>
          <TimeSeriesChart
            data={usagePercentRows(resources)}
            series={charted}
            kind="line"
            height={height}
            yDomain={[0, 100]}
            formatValue={(v) => `${v.toFixed(0)}%`}
            empty="No samples in this range yet. The instance measures itself every minute."
          />
        </LegendedChart>
      </div>
    </Panel>
  );
}

const RATES: Series[] = [
  { key: 'lines', label: 'Log lines / min' },
  { key: 'points', label: 'Metric points / min' },
];
const BYTES: Series[] = [{ key: 'bytes', label: 'Log bytes / min' }];
const AGENTS: Series[] = [{ key: 'agents', label: 'Agents connected' }];

export interface InstanceUsageViewProps {
  usage: InstanceUsage;
  // Shorter charts and tighter spacing, for a dialog rather than a page.
  compact?: boolean;
}

// An instance's usage: meters and % of limit over time per component for CPU,
// memory and storage, then the ingest that drives them.
export function InstanceUsageView({ usage, compact }: InstanceUsageViewProps) {
  const of = (kind: UsageResource['kind']) => usage.resources.filter((r) => r.kind === kind);
  const h = compact ? { resource: 180, ingest: 160, agents: 130 } : { resource: 200, ingest: 180, agents: 140 };
  const ingest = usage.ingest.map((p) => ({
    time: Date.parse(p.time),
    lines: p.log_lines_per_min,
    points: p.metric_points_per_min,
    bytes: p.log_bytes_per_min,
    agents: p.agents,
  }));
  return (
    <div className={cn('flex flex-col', compact ? 'gap-4' : 'gap-6')}>
      <ResourcePanel title="CPU (mean, % of limit)" icon={<Cpu />} resources={of('cpu')} height={h.resource} />
      <ResourcePanel title="Memory (peak, % of limit)" icon={<MemoryStick />} resources={of('memory')} height={h.resource} />
      <ResourcePanel title="Storage (% of volume)" icon={<HardDrive />} resources={of('storage')} height={h.resource} />
      <Panel title="Ingest" icon={<Activity />} description="What drives the growth: data received per minute, and agents connected.">
        <div className="grid gap-4 lg:grid-cols-2">
          <LegendedChart legend={RATES}>
            <TimeSeriesChart
              data={ingest}
              yDomain={[0, 'auto']}
              series={RATES}
              kind="line"
              height={h.ingest}
              formatValue={(v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            />
          </LegendedChart>
          <LegendedChart legend={BYTES}>
            <TimeSeriesChart data={ingest} yDomain={[0, 'auto']} series={BYTES} height={h.ingest} formatValue={(v) => formatBytes(v)} />
          </LegendedChart>
          <LegendedChart legend={AGENTS}>
            <TimeSeriesChart
              data={ingest}
              yDomain={[0, 'auto']}
              series={AGENTS}
              kind="line"
              height={h.agents}
              formatValue={(v) => (Number.isInteger(v) ? String(v) : '')}
            />
          </LegendedChart>
        </div>
      </Panel>
    </div>
  );
}
