import { ChevronDown, Eye, Pencil, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { patients } from '@/data/mockData'
import type { RiskLevel } from '@/types'

const riskScoreColor: Record<RiskLevel, string> = {
  low: 'text-risk-low-fg',
  moderate: 'text-amber-500',
  high: 'text-red-600',
}

export default function PatientsList() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return patients.filter((p) => {
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q)
      const matchesRisk = riskFilter === 'all' || p.riskLevel === riskFilter
      return matchesQuery && matchesRisk
    })
  }, [query, riskFilter])

  return (
    <AppShell
      title="Patient Registry"
      subtitle={`Total Patients Monitored: ${patients.length}`}
    >
      <Card className="flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
          <Search className="size-3.5 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name or MRN..."
            className="w-full text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <div className="relative w-full shrink-0 sm:w-[200px]">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
            className="w-full appearance-none rounded-md border border-slate-200 px-3 py-2 text-[13px] text-slate-600 focus:outline-none"
          >
            <option value="all">Risk: All Levels</option>
            <option value="high">Risk: High</option>
            <option value="moderate">Risk: Moderate</option>
            <option value="low">Risk: Low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-slate-400" />
        </div>
      </Card>

      <Card className="flex w-full flex-col">
        <div className="lg:overflow-x-auto">
          <div className="hidden w-full border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-600 lg:flex lg:min-w-[900px]">
            <p className="shrink-0 lg:w-[120px]">MRN</p>
            <p className="min-w-[140px] flex-1">Patient Name</p>
            <p className="shrink-0 lg:w-[70px]">Age</p>
            <p className="shrink-0 lg:w-[90px]">Gender</p>
            <p className="shrink-0 lg:w-[130px]">Last Assessed</p>
            <p className="shrink-0 lg:w-[140px]">Risk Category</p>
            <p className="shrink-0 lg:w-[90px]">Risk Score</p>
            <p className="shrink-0 text-right lg:w-[90px]">Actions</p>
          </div>

          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate(`/patients/${p.id}`)}
              className="flex w-full flex-col gap-2 border-b border-slate-200 p-3 text-left last:border-b-0 hover:bg-slate-50 lg:min-w-[900px] lg:flex-row lg:items-center lg:gap-0 lg:px-6 lg:py-3"
            >
              <div className="flex w-full items-center justify-between gap-2 lg:hidden">
                <p className="truncate pr-2 text-[13px] font-semibold text-slate-900">{p.name}</p>
                <RiskBadge level={p.riskLevel} />
              </div>
              <div className="flex w-full items-center justify-between gap-2 lg:hidden">
                <p className="text-xs text-slate-500">
                  {p.mrn} · {p.age} {p.sex} · {p.lastCheckedAt}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`text-[13px] font-bold ${riskScoreColor[p.riskLevel]}`}>
                    {p.riskScore}%
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/patients/${p.id}`)
                    }}
                    className="rounded p-1.5 hover:bg-slate-200"
                  >
                    <Eye className="size-3.5 text-slate-500" />
                  </span>
                  <span
                    onClick={(e) => e.stopPropagation()}
                    className="rounded bg-slate-50 p-1.5 hover:bg-slate-200"
                  >
                    <Pencil className="size-3.5 text-slate-500" />
                  </span>
                </div>
              </div>

              <p className="hidden text-[13px] text-slate-600 lg:block lg:w-[120px] lg:shrink-0">
                {p.mrn}
              </p>
              <p className="hidden min-w-[140px] flex-1 truncate pr-2 text-[13px] font-semibold text-slate-900 lg:block">
                {p.name}
              </p>
              <p className="hidden text-[13px] text-slate-600 lg:block lg:w-[70px] lg:shrink-0">
                {p.age}
              </p>
              <p className="hidden text-[13px] text-slate-600 lg:block lg:w-[90px] lg:shrink-0">
                {p.sex}
              </p>
              <p className="hidden text-[13px] text-slate-600 lg:block lg:w-[130px] lg:shrink-0">
                {p.lastCheckedAt}
              </p>
              <div className="hidden lg:block lg:w-[140px] lg:shrink-0">
                <RiskBadge level={p.riskLevel} />
              </div>
              <p
                className={`hidden text-[13px] font-bold lg:block lg:w-[90px] lg:shrink-0 ${riskScoreColor[p.riskLevel]}`}
              >
                {p.riskScore}%
              </p>
              <div className="hidden lg:flex lg:w-[90px] lg:shrink-0 lg:items-center lg:justify-end lg:gap-2">
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/patients/${p.id}`)
                  }}
                  className="rounded p-1.5 hover:bg-slate-200"
                >
                  <Eye className="size-3.5 text-slate-500" />
                </span>
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="rounded bg-slate-50 p-1.5 hover:bg-slate-200"
                >
                  <Pencil className="size-3.5 text-slate-500" />
                </span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="w-full px-6 py-8 text-center text-[13px] text-slate-400">
            No patients match your search.
          </p>
        )}

        <div className="flex w-full flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-slate-600">
            Showing {filtered.length} of {patients.length} patients
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled
              className="rounded border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-400"
            >
              Previous
            </button>
            <span className="rounded bg-blue-600 px-2.5 py-1.5 text-[13px] font-bold text-white">
              1
            </span>
            <button
              disabled
              className="rounded border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-400"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </AppShell>
  )
}
