import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useForm, SubmitHandler } from 'react-hook-form'

interface SearchInputForm {
  medicationName: string
}

interface CreateOrderViewModel {
  onInputSearchConfirm: () => void
  searchMedicationDialogIsOpen: boolean
}

function useCreateOrderViewModel(): CreateOrderViewModel {
  const { handleSubmit, control } = useForm<SearchInputForm>()
  const [searchMedicationDialogIsOpen, setSearchMedicationDialogIsOpen] = useState(false)

  useHotkeys('esc', () => {
    setSearchMedicationDialogIsOpen(false)
  })

  const onInputSearchConfirm: SubmitHandler<SearchInputForm> = (data) => {
    setSearchMedicationDialogIsOpen(true)
  }

  return {
    onInputSearchConfirm: handleSubmit(onInputSearchConfirm),
    searchMedicationDialogIsOpen
  }
}

export { useCreateOrderViewModel }
