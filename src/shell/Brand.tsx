import type { ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export function LogmonMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('size-6 shrink-0', className)} aria-hidden>
      <rect width="24" height="24" rx="6" fill="var(--color-accent)" />
      <rect x="5.5" y="6.5" width="13" height="2.2" rx="1.1" fill="var(--color-accent-fg)" />
      <rect x="5.5" y="10.9" width="8.5" height="2.2" rx="1.1" fill="var(--color-accent-fg)" opacity="0.75" />
      <rect x="5.5" y="15.3" width="11" height="2.2" rx="1.1" fill="var(--color-accent-fg)" opacity="0.5" />
    </svg>
  );
}

export function Brand({ product = 'logmon', context, className }: { product?: ReactNode; context?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <LogmonMark />
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[15px] font-semibold tracking-tight text-fg">{product}</span>
        {context && <span className="truncate text-xs text-fg-muted">{context}</span>}
      </div>
    </div>
  );
}
