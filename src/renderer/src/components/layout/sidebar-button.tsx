import { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

type IconProps = React.ComponentType<React.SVGProps<SVGSVGElement>>

type SidebarButtonProps = {
  title: string
  hotkey: string
  icon: IconProps
}

const sidebarButtonVariants = cva(
  'mb-[8px] border-l-4 rounded-lg border-black group-focus:bg-emerald-100',
  {
    variants: {
      variant: {
        active: 'bg-emerald-500 text-white font-bold',
        default: 'bg-gray-100'
      }
    }
  }
)

function SidebarButton({
  title,
  hotkey,
  variant = 'default',
  icon: Icon
}: SidebarButtonProps & VariantProps<typeof sidebarButtonVariants>): ReactNode {
  return (
    <div className={cn(sidebarButtonVariants({ variant }))}>
      <div className="flex items-center p-2">
        <div className="size-[32px] bg-slate-200 rounded-sm flex items-center justify-center mr-[12px]">
          <Icon color="#64748B" />
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <span className="text-xs">{hotkey}</span>
        </div>
      </div>
    </div>
  )
}

export { SidebarButton }
