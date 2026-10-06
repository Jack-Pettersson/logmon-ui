import { describe, expect, it } from 'vitest';
import { yAxisWidth } from '../../src/charts/common.tsx';
import { formatBytes } from '../../src/lib/format.ts';

describe('yAxisWidth', () => {
  it('grows with the longest label', () => {
    expect(yAxisWidth(100, (v) => `${v}%`)).toBeGreaterThanOrEqual(4 * 7);
    expect(yAxisWidth(2.1e6, (v) => `${formatBytes(v)}/s`)).toBeGreaterThan(yAxisWidth(100, (v) => `${v}%`));
  });
  it('keeps a floor for tiny values', () => {
    expect(yAxisWidth(0)).toBe(32);
  });
});
