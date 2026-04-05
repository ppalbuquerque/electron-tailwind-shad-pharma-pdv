import { ReactNode } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { BoxValue } from '@/components/ui/box-value'
import { useMedicationDetailViewModel } from '@/effects/medication/useMedicationDetail.viewmodel'
import { formatMoneyFromCents } from '@/utils/format-money'

export const Route = createFileRoute('/medication/$id')({
  component: MedicationDetailPage
})

function MedicationDetailPage(): ReactNode {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { medication, isLoading, isError } = useMedicationDetailViewModel(Number(id))

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-sm p-12 border-slate-300 border text-black flex items-center justify-center">
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (isError || !medication) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-sm p-12 border-slate-300 border text-black">
          <p className="text-sm text-muted-foreground">
            Ocorreu um erro ao buscar os dados do medicamento.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black flex flex-col gap-6">
        <img
          src={medication.samplePhotoUrl}
          alt={medication.name}
          className="w-full max-h-64 object-contain rounded-md"
        />

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{medication.name}</h1>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/medication/edit/$id', params: { id } })}
          >
            Editar
          </Button>
        </div>

        <section className="border border-black rounded-sm p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Informações Gerais</h2>
          <BoxValue title="Nome" value={medication.name} />
          <BoxValue title="Composição Química" value={medication.chemicalComposition} />
          <BoxValue title="Indicação Terapêutica" value={medication.usefulness} />
          <BoxValue title="Posologia" value={medication.dosageInstructions} />
        </section>

        <section className="border border-black rounded-sm p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Informações de Estoque</h2>
          <BoxValue title="Localização na Prateleira" value={medication.shelfLocation} />
          <BoxValue title="Estoque Disponível" value={String(medication.stockAvailability)} />
        </section>

        <section className="border border-black rounded-sm p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Informações de Preço</h2>
          <BoxValue title="Preço por Caixa" value={formatMoneyFromCents(medication.boxPrice)} />
          <BoxValue
            title="Preço por Unidade"
            value={formatMoneyFromCents(medication.unitPrice)}
          />
        </section>

        <section className="border border-black rounded-sm p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide">Metadados</h2>
          <BoxValue
            title="Criado em"
            value={new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(medication.createdAt))}
          />
          <BoxValue
            title="Atualizado em"
            value={new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date(medication.updatedAt))}
          />
        </section>
      </div>
    </div>
  )
}
