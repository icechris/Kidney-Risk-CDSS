import { Bell, HelpCircle, Menu, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { clinicalAlerts } from '@/data/mockData'

export function Topbar({
  title,
  subtitle,
  actions,
  onMenuClick,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  onMenuClick?: () => void
}) {
  const unresolved = clinicalAlerts.filter((a) => !a.resolved).length

  return (
    <header className="flex w-full shrink-0 flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-8 lg:py-4">
      <div className="flex items-center gap-3 lg:contents">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex size-9 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-50 lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <div className="flex min-w-0 flex-col gap-0.5 lg:gap-1">
          <p className="truncate text-lg font-bold text-slate-900 lg:text-xl">{title}</p>
          {subtitle && <p className="hidden text-xs text-slate-600 sm:block">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        {actions}
        <div className="hidden w-60 items-center gap-2 rounded-md border border-slate-200 px-3 py-2 lg:flex">
          <Search className="size-3.5 text-slate-400" />
          <input
            placeholder="Search patients, MRN..."
            className="w-full text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <button
          className="flex items-center justify-center rounded-md p-2 hover:bg-slate-50 lg:hidden"
          aria-label="Search"
        >
          <Search className="size-[18px] text-slate-500" />
        </button>
        <button className="relative flex items-center justify-center rounded-md p-2 hover:bg-slate-50" aria-label="Notifications">
          <Bell className="size-[18px] text-slate-500" />
          {unresolved > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
              {unresolved}
            </span>
          )}
        </button>
        <button className="hidden items-center justify-center rounded-md bg-slate-50 p-2 hover:bg-slate-100 lg:flex" aria-label="Help">
          <HelpCircle className="size-[18px] text-slate-500" />
        </button>
      </div>
    </header>
  )
}
