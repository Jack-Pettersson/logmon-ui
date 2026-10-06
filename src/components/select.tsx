import { Select as SelectPrimitive } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export interface SelectOption<T extends string = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

// Radix reserves '' for "no selection"; map it so callers can use '' as a real value.
const EMPTY = '\u0000empty';
const toRadix = (v: string) => (v === '' ? EMPTY : v);
const fromRadix = (v: string) => (v === EMPTY ? '' : v);

export interface SelectProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  size?: 'sm' | 'md';
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export function Select<T extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  id,
  className,
  size = 'md',
  ...aria
}: SelectProps<T>) {
  return (
    <SelectPrimitive.Root value={toRadix(value)} onValueChange={(v) => onValueChange(fromRadix(v) as T)} disabled={disabled}>
      <SelectPrimitive.Trigger
        id={id}
        {...aria}
        className={cn(
          'inline-flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border border-line-strong bg-raised px-2.5 text-left text-fg transition-colors hover:border-fg-muted focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 data-[placeholder]:text-fg-muted dark:bg-sunken',
          size === 'sm' ? 'h-7 text-[13px]' : 'h-8 text-sm',
          className,
        )}
      >
        <span className="truncate">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon>
          <ChevronDown className="size-3.5 text-fg-muted" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) animate-in overflow-hidden rounded-lg border border-line bg-overlay p-1 text-sm text-fg shadow-pop"
        >
          <SelectPrimitive.Viewport>
            {options.map((o) => (
              <SelectPrimitive.Item
                key={o.value}
                value={toRadix(o.value)}
                disabled={o.disabled}
                className="relative flex h-8 cursor-pointer items-center gap-2 rounded-md pr-8 pl-2 outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-hover"
              >
                <SelectPrimitive.ItemText>{o.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2">
                  <Check className="size-3.5 text-accent" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
