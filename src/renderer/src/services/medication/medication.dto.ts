export interface ListMedicationsParams {
  limit: number
  offset: number
}

export interface MedicationSummary {
  id: number
  name: string
  chemicalComposition: string
  boxPrice: string
  unitPrice: string
  stockAvailability: number
}

export interface ListMedicationsResponse {
  medications: MedicationSummary[]
  nextPage: number | null
}
