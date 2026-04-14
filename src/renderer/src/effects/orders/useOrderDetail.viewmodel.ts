import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'

import { OrderDetail } from '@/services/orders/orders.dto'
import { OrdersService } from '@/services/orders/orders.service'
import { ORDERS_QUERY_KEYS } from '@/services/orders/orders.query.keys'

export interface OrderDetailViewModel {
  order: OrderDetail | undefined
  isLoading: boolean
  isCancelDialogOpen: boolean
  isCancelPending: boolean
  openCancelDialog: () => void
  closeCancelDialog: () => void
  handleConfirmCancel: () => void
}

export function useOrderDetailViewModel(id: string): OrderDetailViewModel {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()

  useHotkeys('esc', () => navigate({ to: '/orders/list' }), { preventDefault: true })

  const { data: order, isLoading } = useQuery({
    queryKey: [ORDERS_QUERY_KEYS.GET_ORDER_BY_ID, id],
    queryFn: () => OrdersService.getOrderById(id),
    enabled: !!id
  })

  const { mutate: cancelOrderMutate, isPending: isCancelPending } = useMutation({
    mutationFn: () => OrdersService.cancelOrder(id),
    onSuccess: () => {
      toast.success(`Order ${id} foi cancelada com sucesso`)
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEYS.GET_ORDER_BY_ID, id] })
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEYS.LIST_ORDERS] })
      closeCancelDialog()
      setTimeout(() => {
        router.navigate({ to: '/orders/list' })
      }, 3000)
    },
    onError: () => {
      toast.error('Ocorreu um erro ao cancelar a order')
    }
  })

  function openCancelDialog(): void {
    setIsCancelDialogOpen(true)
  }

  function closeCancelDialog(): void {
    setIsCancelDialogOpen(false)
  }

  function handleConfirmCancel(): void {
    cancelOrderMutate()
  }

  return {
    order,
    isLoading,
    isCancelDialogOpen,
    isCancelPending,
    openCancelDialog,
    closeCancelDialog,
    handleConfirmCancel
  }
}
