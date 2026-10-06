import type { Theme, ThemeVariant } from './types.ts';

export function variantVars(v: ThemeVariant): Record<string, string> {
  return {
    '--color-bg': v.surface.base,
    '--color-sidebar': v.surface.sidebar,
    '--color-raised': v.surface.raised,
    '--color-overlay': v.surface.overlay,
    '--color-sunken': v.surface.sunken,
    '--color-fg': v.text.primary,
    '--color-fg-secondary': v.text.secondary,
    '--color-fg-muted': v.text.muted,
    '--color-fg-inverted': v.text.inverted,
    '--color-line': v.border.subtle,
    '--color-line-strong': v.border.strong,
    '--color-accent': v.accent.base,
    '--color-accent-hover': v.accent.hover,
    '--color-accent-fg': v.accent.fg,
    '--color-ok': v.status.ok,
    '--color-info': v.status.info,
    '--color-warn': v.status.warn,
    '--color-danger': v.status.danger,
    '--color-sev-trace': v.severity.trace,
    '--color-sev-debug': v.severity.debug,
    '--color-sev-info': v.severity.info,
    '--color-sev-warn': v.severity.warn,
    '--color-sev-error': v.severity.error,
    '--color-sev-fatal': v.severity.fatal,
    ...Object.fromEntries(v.data.categorical.map((c, i) => [`--color-data-${i + 1}`, c])),
    '--color-seq-0': v.data.sequential[0],
    '--color-seq-1': v.data.sequential[1],
    '--color-div-neg': v.data.diverging[0],
    '--color-div-mid': v.data.diverging[1],
    '--color-div-pos': v.data.diverging[2],
  };
}

function block(selector: string, scheme: 'light' | 'dark', v: ThemeVariant): string {
  const decls = Object.entries(variantVars(v))
    .map(([k, val]) => `  ${k}: ${val};`)
    .join('\n');
  return `${selector} {\n  color-scheme: ${scheme};\n${decls}\n}`;
}

export function themesCss(themes: readonly Theme[]): string {
  const blocks: string[] = [];
  for (const t of themes) {
    for (const scheme of ['light', 'dark'] as const) {
      const v = t[scheme];
      if (v) blocks.push(block(`:root[data-theme='${t.id}'][data-scheme='${scheme}']`, scheme, v));
    }
  }
  return blocks.join('\n\n') + '\n';
}
