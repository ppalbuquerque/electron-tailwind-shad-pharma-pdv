import { ReactNode } from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { useCheckoutStatus } from '@/effects/checkout/useCheckoutStatus'

const checkoutStatusSpanVariants = cva('text-sm font-semibold', {
  variants: {
    variant: {
      open: 'text-green-700',
      closed: 'text-red-700'
    }
  }
})

const checkoutStatusBadgeVariants = cva('rounded-md pl-4 pr-4 flex pt-2 pb-2', {
  variants: {
    variant: {
      open: 'bg-green-200',
      closed: 'bg-red-200'
    }
  }
})

function CheckoutStatus(): ReactNode {
  const checkoutStatus = useCheckoutStatus()
  const variant = checkoutStatus?.isOpen ? 'open' : 'closed'
  const textToDisplay = variant === 'open' ? 'Caixa Aberto' : 'Caixa Fechado'

  return (
    <div className={cn(checkoutStatusBadgeVariants({ variant }))}>
      <span className={cn(checkoutStatusSpanVariants({ variant }))}>{textToDisplay}</span>
    </div>
  )
}

export { CheckoutStatus }
