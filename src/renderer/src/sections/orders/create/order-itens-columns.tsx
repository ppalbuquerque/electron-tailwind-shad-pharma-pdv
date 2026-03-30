import { ColumnDef } from '@tanstack/react-table'

import { OrderItem } from '@/types/orderItem'

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
      const formatted = new Intl.NumberFormat('pt-Br', {
        style: 'currency',
        currency: 'BRL'
      }).format(subtotal)

      return <div>{formatted}</div>
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Quantidade'
  }
]
