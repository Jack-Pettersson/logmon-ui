import { describe, expect, it } from 'vitest';
import { formatRange, resolveRange, subtractRelative, QUICK_RANGES } from '../../src/lib/timeRange.ts';

const NOW = Date.UTC(2026, 2, 31, 12);

describe('time ranges', () => {
  it('subtracts calendar months, not 30 days', () => {
    const jan15 = new Date(2026, 0, 15, 9).getTime();
    expect(subtractRelative(jan15, 1, 'months')).toBe(new Date(2025, 11, 15, 9).getTime());
    expect(subtractRelative(jan15, 1, 'years')).toBe(new Date(2025, 0, 15, 9).getTime());
    expect(subtractRelative(NOW, 2, 'hours')).toBe(NOW - 7_200_000);
  });

  it('rejects a range whose start is after its end', () => {
    expect(resolveRange({ from: { mode: 'absolute', value: NOW }, to: { mode: 'absolute', value: NOW - 1 } }, NOW).error).toMatch(/after/);
    expect(resolveRange(QUICK_RANGES[0]!, NOW)).toEqual({ from: NOW - 900_000, to: NOW, error: null });
  });

  it('labels quick ranges', () => {
    expect(QUICK_RANGES.map(formatRange)).toEqual([
      'Last 15 minutes',
      'Last hour',
      'Last 6 hours',
      'Last 24 hours',
      'Last 7 days',
      'Last 30 days',
    ]);
  });
});
