import { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CancelOrderDialogProps {
  open: boolean
  onConfirm: () => void
  onDismiss: () => void
}

function CancelOrderDialog({ open, onConfirm, onDismiss }: CancelOrderDialogProps): ReactNode {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onDismiss()}>
      <DialogContent showCloseButton={false} className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>Deseja cancelar a venda?</DialogTitle>
          <DialogDescription>
            Ao cancelar essa venda todos os itens adicionados serão removidos da venda atual.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm}>
            Cancelar Venda
          </Button>
          <Button variant="outline" onClick={onDismiss}>
            Não Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { CancelOrderDialog }
