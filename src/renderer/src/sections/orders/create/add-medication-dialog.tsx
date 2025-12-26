import { ReactNode } from 'react'

import { Dialog, DialogContent } from '@/components/ui/dialog'

interface AddMedicationDialogProps {
  open?: boolean
}

export function AddMedicationDialog({ open }: AddMedicationDialogProps): ReactNode {
  return (
    <Dialog open={open}>
      <DialogContent>
        <div>
          <p>Teste</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
