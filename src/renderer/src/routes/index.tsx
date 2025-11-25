import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  component: Index
})

function Index(): ReactNode {
  return (
    <div className="p-2">
      <h3>Tela inicial</h3>
    </div>
  )
}
