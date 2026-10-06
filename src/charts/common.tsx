import type { ReactNode } from 'react';

export const seriesColor = (i: number) => `var(--color-data-${(i % 8) + 1})`;

export const axisTick = { fill: 'var(--color-fg-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' };

export const gridProps = { stroke: 'var(--color-line)', vertical: false } as const;

const DAY = 86_400_000;

export function timeTickFormatter(spanMs: number, stepMs = 0) {
  if (stepMs >= DAY) return (t: number) => new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' });
  if (spanMs > DAY)
    return (t: number) => new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  if (stepMs > 0 && stepMs < 60_000)
    return (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function spanOf(rows: { time: number }[]): number {
  return rows.length < 2 ? 0 : rows[rows.length - 1]!.time - rows[0]!.time;
}

interface TooltipEntry {
  name?: ReactNode;
  value?: unknown;
  color?: string;
  dataKey?: unknown;
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatValue = (v) => String(v),
  hideZero,
}: {
  active?: boolean;
  payload?: readonly TooltipEntry[];
  label?: unknown;
  formatValue?: (v: number) => string;
  hideZero?: boolean;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => typeof p.value === 'number' && (!hideZero || p.value !== 0));
  return (
    <div className="min-w-36 rounded-lg border border-line bg-overlay px-3 py-2 text-xs shadow-pop">
      <p className="mb-1.5 font-mono text-fg-muted">{new Date(Number(label)).toLocaleString()}</p>
      <div className="flex flex-col gap-1">
        {rows.map((p) => (
          <div key={String(p.dataKey)} className="flex items-center gap-2">
            <span className="size-2 rounded-sm" style={{ background: p.color }} />
            <span className="flex-1 text-fg-secondary">{p.name}</span>
            <span className="font-mono text-fg tabular-nums">{formatValue(p.value as number)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartMessage({ height, children }: { height: number; children: ReactNode }) {
  return (
    <div className="flex items-center justify-center px-6 text-center text-sm text-fg-muted" style={{ height }}>
      {children}
    </div>
  );
}

export function Legend({ items }: { items: { key: string; label: ReactNode; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-fg-muted">
      {items.map((i) => (
        <span key={i.key} className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

// Recharts' width="auto" measures before the mono font loads and clips labels.
export function yAxisWidth(peak: number, format: (v: number) => string = (v) => v.toLocaleString()): number {
  return Math.max(32, format(peak).length * 7 + 12);
}
