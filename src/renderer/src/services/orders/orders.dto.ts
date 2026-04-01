export interface CreateOrderDTO {
  paymentValue: number
  orderItems: {
    medicationId: string
    amount: number
    totalValue: number
    boxType: 'unit' | 'box'
  }[]
}

export interface ListOrdersParams {
  limit: number
  offset: number
  status?: 'COMPLETE' | 'CANCELLED' | 'PROCESSING'
  createdAtFrom?: string
  createdAtTo?: string
}

export interface OrderSummary {
  id: string
  totalValue: number
  status: 'COMPLETE' | 'CANCELLED' | 'PROCESSING'
  createdAt: string
}

export interface ListOrdersResponse {
  orders: OrderSummary[]
  total: number
  limit: number
  offset: number
}
