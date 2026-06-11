import { ColumnDef } from '@tanstack/react-table'

import { OrderItem } from '@/types/orderItem'
import { formatMoneyFromCents } from '@/utils/format-money'

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
    header: 'Quantidade'
  }
]
