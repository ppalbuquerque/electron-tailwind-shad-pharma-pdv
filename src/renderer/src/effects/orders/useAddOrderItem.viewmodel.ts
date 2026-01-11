import { useEffect } from 'react'
import { Control, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useCreateOrder } from '@/contexts/create-order/create-order.context'

import { OrderItem } from '@/types/orderItem'

const formSchema = z.object({
  quantity: z.number().min(1, 'Quantidade miníma de produtos é 1'),
  boxType: z.enum(['box', 'unit'])
})

type AddOrderItemForm = z.infer<typeof formSchema>

interface AddOrderItemViewModel {
  register: UseFormRegister<AddOrderItemForm>
  onAddOrderItemSubmit: () => void
  control: Control<AddOrderItemForm, unknown, AddOrderItemForm>
}

function useAddOrderItemViewModel(): AddOrderItemViewModel {
  const { handleSubmit, register, control, setFocus, formState } = useForm<AddOrderItemForm>({
    resolver: zodResolver(formSchema)
  })
  const { dispatch, state } = useCreateOrder()

  useEffect(() => {
    setFocus('quantity')
  }, [setFocus])

  console.log(formState.errors)

  const onAddOrderItemSubmit: SubmitHandler<AddOrderItemForm> = (data) => {
    if (state.selectedMedication) {
      const { selectedMedication } = state

      const newOrderItem: OrderItem = {
        medication: selectedMedication,
        boxType: data.boxType,
        quantity: data.quantity,
        subtotal: parseInt(selectedMedication.box_price, 10) * data.quantity
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
