export interface CreateOrderDTO {
  paymentValue: number
  orderItems: {
    medicationId: string
    amount: number
    totalValue: number
    boxType: 'unit' | 'box'
  }[]
}
