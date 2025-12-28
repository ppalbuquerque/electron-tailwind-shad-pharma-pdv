import { ColumnDef } from '@tanstack/react-table'

export type Medication = {
  name: string
  boxType: 'Caixa' | 'Unidade'
  value: number
  amount: number
}

export const columns: ColumnDef<Medication>[] = [
  {
    accessorKey: 'name',
    header: 'Produto'
  },
  {
    accessorKey: 'boxType',
    header: 'Unidade'
  },
  {
    accessorKey: 'value',
    header: () => <div className="text-right">Valor</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('value'))
      const formatted = new Intl.NumberFormat('pt-Br', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount)

      return <div className="text-right">{formatted}</div>
    }
  },
  {
    accessorKey: 'amount',
    header: 'Quantidade'
  }
]
