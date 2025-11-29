import { createFileRoute } from '@tanstack/react-router'
import { ReactNode } from 'react'

export const Route = createFileRoute('/')({
  component: Index
})

function Index(): ReactNode {
  return (
    <div className="p-2">
      <p>Tela inicial</p>
    </div>
  )
}
