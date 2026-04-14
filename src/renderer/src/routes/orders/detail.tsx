import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { DataTable } from '@/components/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { orderDetailItemsColumns } from '@/components/orders/order-detail-items-columns'
import { useOrderDetailViewModel } from '@/effects/orders/useOrderDetail.viewmodel'
import { formatMoney } from '@/utils/format-money'
import { OrderDetail } from '@/services/orders/orders.dto'

const STATUS_LABEL: Record<OrderDetail['status'], string> = {
  COMPLETE: 'Concluído',
  CANCELLED: 'Cancelado',
  PROCESSING: 'Em andamento'
}

const STATUS_CLASS: Record<OrderDetail['status'], string> = {
  COMPLETE: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800'
}

export const Route = createFileRoute('/orders/detail')({
  validateSearch: (search: Record<string, unknown>) => ({ id: String(search.id ?? '') }),
  component: OrderDetailPage
})

function OrderDetailPage(): ReactNode {
  const { id } = Route.useSearch()
  const {
    order,
    isLoading,
    isCancelDialogOpen,
    isCancelPending,
    openCancelDialog,
    closeCancelDialog,
    handleConfirmCancel
  } = useOrderDetailViewModel(id)

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-sm p-12 border-slate-300 border text-black">
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-sm p-12 border-slate-300 border text-black">
          <p className="text-sm text-muted-foreground">Pedido não encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Pedido
              </span>
              <span className="font-mono text-sm font-semibold">#{order.id.slice(0, 8)}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Status
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium self-start ${STATUS_CLASS[order.status]}`}
              >
                {STATUS_LABEL[order.status]}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Data
              </span>
              <span className="text-sm">
                {new Intl.DateTimeFormat('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }).format(new Date(order.createdAt))}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Total
              </span>
              <span className="text-sm font-semibold">{formatMoney(order.totalValue)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold">Itens do Pedido</h2>
          <DataTable
            columns={orderDetailItemsColumns}
            data={order.orderItems}
            emptyMessage="Nenhum item encontrado"
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            onClick={openCancelDialog}
            disabled={order.status === 'CANCELLED'}
          >
            Cancelar Pedido
          </Button>
        </div>
      </div>

      <Dialog open={isCancelDialogOpen} onOpenChange={closeCancelDialog}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Cancelar Pedido</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar o pedido #{order.id.slice(0, 8)}? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={closeCancelDialog}>
              Voltar
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel} disabled={isCancelPending}>
              {isCancelPending && <Spinner className="mr-2 size-4" />}
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
