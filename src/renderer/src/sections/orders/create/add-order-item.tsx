import { ReactNode } from 'react'

import { Input } from '@/components/ui/input'
import { useAddOrderItemViewModel } from '@/effects/orders/useAddOrderItem.viewmodel'

function AddOrderItem(): ReactNode {
  const { register, onAddOrderItemSubmit } = useAddOrderItemViewModel()

  return (
    <div className="mb-4 flex items-center">
      <form onSubmit={onAddOrderItemSubmit}>
        <Input type="number" placeholder="Quantidade" {...register('quantitiy')} />
        <div className="ml-4 bg-slate-400 text-zinc-50 rounded-sm p-2">
          <span>300,00</span>
        </div>
      </form>
    </div>
  )
}

export { AddOrderItem }
