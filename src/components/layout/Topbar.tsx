import { Bell, HelpCircle, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { clinicalAlerts } from '@/data/mockData'

export function Topbar({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  const unresolved = clinicalAlerts.filter((a) => !a.resolved).length

  return (
    <header className="flex w-full shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold text-slate-900">{title}</p>
        {subtitle && <p className="text-xs text-slate-600">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        {actions}
        <div className="flex w-60 items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
          <Search className="size-3.5 text-slate-400" />
          <input
            placeholder="Search patients, MRN..."
            className="w-full text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <button className="relative flex items-center justify-center rounded-md p-2 hover:bg-slate-50" aria-label="Notifications">
          <Bell className="size-[18px] text-slate-500" />
          {unresolved > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
              {unresolved}
            </span>
          )}
        </button>
        <button className="flex items-center justify-center rounded-md bg-slate-50 p-2 hover:bg-slate-100" aria-label="Help">
          <HelpCircle className="size-[18px] text-slate-500" />
        </button>
      </div>
    </header>
  )
}
