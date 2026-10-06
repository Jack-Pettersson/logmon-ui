import { DEFAULT_THEME_ID, getTheme, isThemeId, variantOf } from './registry.ts';
import type { Mode, Scheme } from './types.ts';

export const COOKIE_NAME = 'logmon_theme';
export const META_OVERRIDE = 'logmon:theme-override';
export const META_COOKIE_DOMAIN = 'logmon:cookie-domain';

export interface Preference {
  theme: string;
  mode: Mode;
}

export const DEFAULT_PREFERENCE: Preference = { theme: DEFAULT_THEME_ID, mode: 'system' };

const MODES: readonly Mode[] = ['light', 'dark', 'system'];

export function isMode(m: unknown): m is Mode {
  return typeof m === 'string' && (MODES as readonly string[]).includes(m);
}

export function parsePreference(raw: string | null | undefined): Preference {
  const [theme, mode] = (raw ?? '').split('.');
  return {
    theme: isThemeId(theme) ? theme : DEFAULT_PREFERENCE.theme,
    mode: isMode(mode) ? mode : DEFAULT_PREFERENCE.mode,
  };
}

export function serializePreference(p: Preference): string {
  return `${p.theme}.${p.mode}`;
}

export function readCookie(cookieHeader: string, name: string): string | null {
  for (const part of cookieHeader.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export function cookieAttributes(domain: string | null, secure: boolean): string {
  const attrs = ['Path=/', 'Max-Age=31536000', 'SameSite=Lax'];
  if (domain) attrs.push(`Domain=${domain}`);
  if (secure) attrs.push('Secure');
  return attrs.join('; ');
}

const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

export function validCookieDomain(domain: string | null | undefined, hostname: string): string | null {
  if (!domain || !DOMAIN_RE.test(domain)) return null;
  return hostname === domain || hostname.endsWith(`.${domain}`) ? domain : null;
}

export interface Appearance {
  themeId: string;
  scheme: Scheme;
  overridden: boolean;
}

export function resolveAppearance(pref: Preference, override: string | null, systemDark: boolean): Appearance {
  const overridden = isThemeId(override);
  const themeId = overridden ? override : isThemeId(pref.theme) ? pref.theme : DEFAULT_THEME_ID;
  const wanted: Scheme = pref.mode === 'system' ? (systemDark ? 'dark' : 'light') : pref.mode;
  return { themeId, scheme: variantOf(getTheme(themeId), wanted).scheme, overridden };
}
