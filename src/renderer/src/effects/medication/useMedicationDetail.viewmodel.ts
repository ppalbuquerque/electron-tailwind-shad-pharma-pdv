import { useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useHotkeys } from 'react-hotkeys-hook'

import { HotkeyScope } from '@/lib/hotkey-scopes'

import { MedicationDetail } from '@/services/medication/medication.dto'
import { MedicationService } from '@/services/medication/medication.service'
import { MEDICATION_QUERY_KEYS } from '@/services/medication/medication.query.keys'

export interface MedicationDetailViewModel {
  medication: MedicationDetail | undefined
  isLoading: boolean
  isError: boolean
}

export function useMedicationDetailViewModel(id: number): MedicationDetailViewModel {
  const navigate = useNavigate()

  useHotkeys('esc', () => navigate({ to: '/medication/list' }), {
    scopes: [HotkeyScope.CONTENT],
    preventDefault: true,
  })

  const { data: medication, isLoading, isError } = useQuery({
    queryKey: [MEDICATION_QUERY_KEYS.MEDICATION_DETAIL, id],
    queryFn: () => MedicationService.getMedicationById(id),
    enabled: !!id,
    retry: false,
  })

  return { medication, isLoading, isError }
}
