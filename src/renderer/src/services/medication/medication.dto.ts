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

export interface MedicationDetail {
  id: number
  name: string
  chemicalComposition: string
  stockAvailability: number
  shelfLocation: string
  boxPrice: string
  unitPrice: string
  usefulness: string
  dosageInstructions: string
  samplePhotoUrl: string
  createdAt: string
  updatedAt: string
}
