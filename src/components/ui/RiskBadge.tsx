import type { RiskLevel } from '@/types'
import { cn } from '@/lib/utils'

const styles: Record<RiskLevel, string> = {
  low: 'bg-risk-low-bg text-risk-low-fg',
  moderate: 'bg-risk-moderate-bg text-risk-moderate-fg',
  high: 'bg-risk-high-bg text-risk-high-fg',
}

const labels: Record<RiskLevel, string> = {
  low: 'Low Risk',
  moderate: 'Moderate Risk',
  high: 'High Risk',
}

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap',
        styles[level],
        className,
      )}
    >
      {labels[level]}
    </span>
  )
}
