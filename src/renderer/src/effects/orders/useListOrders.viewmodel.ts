import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { BaseSyntheticEvent } from 'react'

import { OrderSummary } from '@/services/orders/orders.dto'
import { OrdersService } from '@/services/orders/orders.service'
import { ORDERS_QUERY_KEYS } from '@/services/orders/orders.query.keys'

const PAGE_SIZE = 15

interface OrdersFilterForm {
  status?: 'COMPLETE' | 'CANCELLED' | 'PROCESSING' | 'ALL'
  createdAtFrom?: string
  createdAtTo?: string
}

export interface ListOrdersViewModel {
  orders: OrderSummary[]
  total: number
  isLoading: boolean
  currentPage: number
  totalPages: number
  goToNextPage: () => void
  goToPrevPage: () => void
  register: ReturnType<typeof useForm<OrdersFilterForm>>['register']
  control: ReturnType<typeof useForm<OrdersFilterForm>>['control']
  handleFilterSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  handleOrderClick: (order: OrderSummary) => void
}

export function useListOrdersViewModel(): ListOrdersViewModel {
  const [offset, setOffset] = useState(0)
  const [filters, setFilters] = useState<OrdersFilterForm>({})

  const { register, control, handleSubmit } = useForm<OrdersFilterForm>()

  const { data, isLoading } = useQuery({
    queryKey: [ORDERS_QUERY_KEYS.LIST_ORDERS, offset, filters],
    queryFn: () =>
      OrdersService.listOrders({
        limit: PAGE_SIZE,
        offset,
        status: filters.status === 'ALL' || !filters.status ? undefined : filters.status,
        createdAtFrom: filters.createdAtFrom || undefined,
        createdAtTo: filters.createdAtTo || undefined
      })
  })

  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = offset / PAGE_SIZE + 1

  function goToNextPage(): void {
    if (currentPage < totalPages) {
      setOffset((prev) => prev + PAGE_SIZE)
    }
  }

  function goToPrevPage(): void {
    if (currentPage > 1) {
      setOffset((prev) => prev - PAGE_SIZE)
    }
  }

  const navigate = useNavigate()

  const handleFilterSubmit = handleSubmit((values) => {
    setFilters(values)
    setOffset(0)
  })

  function handleOrderClick(order: OrderSummary): void {
    navigate({ to: '/orders/detail', search: { id: order.id } })
  }

  return {
    orders: data?.orders ?? [],
    total,
    isLoading,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
    register,
    control,
    handleFilterSubmit,
    handleOrderClick
  }
}
