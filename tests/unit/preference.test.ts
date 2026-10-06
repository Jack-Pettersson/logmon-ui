import { describe, expect, it } from 'vitest';
import { parsePreference, readCookie, resolveAppearance, serializePreference, validCookieDomain } from '../../src/theme/preference.ts';

describe('parsePreference', () => {
  it('round-trips a valid preference', () => {
    expect(parsePreference(serializePreference({ theme: 'dracula', mode: 'dark' }))).toEqual({ theme: 'dracula', mode: 'dark' });
  });

  it.each([null, '', 'nope.dark', 'dracula.purple', 'constructor.system', '__proto__.light', 'logmon'])(
    'falls back field by field for %j',
    (raw) => {
      const p = parsePreference(raw);
      expect(['logmon', 'dracula']).toContain(p.theme);
      expect(['light', 'dark', 'system']).toContain(p.mode);
    },
  );
});

describe('resolveAppearance', () => {
  it('follows the system scheme in system mode', () => {
    expect(resolveAppearance({ theme: 'logmon', mode: 'system' }, null, true)).toEqual({
      themeId: 'logmon',
      scheme: 'dark',
      overridden: false,
    });
    expect(resolveAppearance({ theme: 'logmon', mode: 'system' }, null, false).scheme).toBe('light');
  });

  it('lets an explicit mode win over the system', () => {
    expect(resolveAppearance({ theme: 'terracotta', mode: 'light' }, null, true).scheme).toBe('light');
  });

  it('lets the cluster override replace the theme but keeps the user mode', () => {
    expect(resolveAppearance({ theme: 'dracula', mode: 'light' }, 'prod', true)).toEqual({
      themeId: 'prod',
      scheme: 'light',
      overridden: true,
    });
  });

  it('ignores an unknown override', () => {
    expect(resolveAppearance({ theme: 'dracula', mode: 'dark' }, 'hotdog', false)).toEqual({
      themeId: 'dracula',
      scheme: 'dark',
      overridden: false,
    });
  });
});

describe('cookies', () => {
  it('reads a named cookie among others', () => {
    expect(readCookie('a=1; logmon_theme=solarized.light; b=2', 'logmon_theme')).toBe('solarized.light');
    expect(readCookie('a=1', 'logmon_theme')).toBeNull();
  });

  it('only accepts a cookie domain the current host belongs to', () => {
    expect(validCookieDomain('dev-logmon.io', 'acme-prod.dev-logmon.io')).toBe('dev-logmon.io');
    expect(validCookieDomain('dev-logmon.io', 'dev-logmon.io')).toBe('dev-logmon.io');
    expect(validCookieDomain('dev-logmon.io', 'evil-dev-logmon.io')).toBeNull();
    expect(validCookieDomain('__LOGMON_COOKIE_DOMAIN__', 'localhost')).toBeNull();
    expect(validCookieDomain('', 'localhost')).toBeNull();
  });
});
