import { Input } from '@/components/ui/input'
import { forwardRef } from 'react'

import CurrencyInput, { CurrencyInputOnChangeValues } from 'react-currency-input-field'

interface MoneyInputProps {
  onValueChange?:
    | ((
        value: string | undefined,
        name?: string | undefined,
        values?: CurrencyInputOnChangeValues | undefined
      ) => void)
    | undefined
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(({ onValueChange }, ref) => {
  return (
    <CurrencyInput
      customInput={Input}
      className="border-slate-200"
      prefix="R$ "
      onValueChange={onValueChange}
      ref={ref}
    />
  )
})

MoneyInput.displayName = 'MoneyInput'

export { MoneyInput }
