import type { ThemeVariant } from './types.ts';

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`expected #rrggbb, got ${hex}`);
  const n = parseInt(m[1]!, 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

export interface ContrastCheck {
  label: string;
  fg: string;
  bg: string;
  min: number;
}

export const TEXT_MIN = 4.5;
export const GRAPHIC_MIN = 3;

export function contrastChecks(v: ThemeVariant): ContrastCheck[] {
  const checks: ContrastCheck[] = [];
  const surfaces = Object.entries(v.surface);
  for (const [surface, bg] of surfaces) {
    for (const role of ['primary', 'secondary', 'muted'] as const) {
      checks.push({ label: `text.${role} on surface.${surface}`, fg: v.text[role], bg, min: TEXT_MIN });
    }
  }
  for (const bg of [v.surface.base, v.surface.raised]) {
    for (const [name, c] of Object.entries(v.status)) {
      checks.push({ label: `status.${name} on ${bg}`, fg: c, bg, min: TEXT_MIN });
    }
    for (const [name, c] of Object.entries(v.severity)) {
      checks.push({ label: `severity.${name} on ${bg}`, fg: c, bg, min: TEXT_MIN });
    }
    checks.push({ label: `accent.base as link on ${bg}`, fg: v.accent.base, bg, min: TEXT_MIN });
  }
  checks.push({ label: 'accent.fg on accent.base', fg: v.accent.fg, bg: v.accent.base, min: TEXT_MIN });
  checks.push({ label: 'accent.fg on accent.hover', fg: v.accent.fg, bg: v.accent.hover, min: TEXT_MIN });
  checks.push({ label: 'text.inverted on text.primary', fg: v.text.inverted, bg: v.text.primary, min: TEXT_MIN });
  checks.push({ label: 'border.strong on surface.base', fg: v.border.strong, bg: v.surface.base, min: 1.3 });
  v.data.categorical.forEach((c, i) => {
    checks.push({ label: `data.categorical[${i}] on surface.raised`, fg: c, bg: v.surface.raised, min: GRAPHIC_MIN });
  });
  return checks;
}

export function contrastFailures(v: ThemeVariant): (ContrastCheck & { ratio: number })[] {
  return contrastChecks(v)
    .map((c) => ({ ...c, ratio: contrast(c.fg, c.bg) }))
    .filter((c) => c.ratio < c.min);
}
