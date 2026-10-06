import { ChevronsUpDown, LogOut, Palette } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Dialog } from '../components/overlay.tsx';
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from '../components/overlay.tsx';
import { cn } from '../lib/cn.ts';
import { ThemePicker } from '../theme/ThemePicker.tsx';
import { useSidebar } from './sidebarContext.ts';

function initials(name: string): string {
  const parts = name.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-selected text-xs font-semibold text-fg',
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export interface UserMenuProps {
  name: string;
  subtitle?: ReactNode;
  children?: ReactNode;
  onSignOut?: () => void;
}

export function UserMenu({ name, subtitle, children, onSignOut }: UserMenuProps) {
  const { collapsed } = useSidebar();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  return (
    <>
      <Menu>
        <MenuTrigger
          className={cn(
            'flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-lg px-1.5 text-left transition-colors outline-none hover:bg-hover data-[state=open]:bg-hover',
            collapsed && 'justify-center px-0',
          )}
          aria-label="Account menu"
        >
          <Avatar name={name} />
          {!collapsed && (
            <>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate text-sm text-fg">{name}</span>
                {subtitle && <span className="truncate text-xs text-fg-muted">{subtitle}</span>}
              </span>
              <ChevronsUpDown className="size-4 text-fg-muted" />
            </>
          )}
        </MenuTrigger>
        <MenuContent side="top" align="start" className="w-64">
          <MenuLabel className="truncate">{name}</MenuLabel>
          {children}
          <MenuItem onSelect={() => setAppearanceOpen(true)}>
            <Palette />
            Appearance
          </MenuItem>
          {onSignOut && (
            <>
              <MenuSeparator />
              <MenuItem onSelect={onSignOut}>
                <LogOut />
                Sign out
              </MenuItem>
            </>
          )}
        </MenuContent>
      </Menu>
      <Dialog
        open={appearanceOpen}
        onOpenChange={setAppearanceOpen}
        title="Appearance"
        description="Applies across logmon on this browser."
        className="max-w-xl"
      >
        <ThemePicker />
      </Dialog>
    </>
  );
}
