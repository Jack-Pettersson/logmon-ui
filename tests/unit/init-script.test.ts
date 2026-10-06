import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { initScript } from '../../src/theme/init.ts';
import { parsePreference, resolveAppearance } from '../../src/theme/preference.ts';
import { themes } from '../../src/theme/registry.ts';

function runInit(cookie: string, override: string | null, systemDark: boolean) {
  const dom = new JSDOM(
    `<!doctype html><html><head>${override === null ? '' : `<meta name="logmon:theme-override" content="${override}">`}</head></html>`,
    {
      url: 'https://acme.dev-logmon.io/',
      runScripts: 'outside-only',
    },
  );
  const w = dom.window;
  Object.defineProperty(w, 'matchMedia', { value: (q: string) => ({ matches: systemDark && q.includes('dark') }) });
  if (cookie) w.document.cookie = `logmon_theme=${cookie}`;
  w.eval(initScript(themes));
  const root = w.document.documentElement;
  return { themeId: root.getAttribute('data-theme'), scheme: root.getAttribute('data-scheme') };
}

describe('pre-paint init script', () => {
  it('is committed in sync with the theme registry', () => {
    const committed = readFileSync(new URL('../../src/theme/init.generated.js', import.meta.url), 'utf8');
    expect(committed).toContain(initScript(themes));
  });

  const cookies = ['', 'dracula.dark', 'claude.light', 'solarized.system', 'bogus.dark', 'prod.purple', 'constructor.light'];
  const overrides = [null, '', 'staging', 'nope', 'constructor'];
  for (const cookie of cookies) {
    for (const override of overrides) {
      for (const systemDark of [true, false]) {
        it(`agrees with resolveAppearance for cookie=${cookie || '∅'} override=${override ?? '∅'} dark=${systemDark}`, () => {
          const expected = resolveAppearance(parsePreference(cookie), override, systemDark);
          expect(runInit(cookie, override, systemDark)).toEqual({ themeId: expected.themeId, scheme: expected.scheme });
        });
      }
    }
  }
});
