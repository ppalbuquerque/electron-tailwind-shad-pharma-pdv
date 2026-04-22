import { ReactNode } from 'react'
import { Controller } from 'react-hook-form'

import { BoxValue } from '@/components/ui/box-value'
import { MoneyInput } from '@/components/ui/money-input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { useCloseOrderSectionViewModel } from '@/effects/orders/useCloseOrderSection.viewmodel'

import { formatMoney } from '@/utils/format-money'

interface OrderTotalBoxProps {
  value: string
}

function OrderTotalBox({ value }: OrderTotalBoxProps): ReactNode {
  return (
    <BoxValue
      title="Total"
      value={value}
      className="flex flex-col items-center justify-center rounded-md border border-green-200 bg-green-50 p-4 flex-1"
    />
  )
}

interface PaymentValueBoxProps {
  value: string
}

function PaymentValueBox({ value }: PaymentValueBoxProps): ReactNode {
  return (
    <BoxValue
      title="Valor do pagamento"
      value={value}
      className="flex flex-col items-center justify-center rounded-md bg-[#58b4df] p-4 flex-1"
    />
  )
}

interface ChangeBoxProps {
  value: string
}

function ChangeBox({ value }: ChangeBoxProps): ReactNode {
  return (
    <BoxValue
      title="Troco"
      value={value}
      className="flex flex-col items-center justify-center rounded-md bg-amber-100 p-4 flex-1"
    />
  )
}

interface CloseOrderSectionProps {
  orderTotalRaw: number
  isLoading: boolean
  onConfirm: (paymentValue: number) => void
  onCancel: () => void
}

function CloseOrderSection({
  orderTotalRaw,
  isLoading,
  onConfirm,
  onCancel
}: CloseOrderSectionProps): ReactNode {
  const { control, onSubmit, displayPaymentValue, change } = useCloseOrderSectionViewModel(
    orderTotalRaw,
    isLoading,
    onConfirm,
    onCancel,
  )

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <OrderTotalBox value={formatMoney(orderTotalRaw)} />
        <PaymentValueBox value={displayPaymentValue} />
        <ChangeBox value={change} />
      </div>
      <form onSubmit={onSubmit}>
        <Controller
          name="paymentValue"
          control={control}
          render={({ field }) => (
            <MoneyInput
              ref={field.ref}
              onValueChange={(_, __, values) => field.onChange(values?.float ?? 0)}
            />
          )}
        />
        <div className="flex mt-4 gap-2">
          <Button type="submit" className="flex-1 bg-neutral-900" disabled={isLoading}>
            {isLoading && <Spinner />}
            Confirmar Venda (ESC)
          </Button>
          <Button type="button" variant="destructive" className="flex-1" onClick={onCancel} disabled={isLoading}>
            Cancelar Venda
          </Button>
        </div>
      </form>
    </div>
  )
}

export { CloseOrderSection }
