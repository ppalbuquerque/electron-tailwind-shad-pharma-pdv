import { createContext, useContext, useRef, ReactNode, MutableRefObject } from 'react'
import { sidebarRoutes } from '@/lib/sidebar-routes'

interface SidebarNavigationContextValue {
  linkRefs: MutableRefObject<HTMLAnchorElement[]>
  currentLinkFocused: MutableRefObject<number>
  focusByPath: (path: string) => void
  registerContentFocus: (cb: (() => void) | null) => void
  triggerContentFocus: () => void
}

const SidebarNavigationContext = createContext<SidebarNavigationContextValue | null>(null)

function SidebarNavigationProvider({ children }: { children: ReactNode }): ReactNode {
  const linkRefs = useRef<HTMLAnchorElement[]>([])
  const currentLinkFocused = useRef<number>(0)
  const contentFocusCallback = useRef<(() => void) | null>(null)

  function focusByPath(path: string): void {
    const index = sidebarRoutes.findIndex((route) => route.url === path)
    if (index === -1) return
    currentLinkFocused.current = index
    linkRefs.current[index]?.focus()
  }

  function registerContentFocus(cb: (() => void) | null): void {
    contentFocusCallback.current = cb
  }

  function triggerContentFocus(): void {
    contentFocusCallback.current?.()
  }

  return (
    <SidebarNavigationContext.Provider
      value={{
        linkRefs,
        currentLinkFocused,
        focusByPath,
        registerContentFocus,
        triggerContentFocus
      }}
    >
      {children}
    </SidebarNavigationContext.Provider>
  )
}

function useSidebarNavigationContext(): SidebarNavigationContextValue {
  const ctx = useContext(SidebarNavigationContext)
  if (!ctx) {
    throw new Error('useSidebarNavigationContext must be used within SidebarNavigationProvider')
  }
  return ctx
}

export { SidebarNavigationProvider, useSidebarNavigationContext }
