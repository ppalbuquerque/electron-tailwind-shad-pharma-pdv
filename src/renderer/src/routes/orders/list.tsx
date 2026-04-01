import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Controller } from 'react-hook-form'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { listOrdersColumns } from '@/components/orders/list-orders-columns'
import { useListOrdersViewModel } from '@/effects/orders/useListOrders.viewmodel'

function ListOrdersPage(): ReactNode {
  const {
    orders,
    isLoading,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    register,
    control,
    handleFilterSubmit,
    handleOrderClick
  } = useListOrdersViewModel()

  return (
    <div className="p-6">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black flex flex-col gap-4">
        <form onSubmit={handleFilterSubmit} className="flex flex-row items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? 'ALL'}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="COMPLETE">Concluído</SelectItem>
                    <SelectItem value="PROCESSING">Em andamento</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">De</label>
            <Input type="date" className="w-[160px]" {...register('createdAtFrom')} />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Até</label>
            <Input type="date" className="w-[160px]" {...register('createdAtTo')} />
          </div>

          <Button type="submit">Filtrar</Button>
        </form>

        <DataTable
          columns={listOrdersColumns}
          data={orders}
          isLoading={isLoading}
          loadingMessage="Carregando pedidos..."
          emptyMessage="Nenhum pedido encontrado"
          onConfirmSelection={handleOrderClick}
        />

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goToPrevPage} disabled={currentPage <= 1}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button variant="outline" onClick={goToNextPage} disabled={currentPage >= totalPages}>
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/orders/list')({ component: ListOrdersPage })
