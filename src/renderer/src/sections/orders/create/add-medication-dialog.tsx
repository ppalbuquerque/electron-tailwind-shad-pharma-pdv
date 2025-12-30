import { ReactNode } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Medication } from '@/types/medication'
import { DataTable } from '@/components/ui/data-table'

import { columns } from './search-medication-columns'

interface AddMedicationDialogProps {
  open?: boolean
  medicationTableData: Medication[]
  defaultSearchValue: string
  setSearchValue: (term: string) => void
  onMedicationItemConfirm: (medication: Medication) => void
}

export function AddMedicationDialog({
  open,
  medicationTableData,
  defaultSearchValue,
  setSearchValue,
  onMedicationItemConfirm
}: AddMedicationDialogProps): ReactNode {
  return (
    <Dialog open={open}>
      <DialogContent className="bg-white max-w-5xl!">
        <DialogHeader>
          <DialogTitle className="text-black">Lista de Medicamentos</DialogTitle>
        </DialogHeader>
        <div>
          <DataTable
            data={medicationTableData}
            columns={columns}
            onConfirmSelection={onMedicationItemConfirm}
          />
          <hr className="mb-8 mt-8 text-slate-300" />
          <div>
            <Input
              type="search"
              placeholder="Procure o medicamento pelo nome"
              className="border-slate-300 text-slate-800"
              defaultValue={defaultSearchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
