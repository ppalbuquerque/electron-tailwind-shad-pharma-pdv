import { MutableRefObject } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'

import { HotkeyScope } from '@/lib/hotkey-scopes'
import { sidebarRoutes } from '@/lib/sidebar-routes'

interface UseSidebarNavigationParams {
  linkRefs: MutableRefObject<HTMLAnchorElement[]>
  currentLinkFocused: MutableRefObject<number>
  triggerContentFocus: () => void
}

function useSidebarNavigationViewModel({
  linkRefs,
  currentLinkFocused,
  triggerContentFocus,
}: UseSidebarNavigationParams): void {
  const navigate = useNavigate()
  const { location } = useRouterState()

  useHotkeys('f1', () => navigate({ to: '/' }), { scopes: [HotkeyScope.SIDEBAR], preventDefault: true })
  useHotkeys('f2', () => navigate({ to: '/checkout/open' }), {
    scopes: [HotkeyScope.SIDEBAR],
    preventDefault: true,
  })
  useHotkeys('f3', () => navigate({ to: '/orders/create' }), {
    scopes: [HotkeyScope.SIDEBAR],
    preventDefault: true,
  })
  useHotkeys('f4', () => navigate({ to: '/checkout/resume' }), {
    scopes: [HotkeyScope.SIDEBAR],
    preventDefault: true,
  })
  useHotkeys('f5', () => navigate({ to: '/orders/list' }), {
    scopes: [HotkeyScope.SIDEBAR],
    preventDefault: true,
  })
  useHotkeys('f6', () => navigate({ to: '/checkout/close' }), {
    scopes: [HotkeyScope.SIDEBAR],
    preventDefault: true,
  })
  useHotkeys('f7', () => navigate({ to: '/medication/list' }), {
    scopes: [HotkeyScope.SIDEBAR],
    preventDefault: true,
  })

  useHotkeys(
    'enter',
    () => {
      const focusedRoute = sidebarRoutes[currentLinkFocused.current]
      if (!focusedRoute) return

      if (focusedRoute.url === location.pathname) {
        triggerContentFocus()
      } else {
        navigate({ to: focusedRoute.url })
      }
    },
    { scopes: [HotkeyScope.SIDEBAR], preventDefault: true },
  )

  useHotkeys(
    'ArrowDown',
    () => {
      const nextIndex = currentLinkFocused.current + 1
      currentLinkFocused.current = Math.min(nextIndex, linkRefs.current.length - 1)
      linkRefs.current[currentLinkFocused.current]?.focus()
    },
    { scopes: [HotkeyScope.SIDEBAR] },
  )

  useHotkeys(
    'ArrowUp',
    () => {
      const nextIndex = currentLinkFocused.current - 1
      currentLinkFocused.current = Math.max(nextIndex, 0)
      linkRefs.current[currentLinkFocused.current]?.focus()
    },
    { scopes: [HotkeyScope.SIDEBAR] },
  )
}

export { useSidebarNavigationViewModel }
