import { createContext, use } from 'react';

export const SidebarContext = createContext({ collapsed: false });

export function useSidebar() {
  return use(SidebarContext);
}
