import { variantVars } from '../src/theme/css.ts';
import { variantOf } from '../src/theme/registry.ts';
import type { Scheme, Theme } from '../src/theme/types.ts';

export * from '../src/index.ts';

export function variantVarsFor(theme: Theme, scheme: Scheme): Record<string, string> {
  return variantVars(variantOf(theme, scheme).variant);
}
