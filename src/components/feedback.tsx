import { cva, type VariantProps } from 'class-variance-authority';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.ts';
import type { Severity } from '../theme/types.ts';

export const badgeVariants = cva(
  'inline-flex h-5 shrink-0 items-center gap-1 rounded-md px-1.5 text-xs font-medium whitespace-nowrap [&_svg]:size-3',
  {
    variants: {
      tone: {
        neutral: 'bg-selected text-fg-secondary',
        accent: 'bg-accent-soft text-accent',
        ok: 'bg-ok-soft text-ok',
        info: 'bg-info-soft text-info',
        warn: 'bg-warn-soft text-warn',
        danger: 'bg-danger-soft text-danger',
        outline: 'border border-line-strong text-fg-secondary',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export type Tone = NonNullable<VariantProps<typeof badgeVariants>['tone']>;

export function Badge({ className, tone, ...props }: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

const severityText: Record<Severity, string> = {
  trace: 'text-sev-trace',
  debug: 'text-sev-debug',
  info: 'text-sev-info',
  warn: 'text-sev-warn',
  error: 'text-sev-error',
  fatal: 'text-sev-fatal',
};

export function severityVar(s: Severity): string {
  return `var(--color-sev-${s})`;
}

export function SeverityBadge({ severity, children, className }: { severity: Severity; children?: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded-md px-1.5 font-mono text-[11px] font-semibold tracking-wide uppercase',
        severityText[severity],
        className,
      )}
      style={{ backgroundColor: `color-mix(in oklab, ${severityVar(severity)} 14%, transparent)` }}
    >
      {children ?? severity}
    </span>
  );
}

const dotTone: Record<Tone, string> = {
  neutral: 'bg-fg-muted',
  accent: 'bg-accent',
  ok: 'bg-ok',
  info: 'bg-info',
  warn: 'bg-warn',
  danger: 'bg-danger',
  outline: 'border border-fg-muted',
};

export function StatusDot({ tone = 'neutral', pulse, className }: { tone?: Tone; pulse?: boolean; className?: string }) {
  return (
    <span className={cn('relative inline-flex size-2 shrink-0', className)} aria-hidden>
      {pulse && <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', dotTone[tone])} />}
      <span className={cn('relative inline-flex size-2 rounded-full', dotTone[tone])} />
    </span>
  );
}

const calloutTone = {
  info: { box: 'border-info-line bg-info-soft', icon: <Info className="text-info" /> },
  ok: { box: 'border-ok-line bg-ok-soft', icon: <CircleCheck className="text-ok" /> },
  warn: { box: 'border-warn-line bg-warn-soft', icon: <TriangleAlert className="text-warn" /> },
  danger: { box: 'border-danger-line bg-danger-soft', icon: <CircleAlert className="text-danger" /> },
  neutral: { box: 'border-line bg-raised', icon: <Info className="text-fg-muted" /> },
};

export interface CalloutProps {
  tone?: keyof typeof calloutTone;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Callout({ tone = 'info', title, children, action, className }: CalloutProps) {
  const t = calloutTone[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 rounded-xl border px-3.5 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
        t.box,
        className,
      )}
    >
      {t.icon}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title && <p className="font-medium text-fg">{title}</p>}
        {children && <div className="text-fg-secondary [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center gap-2 px-6 py-12 text-center', className)}>
      {icon && <div className="mb-1 rounded-xl border border-line bg-sunken p-2.5 text-fg-muted [&_svg]:size-5">{icon}</div>}
      <p className="text-sm font-medium text-fg">{title}</p>
      {children && (
        <div className="max-w-md text-sm text-fg-muted [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline">{children}</div>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
