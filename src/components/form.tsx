import {
  Checkbox as CheckboxPrimitive,
  Label as LabelPrimitive,
  RadioGroup as RadioPrimitive,
  Slider as SliderPrimitive,
  Switch as SwitchPrimitive,
} from 'radix-ui';
import { Check } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

export const controlClass =
  'w-full rounded-lg border border-line-strong bg-raised dark:bg-sunken px-2.5 text-sm text-fg placeholder:text-fg-muted transition-colors hover:border-fg-muted focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-danger';

export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return <input type={type} className={cn(controlClass, 'h-8', className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlClass, 'min-h-20 py-2 leading-relaxed', className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root className={cn('text-[13px] font-medium text-fg-secondary', className)} {...props} />;
}

export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: (ids: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode;
}

export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {hint && !error && (
        <p id={hintId} className="text-xs text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-line-strong bg-raised transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-fg dark:bg-sunken',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export function CheckboxField({
  label,
  hint,
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root> & { label: ReactNode; hint?: ReactNode }) {
  const id = useId();
  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <Checkbox id={id} className="mt-0.5" {...props} />
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="cursor-pointer text-sm text-fg peer-disabled:cursor-not-allowed">
          {label}
        </label>
        {hint && <p className="text-xs text-fg-muted">{hint}</p>}
      </div>
    </div>
  );
}

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-line-strong transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-4 translate-x-0.5 rounded-full bg-fg shadow transition-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-accent-fg" />
    </SwitchPrimitive.Root>
  );
}

export function SwitchField({
  label,
  hint,
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & { label: ReactNode; hint?: ReactNode }) {
  const id = useId();
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-fg">
          {label}
        </label>
        {hint && <p className="text-xs text-fg-muted">{hint}</p>}
      </div>
      <Switch id={id} {...props} />
    </div>
  );
}

export interface RadioOption<T extends string> {
  value: T;
  label: ReactNode;
  hint?: ReactNode;
}

export function RadioGroup<T extends string>({
  value,
  onValueChange,
  options,
  className,
  ...props
}: Omit<ComponentProps<typeof RadioPrimitive.Root>, 'value' | 'onValueChange'> & {
  value: T;
  onValueChange: (v: T) => void;
  options: RadioOption<T>[];
}) {
  const baseId = useId();
  return (
    <RadioPrimitive.Root
      value={value}
      onValueChange={(v) => onValueChange(v as T)}
      className={cn('flex flex-col gap-2', className)}
      {...props}
    >
      {options.map((o) => (
        <div key={o.value} className="flex items-start gap-2.5">
          <RadioPrimitive.Item
            id={`${baseId}-${o.value}`}
            value={o.value}
            className="mt-0.5 inline-flex size-4 cursor-pointer items-center justify-center rounded-full border border-line-strong bg-raised disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-accent dark:bg-sunken"
          >
            <RadioPrimitive.Indicator className="size-2 rounded-full bg-accent" />
          </RadioPrimitive.Item>
          <label htmlFor={`${baseId}-${o.value}`} className="flex cursor-pointer flex-col gap-0.5 text-sm">
            {o.label}
            {o.hint && <span className="text-xs text-fg-muted">{o.hint}</span>}
          </label>
        </div>
      ))}
    </RadioPrimitive.Root>
  );
}

export function Slider({ className, ...props }: ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn('relative flex h-5 w-full touch-none items-center select-none data-[disabled]:opacity-50', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 grow overflow-hidden rounded-full bg-line-strong">
        <SliderPrimitive.Range className="absolute h-full bg-accent" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={props['aria-label']}
        className="block size-4 cursor-grab rounded-full border-2 border-accent bg-raised shadow transition-transform hover:scale-110 focus-visible:ring-4 focus-visible:ring-accent-soft focus-visible:outline-none active:cursor-grabbing"
      />
    </SliderPrimitive.Root>
  );
}
