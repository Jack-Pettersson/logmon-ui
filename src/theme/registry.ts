import type { Scheme, Theme, ThemeVariant } from './types.ts';
import { logmon } from './themes/logmon.ts';
import { dev, prod, staging } from './themes/environments.ts';
import { terracotta, dracula, solarized } from './themes/classics.ts';

export const themes: readonly Theme[] = [logmon, prod, staging, dev, solarized, dracula, terracotta];

export const DEFAULT_THEME_ID = 'logmon';

const byId = new Map(themes.map((t) => [t.id, t]));

export function isThemeId(id: unknown): id is string {
  return typeof id === 'string' && byId.has(id);
}

export function getTheme(id: string): Theme {
  return byId.get(id) ?? logmon;
}

export function availableSchemes(theme: Theme): Scheme[] {
  return (['light', 'dark'] as const).filter((s) => theme[s]);
}

export function variantOf(theme: Theme, scheme: Scheme): { scheme: Scheme; variant: ThemeVariant } {
  const variant = theme[scheme];
  if (variant) return { scheme, variant };
  const fallback: Scheme = scheme === 'dark' ? 'light' : 'dark';
  return { scheme: fallback, variant: theme[fallback]! };
}
