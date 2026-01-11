import { ReactNode } from 'react'
import { Controller } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useAddOrderItemViewModel } from '@/effects/orders/useAddOrderItem.viewmodel'

function AddOrderItem(): ReactNode {
  const { register, onAddOrderItemSubmit, control } = useAddOrderItemViewModel()

  return (
    <div>
      <form onSubmit={onAddOrderItemSubmit} className="mb-4 flex items-center">
        <Input
          type="number"
          placeholder="Quantidade"
          className="mr-4"
          {...register('quantity', { valueAsNumber: true })}
        />
        <Controller
          name="boxType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(value) => field.onChange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                <SelectItem value="box" className="focus:border-blue-400">
                  Caixa
                </SelectItem>
                <SelectItem value="unit" className="focus:border-blue-400">
                  Unidade
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </form>
    </div>
  )
}

export { AddOrderItem }
