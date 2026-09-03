import { MoreHorizontal } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { mobileMoreItems, mobilePrimaryTabs } from '@/components/layout/nav-items'

export function MobileTabBar({ onMoreClick }: { onMoreClick: () => void }) {
  const location = useLocation()
  const isMoreActive = mobileMoreItems.some((item) => location.pathname.startsWith(item.to))

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-slate-200 bg-white px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 lg:hidden">
      {mobilePrimaryTabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              'relative flex w-16 flex-col items-center gap-1 rounded-md py-1 text-[10px] font-medium text-slate-400',
              isActive && 'text-blue-600 font-semibold',
            )
          }
        >
          {({ isActive }) => (
            <>
              <tab.icon className={cn('size-5', isActive && 'text-blue-600')} />
              {tab.shortLabel}
              {!!tab.badge && (
                <span className="absolute right-2 top-0 flex min-w-3.5 items-center justify-center rounded-full bg-red-600 px-1 py-0.5 text-[8px] font-bold text-white">
                  {tab.badge}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
      <button
        onClick={onMoreClick}
        className={cn(
          'flex w-16 flex-col items-center gap-1 rounded-md py-1 text-[10px] font-medium text-slate-400',
          isMoreActive && 'text-blue-600 font-semibold',
        )}
      >
        <MoreHorizontal className={cn('size-5', isMoreActive && 'text-blue-600')} />
        More
      </button>
    </nav>
  )
}
