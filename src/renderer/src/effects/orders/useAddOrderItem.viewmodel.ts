import { useEffect } from 'react'
import { Control, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form'

import { useCreateOrder } from '@/contexts/create-order/create-order.context'

import { BoxType, OrderItem } from '@/types/orderItem'

interface AddOrderItemForm {
  quantitiy: number
  boxType: BoxType
}

interface AddOrderItemViewModel {
  register: UseFormRegister<AddOrderItemForm>
  onAddOrderItemSubmit: () => void
  control: Control<AddOrderItemForm, unknown, AddOrderItemForm>
}

function useAddOrderItemViewModel(): AddOrderItemViewModel {
  const { handleSubmit, register, control, setFocus } = useForm<AddOrderItemForm>()
  const { dispatch, state } = useCreateOrder()

  // useEffect(() => {
  //   setFocus('quantitiy')
  // }, [setFocus])

  const onAddOrderItemSubmit: SubmitHandler<AddOrderItemForm> = (data) => {
    if (state.selectedMedication) {
      const { selectedMedication } = state

      const newOrderItem: OrderItem = {
        medication: selectedMedication,
        boxType: data.boxType,
        quantity: data.quantitiy,
        subtotal: parseInt(selectedMedication.box_price, 10) * data.quantitiy
      }

      dispatch({ type: 'addItem', item: newOrderItem })
      dispatch({ type: 'resetSelectOrderItem' })
    }
  }

  return {
    register,
    onAddOrderItemSubmit: handleSubmit(onAddOrderItemSubmit),
    control
  }
}

export { useAddOrderItemViewModel }
