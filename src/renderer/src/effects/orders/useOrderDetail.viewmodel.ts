import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'

import { OrderDetail } from '@/services/orders/orders.dto'
import { OrdersService } from '@/services/orders/orders.service'
import { ORDERS_QUERY_KEYS } from '@/services/orders/orders.query.keys'

export interface OrderDetailViewModel {
  order: OrderDetail | undefined
  isLoading: boolean
  isCancelDialogOpen: boolean
  openCancelDialog: () => void
  closeCancelDialog: () => void
}

export function useOrderDetailViewModel(id: string): OrderDetailViewModel {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const navigate = useNavigate()

  useHotkeys('esc', () => navigate({ to: '/orders/list' }), { preventDefault: true })

  const { data: order, isLoading } = useQuery({
    queryKey: [ORDERS_QUERY_KEYS.GET_ORDER_BY_ID, id],
    queryFn: () => OrdersService.getOrderById(id),
    enabled: !!id
  })

  function openCancelDialog(): void {
    setIsCancelDialogOpen(true)
  }

  function closeCancelDialog(): void {
    setIsCancelDialogOpen(false)
  }

  return {
    order,
    isLoading,
    isCancelDialogOpen,
    openCancelDialog,
    closeCancelDialog
  }
}
