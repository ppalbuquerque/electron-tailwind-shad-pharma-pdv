import { ReactNode, useEffect, useRef } from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent
} from '@/components/ui/navigation-menu'

const RootLaytout = (): ReactNode => {
  const initialNavigationItemRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    initialNavigationItemRef.current?.focus()
  }, [])

  return (
    <>
      <div className="fixed top-0 right-0 left-0 bg-stone-700">
        <div className="p-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger ref={initialNavigationItemRef}>Caixa</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-stone-700">
                  <ul className="grid w-[200px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/checkout/open"
                          className="focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          Abrir caixa
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/checkout/close"
                          className="focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          Fechar caixa
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#"
                          className="focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          Relatório do dia
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#"
                          className="focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          Caixas passados
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger ref={initialNavigationItemRef}>Vendas</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-stone-700">
                  <ul className="grid w-[200px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#"
                          className="focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          Realizar venda
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#"
                          className="focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          Cancelar venda
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="#"
                          className="focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        >
                          Lista de vendas
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRoute({ component: RootLaytout })
