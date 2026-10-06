import type { Theme } from '../types.ts';

export const dracula: Theme = {
  id: 'dracula',
  name: 'Dracula',
  description: 'Dracula, with Alucard as its light variant.',
  dark: {
    surface: { base: '#282a36', sidebar: '#21222c', raised: '#2e303e', overlay: '#343746', sunken: '#1e1f29' },
    text: { primary: '#f8f8f2', secondary: '#d6d6e2', muted: '#a2abd0', inverted: '#21222c' },
    border: { subtle: '#3a3c4e', strong: '#525570' },
    accent: { base: '#bd93f9', hover: '#cfadfb', fg: '#21222c' },
    status: { ok: '#50fa7b', info: '#8be9fd', warn: '#ffb86c', danger: '#ff6e6e' },
    severity: { trace: '#a2abd0', debug: '#d6d6e2', info: '#8be9fd', warn: '#f1fa8c', error: '#ff6e6e', fatal: '#ff79c6' },
    data: {
      categorical: ['#bd93f9', '#8be9fd', '#50fa7b', '#ffb86c', '#ff79c6', '#f1fa8c', '#ff6e6e', '#a2abd0'],
      sequential: ['#3b2d5c', '#bd93f9'],
      diverging: ['#ff6e6e', '#44475a', '#50fa7b'],
    },
  },
  light: {
    surface: { base: '#f5f1fd', sidebar: '#e9e1f9', raised: '#fcfaff', overlay: '#ffffff', sunken: '#eee8fb' },
    text: { primary: '#282a36', secondary: '#44475a', muted: '#5c5878', inverted: '#f8f8f2' },
    border: { subtle: '#e2daf5', strong: '#c9bdea' },
    accent: { base: '#7047d6', hover: '#5d38bd', fg: '#ffffff' },
    status: { ok: '#1b7535', info: '#0a6a8c', warn: '#875500', danger: '#c0362c' },
    severity: { trace: '#5c5878', debug: '#44475a', info: '#0a6a8c', warn: '#9c4f00', error: '#c0362c', fatal: '#b0217a' },
    data: {
      categorical: ['#7047d6', '#0b7ea3', '#1f8a3c', '#c25e00', '#c42d86', '#8a7a00', '#cf3a2b', '#6b6790'],
      sequential: ['#ece6fb', '#7047d6'],
      diverging: ['#cf3a2b', '#c9bdea', '#1f8a3c'],
    },
  },
};

export const solarized: Theme = {
  id: 'solarized',
  name: 'Solarized',
  description: 'Ethan Schoonover’s Solarized, light and dark.',
  dark: {
    surface: { base: '#002b36', sidebar: '#00232c', raised: '#073642', overlay: '#0a3d4a', sunken: '#00212a' },
    text: { primary: '#eee8d5', secondary: '#a7b2b2', muted: '#97a7a8', inverted: '#002b36' },
    border: { subtle: '#0f4351', strong: '#2b5866' },
    accent: { base: '#2aa1e3', hover: '#4fb3ea', fg: '#002b36' },
    status: { ok: '#9cb300', info: '#3fa0e6', warn: '#c99a00', danger: '#f77a72' },
    severity: { trace: '#97a7a8', debug: '#a7b2b2', info: '#3fa0e6', warn: '#c99a00', error: '#f77a72', fatal: '#ee7ab4' },
    data: {
      categorical: ['#268bd2', '#2aa198', '#859900', '#b58900', '#e2703a', '#e35a98', '#8b8fe0', '#ec5a55'],
      sequential: ['#0a3d4a', '#2aa198'],
      diverging: ['#dc322f', '#2b5866', '#859900'],
    },
  },
  light: {
    surface: { base: '#fdf6e3', sidebar: '#eee8d5', raised: '#fffbf0', overlay: '#fffbf0', sunken: '#f5efdc' },
    text: { primary: '#002b36', secondary: '#3f535a', muted: '#536a71', inverted: '#fdf6e3' },
    border: { subtle: '#e6dfc8', strong: '#d9b99b' },
    accent: { base: '#b3420f', hover: '#963709', fg: '#ffffff' },
    status: { ok: '#5c6b00', info: '#1f6fa8', warn: '#7d5f00', danger: '#b8291f' },
    severity: { trace: '#536a71', debug: '#3f535a', info: '#1f6fa8', warn: '#9a4a12', error: '#b8291f', fatal: '#a32867' },
    data: {
      categorical: ['#cb4b16', '#268bd2', '#2aa198', '#859900', '#b58900', '#d33682', '#6c71c4', '#dc322f'],
      sequential: ['#f6dfcc', '#cb4b16'],
      diverging: ['#dc322f', '#d9b99b', '#859900'],
    },
  },
};

export const terracotta: Theme = {
  id: 'terracotta',
  name: 'Terracotta',
  description: 'Warm greys with a terracotta accent.',
  dark: {
    surface: { base: '#1f1e1d', sidebar: '#1a1918', raised: '#262624', overlay: '#2b2a28', sunken: '#171716' },
    text: { primary: '#f0efec', secondary: '#c3c2b7', muted: '#9c9a91', inverted: '#141413' },
    border: { subtle: '#33322f', strong: '#47453f' },
    accent: { base: '#d97757', hover: '#e38c6f', fg: '#1a0f0a' },
    status: { ok: '#8bc28c', info: '#7aa7e0', warn: '#e3b25b', danger: '#f07a72' },
    severity: { trace: '#9c9a91', debug: '#c3c2b7', info: '#7aa7e0', warn: '#e3b25b', error: '#f07a72', fatal: '#d48ce6' },
    data: {
      categorical: ['#d97757', '#7aa7e0', '#e3b25b', '#8bc28c', '#c792ea', '#6cc2bd', '#e58fb0', '#b9a37a'],
      sequential: ['#3a2a22', '#e9a58b'],
      diverging: ['#f07a72', '#47453f', '#8bc28c'],
    },
  },
  light: {
    surface: { base: '#faf9f5', sidebar: '#f3f1ea', raised: '#ffffff', overlay: '#ffffff', sunken: '#efede5' },
    text: { primary: '#141413', secondary: '#3d3d3a', muted: '#6a6963', inverted: '#faf9f5' },
    border: { subtle: '#e8e6dc', strong: '#d1cfc5' },
    accent: { base: '#b5583a', hover: '#9c4a30', fg: '#ffffff' },
    status: { ok: '#3f7d3c', info: '#2f5fa8', warn: '#85600f', danger: '#b3261e' },
    severity: { trace: '#6a6963', debug: '#3d3d3a', info: '#2f5fa8', warn: '#94570f', error: '#b3261e', fatal: '#8e3aa8' },
    data: {
      categorical: ['#c96442', '#2f5fa8', '#b7861b', '#3f7d3c', '#7b4fb0', '#2c8a84', '#c0507a', '#7a6a48'],
      sequential: ['#f6e3db', '#b5583a'],
      diverging: ['#b3261e', '#d1cfc5', '#3f7d3c'],
    },
  },
};
