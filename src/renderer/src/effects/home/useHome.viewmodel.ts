import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  ShoppingCart,
  BanknoteArrowUp,
  NotebookText,
  List,
  BaggageClaim,
  BriefcaseMedical,
  LucideIcon
} from 'lucide-react'

import { CHECKOUT_QUERY_KEYS } from '@/services/checkout/checkout.query.keys'
import { CheckoutStatusResponse } from '@/services/checkout.service'

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
  const queryClient = useQueryClient()
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())

  const checkoutStatus = queryClient.getQueryData<CheckoutStatusResponse>([
    CHECKOUT_QUERY_KEYS.STATUS
  ])
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
