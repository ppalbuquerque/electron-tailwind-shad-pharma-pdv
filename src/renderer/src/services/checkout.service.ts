import { apiClient } from '@/lib/api'

interface CheckoutStatusResponse {
  id: string
  isOpen: boolean
  createdAt: string
  updatedAt: string
  closedAt: string | null
}

interface CheckoutResumeResponse {
  openedAt: string
  initialValue: number
  totalOrderCount: number
  totalOrdersValue: number
  grandTotal: number
}

interface CloseCheckoutDTO {
  checkoutId: string
  closingValue: number
}

class CheckoutService {
  static openCheckout({ initialValue }: { initialValue: number }): Promise<void> {
    return apiClient.post('/checkout', { initialValue })
  }

  static async getCheckoutStatus(): Promise<CheckoutStatusResponse> {
    const { data } = await apiClient.get<CheckoutStatusResponse>('/checkout/status')
    return data
  }

  static async getCheckoutResume(): Promise<CheckoutResumeResponse> {
    const { data } = await apiClient.get<CheckoutResumeResponse>('/checkout/resume')
    return data
  }

  static async closeCheckout(dto: CloseCheckoutDTO): Promise<void> {
    await apiClient.post('/checkout/close', dto)
  }
}

export { CheckoutService }
export type { CheckoutStatusResponse, CheckoutResumeResponse, CloseCheckoutDTO }
