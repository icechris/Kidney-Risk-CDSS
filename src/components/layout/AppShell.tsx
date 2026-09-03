import { useState } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { MobileNavDrawer } from '@/components/layout/MobileNavDrawer'
import { MobileTabBar } from '@/components/layout/MobileTabBar'

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full items-start bg-slate-50">
      <Sidebar />
      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="relative flex min-w-0 flex-1 flex-col self-stretch">
        <Topbar title={title} subtitle={subtitle} actions={actions} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex w-full flex-1 flex-col gap-5 p-4 pb-20 sm:p-6 lg:gap-6 lg:p-8 lg:pb-8">
          {children}
        </main>
      </div>
      <MobileTabBar onMoreClick={() => setDrawerOpen(true)} />
    </div>
  )
}
