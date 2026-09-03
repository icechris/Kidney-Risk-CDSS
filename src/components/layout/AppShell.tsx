import type { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'

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
  return (
    <div className="flex min-h-screen w-full items-start bg-slate-50">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col self-stretch">
        <Topbar title={title} subtitle={subtitle} actions={actions} />
        <main className="flex w-full flex-1 flex-col gap-6 p-8">{children}</main>
      </div>
    </div>
  )
}
