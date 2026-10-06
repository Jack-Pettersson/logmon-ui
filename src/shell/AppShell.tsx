import { Dialog as DialogPrimitive } from 'radix-ui';
import { Menu as MenuIcon, PanelLeft } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Button } from '../components/button.tsx';
import { Tooltip } from '../components/overlay.tsx';
import { cn } from '../lib/cn.ts';
import { usePersistentState } from '../lib/usePersistentState.ts';
import { SidebarContext, useSidebar } from './sidebarContext.ts';

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
  match?: (pathname: string) => boolean;
  badge?: ReactNode;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export interface AppShellProps {
  brand: ReactNode;
  nav: NavSection[];
  footer?: ReactNode;
  banner?: ReactNode;
  children: ReactNode;
}

function NavEntry({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const { collapsed } = useSidebar();
  const { pathname } = useLocation();
  const forced = item.match?.(pathname);
  const link = (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex h-8 items-center gap-2.5 rounded-lg px-2 text-sm transition-colors [&_svg]:size-4 [&_svg]:shrink-0',
          (forced ?? isActive) ? 'bg-selected text-fg' : 'text-fg-secondary hover:bg-hover hover:text-fg',
          collapsed && 'justify-center px-0',
        )
      }
    >
      {item.icon}
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge}
    </NavLink>
  );
  return collapsed ? (
    <Tooltip content={item.label} side="right">
      {link}
    </Tooltip>
  ) : (
    link
  );
}

function SidebarBody({
  brand,
  nav,
  footer,
  onNavigate,
  toggle,
}: Omit<AppShellProps, 'children' | 'banner'> & { onNavigate?: () => void; toggle?: ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div className="flex h-full flex-col gap-2 px-2 pt-2 pb-1.5">
      <div className={cn('flex h-10 items-center gap-1', collapsed ? 'flex-col justify-center' : 'justify-between pl-1')}>
        {!collapsed && <div className="min-w-0 flex-1">{brand}</div>}
        {toggle}
      </div>
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto" aria-label="Main">
        {nav.map((section, i) => (
          <div key={section.label ?? i} className="flex flex-col gap-0.5">
            {section.label && !collapsed && <p className="px-2 pb-1 text-[13px] text-fg-muted">{section.label}</p>}
            {section.items.map((item) => (
              <NavEntry key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        ))}
      </nav>
      {footer && <div className="border-t border-line pt-1.5">{footer}</div>}
    </div>
  );
}

export function AppShell({ brand, nav, footer, banner, children }: AppShellProps) {
  const [collapsed, setCollapsed] = usePersistentState('logmon.sidebar.collapsed', false, (v) => typeof v === 'boolean');
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (
    <Tooltip content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} side="right">
      <Button
        variant="ghost"
        size="icon"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={() => setCollapsed(!collapsed)}
      >
        <PanelLeft />
      </Button>
    </Tooltip>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
      <SidebarContext value={{ collapsed }}>
        <aside
          className={cn(
            'hidden shrink-0 border-r-[0.5px] border-line bg-sidebar transition-[width] duration-150 md:block',
            collapsed ? 'w-(--spacing-sidebar-rail)' : 'w-(--spacing-sidebar)',
          )}
        >
          <SidebarBody brand={brand} nav={nav} footer={footer} toggle={toggle} />
        </aside>
      </SidebarContext>

      <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[rgb(0_0_0/0.5)] md:hidden" />
          <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-[min(288px,85vw)] border-r border-line bg-sidebar md:hidden">
            <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">Main navigation</DialogPrimitive.Description>
            <SidebarContext value={{ collapsed: false }}>
              <SidebarBody brand={brand} nav={nav} footer={footer} onNavigate={() => setMobileOpen(false)} />
            </SidebarContext>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-sidebar px-3 md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </Button>
          <div className="min-w-0 flex-1">{brand}</div>
        </div>
        {banner}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
