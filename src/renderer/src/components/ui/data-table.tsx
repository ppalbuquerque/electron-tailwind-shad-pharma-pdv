import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowModel,
  RowSelectionState,
  useReactTable
} from '@tanstack/react-table'
import { ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { useHotkeys } from 'react-hotkeys-hook'
import { CircleOff } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'

import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading?: boolean
  onConfirmSelection?: (row: TData) => void
  onDeleteSelection?: (row: TData) => void
}

const rowVariants = cva('', {
  variants: {
    variant: {
      selected: 'bg-sky-600 text-neutral-50',
      default: ''
    }
  }
})

function getCurrentIndex(rows: RowModel<unknown>[], rowSelection: RowSelectionState): number {
  const selectedId = Object.keys(rowSelection).find((id) => rowSelection[id])
  const currentIndex = rows.findIndex((row) => row.id == selectedId)

  return currentIndex
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  onConfirmSelection,
  onDeleteSelection
}: DataTableProps<TData, TValue>): ReactNode {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const table = useReactTable({
    data,
    columns,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    state: {
      rowSelection
    }
  })

  const isTableEmpty = !isLoading && data.length === 0

  useHotkeys('ArrowDown', () => {
    const rows = table.getRowModel().rows

    const currentIndex = getCurrentIndex(rows, rowSelection)

    const nextIndex = currentIndex + 1

    if (nextIndex < rows.length) {
      setRowSelection({ [rows[nextIndex].id]: true })
    }
  })

  useHotkeys('ArrowUp', () => {
    const rows = table.getRowModel().rows

    const currentIndex = getCurrentIndex(rows, rowSelection)

    const nextIndex = currentIndex - 1

    if (nextIndex >= 0) {
      setRowSelection({ [rows[nextIndex].id]: true })
    }
  })

  useHotkeys('Enter', () => {
    const rows = table.getRowModel().rows

    const currentIndex = getCurrentIndex(rows, rowSelection)
    const selectedRow = rows[currentIndex]

    if (onConfirmSelection) {
      onConfirmSelection(selectedRow.original)
    }
  })

  useHotkeys('backspace', () => {
    const rows = table.getRowModel().rows

    const currentIndex = getCurrentIndex(rows, rowSelection)
    const selectedRow = rows[currentIndex]

    if (onDeleteSelection) {
      onDeleteSelection(selectedRow.original)
    }
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table className="text-black">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              className={cn(rowVariants({ variant: row.getIsSelected() ? 'selected' : 'default' }))}
              onClick={row.getToggleSelectedHandler()}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isLoading && (
        <div className="text-black flex justify-center mt-4 items-center flex-col">
          <Spinner className="size-8 mb-2" />
          <span>Carregando medicamentos...</span>
        </div>
      )}
      {isTableEmpty && (
        <div className="text-black flex justify-center mt-4 items-center flex-col">
          <CircleOff className="mb-4 mt-4" />
          <span>Nenhum medicamento encontrado</span>
        </div>
      )}
    </div>
  )
}
