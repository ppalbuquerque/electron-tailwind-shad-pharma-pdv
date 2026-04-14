import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LockKeyhole, NotebookText } from 'lucide-react'

import { BoxValue } from '@/components/ui/box-value'
import { Spinner } from '@/components/ui/spinner'

import { useCheckoutResumeViewModel } from '@/effects/checkout/checkoutResume.viewmodel'
import { formatMoney } from '@/utils/format-money'

export const Route = createFileRoute('/checkout/resume')({
  component: CheckoutResume
})

function CheckoutResume(): ReactNode {
  const { isCheckoutOpen, isLoading, initialValue, totalOrdersValue, totalOrderCount, grandTotal } =
    useCheckoutResumeViewModel()

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
        <div className="bg-sky-100 p-4 w-[60px] rounded-full">
          <NotebookText className="stroke-sky-500" />
        </div>
        <h3 className="text-2xl font-bold mt-2">Situação do Caixa</h3>
        <span className="text-base text-slate-600 mt-2">Resumo do caixa atual</span>

        {isLoading ? (
          <div className="mt-8">
            <Spinner />
          </div>
        ) : (
          <div className="w-full max-w-md mt-8 flex flex-col gap-4">
            <BoxValue title="Valor inicial" value={formatMoney(initialValue)} />
            <hr className="border-slate-200" />
            <BoxValue title="Total de vendas" value={formatMoney(totalOrdersValue)} />
            <hr className="border-slate-200" />
            <BoxValue title="Total de pedidos" value={String(totalOrderCount)} />
            <hr className="border-slate-200" />
            <BoxValue
              title="Total no caixa"
              value={formatMoney(grandTotal)}
              className="text-green-700 font-semibold"
            />
          </div>
        )}
      </div>
    </div>
  )
}
