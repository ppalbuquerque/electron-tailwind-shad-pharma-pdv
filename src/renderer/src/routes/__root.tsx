import { ReactNode, useEffect, useRef } from 'react'
import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useQuery } from '@tanstack/react-query'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Header } from '@/components/layout/header'
import { getPageTitleByPath, RoutesPath } from '@renderer/lib/get-page-title-by-path'
import { CheckoutService } from '@/services/checkout.service'
import { CHECKOUT_QUERY_KEYS } from '@/services/checkout/checkout.query.keys'

const RootLaytout = (): ReactNode => {
  const initialNavigationItemRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  useQuery({
    queryKey: [CHECKOUT_QUERY_KEYS.STATUS],
    queryFn: CheckoutService.getCheckoutStatus,
  })

  useEffect(() => {
    initialNavigationItemRef.current?.focus()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header variant="open" routeName={getPageTitleByPath(location.pathname as RoutesPath)} />
        <Outlet />
      </SidebarInset>
      <TanStackRouterDevtools />
    </SidebarProvider>
  )
}

export const Route = createRootRoute({ component: RootLaytout })
