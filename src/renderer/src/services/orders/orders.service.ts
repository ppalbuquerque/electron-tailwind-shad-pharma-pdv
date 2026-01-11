import { apiClient } from '@/lib/api'

import { CreateOrderDTO } from './orders.dto'

export type CreateOrderResponse = {
  totalValue: number
  paymentValue: number
  stauts: 'COMPLETE'
  orderItems: {
    amount: number
    totalValue: number
    boxType: 'unit' | 'box'
    medication: {
      id: string
    }
    id: string
  }[]
}

class OrdersService {
  static async createOrder(payload: CreateOrderDTO): Promise<CreateOrderResponse> {
    const response = await apiClient.post('/orders', payload)
    return response.data
  }
}

export { OrdersService }
