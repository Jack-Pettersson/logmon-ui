import { CalendarClock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/cn.ts';
import {
  QUICK_RANGES,
  RELATIVE_UNITS,
  WHOLE_UNITS,
  formatRange,
  fromDatetimeLocal,
  resolveRange,
  sameRange,
  toDatetimeLocal,
  type RelativeUnit,
  type TimePoint,
  type TimeRange,
} from '../lib/timeRange.ts';
import { Button } from './button.tsx';
import { Input, Label } from './form.tsx';
import { SegmentedControl } from './layout.tsx';
import { Popover } from './overlay.tsx';
import { Select } from './select.tsx';

function PointEditor({
  label,
  point,
  onChange,
  allowNow,
}: {
  label: string;
  point: TimePoint;
  onChange: (p: TimePoint) => void;
  allowNow: boolean;
}) {
  const modes = [
    { value: 'relative' as const, label: 'Relative' },
    { value: 'absolute' as const, label: 'Absolute' },
    ...(allowNow ? [{ value: 'now' as const, label: 'Now' }] : []),
  ];
  const setMode = (mode: TimePoint['mode']) => {
    if (mode === point.mode) return;
    if (mode === 'now') onChange({ mode: 'now' });
    else if (mode === 'relative') onChange({ mode: 'relative', amount: 1, unit: 'hours' });
    else onChange({ mode: 'absolute', value: Date.now() });
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <SegmentedControl size="sm" value={point.mode} onValueChange={setMode} options={modes} aria-label={`${label} mode`} />
      </div>
      {point.mode === 'relative' && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            step={WHOLE_UNITS.has(point.unit) ? 1 : 'any'}
            value={point.amount}
            aria-label={`${label} amount`}
            className="w-20"
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n) && n >= 1) onChange({ ...point, amount: WHOLE_UNITS.has(point.unit) ? Math.round(n) : n });
            }}
          />
          <Select<RelativeUnit>
            aria-label={`${label} unit`}
            value={point.unit}
            onValueChange={(unit) => onChange({ ...point, unit, amount: WHOLE_UNITS.has(unit) ? Math.round(point.amount) : point.amount })}
            options={RELATIVE_UNITS.map((u) => ({ value: u.value, label: u.label.toLowerCase() }))}
          />
          <span className="text-fg-muted">ago</span>
        </div>
      )}
      {point.mode === 'absolute' && (
        <Input
          type="datetime-local"
          aria-label={`${label} time`}
          value={toDatetimeLocal(point.value)}
          onChange={(e) => {
            const ms = fromDatetimeLocal(e.target.value);
            if (!Number.isNaN(ms)) onChange({ mode: 'absolute', value: ms });
          }}
        />
      )}
      {point.mode === 'now' && <p className="text-xs text-fg-muted">Always the current time, re-evaluated on every refresh.</p>}
    </div>
  );
}

export function TimeRangePicker({
  value,
  onChange,
  className,
}: {
  value: TimeRange;
  onChange: (r: TimeRange) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const draftError = resolveRange(draft).error;

  const apply = (r: TimeRange) => {
    onChange(r);
    setOpen(false);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (o) setDraft(value);
        setOpen(o);
      }}
      align="start"
      className="w-[min(560px,calc(100vw-1rem))] p-0"
      trigger={
        <Button variant="secondary" className={cn('justify-start', className)} aria-label={`Time range: ${formatRange(value)}`}>
          <CalendarClock className="text-fg-muted" />
          {formatRange(value)}
        </Button>
      }
    >
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-0.5 border-line p-2 max-sm:border-b sm:w-44 sm:border-r">
          <p className="px-2 py-1 text-xs text-fg-muted">Quick ranges</p>
          {QUICK_RANGES.map((r) => (
            <button
              key={formatRange(r)}
              type="button"
              onClick={() => apply(r)}
              className={cn(
                'flex h-8 cursor-pointer items-center rounded-md px-2 text-left text-sm hover:bg-hover',
                sameRange(r, value) ? 'bg-selected text-fg' : 'text-fg-secondary',
              )}
            >
              {formatRange(r)}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <PointEditor label="From" point={draft.from} onChange={(from) => setDraft((d) => ({ ...d, from }))} allowNow={false} />
          <PointEditor label="To" point={draft.to} onChange={(to) => setDraft((d) => ({ ...d, to }))} allowNow />
          {draftError && <p className="text-xs text-danger">{draftError}</p>}
          <div className="flex justify-end">
            <Button variant="primary" size="sm" disabled={!!draftError} onClick={() => apply(draft)}>
              Apply
            </Button>
          </div>
        </div>
      </div>
    </Popover>
  );
}
