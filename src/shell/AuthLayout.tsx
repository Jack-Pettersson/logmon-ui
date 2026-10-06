import type { ReactNode } from 'react';
import { LogmonMark } from './Brand.tsx';

export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <LogmonMark className="size-9" />
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-fg-muted">{description}</p>}
        </div>
        <div className="rounded-2xl border border-line bg-raised p-6">{children}</div>
        {footer && (
          <div className="text-center text-sm text-fg-muted [&_a]:text-accent [&_a]:underline-offset-4 hover:[&_a]:underline">{footer}</div>
        )}
      </div>
    </div>
  );
}
