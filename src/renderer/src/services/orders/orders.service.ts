import { apiClient } from '@/lib/api'

import { CreateOrderDTO, ListOrdersParams, ListOrdersResponse, OrderDetail } from './orders.dto'

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

  static async listOrders(params: ListOrdersParams): Promise<ListOrdersResponse> {
    const { data } = await apiClient.get<ListOrdersResponse>('/orders', { params })
    return data
  }

  static async getOrderById(id: string): Promise<OrderDetail> {
    const { data } = await apiClient.get<OrderDetail>(`/orders/${id}`)
    return data
  }
}

export { OrdersService }
