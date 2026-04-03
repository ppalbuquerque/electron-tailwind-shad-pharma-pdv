import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { listMedicationsColumns } from '@/components/medication/list-medications-columns'
import { useListMedicationsViewModel } from '@/effects/medication/useListMedications.viewmodel'

function ListMedicationsPage(): ReactNode {
  const {
    medications,
    isLoading,
    currentPage,
    hasNextPage,
    goToNextPage,
    goToPrevPage,
    register,
    handleSearchSubmit
  } = useListMedicationsViewModel()

  return (
    <div className="p-6">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black flex flex-col gap-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-row items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Buscar</label>
            <Input placeholder="Nome do medicamento..." className="w-[280px]" {...register('q')} />
          </div>
          <Button type="submit">Buscar</Button>
        </form>

        <DataTable
          columns={listMedicationsColumns}
          data={medications}
          isLoading={isLoading}
          loadingMessage="Carregando medicamentos..."
          emptyMessage="Nenhum medicamento encontrado"
          getRowClassName={(row) => (row.stockAvailability <= 0 ? 'bg-red-100 text-red-800' : '')}
        />

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goToPrevPage} disabled={currentPage <= 1}>
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">Página {currentPage}</span>
          <Button variant="outline" onClick={goToNextPage} disabled={!hasNextPage}>
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/medication/list')({ component: ListMedicationsPage })
