import { useEffect } from 'react'
import { Control, SubmitHandler, useForm } from 'react-hook-form'
import { useHotkeys, useHotkeysContext } from 'react-hotkeys-hook'
import { toast } from 'sonner'

import { formatMoney } from '@/utils/format-money'
import { HotkeyScope } from '@/lib/hotkey-scopes'

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
  onConfirm: (paymentValue: number) => void,
  onCancel: () => void,
): CloseOrderSectionViewModel {
  const { handleSubmit, control, watch, setFocus } = useForm<CloseOrderSectionForm>({
    defaultValues: { paymentValue: 0 },
  })

  const { enableScope, disableScope } = useHotkeysContext()

  useEffect(() => {
    setFocus('paymentValue')
  }, [setFocus])

  useEffect(() => {
    enableScope(HotkeyScope.FORM)
    return () => disableScope(HotkeyScope.FORM)
  }, [enableScope, disableScope])

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

  useHotkeys('esc', onCancel, {
    scopes: [HotkeyScope.FORM],
    enableOnFormTags: true,
  })

  useHotkeys(
    'enter',
    () => {
      if (!isLoading) handleSubmit(onCloseOrderSubmit)()
    },
    {
      scopes: [HotkeyScope.FORM],
      enableOnFormTags: true,
      preventDefault: true,
    },
    [isLoading],
  )

  return {
    control,
    onSubmit: handleSubmit(onCloseOrderSubmit),
    displayPaymentValue,
    change,
  }
}

export { useCloseOrderSectionViewModel }
