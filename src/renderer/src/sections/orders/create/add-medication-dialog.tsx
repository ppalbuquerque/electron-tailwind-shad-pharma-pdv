import { ReactNode } from 'react'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { DataTable } from './data-table'
import { columns, Medication } from './columns'

interface AddMedicationDialogProps {
  open?: boolean
}

const MOCK_DATA: Medication[] = [
  {
    amount: 10,
    boxType: 'Caixa',
    name: 'Dipirona',
    value: 10
  }
]

export function AddMedicationDialog({ open }: AddMedicationDialogProps): ReactNode {
  return (
    <Dialog open={open}>
      <DialogContent className="bg-black">
        <div>
          <DataTable data={MOCK_DATA} columns={columns} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
