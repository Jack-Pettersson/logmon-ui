import { Tabs as TabsPrimitive, ToggleGroup } from 'radix-ui';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export function Page({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) {
  return (
    <div className={cn('mx-auto flex w-full flex-col gap-6 px-6 py-6 lg:px-8', wide ? 'max-w-none' : 'max-w-6xl', className)}>
      {children}
    </div>
  );
}

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: ReactNode;
  meta?: ReactNode;
}

export function PageHeader({ title, description, actions, back, meta }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      {back}
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold tracking-tight text-fg">{title}</h1>
            {meta}
          </div>
          {description && <p className="text-sm text-fg-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export interface PanelProps extends Omit<ComponentProps<'section'>, 'title'> {
  title?: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  flush?: boolean;
}

export function Panel({ title, icon, description, actions, flush, className, children, ...props }: PanelProps) {
  const hasHeader = title || actions;
  return (
    <section className={cn('flex min-w-0 flex-col rounded-xl border border-line bg-raised', className)} {...props}>
      {hasHeader && (
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-2.5">
          <div className="flex min-w-0 flex-col">
            <h2 className="flex items-center gap-2 text-[13px] font-medium text-fg-secondary [&_svg]:size-4 [&_svg]:text-fg-muted">
              {icon}
              {title}
            </h2>
            {description && <p className="text-xs text-fg-muted">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(flush ? '' : 'p-4')}>{children}</div>
    </section>
  );
}

export interface Stat {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: 'ok' | 'warn' | 'danger' | 'info';
}

const statTone = { ok: 'text-ok', warn: 'text-warn', danger: 'text-danger', info: 'text-info' };

export function StatStrip({ stats, className }: { stats: Stat[]; className?: string }) {
  return (
    <div
      className={cn('grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-(--cols)', className)}
      style={{ '--cols': `repeat(${stats.length}, minmax(0, 1fr))` } as CSSProperties}
    >
      {stats.map((s, i) => (
        <div key={i} className="flex min-w-0 flex-col gap-1 bg-raised px-4 py-3.5">
          <span className="truncate text-[13px] text-fg-muted">{s.label}</span>
          <span className={cn('truncate text-2xl font-semibold tracking-tight tabular-nums', s.tone ? statTone[s.tone] : 'text-fg')}>
            {s.value}
          </span>
          {s.hint && <span className="truncate text-xs text-fg-muted">{s.hint}</span>}
        </div>
      ))}
    </div>
  );
}

export function Toolbar({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-wrap items-end gap-3', className)} {...props} />;
}

export function Separator({ className }: { className?: string }) {
  return <div role="separator" className={cn('h-px w-full bg-line', className)} />;
}

export function KeyValue({ items, className }: { items: { label: ReactNode; value: ReactNode; mono?: boolean }[]; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-6 gap-y-4', className)}>
      {items.map((it, i) => (
        <div key={i} className="flex min-w-0 flex-col gap-0.5">
          <dt className="text-xs text-fg-muted">{it.label}</dt>
          <dd className={cn('truncate text-sm text-fg', it.mono && 'font-mono text-[13px]')}>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn('flex gap-1 overflow-x-auto border-b border-line', className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        '-mb-px inline-flex h-9 cursor-pointer items-center gap-1.5 border-b-2 border-transparent px-2.5 text-sm whitespace-nowrap text-fg-muted transition-colors hover:text-fg data-[state=active]:border-fg data-[state=active]:text-fg [&_svg]:size-4',
        className,
      )}
      {...props}
    />
  );
}

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
}

export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  className,
  size = 'md',
  disabled,
  'aria-label': ariaLabel,
}: {
  value: T;
  onValueChange: (v: T) => void;
  options: SegmentOption<T>[];
  className?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  'aria-label'?: string;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onValueChange(v as T)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex w-fit items-center gap-0.5 rounded-lg border border-line bg-sunken p-0.5',
        disabled && 'opacity-60',
        className,
      )}
    >
      {options.map((o) => (
        <ToggleGroup.Item
          key={o.value}
          value={o.value}
          className={cn(
            'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 font-medium text-fg-muted transition-colors hover:text-fg disabled:cursor-not-allowed data-[state=on]:bg-raised data-[state=on]:text-fg data-[state=on]:shadow-[0_0_0_1px_var(--color-line)] [&_svg]:size-3.5',
            size === 'sm' ? 'h-6 text-xs' : 'h-7 text-[13px]',
          )}
        >
          {o.icon}
          {o.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
