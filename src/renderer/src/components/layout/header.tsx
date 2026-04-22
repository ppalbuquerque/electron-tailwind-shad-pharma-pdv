import { ReactNode } from 'react'
import { CheckoutStatus } from './checkoutStatus'

type HeaderProps = {
  routeName: string
}

function Header({ routeName }: HeaderProps): ReactNode {
  return (
    <header className="flex h-[85px] shrink-0 gap-2 border-b border-slate-400 bg-white text-2xl">
      <div className="ml-8 mr-8 flex items-center justify-between w-full">
        <p className="text-black font-semibold text-slate-800">{routeName}</p>
        <CheckoutStatus />
      </div>
    </header>
  )
}

export { Header }
