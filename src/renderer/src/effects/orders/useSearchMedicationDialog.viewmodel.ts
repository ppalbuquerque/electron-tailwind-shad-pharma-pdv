import { useEffect } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'

import { MEDICATION_QUERY_KEYS } from '@/services/medication/medication.query.keys'
import { MedicationService, SearchResponse } from '@/services/medication/medication.service'

import { useDebounce } from '@/hooks/use-debounce'

interface SearchMedicationForm {
  medicationName: string
}

interface SearchMedicationDialogViewModel {
  register: UseFormRegister<SearchMedicationForm>
  isLoadingMedications: boolean
  medicationTableData: SearchResponse
}

function useSearchMedicationDialogViewModel(
  medicationName: string
): SearchMedicationDialogViewModel {
  const { setValue, register, watch } = useForm<SearchMedicationForm>()
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

  return {
    register,
    medicationTableData: searchData ?? [],
    isLoadingMedications: isLoading
  }
}

export { useSearchMedicationDialogViewModel }
