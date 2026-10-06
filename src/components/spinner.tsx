import { LoaderCircle } from 'lucide-react';
import { cn } from '../lib/cn.ts';

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return <LoaderCircle role="status" aria-label={label} className={cn('size-4 animate-spin text-fg-muted', className)} />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn('animate-pulse rounded-md bg-selected', className)} />;
}

export function LoadingBlock({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-2 py-12 text-fg-muted', className)}>
      <Spinner label={label} />
      <span>{label}</span>
    </div>
  );
}
