import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { AddMedicationDialog } from '@/sections/orders/create/add-medication-dialog'
import { useCreateOrderViewModel } from '@/effects/orders/useCreateOrder.viewmodel'

export const Route = createFileRoute('/orders/create')({
  component: CreateOrder
})

function CreateOrder(): ReactNode {
  const {
    onInputSearchConfirm,
    register,
    setSearchValue,
    handleAddOrderItens,
    searchMedicationDialogIsOpen,
    searchData,
    searchValue,
    orderItens
  } = useCreateOrderViewModel()

  return (
    <div className="flex justify-center mt-4">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black w-[90%]">
        <div className="bg-stone-950 rounded-sm p-4 max-w-fit">
          <span className="text-stone-50 font-semibold">Nº 000001</span>
        </div>
        <div className="flex items-center flex-col mt-10 mb-10">
          <div className="bg-slate-200 p-8 rounded-full mb-2">
            <ShoppingCart className="stroke-[#64748B]" />
          </div>
          <h2 className="font-semibold text-slate-500 text-lg">Sem items</h2>
          <span className="text-base text-slate-400">Procure por medicamentos</span>
        </div>
        <hr className="mb-8 mt-8 text-slate-300" />
        <form onSubmit={onInputSearchConfirm}>
          <Input
            type="search"
            placeholder="Procure o medicamento pelo nome"
            {...register('medicationName')}
          />
        </form>
        <div className="flex flex-col items-center pt-2 pb-2 mt-4 bg-emerald-200 rounded-sm">
          <h2 className="font-semibold text-emerald-900 text-lg">Total</h2>
          <p className="font-bold text-2xl text-emerald-600">R$ 0.00</p>
        </div>
        <div className="mt-4">
          <Button variant="default" className="flex-1 mr-2 bg-neutral-700">
            Fechar Venda (ESC)
          </Button>
          <Button className="flex-1" variant="destructive">
            Cancelar Venda
          </Button>
        </div>
      </div>
      <AddMedicationDialog
        open={searchMedicationDialogIsOpen}
        medicationTableData={searchData}
        defaultSearchValue={searchValue}
        setSearchValue={setSearchValue}
        onMedicationItemConfirm={handleAddOrderItens}
      />
    </div>
  )
}
