import { ColumnDef } from '@tanstack/react-table'

import { Medication } from '@/types/medication'

export const columns: ColumnDef<Medication>[] = [
  {
    accessorKey: 'name',
    header: 'Produto'
  },
  {
    accessorKey: 'box_price',
    header: () => <div>Valor</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('value'))
      const formatted = new Intl.NumberFormat('pt-Br', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount)

      return <div>{row.getValue('box_price')}</div>
    }
  },
  {
    accessorKey: 'stock_availability',
    header: 'Quantidade'
  }
]
