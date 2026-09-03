import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle, AlertTriangle, Check, Info, Settings as SettingsIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { clinicalAlerts as initialAlerts } from '@/data/mockData'
import type { RiskLevel } from '@/types'
import { cn } from '@/lib/utils'

type SeverityFilter = 'all' | RiskLevel

const severityMeta: Record<
  RiskLevel,
  {
    label: string
    dot: string
    panelBg: string
    panelFg: string
    icon: LucideIcon
    headline: string
    description: string
  }
> = {
  high: {
    label: 'Critical',
    dot: 'bg-red-600',
    panelBg: 'bg-red-50',
    panelFg: 'text-red-600',
    icon: AlertTriangle,
    headline: 'Critical Flags',
    description: 'Require immediate clinical intervention',
  },
  moderate: {
    label: 'Warning',
    dot: 'bg-amber-500',
    panelBg: 'bg-amber-50',
    panelFg: 'text-amber-600',
    icon: AlertCircle,
    headline: 'Warnings',
    description: 'Declining renal biometrics noted',
  },
  low: {
    label: 'Info',
    dot: 'bg-blue-500',
    panelBg: 'bg-blue-50',
    panelFg: 'text-blue-600',
    icon: Info,
    headline: 'System Info',
    description: 'Medication follow-ups and schedule updates',
  },
}

const severityOrder: RiskLevel[] = ['high', 'moderate', 'low']

export default function ClinicalAlerts() {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState(initialAlerts)
  const [filter, setFilter] = useState<SeverityFilter>('all')

  function resolveAlert(id: string) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)))
  }

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, resolved: true })))
  }

  const counts = {
    all: alerts.length,
    high: alerts.filter((a) => a.severity === 'high').length,
    moderate: alerts.filter((a) => a.severity === 'moderate').length,
    low: alerts.filter((a) => a.severity === 'low').length,
  }

  const visible = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter)

  return (
    <AppShell
      title="Clinical Risk Alerts Console"
      subtitle="CDSS Real-Time Bayesian Inference Risk Triggers & Critical Flag Notifications"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={markAllRead}>
            <Check className="size-3.5" />
            <span className="hidden sm:inline">Mark All Read</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/settings')}>
            <SettingsIcon className="size-3.5" />
            <span className="hidden sm:inline">Configure Alerts</span>
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'flex items-center gap-2 rounded-md border px-4 py-2 transition-colors',
                filter === 'all'
                  ? 'border-navy-900 bg-navy-900 text-white'
                  : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
              )}
            >
              <span className="text-[13px] font-semibold">All Alerts</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                  filter === 'all' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-900',
                )}
              >
                {counts.all}
              </span>
            </button>
            {severityOrder.map((sev) => (
              <button
                key={sev}
                onClick={() => setFilter(sev)}
                className={cn(
                  'flex items-center gap-2 rounded-md border bg-white px-4 py-2 transition-colors hover:bg-slate-50',
                  filter === sev ? 'border-blue-600' : 'border-slate-200',
                )}
              >
                <span className="text-[13px] font-semibold text-slate-900">
                  {severityMeta[sev].label}
                </span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white',
                    severityMeta[sev].dot,
                  )}
                >
                  {counts[sev]}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {visible.length === 0 && (
              <Card className="p-6 text-center text-sm text-slate-400">
                No alerts in this category.
              </Card>
            )}
            {visible.map((alert) => (
              <Card key={alert.id} className="flex gap-4 p-4">
                <span
                  className={cn('w-1.5 shrink-0 self-stretch rounded', severityMeta[alert.severity].dot)}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                      <p className="text-sm font-bold text-blue-600">{alert.patientName}</p>
                      <p className="text-[11px] text-slate-400">MRN: {alert.mrn}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <p className="text-[11px] text-slate-400">{alert.timeAgo}</p>
                      <span
                        className={cn(
                          'rounded px-2 py-0.5 text-[10px] font-bold',
                          alert.resolved ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-600',
                        )}
                      >
                        {alert.resolved ? 'Resolved' : 'New'}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-900">{alert.message}</p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Button size="sm" disabled={alert.resolved} onClick={() => resolveAlert(alert.id)}>
                      {alert.resolved ? 'Acknowledged' : 'Acknowledge'}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => navigate('/patients')}>
                      View Profile
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => resolveAlert(alert.id)}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="flex w-full flex-col gap-5 p-6 lg:w-[340px] lg:shrink-0">
          <p className="text-[15px] font-bold text-slate-900">Active Alert Severity Metrics</p>
          <div className="flex flex-col gap-4">
            {severityOrder.map((sev) => {
              const meta = severityMeta[sev]
              const Icon = meta.icon
              return (
                <div key={sev} className={cn('flex items-center gap-3 rounded-md p-3', meta.panelBg)}>
                  <Icon className={cn('size-6 shrink-0', meta.panelFg)} />
                  <div className={meta.panelFg}>
                    <p className="text-base font-bold">
                      {counts[sev]} {meta.headline}
                    </p>
                    <p className="text-[11px]">{meta.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="h-px w-full bg-slate-200" />
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-bold text-slate-900">Inference Threshold Settings</p>
            <p className="text-xs leading-relaxed text-slate-600">
              Renal alerts are triggered automatically based on posterior probabilities from daily
              electronic health record lab dumps. eGFR decline warning is currently set at -10% slope
              over 6 months.
            </p>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
