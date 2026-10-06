import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.ts';
import { Spinner } from './spinner.tsx';

export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-accent-fg hover:bg-accent-hover',
        secondary: 'border border-line-strong bg-raised text-fg hover:bg-hover',
        ghost: 'text-fg-secondary hover:bg-hover hover:text-fg',
        danger: 'border border-danger-line text-danger hover:bg-danger-soft',
        destructive: 'bg-danger text-bg hover:opacity-90',
        inverted: 'bg-fg text-fg-inverted hover:opacity-90',
        link: 'h-auto px-0 text-accent underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-7 px-2.5 text-[13px]',
        md: 'h-8 px-3 text-sm',
        lg: 'h-10 px-4 text-sm',
        icon: 'size-8',
        'icon-sm': 'size-7 [&_svg]:size-3.5',
      },
    },
    defaultVariants: { variant: 'secondary', size: 'md' },
  },
);

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({ className, variant, size, asChild, loading, disabled, children, type, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (asChild) {
    return (
      <Slot.Root className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }
  return (
    <button type={type ?? 'button'} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Spinner className="size-3.5 text-current" />}
      {children}
    </button>
  );
}
