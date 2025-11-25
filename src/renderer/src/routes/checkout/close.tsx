import { ReactNode } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/checkout/close')({
  component: RouteComponent
})

function RouteComponent(): ReactNode {
  return <div>Hello "/checkout/close"!</div>
}
