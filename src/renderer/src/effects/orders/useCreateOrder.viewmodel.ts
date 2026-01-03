import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useForm, SubmitHandler, UseFormRegister } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'

import { MEDICATION_QUERY_KEYS } from '@/services/medication/medication.query.keys'
import { MedicationService, SearchResponse } from '@/services/medication/medication.service'

import { useDebounce } from '@/hooks/use-debounce'

import { Medication } from '@/types/medication'
import { OrderItem } from '@/types/orderItem'

import { useCreateOrder } from '@/contexts/create-order/create-order.context'

interface SearchInputForm {
  medicationName: string
}

interface CreateOrderViewModel {
  onInputSearchConfirm: () => void
  register: UseFormRegister<SearchInputForm>
  setSearchValue: (term: string) => void
  handleOnMedicationDialogConfirm: (medication: Medication) => void
  searchMedicationDialogIsOpen: boolean
  searchData: SearchResponse
  searchValue: string
  orderItens: OrderItem[]
  selectedMedication: Medication | undefined
}

function useCreateOrderViewModel(): CreateOrderViewModel {
  const { handleSubmit, register } = useForm<SearchInputForm>()
  const [searchMedicationDialogIsOpen, setSearchMedicationDialogIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { dispatch, state } = useCreateOrder()

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

  const handleOnMedicationDialogConfirm = (medication: Medication): void => {
    setSearchMedicationDialogIsOpen(false)
    dispatch({ type: 'selectOrderItem', item: medication })
  }

  return {
    searchMedicationDialogIsOpen,
    searchData: searchData ?? [],
    searchValue: debouncedSearchTerm,
    orderItens: state.items,
    selectedMedication: state.selectedMedication,
    onInputSearchConfirm: handleSubmit(onInputSearchConfirm),
    register,
    setSearchValue,
    handleOnMedicationDialogConfirm
  }
}

export { useCreateOrderViewModel }
