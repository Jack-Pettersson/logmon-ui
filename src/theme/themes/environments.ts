import type { Theme, ThemeVariant } from '../types.ts';
import { logmonDark, logmonLight } from './logmon.ts';

type Tint = Pick<ThemeVariant, 'surface' | 'border' | 'accent'> & { sequential: [string, string] };

function tinted(base: ThemeVariant, tint: Tint): ThemeVariant {
  return {
    ...base,
    surface: tint.surface,
    border: tint.border,
    accent: tint.accent,
    data: { ...base.data, sequential: tint.sequential },
  };
}

export const prod: Theme = {
  id: 'prod',
  name: 'Prod (red)',
  description: 'Red-tinted chrome for production instances.',
  dark: tinted(logmonDark, {
    surface: { base: '#181414', sidebar: '#2b1013', raised: '#201a1a', overlay: '#261f1f', sunken: '#130f0f' },
    border: { subtle: '#33292a', strong: '#4a3a3b' },
    accent: { base: '#f87171', hover: '#fca5a5', fg: '#2a0707' },
    sequential: ['#3b1416', '#fca5a5'],
  }),
  light: tinted(logmonLight, {
    surface: { base: '#fffafa', sidebar: '#fdeaea', raised: '#ffffff', overlay: '#ffffff', sunken: '#fbefef' },
    border: { subtle: '#f2dede', strong: '#e5c3c3' },
    accent: { base: '#b91c1c', hover: '#991b1b', fg: '#ffffff' },
    sequential: ['#fee2e2', '#b91c1c'],
  }),
};

export const staging: Theme = {
  id: 'staging',
  name: 'Staging (blue)',
  description: 'Blue-tinted chrome for staging instances.',
  dark: tinted(logmonDark, {
    surface: { base: '#14161a', sidebar: '#0f1a2e', raised: '#1a1d23', overlay: '#20242b', sunken: '#101216' },
    border: { subtle: '#272c35', strong: '#3a414d' },
    accent: { base: '#60a5fa', hover: '#93c5fd', fg: '#0a1a33' },
    sequential: ['#13284a', '#93c5fd'],
  }),
  light: tinted(logmonLight, {
    surface: { base: '#fafcff', sidebar: '#e3edfc', raised: '#ffffff', overlay: '#ffffff', sunken: '#eef3fb' },
    border: { subtle: '#dfe7f3', strong: '#c3d0e4' },
    accent: { base: '#1d4ed8', hover: '#1e40af', fg: '#ffffff' },
    sequential: ['#dbeafe', '#1d4ed8'],
  }),
};

export const dev: Theme = {
  id: 'dev',
  name: 'Dev (green)',
  description: 'Green-tinted chrome for development instances.',
  dark: tinted(logmonDark, {
    surface: { base: '#141714', sidebar: '#0f2416', raised: '#1a1e1a', overlay: '#202520', sunken: '#101310' },
    border: { subtle: '#283028', strong: '#3a453a' },
    accent: { base: '#4ade80', hover: '#86efac', fg: '#062411' },
    sequential: ['#123a22', '#86efac'],
  }),
  light: tinted(logmonLight, {
    surface: { base: '#fbfefb', sidebar: '#dcf5e3', raised: '#ffffff', overlay: '#ffffff', sunken: '#eef8f0' },
    border: { subtle: '#dcebdf', strong: '#bfd8c5' },
    accent: { base: '#15803d', hover: '#166534', fg: '#ffffff' },
    sequential: ['#dcfce7', '#15803d'],
  }),
};
