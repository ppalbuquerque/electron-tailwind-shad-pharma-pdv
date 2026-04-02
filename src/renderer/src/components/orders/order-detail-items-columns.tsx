import { ColumnDef } from '@tanstack/react-table'

import { OrderItemDetail } from '@/services/orders/orders.dto'
import { formatMoney } from '@/utils/format-money'

const BOX_TYPE_LABEL: Record<OrderItemDetail['boxType'], string> = {
  unit: 'Unidade',
  box: 'Caixa'
}

export const orderDetailItemsColumns: ColumnDef<OrderItemDetail>[] = [
  {
    accessorKey: 'medication.name',
    header: 'Medicamento',
    cell: ({ row }) => {
      const name: string = row.original.medication.name
      return <span>{name}</span>
    }
  },
  {
    accessorKey: 'medication.id',
    header: 'ID do produto',
    cell: ({ row }) => {
      const id: number = row.original.medication.id
      return <span className="font-mono text-sm">#{id}</span>
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
      return <span>{formatMoney(value)}</span>
    }
  }
]
