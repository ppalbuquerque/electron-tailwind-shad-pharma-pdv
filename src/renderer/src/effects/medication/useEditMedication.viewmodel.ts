import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  useForm,
  type SubmitHandler,
  type UseFormRegister,
  type FieldErrors,
  type Control
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'

import { MedicationService } from '@/services/medication/medication.service'
import { FilesService } from '@/services/files/files.service'
import { MEDICATION_QUERY_KEYS } from '@/services/medication/medication.query.keys'
import type { MedicationDetail } from '@/services/medication/medication.dto'

const editMedicationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  chemicalComposition: z.string().min(1, 'Composição química é obrigatória'),
  stockAvailability: z
    .number({ error: 'Estoque deve ser um número' })
    .int()
    .min(0, 'Estoque não pode ser negativo'),
  shelfLocation: z.string().min(1, 'Localização na prateleira é obrigatória'),
  boxPrice: z.number({ error: 'Preço por caixa é obrigatório' }).int().min(0),
  unitPrice: z.number({ error: 'Preço por unidade é obrigatório' }).int().min(0),
  usefulness: z.string().min(1, 'Indicação terapêutica é obrigatória'),
  dosageInstructions: z.string().min(1, 'Posologia é obrigatória'),
  photo: z.instanceof(FileList).optional()
})

type EditMedicationForm = z.infer<typeof editMedicationSchema>

interface EditMedicationViewModel {
  register: UseFormRegister<EditMedicationForm>
  control: Control<EditMedicationForm>
  errors: FieldErrors<EditMedicationForm>
  isValid: boolean
  isSubmitting: boolean
  currentPhotoUrl: string | undefined
  onSubmit: () => Promise<void>
}

export function useEditMedicationViewModel(id: number): EditMedicationViewModel {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const cached = queryClient.getQueryData<MedicationDetail>([
    MEDICATION_QUERY_KEYS.MEDICATION_DETAIL,
    id
  ])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<EditMedicationForm>({
    resolver: zodResolver(editMedicationSchema),
    mode: 'onBlur',
    defaultValues: cached
      ? {
          name: cached.name,
          chemicalComposition: cached.chemicalComposition,
          stockAvailability: cached.stockAvailability,
          shelfLocation: cached.shelfLocation,
          boxPrice: cached.boxPrice,
          unitPrice: cached.unitPrice,
          usefulness: cached.usefulness,
          dosageInstructions: cached.dosageInstructions
        }
      : undefined
  })

  const handleEditMedication: SubmitHandler<EditMedicationForm> = async (data) => {
    let samplePhotoUrl = cached?.samplePhotoUrl

    if (data.photo && data.photo.length > 0) {
      try {
        const uploaded = await FilesService.uploadFile(data.photo[0])
        samplePhotoUrl = uploaded.url
      } catch {
        toast.error('Erro ao fazer upload da imagem')
        return
      }
    }

    try {
      await MedicationService.updateMedication({
        id,
        name: data.name,
        chemicalComposition: data.chemicalComposition,
        stockAvailability: data.stockAvailability,
        shelfLocation: data.shelfLocation,
        boxPrice: data.boxPrice,
        unitPrice: data.unitPrice,
        usefulness: data.usefulness,
        dosageInstructions: data.dosageInstructions,
        samplePhotoUrl
      })

      await queryClient.invalidateQueries({
        queryKey: [MEDICATION_QUERY_KEYS.MEDICATION_DETAIL, id]
      })
      await queryClient.invalidateQueries({
        queryKey: [MEDICATION_QUERY_KEYS.LIST_MEDICATIONS]
      })

      toast.success('Medicamento atualizado com sucesso')
      navigate({ to: '/medication/$id', params: { id: String(id) } })
    } catch {
      toast.error('Erro ao atualizar o medicamento')
    }
  }

  return {
    register,
    control,
    errors,
    isValid,
    isSubmitting,
    currentPhotoUrl: cached?.samplePhotoUrl,
    onSubmit: handleSubmit(handleEditMedication)
  }
}
