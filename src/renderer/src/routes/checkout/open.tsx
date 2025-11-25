import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout/open')({
  component: RouteComponent
})

function RouteComponent(): ReactNode {
  return <div>Abrir Checkout</div>
}
