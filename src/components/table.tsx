import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn.ts';
import { Button } from './button.tsx';

export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full border-collapse text-left text-sm', className)} {...props} />
    </div>
  );
}

export function THead({ className, ...props }: ComponentProps<'thead'>) {
  return <thead className={cn('border-b border-line', className)} {...props} />;
}

export function TBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody className={cn('[&>tr]:border-b [&>tr]:border-line [&>tr:last-child]:border-0', className)} {...props} />;
}

export function TR({ className, interactive, ...props }: ComponentProps<'tr'> & { interactive?: boolean }) {
  return <tr className={cn(interactive && 'cursor-pointer transition-colors hover:bg-hover', className)} {...props} />;
}

export function TH({ className, ...props }: ComponentProps<'th'>) {
  return <th className={cn('h-9 px-4 text-xs font-medium whitespace-nowrap text-fg-muted first:pl-4', className)} {...props} />;
}

export function TD({ className, ...props }: ComponentProps<'td'>) {
  return <td className={cn('px-4 py-2.5 align-middle', className)} {...props} />;
}

export function TableEmpty({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-fg-muted [&_a]:text-accent">
        {children}
      </td>
    </tr>
  );
}

export function Pagination({
  offset,
  pageSize,
  hasMore,
  onChange,
  disabled,
  count,
}: {
  offset: number;
  pageSize: number;
  hasMore: boolean;
  onChange: (offset: number) => void;
  disabled?: boolean;
  count?: number;
}) {
  const shown = count ?? pageSize;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs text-fg-muted">
      <span className="tabular-nums">{shown === 0 ? 'No results' : `${offset + 1}–${offset + shown}`}</span>
      <div className="flex gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Previous page"
          disabled={disabled || offset === 0}
          onClick={() => onChange(Math.max(0, offset - pageSize))}
        >
          <ChevronLeft />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Next page"
          disabled={disabled || !hasMore}
          onClick={() => onChange(offset + pageSize)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
