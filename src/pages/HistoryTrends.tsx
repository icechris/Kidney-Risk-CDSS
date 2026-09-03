import { AlertCircle, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { assessments, patients, trend6Month } from '@/data/mockData'
import type { RiskLevel } from '@/types'

const ranges = ['3M', '6M', 'All'] as const
type Range = (typeof ranges)[number]

const riskLevels: RiskLevel[] = ['low', 'moderate', 'high']
const riskColor: Record<RiskLevel, string> = {
  low: '#16a34a',
  moderate: '#f59e0b',
  high: '#dc2626',
}

export default function HistoryTrends() {
  const [range, setRange] = useState<Range>('6M')

  const trendSlice = useMemo(() => {
    if (range === '3M') return trend6Month.slice(-3)
    return trend6Month
  }, [range])

  const riskCounts = useMemo(() => {
    return riskLevels.map((level) => ({
      level,
      count: patients.filter((p) => p.riskLevel === level).length,
    }))
  }, [])

  const avgEgfrByRisk = useMemo(() => {
    return riskLevels.map((level) => {
      const group = patients.filter((p) => p.riskLevel === level)
      const avg = group.length
        ? Math.round(group.reduce((sum, p) => sum + p.latestEgfr, 0) / group.length)
        : 0
      return { level, avgEgfr: avg }
    })
  }, [])

  const topRiskAssessments = useMemo(
    () => [...assessments].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
    [],
  )

  const first = trend6Month[0]
  const last = trend6Month[trend6Month.length - 1]
  const highDelta = last.high - first.high
  const highRiskCount = riskCounts.find((r) => r.level === 'high')?.count ?? 0
  const highRiskPct = Math.round((highRiskCount / patients.length) * 100)

  return (
    <AppShell
      title="History & Trends"
      subtitle="Longitudinal Risk Analysis Across the Monitored Population"
    >
      <div className="flex w-full items-center gap-2 text-[13px]">
        <Link to="/dashboard" className="font-medium text-blue-600 hover:underline">
          Dashboard
        </Link>
        <ChevronRight className="size-3 text-slate-400" />
        <p className="font-medium text-slate-600">History &amp; Trends</p>
      </div>

      <div className="flex w-full items-center justify-between pb-2">
        <p className="text-[15px] font-bold text-slate-900">Population Risk Trend</p>
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-4 py-1.5 text-[13px] ${
                range === r
                  ? 'bg-white font-bold text-blue-600 shadow-sm'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <Card className="flex w-full flex-col gap-5 p-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-slate-900">6-Month Risk Category Trend</p>
            {highDelta > 0 && (
              <span className="flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">
                <TrendingUp className="size-3" /> High-risk share rising
              </span>
            )}
            {highDelta <= 0 && (
              <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                <TrendingDown className="size-3" /> High-risk share stable
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {(['Low', 'Moderate', 'High'] as const).map((label) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="h-0.5 w-3"
                  style={{ backgroundColor: riskColor[label.toLowerCase() as RiskLevel] }}
                />
                <p className="text-[11px] text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendSlice} margin={{ left: 0, right: 12, top: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={28}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip />
              <Line type="monotone" dataKey="low" stroke={riskColor.low} strokeWidth={2} dot={false} />
              <Line
                type="monotone"
                dataKey="moderate"
                stroke={riskColor.moderate}
                strokeWidth={2}
                dot={false}
              />
              <Line type="monotone" dataKey="high" stroke={riskColor.high} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="flex w-full items-start gap-5">
        <Card className="flex flex-1 flex-col gap-5 p-6">
          <p className="text-base font-bold text-slate-900">Average eGFR by Risk Category</p>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgEgfrByRisk} margin={{ left: 0, right: 12, top: 4, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="level"
                  tickFormatter={(v: RiskLevel) => v[0].toUpperCase() + v.slice(1)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={28}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip />
                <Bar dataKey="avgEgfr" radius={[4, 4, 0, 0]}>
                  {avgEgfrByRisk.map((d) => (
                    <Cell key={d.level} fill={riskColor[d.level]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex w-[380px] shrink-0 flex-col gap-5 p-6">
          <p className="text-base font-bold text-slate-900">Risk Category Distribution</p>
          <div className="flex w-full flex-col gap-4">
            {riskCounts.map((r) => {
              const pct = Math.round((r.count / patients.length) * 100)
              return (
                <div key={r.level} className="flex w-full flex-col gap-1.5">
                  <div className="flex w-full items-center justify-between text-[13px]">
                    <p className="font-semibold capitalize text-slate-900">{r.level} Risk</p>
                    <p className="text-slate-600">
                      {r.count} patients · {pct}%
                    </p>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: riskColor[r.level] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card className="flex w-full flex-col p-0">
        <div className="flex w-full items-center justify-between border-b border-slate-200 p-6 pb-4">
          <p className="text-base font-bold text-slate-900">Top High-Risk Patients</p>
          <Link to="/patients" className="text-[13px] font-semibold text-blue-600 hover:underline">
            View All Patients
          </Link>
        </div>
        <div className="flex w-full border-b border-slate-200 bg-slate-50 px-6 py-2.5 text-xs font-semibold text-slate-600">
          <p className="flex-1">Patient</p>
          <p className="w-[120px]">MRN</p>
          <p className="w-[130px]">Last Assessed</p>
          <p className="w-[130px]">Clinician</p>
          <p className="w-[120px]">Risk</p>
          <p className="w-[100px]">Score</p>
        </div>
        {topRiskAssessments.map((a) => (
          <Link
            key={a.id}
            to={`/patients/${a.patientId}`}
            className="flex w-full items-center border-b border-slate-200 px-6 py-3 last:border-b-0 hover:bg-slate-50"
          >
            <p className="flex-1 text-[13px] font-semibold text-slate-900">{a.patientName}</p>
            <p className="w-[120px] text-[13px] text-slate-600">{a.mrn}</p>
            <p className="w-[130px] text-[13px] text-slate-600">{a.date}</p>
            <p className="w-[130px] text-[13px] text-slate-600">{a.clinician}</p>
            <div className="w-[120px]">
              <RiskBadge level={a.riskLevel} />
            </div>
            <p className="w-[100px] text-[13px] font-bold" style={{ color: riskColor[a.riskLevel] }}>
              {a.riskScore}%
            </p>
          </Link>
        ))}
      </Card>

      <Card className="flex w-full flex-col gap-3 border-blue-600 bg-blue-50 p-5">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-blue-600" />
          <p className="text-sm font-bold text-blue-600">Longitudinal Population Summary</p>
        </div>
        <p className="text-[13px] leading-relaxed text-slate-900">
          {highRiskCount} of {patients.length} monitored patients ({highRiskPct}%) currently carry a
          High Risk Bayesian classification. Over the last {trend6Month.length} months, the high-risk
          share of the population has {highDelta > 0 ? 'increased' : highDelta < 0 ? 'decreased' : 'held steady'}
          {' '}from {first.high}% to {last.high}%. Recommend prioritizing nephrology follow-up for the
          patients listed above.
        </p>
      </Card>
    </AppShell>
  )
}
