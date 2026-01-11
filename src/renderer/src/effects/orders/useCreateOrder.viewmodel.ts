import { useState, useMemo, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useForm, SubmitHandler, UseFormRegister } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'

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
  searchMedicationDialogIsOpen: boolean
  searchValue: string
  orderItens: OrderItem[]
  orderTotal: string
  selectedMedication: Medication | undefined
}

function useCreateOrderViewModel(): CreateOrderViewModel {
  const { handleSubmit, register, setFocus, setValue } = useForm<SearchInputForm>()
  const [searchMedicationDialogIsOpen, setSearchMedicationDialogIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const { dispatch, state } = useCreateOrder()

  useEffect(() => {
    setFocus('medicationName')
  }, [setFocus])

  const orderTotal = useMemo(() => {
    const sumOfOrderItens = state.items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.subtotal
    }, 0)

    return formatMoney(sumOfOrderItens)
  }, [state.items])

  const createOrderMutation = useMutation({
    mutationFn: (payload: CreateOrderDTO) => OrdersService.createOrder(payload),
    onSuccess: (data, variables, onMutateResult) => {},
    onError(error, variables, onMutateResult) {}
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

    createOrderMutation.mutate({
      paymentValue: 300,
      orderItems: formattedOrderItems
    })
  }

  return {
    searchMedicationDialogIsOpen,
    searchValue,
    orderItens: state.items,
    selectedMedication: state.selectedMedication,
    orderTotal,
    handleRemoveOrderItem,
    onInputSearchConfirm: handleSubmit(onInputSearchConfirm),
    register,
    handleOnMedicationDialogConfirm,
    handleCreateOrder
  }
}

export { useCreateOrderViewModel }
