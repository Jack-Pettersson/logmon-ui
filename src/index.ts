export { cn } from './lib/cn.ts';
export { copyText } from './lib/clipboard.ts';
export * from './lib/format.ts';
export * from './lib/timeRange.ts';
export { usePersistentState } from './lib/usePersistentState.ts';

export type { Mode, Scheme, Severity, Status, Theme, ThemeVariant } from './theme/types.ts';
export { themes, getTheme, isThemeId, DEFAULT_THEME_ID } from './theme/registry.ts';
export { ThemeProvider, useTheme, type ThemeProviderProps } from './theme/ThemeProvider.tsx';
export { ThemePicker } from './theme/ThemePicker.tsx';
export { COOKIE_NAME, META_COOKIE_DOMAIN, META_OVERRIDE, type Preference, type Appearance } from './theme/preference.ts';

export { Button, buttonVariants, type ButtonProps } from './components/button.tsx';
export { Spinner, Skeleton, LoadingBlock } from './components/spinner.tsx';
export {
  Input,
  Textarea,
  Label,
  Field,
  Checkbox,
  CheckboxField,
  Switch,
  SwitchField,
  RadioGroup,
  Slider,
  controlClass,
  type RadioOption,
} from './components/form.tsx';
export { Select, type SelectOption } from './components/select.tsx';
export {
  Dialog,
  DialogClose,
  Popover,
  PopoverClose,
  Tooltip,
  TooltipProvider,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  MenuLabel,
  MenuSeparator,
} from './components/overlay.tsx';
export { ConfirmProvider, useConfirm, type ConfirmOptions } from './components/confirm.tsx';
export { Toaster, toast } from './components/toast.tsx';
export { Badge, SeverityBadge, StatusDot, Callout, EmptyState, badgeVariants, severityVar, type Tone } from './components/feedback.tsx';
export {
  Page,
  PageHeader,
  Panel,
  StatStrip,
  Toolbar,
  Separator,
  KeyValue,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SegmentedControl,
  type Stat,
} from './components/layout.tsx';
export { Table, THead, TBody, TR, TH, TD, TableEmpty, Pagination } from './components/table.tsx';
export { CopyButton, CodeBlock, Mono } from './components/code.tsx';
export { TimeRangePicker } from './components/time-range.tsx';
export { ErrorBoundary } from './components/error-boundary.tsx';

export { AppShell, type NavItem, type NavSection, type AppShellProps } from './shell/AppShell.tsx';
export { Brand, LogmonMark } from './shell/Brand.tsx';
export { UserMenu, Avatar } from './shell/UserMenu.tsx';
export { AuthLayout } from './shell/AuthLayout.tsx';
export { AppearanceButton } from './shell/AppearanceButton.tsx';
export { useSidebar } from './shell/sidebarContext.ts';
