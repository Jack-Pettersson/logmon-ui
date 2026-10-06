import { AlertDialog } from 'radix-ui';
import { createContext, use, useCallback, useRef, useState, type ReactNode } from 'react';
import { Button } from './button.tsx';

export interface ConfirmOptions {
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>((opts) => {
    resolverRef.current?.(false);
    setOptions(opts);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const settle = (ok: boolean) => {
    resolverRef.current?.(ok);
    resolverRef.current = null;
    setOptions(null);
  };

  return (
    <ConfirmContext value={confirm}>
      {children}
      <AlertDialog.Root open={options !== null} onOpenChange={(open) => !open && settle(false)}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-[rgb(0_0_0/0.5)]" />
          <AlertDialog.Content className="fixed top-[18vh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 animate-in rounded-2xl border border-line bg-overlay p-5 text-fg shadow-pop">
            <AlertDialog.Title className="text-base font-semibold">{options?.title}</AlertDialog.Title>
            <AlertDialog.Description asChild={typeof options?.description !== 'string'} className="mt-2 text-sm text-fg-secondary">
              {typeof options?.description === 'string' ? options.description : <div>{options?.description}</div>}
            </AlertDialog.Description>
            <div className="mt-5 flex justify-end gap-2">
              <AlertDialog.Cancel asChild>
                <Button variant="secondary">{options?.cancelLabel ?? 'Cancel'}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button variant={options?.tone === 'danger' ? 'destructive' : 'primary'} onClick={() => settle(true)}>
                  {options?.confirmLabel ?? 'Confirm'}
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </ConfirmContext>
  );
}

export function useConfirm(): Confirm {
  const ctx = use(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return ctx;
}
