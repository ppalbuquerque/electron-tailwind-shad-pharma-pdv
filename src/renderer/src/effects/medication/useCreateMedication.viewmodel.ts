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

const createMedicationSchema = z.object({
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

type CreateMedicationForm = z.infer<typeof createMedicationSchema>

interface CreateMedicationViewModel {
  register: UseFormRegister<CreateMedicationForm>
  control: Control<CreateMedicationForm>
  errors: FieldErrors<CreateMedicationForm>
  isValid: boolean
  isSubmitting: boolean
  onSubmit: () => Promise<void>
}

export function useCreateMedicationViewModel(): CreateMedicationViewModel {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting }
  } = useForm<CreateMedicationForm>({
    resolver: zodResolver(createMedicationSchema),
    mode: 'onBlur'
  })

  const handleCreateMedication: SubmitHandler<CreateMedicationForm> = async (data) => {
    let samplePhotoUrl = ''

    if (data.photo && data.photo.length > 0) {
      try {
        const uploaded = await FilesService.uploadFile(data.photo[0])
        samplePhotoUrl = uploaded.url
      } catch {
        toast.error('Erro ao subir a imagem')
        return
      }
    }

    try {
      await MedicationService.createMedication({
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
        queryKey: [MEDICATION_QUERY_KEYS.LIST_MEDICATIONS]
      })

      toast.success('Medicamento registrado com sucesso')
      setTimeout(() => navigate({ to: '/medication/list' }), 3000)
    } catch {
      toast.error('Erro ao registrar novo medicamento')
    }
  }

  return {
    register,
    control,
    errors,
    isValid,
    isSubmitting,
    onSubmit: handleSubmit(handleCreateMedication)
  }
}
