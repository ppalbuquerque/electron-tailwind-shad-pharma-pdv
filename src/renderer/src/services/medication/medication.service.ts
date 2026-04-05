import { apiClient } from '@/lib/api'

import type { Medication } from '@/types/medication'
import {
  ListMedicationsParams,
  ListMedicationsResponse,
  MedicationDetail,
  UpdateMedicationDTO,
} from './medication.dto'

export type SearchResponse = Pick<Medication, 'name' | 'id' | 'box_price' | 'stock_availability'>[]

class MedicationService {
  static async search({ query }: { query: string }): Promise<SearchResponse> {
    const response = await apiClient.get(`/medication/search?q=${query}`)
    return response.data
  }

  static async list(params: ListMedicationsParams): Promise<ListMedicationsResponse> {
    const { data } = await apiClient.get<ListMedicationsResponse>('/medication', { params })
    return data
  }

  static async getMedicationById(id: number): Promise<MedicationDetail> {
    const { data } = await apiClient.get<MedicationDetail>(`/medication/${id}`)
    return data
  }

  static async updateMedication(payload: UpdateMedicationDTO): Promise<void> {
    await apiClient.put('/medication', payload)
  }
}

export { MedicationService }
