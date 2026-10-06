import { Check, Copy } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { copyText } from '../lib/clipboard.ts';
import { cn } from '../lib/cn.ts';
import { Button } from './button.tsx';
import { Tooltip } from './overlay.tsx';
import { toast } from './toast.tsx';

export function CopyButton({
  value,
  label = 'Copy',
  disabled,
  className,
  showLabel,
}: {
  value: string | (() => Promise<string>);
  label?: string;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const onClick = async () => {
    try {
      await copyText(typeof value === 'string' ? value : await value());
      setCopied(true);
    } catch (err) {
      toast.error('Could not copy', err instanceof Error ? err.message : undefined);
    }
  };

  const icon = copied ? <Check className="text-ok" /> : <Copy />;
  if (showLabel) {
    return (
      <Button size="sm" variant="secondary" onClick={onClick} disabled={disabled} className={className}>
        {icon}
        {copied ? 'Copied' : label}
      </Button>
    );
  }
  return (
    <Tooltip content={copied ? 'Copied' : label}>
      <Button size="icon-sm" variant="ghost" aria-label={label} onClick={onClick} disabled={disabled} className={className}>
        {icon}
      </Button>
    </Tooltip>
  );
}

export function CodeBlock({
  children,
  copy,
  className,
}: {
  children: ReactNode;
  copy?: string | (() => Promise<string>);
  className?: string;
}) {
  return (
    <div
      className={cn('group relative flex min-w-0 items-start gap-2 rounded-lg border border-line bg-sunken py-2 pr-1.5 pl-3', className)}
    >
      <pre className="min-w-0 flex-1 overflow-x-auto py-0.5 font-mono text-[13px] leading-relaxed whitespace-pre text-fg">{children}</pre>
      {copy !== undefined && <CopyButton value={copy} />}
    </div>
  );
}

export function Mono({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn('font-mono text-[13px]', className)}>{children}</span>;
}
