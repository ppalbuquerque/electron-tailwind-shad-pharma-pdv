import { ReactNode, ComponentProps, useEffect } from 'react'
import { BriefcaseMedical } from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { useHotkeysContext } from 'react-hotkeys-hook'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { SidebarButton } from '@/components/layout/sidebar-button'
import { HotkeyScope } from '@/lib/hotkey-scopes'
import { useSidebarNavigationViewModel } from '@/effects/navigation/useSidebarNavigation.viewmodel'
import { sidebarRoutes } from '@/lib/sidebar-routes'
import { useSidebarNavigationContext } from '@/contexts/navigation/sidebar-navigation.context'

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>): ReactNode {
  const { linkRefs, currentLinkFocused, triggerContentFocus } = useSidebarNavigationContext()
  const location = useLocation()
  const { enableScope, disableScope } = useHotkeysContext()

  useSidebarNavigationViewModel({ linkRefs, currentLinkFocused, triggerContentFocus })

  useEffect(() => {
    const { pathname } = location

    const currentRouteIndex = sidebarRoutes.findIndex((route) => route.url === pathname)

    linkRefs.current[currentRouteIndex]?.focus()
  }, [location])

  return (
    <Sidebar
      {...props}
      onFocus={() => {
        enableScope(HotkeyScope.SIDEBAR)
        disableScope(HotkeyScope.CONTENT)
        disableScope(HotkeyScope.TABLE)
      }}
      onBlur={() => {
        disableScope(HotkeyScope.SIDEBAR)
        enableScope(HotkeyScope.CONTENT)
      }}
    >
      <SidebarHeader>
        <div className="bg-black w-full h-[85px] flex items-center justify-center">
          <div className="flex flex-row items-center">
            <div className="size-[40px] bg-white rounded-lg mr-[12px] flex items-center justify-center">
              <BriefcaseMedical />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Farma POS</h1>
              <span className="text-slate-300">Sistema de ponto de venda</span>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup key="Navegação">
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarRoutes.map((item, index) => (
                <Link
                  to={item.url}
                  key={item.title}
                  ref={(el) => (linkRefs.current[index] = el)}
                  className="group focus:outline-none"
                >
                  {({ isActive }) => (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <SidebarButton
                          title={item.title}
                          hotkey={item.hotkey}
                          icon={item.icon}
                          variant={isActive ? 'active' : 'default'}
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
