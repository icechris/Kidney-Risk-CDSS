import { AppShell } from '@/components/layout/AppShell'

export function StubPage({ title }: { title: string }) {
  return (
    <AppShell title={title}>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 text-slate-400">
        {title} — coming soon
      </div>
    </AppShell>
  )
}
