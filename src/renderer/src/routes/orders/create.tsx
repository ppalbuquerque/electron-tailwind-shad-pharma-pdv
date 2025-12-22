import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orders/create')({
  component: CreateOrder
})

function CreateOrder(): ReactNode {
  return <div>Novo pedido</div>
}
