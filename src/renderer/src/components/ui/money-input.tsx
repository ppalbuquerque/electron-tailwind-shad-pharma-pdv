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
  defaultValue?: number | string
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ onValueChange, defaultValue }, ref) => {
    return (
      <CurrencyInput
        customInput={Input}
        className="border-slate-200"
        prefix="R$ "
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        ref={ref}
      />
    )
  }
)

MoneyInput.displayName = 'MoneyInput'

export { MoneyInput }
