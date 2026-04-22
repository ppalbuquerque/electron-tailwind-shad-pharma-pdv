import { ReactNode } from 'react'
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useQuery } from '@tanstack/react-query'
import { HotkeysProvider, useHotkeysContext } from 'react-hotkeys-hook'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/header'
import { getPageTitleByPath, RoutesPath } from '@renderer/lib/get-page-title-by-path'
import { CheckoutService } from '@/services/checkout.service'
import { CHECKOUT_QUERY_KEYS } from '@/services/checkout/checkout.query.keys'
import { HotkeyScope } from '@/lib/hotkey-scopes'

function ContentArea(): ReactNode {
  const { enableScope, disableScope } = useHotkeysContext()
  const location = useLocation()

  return (
    <SidebarInset
      onFocus={() => {
        enableScope(HotkeyScope.CONTENT)
        disableScope(HotkeyScope.SIDEBAR)
      }}
    >
      <Header routeName={getPageTitleByPath(location.pathname as RoutesPath)} />
      <Outlet />
    </SidebarInset>
  )
}

const RootLaytout = (): ReactNode => {
  useQuery({
    queryKey: [CHECKOUT_QUERY_KEYS.STATUS],
    queryFn: CheckoutService.getCheckoutStatus,
    staleTime: Infinity,
  })

  return (
    <HotkeysProvider initiallyActiveScopes={[HotkeyScope.SIDEBAR, HotkeyScope.CONTENT]}>
      <SidebarProvider>
        <AppSidebar />
        <ContentArea />
        <TanStackRouterDevtools />
      </SidebarProvider>
    </HotkeysProvider>
  )
}

export const Route = createRootRoute({ component: RootLaytout })
