import { ColumnDef } from '@tanstack/react-table'

import { OrderItemDetail } from '@/services/orders/orders.dto'
import { formatMoneyFromCents } from '@/utils/format-money'

const BOX_TYPE_LABEL: Record<OrderItemDetail['boxType'], string> = {
  unit: 'Unidade',
  box: 'Caixa'
}

export const orderDetailItemsColumns: ColumnDef<OrderItemDetail>[] = [
  {
    accessorKey: 'medication.name',
    header: 'Medicamento',
    cell: ({ row }) => {
      const medication = row.original.medication
      return <span>{medication?.name ?? 'Medicamento removido'}</span>
    }
  },
  {
    accessorKey: 'medication.id',
    header: 'ID do produto',
    cell: ({ row }) => {
      const id = row.original.medication?.id
      if (!id) return <span className="text-muted-foreground">—</span>
      return (
        <span className="font-mono text-sm" title={id}>
          #{id.slice(0, 8)}
        </span>
      )
    }
  },
  {
    accessorKey: 'amount',
    header: 'Quantidade',
    cell: ({ row }) => {
      const amount: number = row.getValue('amount')
      return <span>{amount}</span>
    }
  },
  {
    accessorKey: 'boxType',
    header: 'Tipo de embalagem',
    cell: ({ row }) => {
      const boxType: OrderItemDetail['boxType'] = row.getValue('boxType')
      return <span>{BOX_TYPE_LABEL[boxType]}</span>
    }
  },
  {
    accessorKey: 'totalValue',
    header: 'Total',
    cell: ({ row }) => {
      const value: number = row.getValue('totalValue')
      return <span>{formatMoneyFromCents(value)}</span>
    }
  }
]
