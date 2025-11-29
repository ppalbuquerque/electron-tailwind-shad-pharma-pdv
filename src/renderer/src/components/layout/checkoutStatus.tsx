import { ReactNode } from 'react'
import { cva, VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const checkoutStatusSpanVariants = cva('text-sm font-semibold', {
  variants: {
    variant: {
      open: 'text-green-700',
      closed: 'text-slate-600'
    }
  }
})

const checkoutStatusBadgeVariants = cva('rounded-md pl-4 pr-4 flex pt-2 pb-2', {
  variants: {
    variant: {
      open: 'bg-green-200',
      closed: 'bg-slate-300'
    }
  }
})

function CheckoutStatus({ variant }: VariantProps<typeof checkoutStatusSpanVariants>): ReactNode {
  const textToDisplay = variant === 'closed' ? 'Fechado' : 'Aberto'

  return (
    <div className={cn(checkoutStatusBadgeVariants({ variant }))}>
      <span className={cn(checkoutStatusSpanVariants({ variant }))}>Caixa {textToDisplay}</span>
    </div>
  )
}

export { CheckoutStatus }
