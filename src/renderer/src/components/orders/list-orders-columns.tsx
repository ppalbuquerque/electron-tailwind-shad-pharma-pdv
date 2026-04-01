import { ColumnDef } from '@tanstack/react-table'

import { OrderSummary } from '@/services/orders/orders.dto'
import { formatMoney } from '@/utils/format-money'

const STATUS_LABEL: Record<OrderSummary['status'], string> = {
  COMPLETE: 'Concluído',
  CANCELLED: 'Cancelado',
  PROCESSING: 'Em andamento'
}

const STATUS_CLASS: Record<OrderSummary['status'], string> = {
  COMPLETE: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800'
}

export const listOrdersColumns: ColumnDef<OrderSummary>[] = [
  {
    accessorKey: 'id',
    header: 'Pedido',
    cell: ({ row }) => {
      const id: string = row.getValue('id')
      return <span className="font-mono text-sm">#{id.slice(0, 6)}</span>
    }
  },
  {
    accessorKey: 'totalValue',
    header: 'Total',
    cell: ({ row }) => {
      const value: number = row.getValue('totalValue')
      return <span>{formatMoney(value)}</span>
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status: OrderSummary['status'] = row.getValue('status')
      return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => {
      const date: string = row.getValue('createdAt')
      return (
        <span>
          {new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(date))}
        </span>
      )
    }
  }
]
