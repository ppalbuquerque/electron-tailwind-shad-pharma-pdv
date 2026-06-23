import { useState, useEffect, useRef } from 'react'
import type { BaseSyntheticEvent, RefObject } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useHotkeys } from 'react-hotkeys-hook'

import { MedicationSummary, ListMedicationsResponse } from '@/services/medication/medication.dto'
import { MedicationService } from '@/services/medication/medication.service'
import { MEDICATION_QUERY_KEYS } from '@/services/medication/medication.query.keys'
import { HotkeyScope } from '@/lib/hotkey-scopes'
import { useSidebarNavigationContext } from '@/contexts/navigation/sidebar-navigation.context'

const PAGE_SIZE = 15

interface MedicationSearchForm {
  q: string
}

export interface ListMedicationsViewModel {
  medications: MedicationSummary[]
  isLoading: boolean
  currentPage: number
  hasNextPage: boolean
  goToNextPage: () => void
  goToPrevPage: () => void
  register: ReturnType<typeof useForm<MedicationSearchForm>>['register']
  handleSearchSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  tableRef: RefObject<HTMLDivElement | null>
}

export function useListMedicationsViewModel(): ListMedicationsViewModel {
  const [offset, setOffset] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const tableRef = useRef<HTMLDivElement>(null)
  const { focusByPath, registerContentFocus } = useSidebarNavigationContext()

  const { register, handleSubmit } = useForm<MedicationSearchForm>()

  const isSearching = searchQuery.trim().length > 0

  useEffect(() => {
    tableRef.current?.focus()
  }, [])

  useEffect(() => {
    registerContentFocus(() => tableRef.current?.focus())
    return () => registerContentFocus(null)
  }, [registerContentFocus])

  useHotkeys('escape', () => focusByPath('/medication/list'), {
    scopes: [HotkeyScope.CONTENT],
    preventDefault: true
  })

  const { data, isLoading } = useQuery({
    queryKey: isSearching
      ? [MEDICATION_QUERY_KEYS.MEDICATION_SEARCH, searchQuery]
      : [MEDICATION_QUERY_KEYS.LIST_MEDICATIONS, offset],
    queryFn: () =>
      isSearching
        ? MedicationService.search({ query: searchQuery })
        : MedicationService.list({ limit: PAGE_SIZE, offset })
  })

  const listData = !isSearching ? (data as ListMedicationsResponse | undefined) : undefined
  const medications: MedicationSummary[] = isSearching
    ? ((data as MedicationSummary[] | undefined) ?? [])
    : (listData?.medications ?? [])
  const currentPage = offset / PAGE_SIZE + 1
  const hasNextPage = !isSearching && listData?.nextPage != null

  function goToNextPage(): void {
    if (hasNextPage) {
      setOffset((prev) => prev + PAGE_SIZE)
    }
  }

  function goToPrevPage(): void {
    if (currentPage > 1) {
      setOffset((prev) => prev - PAGE_SIZE)
    }
  }

  const handleSearchSubmit = handleSubmit((values) => {
    setSearchQuery(values.q ?? '')
    setOffset(0)
  })

  return {
    medications,
    isLoading,
    currentPage,
    hasNextPage,
    goToNextPage,
    goToPrevPage,
    register,
    handleSearchSubmit,
    tableRef
  }
}
