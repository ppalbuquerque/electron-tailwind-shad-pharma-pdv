import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useForm, SubmitHandler, UseFormRegister } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'

import { MEDICATION_QUERY_KEYS } from '@/services/medication/medication.query.keys'
import { MedicationService, SearchResponse } from '@/services/medication/medication.service'
import { useDebounce } from '@/hooks/use-debounce'

interface SearchInputForm {
  medicationName: string
}

interface CreateOrderViewModel {
  onInputSearchConfirm: () => void
  register: UseFormRegister<SearchInputForm>
  setSearchValue: (term: string) => void
  searchMedicationDialogIsOpen: boolean
  searchData: SearchResponse
  searchValue: string
}

function useCreateOrderViewModel(): CreateOrderViewModel {
  const { handleSubmit, register } = useForm<SearchInputForm>()
  const [searchMedicationDialogIsOpen, setSearchMedicationDialogIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const debouncedSearchTerm = useDebounce(searchValue)

  const { data: searchData } = useQuery({
    queryKey: [MEDICATION_QUERY_KEYS.MEDICATION_SEARCH, debouncedSearchTerm],
    queryFn: () => MedicationService.search({ query: debouncedSearchTerm }),
    enabled: debouncedSearchTerm.length > 0
  })

  useHotkeys('esc', () => {
    setSearchMedicationDialogIsOpen(false)
  })

  const onInputSearchConfirm: SubmitHandler<SearchInputForm> = (data) => {
    setSearchMedicationDialogIsOpen(true)
    setSearchValue(data.medicationName)
  }

  return {
    searchMedicationDialogIsOpen,
    searchData: searchData ?? [],
    searchValue: debouncedSearchTerm,
    onInputSearchConfirm: handleSubmit(onInputSearchConfirm),
    register,
    setSearchValue
  }
}

export { useCreateOrderViewModel }
