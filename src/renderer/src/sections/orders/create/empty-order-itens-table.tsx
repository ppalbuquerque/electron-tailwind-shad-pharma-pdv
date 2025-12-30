import { ReactNode } from 'react'
import { ShoppingCart } from 'lucide-react'

function EmptyOrderItensTable(): ReactNode {
  return (
    <div className="flex items-center flex-col mt-10 mb-10">
      <div className="bg-slate-200 p-8 rounded-full mb-2">
        <ShoppingCart className="stroke-[#64748B]" />
      </div>
      <h2 className="font-semibold text-slate-500 text-lg">Sem items</h2>
      <span className="text-base text-slate-400">Procure por medicamentos</span>
    </div>
  )
}

export { EmptyOrderItensTable }
