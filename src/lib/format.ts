const EMPTY = '—';

function toDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateTime(value: string | number | Date | null | undefined): string {
  return toDate(value)?.toLocaleString([], { dateStyle: 'medium', timeStyle: 'medium' }) ?? EMPTY;
}

export function formatDate(value: string | number | Date | null | undefined): string {
  return toDate(value)?.toLocaleDateString([], { dateStyle: 'medium' }) ?? EMPTY;
}

export function formatTime(value: string | number | Date | null | undefined, seconds = false): string {
  return toDate(value)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', ...(seconds ? { second: '2-digit' } : {}) }) ?? EMPTY;
}

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['second', 60],
  ['minute', 60],
  ['hour', 24],
  ['day', 30],
  ['month', 12],
  ['year', Infinity],
];

export function formatRelative(value: string | number | Date | null | undefined, now = Date.now()): string {
  const d = toDate(value);
  if (!d) return EMPTY;
  let delta = (d.getTime() - now) / 1000;
  if (Math.abs(delta) < 10) return 'just now';
  const fmt = new Intl.RelativeTimeFormat([], { numeric: 'auto' });
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(delta) < size) return fmt.format(Math.round(delta), unit);
    delta /= size;
  }
  return EMPTY;
}

export function formatBytes(bytes: number | null | undefined, suffix = ''): string {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes)) return EMPTY;
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let v = Math.abs(bytes);
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  const digits = v >= 100 || i === 0 ? 0 : v >= 10 ? 1 : 2;
  return `${bytes < 0 ? '-' : ''}${v.toFixed(digits)} ${units[i]}${suffix}`;
}

export function formatPercent(value: number | null | undefined, digits = 1): string {
  return value === null || value === undefined || !Number.isFinite(value) ? EMPTY : `${value.toFixed(digits)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined || !Number.isFinite(value) ? EMPTY : value.toLocaleString();
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${+(seconds / 3600).toFixed(1)}h`;
  return `${+(seconds / 86400).toFixed(1)}d`;
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n.toLocaleString()} ${n === 1 ? one : many}`;
}
