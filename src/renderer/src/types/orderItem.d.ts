import type { Medication } from './medication'

export type BoxType = 'box' | 'unit'

export type OrderItem = {
  medication: Medication
  quantity: number
  boxType: BoxType
  subtotal: number
}
