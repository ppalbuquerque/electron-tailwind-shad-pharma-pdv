import { ColumnDef } from '@tanstack/react-table'

import { BoxType, OrderItem } from '@/types/orderItem'
import { formatMoneyFromCents } from '@/utils/format-money'

const BOX_TYPE_LABEL: Record<BoxType, string> = {
  box: 'Caixa(s)',
  unit: 'Unidade(s)'
}

export const columns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: 'medication.name',
    header: 'Produto'
  },
  {
    accessorKey: 'subtotal',
    header: () => <div>Valor</div>,
    cell: ({ row }) => {
      const subtotal: number = row.getValue('subtotal')
      return <div>{formatMoneyFromCents(subtotal)}</div>
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Quantidade',
    cell: ({ row }) => {
      const { quantity, boxType } = row.original
      return <div>{`${quantity} ${BOX_TYPE_LABEL[boxType]}`}</div>
    }
  }
]
