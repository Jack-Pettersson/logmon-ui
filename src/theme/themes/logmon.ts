import type { Theme, ThemeVariant } from '../types.ts';

export const logmonDark: ThemeVariant = {
  surface: { base: '#161616', sidebar: '#101010', raised: '#1d1d1d', overlay: '#232323', sunken: '#121212' },
  text: { primary: '#ededed', secondary: '#b5b5b5', muted: '#8f8f8f', inverted: '#111111' },
  border: { subtle: '#2a2a2a', strong: '#3d3d3d' },
  accent: { base: '#2dd4bf', hover: '#5eead4', fg: '#04211e' },
  status: { ok: '#4ade80', info: '#60a5fa', warn: '#fbbf24', danger: '#f87171' },
  severity: { trace: '#8f8f8f', debug: '#b5b5b5', info: '#60a5fa', warn: '#fbbf24', error: '#f87171', fatal: '#e879f9' },
  data: {
    categorical: ['#2dd4bf', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#a3e635', '#fb923c', '#38bdf8'],
    sequential: ['#123b37', '#5eead4'],
    diverging: ['#f87171', '#3d3d3d', '#4ade80'],
  },
};

export const logmonLight: ThemeVariant = {
  surface: { base: '#ffffff', sidebar: '#f6f6f6', raised: '#ffffff', overlay: '#ffffff', sunken: '#f3f3f3' },
  text: { primary: '#171717', secondary: '#404040', muted: '#6b6b6b', inverted: '#fafafa' },
  border: { subtle: '#e6e6e6', strong: '#cfcfcf' },
  accent: { base: '#0f766e', hover: '#115e59', fg: '#ffffff' },
  status: { ok: '#15803d', info: '#1d4ed8', warn: '#a16207', danger: '#b91c1c' },
  severity: { trace: '#6b6b6b', debug: '#525252', info: '#2563eb', warn: '#b45309', error: '#dc2626', fatal: '#a21caf' },
  data: {
    categorical: ['#0d9488', '#2563eb', '#d97706', '#db2777', '#7c3aed', '#65a30d', '#ea580c', '#0284c7'],
    sequential: ['#ccfbf1', '#0f766e'],
    diverging: ['#dc2626', '#d4d4d4', '#16a34a'],
  },
};

export const logmon: Theme = {
  id: 'logmon',
  name: 'logmon',
  description: 'Neutral greys with a teal accent.',
  light: logmonLight,
  dark: logmonDark,
};
