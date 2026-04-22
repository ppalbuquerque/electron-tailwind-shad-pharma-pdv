import { useState, useEffect } from 'react'
import {
  ShoppingCart,
  BanknoteArrowUp,
  NotebookText,
  List,
  BaggageClaim,
  BriefcaseMedical,
  LucideIcon
} from 'lucide-react'

import { useCheckoutStatus } from '@/effects/checkout/useCheckoutStatus'

interface HomeShortcut {
  title: string
  icon: LucideIcon
  url: string
  hotkey: string
  disabled: boolean
}

interface HomeViewModel {
  currentDateTime: Date
  shortcuts: HomeShortcut[]
}

function useHomeViewModel(): HomeViewModel {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

  const checkoutStatus = useCheckoutStatus()
  const isCheckoutOpen = checkoutStatus?.isOpen ?? false

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const shortcuts: HomeShortcut[] = [
    {
      title: 'Abrir Caixa',
      icon: ShoppingCart,
      url: '/checkout/open',
      hotkey: 'F2',
      disabled: isCheckoutOpen
    },
    {
      title: 'Venda',
      icon: BanknoteArrowUp,
      url: '/orders/create',
      hotkey: 'F3',
      disabled: !isCheckoutOpen
    },
    {
      title: 'Situação do Caixa',
      icon: NotebookText,
      url: '/checkout/resume',
      hotkey: 'F4',
      disabled: false
    },
    {
      title: 'Lista de Vendas',
      icon: List,
      url: '/orders/list',
      hotkey: 'F5',
      disabled: false
    },
    {
      title: 'Fechar Caixa',
      icon: BaggageClaim,
      url: '/checkout/close',
      hotkey: 'F6',
      disabled: !isCheckoutOpen
    },
    {
      title: 'Medicamentos',
      icon: BriefcaseMedical,
      url: '/medication/list',
      hotkey: 'F7',
      disabled: false
    }
  ]

  return { currentDateTime, shortcuts }
}

export { useHomeViewModel }
export type { HomeViewModel, HomeShortcut }
