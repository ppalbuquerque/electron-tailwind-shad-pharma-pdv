import { useEffect } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useHotkeysContext } from 'react-hotkeys-hook'

import { MEDICATION_QUERY_KEYS } from '@/services/medication/medication.query.keys'
import { MedicationService, SearchResponse } from '@/services/medication/medication.service'

import { useDebounce } from '@/hooks/use-debounce'

import { HotkeyScope } from '@/lib/hotkey-scopes'

interface SearchMedicationForm {
  medicationName: string
}

interface SearchMedicationDialogViewModel {
  register: UseFormRegister<SearchMedicationForm>
  isLoadingMedications: boolean
  medicationTableData: SearchResponse
  focusSearchInput: () => void
}

function useSearchMedicationDialogViewModel(
  medicationName: string,
  open: boolean
): SearchMedicationDialogViewModel {
  const { setValue, register, watch, setFocus } = useForm<SearchMedicationForm>()
  const watchSearchTerm = watch('medicationName', '')

  const debouncedSearchTerm = useDebounce(watchSearchTerm)

  const { data: searchData, isLoading } = useQuery({
    queryKey: [MEDICATION_QUERY_KEYS.MEDICATION_SEARCH, debouncedSearchTerm],
    queryFn: () => MedicationService.search({ query: debouncedSearchTerm }),
    enabled: debouncedSearchTerm.length > 0
  })

  useEffect(() => {
    setValue('medicationName', medicationName)
  }, [medicationName, setValue])

  const { enableScope, disableScope } = useHotkeysContext()

  useEffect(() => {
    if (open) {
      enableScope(HotkeyScope.TABLE)
    } else {
      disableScope(HotkeyScope.TABLE)
    }

    return () => {
      disableScope(HotkeyScope.TABLE)
    }
  }, [open, enableScope, disableScope])

  function focusSearchInput(): void {
    setFocus('medicationName')
  }

  return {
    register,
    medicationTableData: searchData ?? [],
    isLoadingMedications: isLoading,
    focusSearchInput
  }
}

export { useSearchMedicationDialogViewModel }
