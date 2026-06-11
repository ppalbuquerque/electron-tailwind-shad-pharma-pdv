import { useState, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import {
  ShoppingCart,
  BanknoteArrowUp,
  NotebookText,
  List,
  BaggageClaim,
  BriefcaseMedical,
  LucideIcon
} from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useRouter } from '@tanstack/react-router'

import { useCheckoutStatus } from '@/effects/checkout/useCheckoutStatus'
import { HotkeyScope } from '@/lib/hotkey-scopes'
import { useSidebarNavigationContext } from '@/contexts/navigation/sidebar-navigation.context'

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
  focusedIndex: number
  contentAreaRef: RefObject<HTMLDivElement | null>
}

function useHomeViewModel(): HomeViewModel {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date())
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const contentAreaRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { focusByPath, registerContentFocus } = useSidebarNavigationContext()
  const checkoutStatus = useCheckoutStatus()
  const isCheckoutOpen = checkoutStatus?.isOpen ?? false

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setFocusedIndex(0)
    contentAreaRef.current?.focus()
  }, [])

  useEffect(() => {
    registerContentFocus(() => {
      setFocusedIndex(0)
      contentAreaRef.current?.focus()
    })
    return () => registerContentFocus(null)
  }, [registerContentFocus])

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

  useHotkeys(
    ['ArrowRight', 'ArrowDown'],
    () => setFocusedIndex((i) => Math.min(i + 1, shortcuts.length - 1)),
    { scopes: [HotkeyScope.CONTENT], enabled: focusedIndex >= 0, preventDefault: true }
  )

  useHotkeys(['ArrowLeft', 'ArrowUp'], () => setFocusedIndex((i) => Math.max(i - 1, 0)), {
    scopes: [HotkeyScope.CONTENT],
    enabled: focusedIndex >= 0,
    preventDefault: true
  })

  useHotkeys(
    'enter',
    () => {
      const target = shortcuts[focusedIndex]
      if (target && !target.disabled) router.navigate({ to: target.url })
    },
    { scopes: [HotkeyScope.CONTENT], enabled: focusedIndex >= 0, preventDefault: true }
  )

  useHotkeys(
    'escape',
    () => {
      setFocusedIndex(-1)
      focusByPath('/')
    },
    { scopes: [HotkeyScope.CONTENT], enableOnFormTags: true, preventDefault: true }
  )

  return { currentDateTime, shortcuts, focusedIndex, contentAreaRef }
}

export { useHomeViewModel }
export type { HomeViewModel, HomeShortcut }
