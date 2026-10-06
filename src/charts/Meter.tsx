import type { ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export type MeterTone = 'ok' | 'warn' | 'danger';

export function utilizationTone(value: number): MeterTone {
  if (value < 50) return 'ok';
  if (value < 80) return 'warn';
  return 'danger';
}

const toneBg: Record<MeterTone, string> = { ok: 'bg-ok', warn: 'bg-warn', danger: 'bg-danger' };
const toneText: Record<MeterTone, string> = { ok: 'text-fg', warn: 'text-warn', danger: 'text-danger' };

export function Meter({ label, value, icon, hint }: { label: ReactNode; value: number | null; icon?: ReactNode; hint?: ReactNode }) {
  const known = value !== null && Number.isFinite(value);
  const tone = known ? utilizationTone(value) : null;
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-raised px-4 py-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[13px] text-fg-muted [&_svg]:size-4">
          {icon}
          {label}
        </span>
        {hint && <span className="text-xs text-fg-muted">{hint}</span>}
      </div>
      <span className={cn('text-2xl font-semibold tracking-tight tabular-nums', tone ? toneText[tone] : 'text-fg-muted')}>
        {known ? `${value.toFixed(1)}%` : '—'}
      </span>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-selected"
        role="meter"
        aria-label={typeof label === 'string' ? label : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={known ? value : undefined}
      >
        {known && (
          <div
            className={cn('h-full rounded-full transition-[width]', toneBg[tone!])}
            style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
          />
        )}
      </div>
    </div>
  );
}
