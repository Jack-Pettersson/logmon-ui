import { describe, expect, it } from 'vitest';
import { yAxisTicks, yAxisWidth } from '../../src/charts/common.tsx';
import { formatBytes } from '../../src/lib/format.ts';

describe('yAxisTicks', () => {
  it('picks the nice ticks Recharts would', () => {
    expect(yAxisTicks([3, 87])).toEqual([0, 25, 50, 75, 100]);
    expect(yAxisTicks([12, 40], [0, 100])).toEqual([0, 25, 50, 75, 100]);
    expect(yAxisTicks([0, 7], [0, 'auto'], false)).toEqual([0, 2, 4, 6, 8]);
    expect(yAxisTicks([12, 40], [0, 90])).toEqual([0, 25, 50, 75]);
  });
  it('has nothing to pick without values', () => {
    expect(yAxisTicks([])).toBeUndefined();
  });
});

describe('yAxisWidth', () => {
  it('fits the longest tick label, not just the peak', () => {
    const fmt = (v: number) => formatBytes(v);
    const ticks = yAxisTicks([0, 340_000])!;
    const peak = ticks.at(-1)!;
    expect(fmt(peak).length).toBeLessThan(Math.max(...ticks.map((t) => fmt(t).length)));
    expect(yAxisWidth(ticks, fmt)).toBeGreaterThan(yAxisWidth([peak], fmt));
  });
  it('keeps a floor for tiny values', () => {
    expect(yAxisWidth([0])).toBe(32);
    expect(yAxisWidth(undefined)).toBe(32);
  });
});
