export type Scheme = 'light' | 'dark';
export type Mode = Scheme | 'system';

export type Severity = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Status = 'ok' | 'info' | 'warn' | 'danger';

export interface ThemeVariant {
  surface: { base: string; sidebar: string; raised: string; overlay: string; sunken: string };
  text: { primary: string; secondary: string; muted: string; inverted: string };
  border: { subtle: string; strong: string };
  accent: { base: string; hover: string; fg: string };
  status: Record<Status, string>;
  severity: Record<Severity, string>;
  data: {
    categorical: [string, string, string, string, string, string, string, string];
    sequential: [string, string];
    diverging: [string, string, string];
  };
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  light?: ThemeVariant;
  dark?: ThemeVariant;
}
