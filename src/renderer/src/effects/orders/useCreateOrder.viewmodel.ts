import { useState, useMemo, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useForm, SubmitHandler, UseFormRegister } from 'react-hook-form'

import { HotkeyScope } from '@/lib/hotkey-scopes'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Medication } from '@/types/medication'
import { OrderItem } from '@/types/orderItem'

import { useCreateOrder } from '@/contexts/create-order/create-order.context'
import { useSidebarNavigationContext } from '@/contexts/navigation/sidebar-navigation.context'

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
  handleCreateOrder: (paymentValue: number) => void
  handleOpenCloseOrder: () => void
  handleCancelCloseOrder: () => void
  isCreateOrderMutationLoading: boolean
  isClosingOrder: boolean
  searchMedicationDialogIsOpen: boolean
  searchValue: string
  orderItens: OrderItem[]
  orderTotalRaw: number
  selectedMedication: Medication | undefined
  isCancelModalOpen: boolean
  openCancelOrderModal: () => void
  dismissCancelOrderModal: () => void
  handleConfirmCancelOrder: () => void
}

function useCreateOrderViewModel(): CreateOrderViewModel {
  const { handleSubmit, register, setFocus, setValue, reset } = useForm<SearchInputForm>()
  const [searchMedicationDialogIsOpen, setSearchMedicationDialogIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [isClosingOrder, setIsClosingOrder] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const { dispatch, state } = useCreateOrder()
  const { focusByPath } = useSidebarNavigationContext()

  useEffect(() => {
    if (state.selectedMedication === undefined) {
      setFocus('medicationName')
    }
  }, [setFocus, state.selectedMedication])

  const orderTotalRaw = useMemo(() => {
    return state.items.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.subtotal
    }, 0)
  }, [state.items])

  const resetOrder = (): void => {
    dispatch({ type: 'resetOrderContext' })
    setSearchMedicationDialogIsOpen(false)
    setSearchValue('')
    setIsClosingOrder(false)
    reset()
    setTimeout(() => setFocus('medicationName'), 0)
  }

  const { mutate: createOrderMutate, isPending } = useMutation({
    mutationFn: (payload: CreateOrderDTO) => OrdersService.createOrder(payload),
    onSuccess: () => {
      toast.success('Venda realizada com sucesso')
      resetOrder()
    },
    onError() {
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

  const handleCreateOrder = (paymentValue: number): void => {
    const { items } = state

    const formattedOrderItems = items.map((orderItem) => ({
      amount: orderItem.quantity,
      medicationId: orderItem.medication.id,
      boxType: orderItem.boxType
    }))

    createOrderMutate({ paymentValue, orderItems: formattedOrderItems })
  }

  const handleOpenCloseOrder = (): void => {
    if (state.items.length === 0) return
    setIsClosingOrder(true)
  }

  const handleCancelCloseOrder = (): void => {
    setIsClosingOrder(false)
  }

  const openCancelOrderModal = (): void => {
    if (state.items.length === 0) return
    setIsCancelModalOpen(true)
  }

  const dismissCancelOrderModal = (): void => {
    setIsCancelModalOpen(false)
  }

  const handleConfirmCancelOrder = (): void => {
    resetOrder()
    setIsCancelModalOpen(false)
  }

  useHotkeys(
    'esc',
    () => {
      setSearchMedicationDialogIsOpen(false)
      setTimeout(() => setFocus('medicationName'), 0)
    },
    {
      scopes: [HotkeyScope.CONTENT],
      enabled: searchMedicationDialogIsOpen,
      enableOnFormTags: true,
    },
  )

  useHotkeys(
    'esc',
    () => {
      if (state.items.length === 0) {
        focusByPath('/orders/create')
      } else {
        handleOpenCloseOrder()
      }
    },
    {
      scopes: [HotkeyScope.CONTENT],
      enabled: !searchMedicationDialogIsOpen && !isClosingOrder && !isCancelModalOpen,
      enableOnFormTags: true,
    },
  )

  return {
    searchMedicationDialogIsOpen,
    searchValue,
    orderItens: state.items,
    selectedMedication: state.selectedMedication,
    orderTotalRaw,
    isCreateOrderMutationLoading: isPending,
    isClosingOrder,
    handleRemoveOrderItem,
    onInputSearchConfirm: handleSubmit(onInputSearchConfirm),
    register,
    handleOnMedicationDialogConfirm,
    handleCreateOrder,
    handleOpenCloseOrder,
    handleCancelCloseOrder,
    isCancelModalOpen,
    openCancelOrderModal,
    dismissCancelOrderModal,
    handleConfirmCancelOrder
  }
}

export { useCreateOrderViewModel }
