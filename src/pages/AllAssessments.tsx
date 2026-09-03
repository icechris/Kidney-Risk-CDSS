import { ChevronDown, Download, ExternalLink, MoreVertical, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { assessments as initialAssessments } from '@/data/mockData'
import type { Assessment, RiskLevel } from '@/types'
import { cn } from '@/lib/utils'

const statusStyles: Record<Assessment['status'], string> = {
  Completed: 'bg-emerald-50 text-emerald-600',
  'Pending Review': 'bg-blue-50 text-blue-600',
  Draft: 'bg-slate-100 text-slate-600',
}

const riskFilters: { label: string; value: RiskLevel | 'all' }[] = [
  { label: 'All Risk Levels', value: 'all' },
  { label: 'Low Risk', value: 'low' },
  { label: 'Moderate Risk', value: 'moderate' },
  { label: 'High Risk', value: 'high' },
]

const statusFilters: { label: string; value: Assessment['status'] | 'all' }[] = [
  { label: 'Status: All', value: 'all' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending Review', value: 'Pending Review' },
  { label: 'Draft', value: 'Draft' },
]

function assessmentCode(index: number) {
  return `ASX-${401 - index}`
}

export default function AllAssessments() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<Assessment[]>(initialAssessments)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | string>('all')
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<Assessment['status'] | 'all'>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const codeById = useMemo(() => {
    const map = new Map<string, string>()
    initialAssessments.forEach((a, i) => map.set(a.id, assessmentCode(i)))
    return map
  }, [])

  const uniqueDates = useMemo(
    () => Array.from(new Set(initialAssessments.map((a) => a.date))),
    [],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return rows.filter((a) => {
      const code = codeById.get(a.id) ?? ''
      const matchesSearch =
        !term || a.patientName.toLowerCase().includes(term) || code.toLowerCase().includes(term)
      const matchesDate = dateFilter === 'all' || a.date === dateFilter
      const matchesRisk = riskFilter === 'all' || a.riskLevel === riskFilter
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter
      return matchesSearch && matchesDate && matchesRisk && matchesStatus
    })
  }, [rows, search, dateFilter, riskFilter, statusFilter, codeById])

  const allFilteredSelected = filtered.length > 0 && filtered.every((a) => selected.has(a.id))

  function toggleAll() {
    setSelected(allFilteredSelected ? new Set() : new Set(filtered.map((a) => a.id)))
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function deleteDrafts() {
    setRows((prev) => prev.filter((a) => !(selected.has(a.id) && a.status === 'Draft')))
    setSelected(new Set())
  }

  return (
    <AppShell
      title="Assessments Repository"
      subtitle="Operational CDSS History · All Saved & Completed Bayesian Risk Runs"
    >
      <Card className="flex w-full flex-col gap-4 p-5">
        <div className="flex w-full items-start gap-4">
          <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
            <Search className="size-3.5 shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient name or Assessment ID..."
              className="w-full text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
          <div className="relative w-[200px] shrink-0">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full appearance-none rounded-md border border-slate-200 px-3 py-2 text-[13px] text-slate-600 focus:outline-none"
            >
              <option value="all">All Dates</option>
              {uniqueDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="relative w-[180px] shrink-0">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
              className="w-full appearance-none rounded-md border border-slate-200 px-3 py-2 text-[13px] text-slate-600 focus:outline-none"
            >
              {riskFilters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="relative w-[160px] shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Assessment['status'] | 'all')}
              className="w-full appearance-none rounded-md border border-slate-200 px-3 py-2 text-[13px] text-slate-600 focus:outline-none"
            >
              {statusFilters.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="h-px w-full bg-slate-200" />

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            {selected.size > 0 && (
              <>
                <span className="rounded bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600">
                  {selected.size} SELECTED
                </span>
                <span className="h-4 w-px bg-slate-200" />
                <button
                  className="flex items-center gap-2 text-[13px] font-semibold text-blue-600 hover:underline"
                  onClick={() => setSelected(new Set())}
                >
                  <Download className="size-3.5" />
                  Export selected profiles
                </button>
                <button
                  onClick={deleteDrafts}
                  className="flex items-center gap-2 border-l border-slate-200 pl-4 text-[13px] font-semibold text-red-600 hover:underline"
                >
                  <Trash2 className="size-3.5" />
                  Delete drafts
                </button>
              </>
            )}
          </div>
          <p className="text-[13px] text-slate-600">
            Showing 1-{filtered.length} of {rows.length} Assessments
          </p>
        </div>
      </Card>

      <Card className="flex w-full flex-col overflow-hidden">
        <div className="flex w-full items-center border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-semibold text-slate-600">
          <div className="flex w-6 items-center">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={toggleAll}
              className="size-3.5 rounded border-slate-300 accent-blue-600"
            />
          </div>
          <p className="w-[110px]">ID Code</p>
          <p className="flex-1">Patient Name</p>
          <p className="w-[130px]">Date Checked</p>
          <p className="w-[120px]">Risk Level</p>
          <p className="w-[100px]">Risk Score</p>
          <p className="w-[120px]">Status</p>
          <p className="w-[130px]">Clinician</p>
          <p className="w-[80px] text-right">Actions</p>
        </div>

        {filtered.length === 0 && (
          <p className="w-full px-6 py-10 text-center text-sm text-slate-400">
            No assessments match the current filters.
          </p>
        )}

        {filtered.map((a) => (
          <div
            key={a.id}
            className="flex w-full items-center border-b border-slate-100 px-6 py-4 last:border-b-0 hover:bg-slate-50"
          >
            <div className="flex w-6 items-center">
              <input
                type="checkbox"
                checked={selected.has(a.id)}
                onChange={() => toggleOne(a.id)}
                className="size-3.5 rounded border-slate-300 accent-blue-600"
              />
            </div>
            <button
              onClick={() => navigate(`/assessments/${a.id}/result`)}
              className="w-[110px] text-left text-[13px] font-bold text-blue-600 hover:underline"
            >
              {codeById.get(a.id)}
            </button>
            <button
              onClick={() => navigate(`/patients/${a.patientId}`)}
              className="flex-1 text-left text-[13px] font-semibold text-slate-900 hover:underline"
            >
              {a.patientName}
            </button>
            <p className="w-[130px] text-[13px] text-slate-600">{a.date}</p>
            <div className="w-[120px]">
              <RiskBadge level={a.riskLevel} />
            </div>
            <p className="w-[100px] text-[13px] font-bold text-slate-900">{a.riskScore}%</p>
            <div className="w-[120px]">
              <span
                className={cn(
                  'inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold whitespace-nowrap',
                  statusStyles[a.status],
                )}
              >
                {a.status}
              </span>
            </div>
            <p className="w-[130px] text-[13px] text-slate-600">{a.clinician}</p>
            <div className="flex w-[80px] items-center justify-end gap-3">
              <button
                onClick={() => navigate(`/assessments/${a.id}/result`)}
                aria-label="Open assessment result"
                className="text-slate-400 hover:text-blue-600"
              >
                <ExternalLink className="size-4" />
              </button>
              <button aria-label="More actions" className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </Card>
    </AppShell>
  )
}
