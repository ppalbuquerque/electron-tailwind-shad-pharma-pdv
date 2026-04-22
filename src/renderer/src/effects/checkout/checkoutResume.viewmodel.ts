import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { CheckoutService } from '@/services/checkout.service'
import { CHECKOUT_QUERY_KEYS } from '@/services/checkout/checkout.query.keys'
import { useCheckoutStatus } from '@/effects/checkout/useCheckoutStatus'

interface CheckoutResumeViewModel {
  isCheckoutOpen: boolean
  isLoading: boolean
  initialValue: number
  totalOrdersValue: number
  totalOrderCount: number
  grandTotal: number
}

function useCheckoutResumeViewModel(): CheckoutResumeViewModel {
  const checkoutStatus = useCheckoutStatus()
  const isCheckoutOpen = checkoutStatus?.isOpen ?? false

  const {
    data: checkoutResume,
    isFetching,
    isError
  } = useQuery({
    queryKey: [CHECKOUT_QUERY_KEYS.RESUME],
    queryFn: CheckoutService.getCheckoutResume,
    enabled: isCheckoutOpen
  })

  useEffect(() => {
    if (isError) {
      toast.error('Erro ao buscar resumo do caixa')
    }
  }, [isError])

  return {
    isCheckoutOpen,
    isLoading: isFetching,
    initialValue: checkoutResume?.initialValue ?? 0,
    totalOrdersValue: checkoutResume?.totalOrdersValue ?? 0,
    totalOrderCount: checkoutResume?.totalOrderCount ?? 0,
    grandTotal: checkoutResume?.grandTotal ?? 0
  }
}

export { useCheckoutResumeViewModel }
