import { type ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoneyInput } from '@/components/ui/money-input'
import { useCreateMedicationViewModel } from '@/effects/medication/useCreateMedication.viewmodel'

export const Route = createFileRoute('/medication/create')({
  component: CreateMedicationPage
})

function CreateMedicationPage(): ReactNode {
  const { register, control, errors, isValid, isSubmitting, onSubmit } =
    useCreateMedicationViewModel()

  return (
    <div className="p-6 overflow-y-auto h-[700px]">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black">
        <h1 className="text-2xl font-bold mb-8">Cadastrar Medicamento</h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <section className="border border-black rounded-sm p-4 flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Informações Gerais</h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Nome</label>
              <Input {...register('name')} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Composição Química</label>
              <Input {...register('chemicalComposition')} />
              {errors.chemicalComposition && (
                <p className="text-sm text-red-500">{errors.chemicalComposition.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Indicação Terapêutica</label>
              <Input {...register('usefulness')} />
              {errors.usefulness && (
                <p className="text-sm text-red-500">{errors.usefulness.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Posologia</label>
              <Input {...register('dosageInstructions')} />
              {errors.dosageInstructions && (
                <p className="text-sm text-red-500">{errors.dosageInstructions.message}</p>
              )}
            </div>
          </section>

          <section className="border border-black rounded-sm p-4 flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">
              Informações de Estoque
            </h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Localização na Prateleira</label>
              <Input {...register('shelfLocation')} />
              {errors.shelfLocation && (
                <p className="text-sm text-red-500">{errors.shelfLocation.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Estoque Disponível</label>
              <Input type="number" {...register('stockAvailability', { valueAsNumber: true })} />
              {errors.stockAvailability && (
                <p className="text-sm text-red-500">{errors.stockAvailability.message}</p>
              )}
            </div>
          </section>

          <section className="border border-black rounded-sm p-4 flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Informações de Preço</h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Preço por Caixa</label>
              <Controller
                name="boxPrice"
                control={control}
                render={({ field }) => (
                  <MoneyInput
                    ref={field.ref}
                    defaultValue={(field.value ?? 0) / 100}
                    onValueChange={(_, __, values) =>
                      field.onChange(Math.round((values?.float ?? 0) * 100))
                    }
                  />
                )}
              />
              {errors.boxPrice && <p className="text-sm text-red-500">{errors.boxPrice.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Preço por Unidade</label>
              <Controller
                name="unitPrice"
                control={control}
                render={({ field }) => (
                  <MoneyInput
                    ref={field.ref}
                    defaultValue={(field.value ?? 0) / 100}
                    onValueChange={(_, __, values) =>
                      field.onChange(Math.round((values?.float ?? 0) * 100))
                    }
                  />
                )}
              />
              {errors.unitPrice && (
                <p className="text-sm text-red-500">{errors.unitPrice.message}</p>
              )}
            </div>
          </section>

          <section className="border border-black rounded-sm p-4 flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Imagem do Produto</h2>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Imagem (opcional)</label>
              <Input type="file" accept="image/*" {...register('photo')} />
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
