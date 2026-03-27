import { ReactNode } from 'react'

import { MoneyInput } from '@/components/ui/money-input'
import { BoxValue } from '@/components/ui/box-value'

function CheckoutOrder(): ReactNode {
  return (
    <div>
      <BoxValue />
      <MoneyInput />
    </div>
  )
}

export { CheckoutOrder }
