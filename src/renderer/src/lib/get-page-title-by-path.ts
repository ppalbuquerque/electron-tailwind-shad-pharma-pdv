import { FileRoutesByPath } from '@tanstack/react-router'

export type RoutesPath = keyof FileRoutesByPath

function getPageTitleByPath(path: RoutesPath): string {
  switch (path) {
    case '/':
      return 'Home'
    case '/checkout/close':
      return 'Fechar Caixa'
    case '/checkout/open':
      return 'Abrir Caixa'
    case '/orders/list':
      return 'Lista de Pedidos'
    default:
      return 'Home'
  }
}

export { getPageTitleByPath }
