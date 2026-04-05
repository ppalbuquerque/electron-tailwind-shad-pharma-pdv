import { ColumnDef } from '@tanstack/react-table'

import { MedicationSummary } from '@/services/medication/medication.dto'
import { formatMoneyFromCents } from '@/utils/format-money'

export const listMedicationsColumns: ColumnDef<MedicationSummary>[] = [
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'chemicalComposition',
    header: 'Composição',
    cell: ({ row }) => {
      const value: string = row.getValue('chemicalComposition')
      const truncated = value?.length > 40 ? `${value?.slice(0, 40)}…` : value
      return <span title={value}>{truncated}</span>
    }
  },
  {
    accessorKey: 'stockAvailability',
    header: 'Estoque'
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
  }
]
