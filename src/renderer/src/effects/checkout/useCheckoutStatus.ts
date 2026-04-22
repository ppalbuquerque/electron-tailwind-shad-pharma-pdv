import { useQuery } from '@tanstack/react-query'

import { CheckoutService, CheckoutStatusResponse } from '@/services/checkout.service'
import { CHECKOUT_QUERY_KEYS } from '@/services/checkout/checkout.query.keys'

function useCheckoutStatus(): CheckoutStatusResponse | undefined {
  const { data } = useQuery({
    queryKey: [CHECKOUT_QUERY_KEYS.STATUS],
    queryFn: CheckoutService.getCheckoutStatus,
    staleTime: Infinity,
  })
  return data
}

export { useCheckoutStatus }
