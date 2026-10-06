import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { Callout } from '../components/feedback.tsx';
import { SegmentedControl } from '../components/layout.tsx';
import { cn } from '../lib/cn.ts';
import { getTheme, themes, variantOf } from './registry.ts';
import { useTheme } from './ThemeProvider.tsx';
import type { Mode, Theme } from './types.ts';

function Swatch({ theme, scheme }: { theme: Theme; scheme: 'light' | 'dark' }) {
  const { variant: v } = variantOf(theme, scheme);
  return (
    <div
      className="flex h-16 overflow-hidden rounded-md border"
      style={{ borderColor: v.border.subtle, background: v.surface.base }}
      aria-hidden
    >
      <div className="flex w-1/4 flex-col gap-1 p-1.5" style={{ background: v.surface.sidebar }}>
        <div className="h-1.5 w-full rounded-sm" style={{ background: v.text.muted, opacity: 0.5 }} />
        <div className="h-1.5 w-3/4 rounded-sm" style={{ background: v.text.muted, opacity: 0.35 }} />
        <div className="h-1.5 w-full rounded-sm" style={{ background: v.text.muted, opacity: 0.35 }} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <div className="h-2 w-1/2 rounded-sm" style={{ background: v.text.primary }} />
        <div
          className="flex flex-1 items-end gap-1 rounded-sm p-1"
          style={{ background: v.surface.raised, boxShadow: `inset 0 0 0 1px ${v.border.subtle}` }}
        >
          {v.data.categorical.slice(0, 4).map((c, i) => (
            <div key={c + i} className="w-1.5 rounded-[1px]" style={{ background: c, height: `${35 + ((i * 23) % 55)}%` }} />
          ))}
          <div className="ml-auto h-2.5 w-6 rounded-sm" style={{ background: v.accent.base }} />
        </div>
      </div>
    </div>
  );
}

const MODES = [
  { value: 'light' as const, label: 'Light', icon: <Sun /> },
  { value: 'dark' as const, label: 'Dark', icon: <Moon /> },
  { value: 'system' as const, label: 'System', icon: <Monitor /> },
];

export function ThemePicker() {
  const { preference, appearance, override, setPreference } = useTheme();
  return (
    <div className="flex flex-col gap-4">
      {override && (
        <Callout tone="info" title={`This cluster uses the ${getTheme(override).name} theme`}>
          An editor set it for everyone here. Your own choice below still applies on other logmon pages, and light/dark still follows you.
        </Callout>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">Mode</span>
        <SegmentedControl<Mode>
          aria-label="Color mode"
          value={preference.mode}
          onValueChange={(mode) => setPreference({ mode })}
          options={MODES}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Theme">
        {themes.map((t) => {
          const selected = preference.theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPreference({ theme: t.id })}
              className={cn(
                'flex cursor-pointer flex-col gap-2 rounded-lg border p-2 text-left transition-colors hover:bg-hover',
                selected ? 'border-accent ring-2 ring-accent-soft' : 'border-line',
              )}
            >
              <Swatch theme={t} scheme={appearance.scheme} />
              <span className="flex items-center justify-between gap-1 px-0.5 text-[13px] font-medium">
                {t.name}
                {selected && <Check className="size-3.5 text-accent" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
