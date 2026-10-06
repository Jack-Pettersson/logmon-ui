export type RelativeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';

export type TimePoint = { mode: 'absolute'; value: number } | { mode: 'relative'; amount: number; unit: RelativeUnit } | { mode: 'now' };

export interface TimeRange {
  from: TimePoint;
  to: TimePoint;
}

export const RELATIVE_UNITS: { value: RelativeUnit; label: string; short: string }[] = [
  { value: 'seconds', label: 'Seconds', short: 's' },
  { value: 'minutes', label: 'Minutes', short: 'm' },
  { value: 'hours', label: 'Hours', short: 'h' },
  { value: 'days', label: 'Days', short: 'd' },
  { value: 'weeks', label: 'Weeks', short: 'w' },
  { value: 'months', label: 'Months', short: 'mo' },
  { value: 'years', label: 'Years', short: 'y' },
];

const FIXED_MS: Partial<Record<RelativeUnit, number>> = {
  seconds: 1_000,
  minutes: 60_000,
  hours: 3_600_000,
  days: 86_400_000,
  weeks: 604_800_000,
};

// Months and years subtract on the calendar, so they only accept whole amounts.
export const WHOLE_UNITS: ReadonlySet<RelativeUnit> = new Set(['months', 'years']);

export function subtractRelative(epochMs: number, amount: number, unit: RelativeUnit): number {
  if (unit === 'months' || unit === 'years') {
    const d = new Date(epochMs);
    if (unit === 'months') d.setMonth(d.getMonth() - amount);
    else d.setFullYear(d.getFullYear() - amount);
    return d.getTime();
  }
  return epochMs - amount * FIXED_MS[unit]!;
}

// Relative and now points re-resolve on every call so polling keeps sliding forward.
export function resolveTimePoint(p: TimePoint, now = Date.now()): number {
  switch (p.mode) {
    case 'absolute':
      return p.value;
    case 'relative':
      return subtractRelative(now, p.amount, p.unit);
    case 'now':
      return now;
  }
}

export function resolveRange(range: TimeRange, now = Date.now()): { from: number; to: number; error: string | null } {
  const from = resolveTimePoint(range.from, now);
  const to = resolveTimePoint(range.to, now);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return { from, to, error: 'From and To must both be valid times' };
  if (from > to) return { from, to, error: 'From must not be after To' };
  return { from, to, error: null };
}

export function formatTimePoint(p: TimePoint): string {
  switch (p.mode) {
    case 'absolute':
      return new Date(p.value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    case 'relative': {
      const unit = RELATIVE_UNITS.find((u) => u.value === p.unit)!;
      const label = unit.label.toLowerCase();
      return `${p.amount} ${p.amount === 1 ? label.replace(/s$/, '') : label} ago`;
    }
    case 'now':
      return 'now';
  }
}

export function formatRange(range: TimeRange): string {
  const { from, to } = range;
  if (to.mode === 'now' && from.mode === 'relative') {
    const label = RELATIVE_UNITS.find((u) => u.value === from.unit)!.label.toLowerCase();
    return `Last ${from.amount === 1 ? label.replace(/s$/, '') : `${from.amount} ${label}`}`;
  }
  return `${formatTimePoint(range.from)} → ${formatTimePoint(range.to)}`;
}

export const QUICK_RANGES: TimeRange[] = (
  [
    [15, 'minutes'],
    [1, 'hours'],
    [6, 'hours'],
    [24, 'hours'],
    [7, 'days'],
    [30, 'days'],
  ] as const
).map(([amount, unit]) => ({ from: { mode: 'relative', amount, unit }, to: { mode: 'now' } }));

export const DEFAULT_RANGE: TimeRange = QUICK_RANGES[1]!;

export function sameRange(a: TimeRange, b: TimeRange): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function toDatetimeLocal(epochMs: number): string {
  const d = new Date(epochMs);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromDatetimeLocal(value: string): number {
  return new Date(value).getTime();
}
