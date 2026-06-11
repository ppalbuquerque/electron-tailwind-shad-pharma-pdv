import { SVGProps, ComponentType } from 'react'
import {
  House,
  ShoppingCart,
  BanknoteArrowUp,
  NotebookText,
  List,
  BaggageClaim,
  BriefcaseMedical,
} from 'lucide-react'

export interface SidebarRoute {
  title: string
  url: string
  hotkey: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const sidebarRoutes: SidebarRoute[] = [
  { title: 'Tela inicial', url: '/', hotkey: 'F1', icon: House },
  { title: 'Abrir Caixa', url: '/checkout/open', hotkey: 'F2', icon: ShoppingCart },
  { title: 'Venda', url: '/orders/create', hotkey: 'F3', icon: BanknoteArrowUp },
  { title: 'Situação do Caixa', url: '/checkout/resume', hotkey: 'F4', icon: NotebookText },
  { title: 'Lista de Vendas', url: '/orders/list', hotkey: 'F5', icon: List },
  { title: 'Fechar Caixa', url: '/checkout/close', hotkey: 'F6', icon: BaggageClaim },
  { title: 'Medicamentos', url: '/medication/list', hotkey: 'F7', icon: BriefcaseMedical },
]
