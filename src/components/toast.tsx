import { Toast as ToastPrimitive } from 'radix-ui';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useSyncExternalStore, type ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

type Tone = 'info' | 'ok' | 'danger';

interface ToastItem {
  id: number;
  tone: Tone;
  title: ReactNode;
  description?: ReactNode;
}

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function push(tone: Tone, title: ReactNode, description?: ReactNode) {
  items = [...items, { id: nextId++, tone, title, description }];
  emit();
}

function dismiss(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

export const toast = Object.assign((title: ReactNode, description?: ReactNode) => push('info', title, description), {
  success: (title: ReactNode, description?: ReactNode) => push('ok', title, description),
  error: (title: ReactNode, description?: ReactNode) => push('danger', title, description),
});

const icons: Record<Tone, ReactNode> = {
  info: <Info className="size-4 text-info" />,
  ok: <CircleCheck className="size-4 text-ok" />,
  danger: <CircleAlert className="size-4 text-danger" />,
};

export function Toaster() {
  const list = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => items,
  );
  return (
    <ToastPrimitive.Provider duration={5000} swipeDirection="right">
      {list.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          type={t.tone === 'danger' ? 'foreground' : 'background'}
          duration={t.tone === 'danger' ? 8000 : 4000}
          onOpenChange={(open) => !open && dismiss(t.id)}
          className={cn(
            'flex w-full animate-in items-start gap-3 rounded-xl border border-line bg-overlay p-3 text-sm text-fg shadow-pop data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x)',
          )}
        >
          <span className="mt-0.5">{icons[t.tone]}</span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <ToastPrimitive.Title className="font-medium break-words">{t.title}</ToastPrimitive.Title>
            {t.description && <ToastPrimitive.Description className="text-fg-secondary">{t.description}</ToastPrimitive.Description>}
          </div>
          <ToastPrimitive.Close aria-label="Dismiss" className="rounded-md p-0.5 text-fg-muted hover:bg-hover hover:text-fg">
            <X className="size-3.5" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed right-0 bottom-0 z-[60] flex w-full max-w-sm flex-col gap-2 p-4 outline-none" />
    </ToastPrimitive.Provider>
  );
}
