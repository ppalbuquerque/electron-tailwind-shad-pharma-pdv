import { useEffect } from 'react'
import { Control, SubmitHandler, useForm } from 'react-hook-form'
import { useHotkeys } from 'react-hotkeys-hook'
import { toast } from 'sonner'

import { formatMoney } from '@/utils/format-money'

interface CloseOrderSectionForm {
  paymentValue: number
}

interface CloseOrderSectionViewModel {
  control: Control<CloseOrderSectionForm>
  onSubmit: () => void
  displayPaymentValue: string
  change: string
}

function useCloseOrderSectionViewModel(
  orderTotalRaw: number,
  isLoading: boolean,
  onConfirm: (paymentValue: number) => void
): CloseOrderSectionViewModel {
  const { handleSubmit, control, watch, setFocus } = useForm<CloseOrderSectionForm>({
    defaultValues: { paymentValue: 0 }
  })

  useEffect(() => {
    setFocus('paymentValue')
  }, [setFocus])

  const paymentValue = watch('paymentValue') ?? 0

  const displayPaymentValue = formatMoney(paymentValue)
  const change = formatMoney(Math.max(0, paymentValue - orderTotalRaw))

  const validateAndConfirm = (value: number): void => {
    if (value <= orderTotalRaw) {
      toast.error('O valor informado é insuficiente para cobrir o total da venda')
      return
    }
    onConfirm(value)
  }

  const onCloseOrderSubmit: SubmitHandler<CloseOrderSectionForm> = (data) => {
    validateAndConfirm(data.paymentValue)
  }

  useHotkeys(
    'esc',
    () => {
      if (isLoading) return
      handleSubmit(onCloseOrderSubmit)()
    },
    { enableOnFormTags: true },
    [isLoading]
  )

  return {
    control,
    onSubmit: handleSubmit(onCloseOrderSubmit),
    displayPaymentValue,
    change
  }
}

export { useCloseOrderSectionViewModel }
