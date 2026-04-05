import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LockKeyhole } from 'lucide-react'
import { Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { MoneyInput } from '@/components/ui/money-input'
import { Spinner } from '@/components/ui/spinner'
import { BoxValue } from '@/components/ui/box-value'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useCloseCheckoutViewModel } from '@/effects/checkout/closeCheckout.viewmodel'
import { formatMoney } from '@/utils/format-money'

export const Route = createFileRoute('/checkout/close')({
  component: CloseCheckout
})

function CloseCheckout(): ReactNode {
  const {
    control,
    inputRef,
    isLoading,
    isModalOpen,
    isCheckoutOpen,
    grandTotal,
    closingValue,
    difference,
    handleCancel,
    handleConfirm,
    onSubmit
  } = useCloseCheckoutViewModel()

  if (!isCheckoutOpen) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-sm p-12 border-slate-300 border text-black flex flex-col items-center">
          <div className="bg-slate-100 p-4 w-[60px] rounded-full">
            <LockKeyhole className="stroke-slate-500" />
          </div>
          <h3 className="text-2xl font-bold mt-2">Caixa fechado</h3>
          <span className="text-base text-slate-600 mt-2">
            O caixa já se encontra fechado. Abra um novo caixa para iniciar as operações.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black flex flex-col items-center">
        <div className="bg-red-100 p-4 w-[60px] rounded-full">
          <LockKeyhole className="stroke-red-500" />
        </div>
        <h3 className="text-2xl font-bold mt-2">Fechar caixa</h3>
        <span className="text-base text-slate-600 mt-2">
          Informe o valor total contado no caixa ao final do dia
        </span>
        <div className="bg-slate-100 p-6 rounded-lg mt-8 border border-slate-300">
          <h3 className="font-semibold text-lg">Valor de fechamento</h3>
          <span className="text-sm text-slate-600 mt-2">
            Coloque o valor físico contado no caixa
          </span>
          <form className="mt-4" onSubmit={onSubmit}>
            <Controller
              name="closingValue"
              control={control}
              render={({ field }) => (
                <MoneyInput
                  ref={inputRef}
                  onValueChange={(_, __, values) => field.onChange(values?.float ?? 0)}
                />
              )}
            />
            <div className="mt-4 flex justify-between w-full">
              <Button variant="destructive" type="button" className="flex-1 mr-2">
                Cancelar (ESC)
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={!closingValue || closingValue <= 0}
              >
                Fechar Caixa (Enter)
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Confirmar fechamento de caixa</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <BoxValue title="Total vendido no caixa" value={formatMoney(grandTotal)} />
            <BoxValue title="Valor contado no caixa" value={formatMoney(closingValue)} />
            <BoxValue
              title="Diferença"
              value={formatMoney(difference)}
              className={difference < 0 ? 'text-red-600' : 'text-green-700'}
            />
          </div>

          <div className="mt-6 flex justify-between gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading && <Spinner />}
              Confirmar fechamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
