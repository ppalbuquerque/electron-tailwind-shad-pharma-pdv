import { SubmitHandler, useForm, UseFormRegister } from 'react-hook-form'

import { useCreateOrder } from '@/contexts/create-order/create-order.context'

interface AddOrderItemForm {
  quantitiy: number
}

interface AddOrderItemViewModel {
  register: UseFormRegister<AddOrderItemForm>
  onAddOrderItemSubmit: () => void
}

function useAddOrderItemViewModel(): AddOrderItemViewModel {
  const { handleSubmit, register } = useForm<AddOrderItemForm>()
  const { dispatch, state } = useCreateOrder()

  const onAddOrderItemSubmit: SubmitHandler<AddOrderItemForm> = (data) => {
    if (state.selectedOrderItem) {
      dispatch({ type: 'addItem', item: state.selectedOrderItem })
    }
  }

  return {
    register,
    onAddOrderItemSubmit: handleSubmit(onAddOrderItemSubmit)
  }
}

export { useAddOrderItemViewModel }
