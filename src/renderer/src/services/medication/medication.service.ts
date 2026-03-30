import { apiClient } from '@/lib/api'

import type { Medication } from '@/types/medication'

export type SearchResponse = Pick<Medication, 'name' | 'id' | 'box_price' | 'stock_availability'>[]

class MedicationService {
  static async search({ query }: { query: string }): Promise<SearchResponse> {
    const response = await apiClient.get(`/medication/search?q=${query}`)
    return response.data
  }
}

export { MedicationService }
