import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon: Icon,
  valueClassName,
  footer,
  dotClassName,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  valueClassName?: string
  footer: string
  dotClassName?: string
}) {
  return (
    <Card className="flex min-w-0 flex-1 flex-col gap-3 p-5 shadow-[0_2px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-slate-600">{label}</p>
        <Icon className="size-4 text-slate-400" />
      </div>
      <p className={cn('text-[32px] font-bold text-slate-900', valueClassName)}>{value}</p>
      <div className="flex items-center gap-1.5">
        <span className={cn('size-1.5 rounded-full', dotClassName ?? 'bg-emerald-500')} />
        <p className="text-xs font-medium text-slate-600">{footer}</p>
      </div>
    </Card>
  )
}
