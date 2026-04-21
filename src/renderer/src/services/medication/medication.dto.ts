export interface ListMedicationsParams {
  limit: number
  offset: number
}

export interface MedicationSummary {
  id: number
  name: string
  chemicalComposition: string
  boxPrice: number
  unitPrice: number
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
  boxPrice: number
  unitPrice: number
  usefulness: string
  dosageInstructions: string
  samplePhotoUrl: string
  createdAt: string
  updatedAt: string
}

export interface UpdateMedicationDTO {
  id: number
  name?: string
  chemicalComposition?: string
  stockAvailability?: number
  shelfLocation?: string
  boxPrice?: number
  unitPrice?: number
  usefulness?: string
  dosageInstructions?: string
  samplePhotoUrl?: string
}

export interface UploadFileResponse {
  id: number
  fileName: string
  contentLength: number
  contentType: string
  url: string
}

export interface CreateMedicationDTO {
  name: string
  chemicalComposition: string
  stockAvailability: number
  shelfLocation: string
  boxPrice: number
  unitPrice: number
  usefulness: string
  dosageInstructions: string
  samplePhotoUrl?: string
}
