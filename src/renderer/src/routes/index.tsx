import { createFileRoute, Link } from '@tanstack/react-router'
import { ReactNode } from 'react'
import { Clock } from 'lucide-react'

import { useHomeViewModel, HomeShortcut } from '@/effects/home/useHome.viewmodel'

export const Route = createFileRoute('/')({
  component: Index
})

function ShortcutCard({ shortcut }: { shortcut: HomeShortcut }): ReactNode {
  const { title, icon: Icon, url, hotkey, disabled } = shortcut

  const cardContent = (
    <div
      className={[
        'group relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 p-8',
        'transition-all duration-200 select-none',
        disabled
          ? 'border-slate-200 bg-slate-50 opacity-40 cursor-not-allowed'
          : 'border-slate-200 bg-white cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md active:scale-[0.98]'
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-3 right-3 rounded px-1.5 py-0.5 font-mono text-xs font-semibold',
          disabled ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-500'
        ].join(' ')}
      >
        {hotkey}
      </span>

      <div
        className={[
          'flex size-16 items-center justify-center rounded-xl transition-colors duration-200',
          disabled
            ? 'bg-slate-100 text-slate-400'
            : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700'
        ].join(' ')}
      >
        <Icon size={32} strokeWidth={1.5} />
      </div>

      <span
        className={[
          'text-center text-sm font-semibold leading-tight',
          disabled ? 'text-slate-400' : 'text-slate-700 group-hover:text-emerald-800'
        ].join(' ')}
      >
        {title}
      </span>
    </div>
  )

  if (disabled) {
    return cardContent
  }

  return (
    <Link to={url} className="block">
      {cardContent}
    </Link>
  )
}

function Index(): ReactNode {
  const { currentDateTime, shortcuts } = useHomeViewModel()

  const formattedDate = currentDateTime.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  const formattedTime = currentDateTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <div className="p-6">
      <div className="bg-white rounded-sm p-12 border-slate-300 border text-black">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Atalhos</h1>
            <p className="text-sm text-slate-500 mt-1">Acesse rapidamente os módulos do sistema</p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
            <Clock size={16} className="text-slate-400" />
            <div className="text-right">
              <p className="font-mono text-sm font-semibold text-slate-700 tabular-nums">
                {formattedTime}
              </p>
              <p className="font-mono text-xs text-slate-400 tabular-nums">{formattedDate}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {shortcuts.map((shortcut) => (
            <ShortcutCard key={shortcut.url} shortcut={shortcut} />
          ))}
        </div>
      </div>
    </div>
  )
}
