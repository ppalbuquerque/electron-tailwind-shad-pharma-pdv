import { apiClient } from '@/lib/api'

class CheckoutService {
  static openCheckout({ initialValue }: { initialValue: number }): Promise<void> {
    return apiClient.post('/checkout', { initialValue })
  }
}

export { CheckoutService }
