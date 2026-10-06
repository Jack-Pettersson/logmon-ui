import { useCallback, useState } from 'react';

// localStorage can throw (private mode, quota); a lost preference must never break the page.
export function usePersistentState<T>(key: string, fallback: T, valid: (v: unknown) => boolean = () => true): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      const parsed: unknown = JSON.parse(raw);
      return valid(parsed) ? (parsed as T) : fallback;
    } catch {
      return fallback;
    }
  });
  const set = useCallback(
    (v: T) => {
      setValue(v);
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {
        // Session keeps the value; persistence is best-effort.
      }
    },
    [key],
  );
  return [value, set];
}
