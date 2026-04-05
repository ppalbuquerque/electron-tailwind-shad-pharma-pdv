import { apiClient } from '@/lib/api'
import type { UploadFileResponse } from '@/services/medication/medication.dto'

class FilesService {
  static async uploadFile(file: File): Promise<UploadFileResponse> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiClient.post<UploadFileResponse>('/files', formData)
    return data
  }
}

export { FilesService }
