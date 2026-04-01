import { ReactNode } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/ui/data-table'

import { Medication } from '@/types/medication'

import { useSearchMedicationDialogViewModel } from '@/effects/orders/useSearchMedicationDialog.viewmodel'

import { columns } from './search-medication-columns'

interface AddMedicationDialogProps {
  open?: boolean
  defaultSearchValue: string
  handleOnMedicationDialogConfirm: (medication: Medication) => void
}

export function AddMedicationDialog({
  open,
  defaultSearchValue,
  handleOnMedicationDialogConfirm
}: AddMedicationDialogProps): ReactNode {
  const { register, medicationTableData, isLoadingMedications } =
    useSearchMedicationDialogViewModel(defaultSearchValue)

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white max-w-5xl!">
        <DialogHeader>
          <DialogTitle className="text-black">Lista de Medicamentos</DialogTitle>
        </DialogHeader>
        <div>
          <DataTable
            data={medicationTableData}
            isLoading={isLoadingMedications}
            columns={columns}
            loadingMessage="Carregando medicamentos..."
            emptyMessage="Nenhum medicamento encontrado"
            onConfirmSelection={handleOnMedicationDialogConfirm}
          />
          <hr className="mb-8 mt-8 text-slate-300" />
          <div>
            <Input
              type="search"
              placeholder="Procure o medicamento pelo nome"
              className="border-slate-300 text-slate-800"
              {...register('medicationName')}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
