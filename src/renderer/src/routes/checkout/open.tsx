import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShoppingCart, InfoIcon } from 'lucide-react'
import { Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { MoneyInput } from '@/components/ui/money-input'

import { useOpenCheckoutViewModel } from '@/effects/checkout/openCheckout.viewmodel'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/checkout/open')({
  component: OpenCheckout,
})

function OpenCheckout(): ReactNode {
  const { control, onSubmit, isLoading, initialValueInputRef } = useOpenCheckoutViewModel()

  return (
    <div className="flex flex-col mt-8 items-center">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black flex flex-col items-center">
        <div className="bg-sky-100 p-4 w-[60px] rounded-full">
          <ShoppingCart className="stroke-[#3B82F6]" />
        </div>
        <h3 className="text-2xl font-bold mt-2">Abrir novo caixa</h3>
        <span className="text-base text-slate-600 mt-2">
          Coloque a quantidade de dinheiro inicial do caixa
        </span>
        <div className="bg-slate-100 p-6 rounded-lg mt-8 border border-slate-300">
          <h3 className="font-semibold text-lg">Valor inicial</h3>
          <span className="text-sm text-slate-600 mt-2">
            Coloque a quantidade de dinheiro inicial do caixa
          </span>
          <form className="mt-4" onSubmit={onSubmit}>
            <Controller
              name="initialValue"
              control={control}
              render={({ field }) => (
                <MoneyInput
                  ref={initialValueInputRef}
                  onValueChange={(value, formatted, values) => field.onChange(values?.float)}
                />
              )}
            />
            <div className="mt-4 w-full">
              <Button className="w-full" disabled={isLoading}>
                {isLoading && <Spinner />}
                Confirmar (Enter)
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-yellow-100 p-8 rounded-sm mt-4">
        <div className="flex">
          <InfoIcon className="mr-2 stroke-[#F59E0B]" />
          <h4 className="font-semibold text-orange-800">Lembretes importantes</h4>
        </div>
        <ul className="list-disc text-orange-800">
          <li>Observe o valor anotado na gaveta de dinheiro.</li>
          <li>Confira se o valor está correto.</li>
        </ul>
      </div>
    </div>
  )
}
