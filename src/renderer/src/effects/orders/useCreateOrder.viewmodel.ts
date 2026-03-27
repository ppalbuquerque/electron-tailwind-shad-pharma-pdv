import { useState, useMemo, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useForm, SubmitHandler, UseFormRegister } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Medication } from '@/types/medication'
import { OrderItem } from '@/types/orderItem'

import { useCreateOrder } from '@/contexts/create-order/create-order.context'

import { formatMoney } from '@/utils/format-money'

import { OrdersService } from '@/services/orders/orders.service'
import { CreateOrderDTO } from '@/services/orders/orders.dto'

interface SearchInputForm {
  medicationName: string
}

interface CreateOrderViewModel {
  onInputSearchConfirm: () => void
  register: UseFormRegister<SearchInputForm>
  handleOnMedicationDialogConfirm: (medication: Medication) => void
  handleRemoveOrderItem: (orderItem: OrderItem) => void
  handleCreateOrder: () => void
  isCreateOrderMutationLoading: boolean
  searchMedicationDialogIsOpen: boolean
  searchValue: string
  orderItens: OrderItem[]
  orderTotal: string
  selectedMedication: Medication | undefined
}

function useCreateOrderViewModel(): CreateOrderViewModel {
  const { handleSubmit, register, setFocus, setValue, reset } = useForm<SearchInputForm>()
  const [searchMedicationDialogIsOpen, setSearchMedicationDialogIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { dispatch, state } = useCreateOrder()

  useEffect(() => {
    if (state.selectedMedication === undefined) {
      setFocus('medicationName')
    }
  }, [setFocus, state.selectedMedication])

  const orderTotal = useMemo(() => {
    const sumOfOrderItens = state.items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.subtotal
    }, 0)

    return formatMoney(sumOfOrderItens)
  }, [state.items])

  const { mutate: createOrderMutate, isPending } = useMutation({
    mutationFn: (payload: CreateOrderDTO) => OrdersService.createOrder(payload),
    onSuccess: (data, variables, onMutateResult) => {
      toast.success('Venda realizada com sucesso')
      dispatch({ type: 'resetOrderContext' })
      setFocus('medicationName')
      reset()
    },
    onError(error, variables, onMutateResult) {
      toast.error('Ocorreu um erro ao registrar a venda')
    }
  })

  const onInputSearchConfirm: SubmitHandler<SearchInputForm> = (data) => {
    setSearchMedicationDialogIsOpen(true)
    setSearchValue(data.medicationName)
  }

  const handleOnMedicationDialogConfirm = (medication: Medication): void => {
    setSearchMedicationDialogIsOpen(false)
    dispatch({ type: 'selectOrderItem', item: medication })
    setValue('medicationName', medication.name)
  }

  const handleRemoveOrderItem = (orderItem: OrderItem): void => {
    dispatch({ type: 'removeItem', item: orderItem })
  }

  const handleCreateOrder = (): void => {
    const { items } = state

    const formattedOrderItems = items.map((orderItem) => ({
      amount: orderItem.quantity,
      medicationId: String(orderItem.medication.id),
      totalValue: orderItem.subtotal,
      boxType: orderItem.boxType
    }))

    createOrderMutate({
      paymentValue: 300,
      orderItems: formattedOrderItems
    })
  }

  useHotkeys(
    'esc',
    () => {
      if (searchMedicationDialogIsOpen) {
        setSearchMedicationDialogIsOpen(false)
        setTimeout(() => setFocus('medicationName'), 0)
        return
      }

      if (state.items.length > 0) {
        handleCreateOrder()
      }
    },
    { enableOnFormTags: true },
  )

  return {
    searchMedicationDialogIsOpen,
    searchValue,
    orderItens: state.items,
    selectedMedication: state.selectedMedication,
    orderTotal,
    isCreateOrderMutationLoading: isPending,
    handleRemoveOrderItem,
    onInputSearchConfirm: handleSubmit(onInputSearchConfirm),
    register,
    handleOnMedicationDialogConfirm,
    handleCreateOrder
  }
}

export { useCreateOrderViewModel }
