import { ColumnDef } from '@tanstack/react-table'

import { Medication } from '@/types/medication'
import { formatMoneyFromCents } from '@/utils/format-money'

export const columns: ColumnDef<Medication>[] = [
  {
    accessorKey: 'name',
    header: 'Produto'
  },
  {
    accessorKey: 'boxPrice',
    header: 'Preço caixa',
    cell: ({ row }) => {
      const value: number = row.getValue('boxPrice')
      return <span>{formatMoneyFromCents(value)}</span>
    }
  },
  {
    accessorKey: 'unitPrice',
    header: 'Preço unitário',
    cell: ({ row }) => {
      const value: number = row.getValue('unitPrice')
      return <span>{formatMoneyFromCents(value)}</span>
    }
  },
  {
    accessorKey: 'stockAvailability',
    header: 'Quantidade'
  }
]
