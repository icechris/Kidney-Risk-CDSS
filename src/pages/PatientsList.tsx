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
      <Card className="flex w-full items-center gap-4 p-4">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
          <Search className="size-3.5 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name or MRN..."
            className="w-full text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        <div className="relative w-[200px] shrink-0">
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
        <div className="flex w-full border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-600">
          <p className="w-[120px]">MRN</p>
          <p className="flex-1">Patient Name</p>
          <p className="w-[70px]">Age</p>
          <p className="w-[90px]">Gender</p>
          <p className="w-[130px]">Last Assessed</p>
          <p className="w-[140px]">Risk Category</p>
          <p className="w-[90px]">Risk Score</p>
          <p className="w-[90px] text-right">Actions</p>
        </div>

        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate(`/patients/${p.id}`)}
            className="flex w-full items-center border-b border-slate-200 px-6 py-3 text-left last:border-b-0 hover:bg-slate-50"
          >
            <p className="w-[120px] text-[13px] text-slate-600">{p.mrn}</p>
            <p className="flex-1 truncate pr-2 text-[13px] font-semibold text-slate-900">
              {p.name}
            </p>
            <p className="w-[70px] text-[13px] text-slate-600">{p.age}</p>
            <p className="w-[90px] text-[13px] text-slate-600">{p.sex}</p>
            <p className="w-[130px] text-[13px] text-slate-600">{p.lastCheckedAt}</p>
            <div className="w-[140px]">
              <RiskBadge level={p.riskLevel} />
            </div>
            <p className={`w-[90px] text-[13px] font-bold ${riskScoreColor[p.riskLevel]}`}>
              {p.riskScore}%
            </p>
            <div className="flex w-[90px] items-center justify-end gap-2">
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

        {filtered.length === 0 && (
          <p className="w-full px-6 py-8 text-center text-[13px] text-slate-400">
            No patients match your search.
          </p>
        )}

        <div className="flex w-full items-center justify-between p-4">
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
