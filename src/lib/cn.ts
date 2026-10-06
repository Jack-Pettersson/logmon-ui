import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const merge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'bg',
        'sidebar',
        'raised',
        'overlay',
        'sunken',
        'fg',
        'fg-secondary',
        'fg-muted',
        'fg-inverted',
        'line',
        'line-strong',
        'accent',
        'accent-hover',
        'accent-fg',
        'accent-soft',
        'ok',
        'info',
        'warn',
        'danger',
        'ok-soft',
        'info-soft',
        'warn-soft',
        'danger-soft',
        'ok-line',
        'info-line',
        'warn-line',
        'danger-line',
        'hover',
        'selected',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return merge(clsx(inputs));
}
