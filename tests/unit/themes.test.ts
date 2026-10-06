import { describe, expect, it } from 'vitest';
import { contrastFailures } from '../../src/theme/contrast.ts';
import { variantVars } from '../../src/theme/css.ts';
import { themes } from '../../src/theme/registry.ts';

describe('theme catalogue', () => {
  it('has unique ids that are safe in a cookie and a CSS attribute selector', () => {
    const ids = themes.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it('gives every theme at least one variant', () => {
    for (const t of themes) expect(t.light ?? t.dark).toBeTruthy();
  });

  for (const t of themes) {
    for (const scheme of ['light', 'dark'] as const) {
      const v = t[scheme];
      if (!v) continue;
      it(`${t.id}/${scheme} meets its contrast minimums`, () => {
        expect(contrastFailures(v).map((f) => `${f.label}: ${f.ratio.toFixed(2)}`)).toEqual([]);
      });
      it(`${t.id}/${scheme} only uses #rrggbb values`, () => {
        for (const value of Object.values(variantVars(v))) expect(value).toMatch(/^#[0-9a-f]{6}$/i);
      });
    }
  }
});
