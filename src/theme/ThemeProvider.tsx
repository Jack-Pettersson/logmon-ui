import { createContext, use, useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import {
  COOKIE_NAME,
  META_COOKIE_DOMAIN,
  META_OVERRIDE,
  cookieAttributes,
  parsePreference,
  readCookie,
  resolveAppearance,
  serializePreference,
  validCookieDomain,
  type Appearance,
  type Preference,
} from './preference.ts';
import { isThemeId } from './registry.ts';

interface ThemeContextValue {
  preference: Preference;
  appearance: Appearance;
  override: string | null;
  setPreference: (next: Partial<Preference>) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function meta(name: string): string | null {
  return document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? null;
}

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeSystemDark(onChange: () => void): () => void {
  const mql = window.matchMedia(DARK_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const systemDarkSnapshot = () => window.matchMedia(DARK_QUERY).matches;

function readPreference(): Preference {
  return parsePreference(readCookie(document.cookie, COOKIE_NAME));
}

export interface ThemeProviderProps {
  /** Cluster-wide theme. `undefined` reads the server-rendered meta tag. */
  override?: string | null;
  children: ReactNode;
}

export function ThemeProvider({ override: overrideProp, children }: ThemeProviderProps) {
  const [storedPreference, setStoredPreference] = useState(readPreference);
  const [metaOverride] = useState(() => meta(META_OVERRIDE));
  const override = overrideProp === undefined ? metaOverride : overrideProp;
  const systemDark = useSyncExternalStore(subscribeSystemDark, systemDarkSnapshot);
  const appearance = useMemo(
    () => resolveAppearance(storedPreference, isThemeId(override) ? override : null, systemDark),
    [storedPreference, override, systemDark],
  );

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', appearance.themeId);
    root.setAttribute('data-scheme', appearance.scheme);
  }, [appearance]);

  useLayoutEffect(() => {
    const sync = () => {
      if (document.visibilityState === 'visible') setStoredPreference(readPreference());
    };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const setPreference = useCallback(
    (next: Partial<Preference>) => {
      const merged = { ...storedPreference, ...next };
      const domain = validCookieDomain(meta(META_COOKIE_DOMAIN), window.location.hostname);
      document.cookie = `${COOKIE_NAME}=${encodeURIComponent(serializePreference(merged))}; ${cookieAttributes(domain, window.location.protocol === 'https:')}`;
      setStoredPreference(merged);
    },
    [storedPreference],
  );

  const value = useMemo(
    () => ({ preference: storedPreference, appearance, override: isThemeId(override) ? override : null, setPreference }),
    [storedPreference, appearance, override, setPreference],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
