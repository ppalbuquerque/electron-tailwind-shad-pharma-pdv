import { useRef, ReactNode, ComponentProps, useEffect } from 'react'
import {
  BriefcaseMedical,
  House,
  ShoppingCart,
  BanknoteArrowUp,
  NotebookText,
  List,
  BaggageClaim
} from 'lucide-react'
import { Link, useLocation } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'

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
  SidebarRail
} from '@/components/ui/sidebar'
import { SidebarButton } from '@/components/layout/sidebar-button'

const routes = [
  {
    title: 'Tela inicial',
    icon: House,
    url: '/',
    hotkey: 'F1'
  },
  {
    title: 'Abrir Caixa',
    url: '/checkout/open',
    icon: ShoppingCart,
    hotkey: 'F2'
  },
  {
    title: 'Venda',
    icon: BanknoteArrowUp,
    url: '/orders/create',
    hotkey: 'F3'
  },
  {
    title: 'Situação do Caixa',
    icon: NotebookText,
    url: '/checkout/resume',
    hotkey: 'F4'
  },
  {
    title: 'Lista de Vendas',
    icon: List,
    url: '/orders/list',
    hotkey: 'F5'
  },
  {
    title: 'Fechar Caixa',
    icon: BaggageClaim,
    url: '/checkout/close',
    hotkey: 'F6'
  },
  {
    title: 'Medicamentos',
    icon: BriefcaseMedical,
    url: '/medication/list',
    hotkey: 'F7'
  }
]

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>): ReactNode {
  const linkRefs = useRef<HTMLAnchorElement[]>([])
  const currentLinkFocused = useRef(0)
  const location = useLocation()

  useEffect(() => {
    const { pathname } = location

    const currentRouteIndex = routes.findIndex((route) => route.url === pathname)

    linkRefs.current[currentRouteIndex]?.focus()
  }, [location])

  useHotkeys('ArrowDown', () => {
    const nextLinkRefsIndex = currentLinkFocused.current + 1

    currentLinkFocused.current = Math.min(nextLinkRefsIndex, linkRefs.current.length - 1)

    linkRefs.current[currentLinkFocused.current]?.focus()
  })

  useHotkeys('ArrowUp', () => {
    const nextLinkRefsIndex = currentLinkFocused.current - 1

    currentLinkFocused.current = Math.max(nextLinkRefsIndex, 0)

    linkRefs.current[currentLinkFocused.current]?.focus()
  })

  return (
    <Sidebar {...props}>
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
              {routes.map((item, index) => (
                <Link to={item.url} key={item.title} ref={(el) => (linkRefs.current[index] = el)}>
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
