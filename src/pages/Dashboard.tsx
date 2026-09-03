import { Plus, TrendingUp } from 'lucide-react'
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { StatCard } from '@/components/ui/StatCard'
import { assessments, clinicalAlerts, riskDistribution, trend6Month } from '@/data/mockData'

const donutData = [
  { name: 'Low', value: riskDistribution.low, color: '#16a34a' },
  { name: 'Moderate', value: riskDistribution.moderate, color: '#f59e0b' },
  { name: 'High', value: riskDistribution.high, color: '#dc2626' },
]

const severityDot: Record<string, string> = {
  high: 'bg-red-600',
  moderate: 'bg-amber-500',
  low: 'bg-emerald-600',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const recent = assessments.slice(0, 5)
  const unresolvedAlerts = clinicalAlerts.filter((a) => !a.resolved)

  return (
    <AppShell title="Clinical Risk Dashboard" subtitle="System Status: Operational · October 24, 2024">
      <div className="grid grid-cols-2 gap-4 lg:flex lg:items-start lg:gap-5">
        <StatCard label="Total Monitored" value="1,247" icon={TrendingUp} footer="+32 this week" />
        <StatCard label="Assessments Run" value="342" icon={TrendingUp} footer="+8 today" />
        <StatCard
          label="High Risk Flags"
          value="89"
          icon={TrendingUp}
          valueClassName="text-red-600"
          dotClassName="bg-red-600"
          footer="Requires Attention"
        />
        <StatCard
          label="Active Alerts"
          value={unresolvedAlerts.length}
          icon={TrendingUp}
          valueClassName="text-amber-500"
          dotClassName="bg-amber-500"
          footer={`${unresolvedAlerts.length} Unresolved`}
        />
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <Card className="flex w-full flex-col gap-5 p-6 lg:w-[420px] lg:shrink-0">
          <p className="text-[15px] font-bold text-slate-900">Bayesian Risk Distribution</p>
          <div className="relative h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                >
                  {donutData.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <p className="text-2xl font-bold text-slate-900">{riskDistribution.low}%</p>
              <p className="text-[11px] text-slate-600">Low Risk Base</p>
            </div>
          </div>
          <div className="flex w-full items-start justify-between">
            {donutData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                <p className="text-xs text-slate-600">
                  {d.name} ({d.value}%)
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex min-w-0 flex-1 flex-col gap-5 p-6">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold text-slate-900">6-Month Patient Transition Trend</p>
            <div className="flex items-center gap-3">
              {[
                { label: 'Low', color: '#16a34a' },
                { label: 'Moderate', color: '#f59e0b' },
                { label: 'High', color: '#dc2626' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="h-0.5 w-3" style={{ backgroundColor: l.color }} />
                  <p className="text-[11px] text-slate-600">{l.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend6Month} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip />
                <Line type="monotone" dataKey="low" stroke="#16a34a" strokeWidth={2} dot={false} />
                <Line
                  type="monotone"
                  dataKey="moderate"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
                <Line type="monotone" dataKey="high" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <Card className="flex w-full min-w-0 flex-col gap-4 p-6 lg:flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold text-slate-900">Recent Active Assessments</p>
            <button
              onClick={() => navigate('/assessments')}
              className="text-[13px] font-semibold text-blue-600 hover:underline"
            >
              View All Records
            </button>
          </div>
          <div className="flex w-full flex-col">
            <div className="hidden w-full border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600 lg:flex">
              <p className="flex-1">Patient Name</p>
              <p className="w-[120px]">ID Code / MRN</p>
              <p className="w-[120px]">Date Checked</p>
              <p className="w-[120px]">Latest eGFR</p>
              <p className="w-[100px]">Risk Score</p>
            </div>
            {recent.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate(`/patients/${a.patientId}`)}
                className="flex w-full flex-col gap-2 border-b border-slate-200 p-3 text-left last:border-b-0 hover:bg-slate-50 lg:flex-row lg:items-center lg:gap-0"
              >
                <div className="flex w-full items-center justify-between gap-2 lg:contents">
                  <p className="text-[13px] font-semibold text-slate-900 lg:flex-1">{a.patientName}</p>
                  <RiskBadge level={a.riskLevel} className="lg:hidden" />
                </div>
                <p className="text-xs text-slate-500 lg:hidden">
                  {a.mrn} · {a.date} · {a.egfr} ml/min
                </p>
                <p className="hidden text-[13px] text-slate-600 lg:block lg:w-[120px]">{a.mrn}</p>
                <p className="hidden text-[13px] text-slate-600 lg:block lg:w-[120px]">{a.date}</p>
                <p className="hidden text-[13px] font-semibold text-slate-900 lg:block lg:w-[120px]">
                  {a.egfr} ml/min
                </p>
                <div className="hidden lg:block lg:w-[100px]">
                  <RiskBadge level={a.riskLevel} />
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex w-full flex-col gap-4 p-6 lg:w-[460px] lg:shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold text-slate-900">Active Clinical Alerts</p>
            <p className="text-[13px] text-slate-400">{unresolvedAlerts.length} unresolved</p>
          </div>
          <div className="flex w-full flex-col gap-3">
            {unresolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex w-full gap-3 rounded-md border border-slate-200 bg-slate-50 p-3"
              >
                <span className={`w-2 shrink-0 self-stretch rounded ${severityDot[alert.severity]}`} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex w-full items-start justify-between gap-2">
                    <p className="text-[13px] font-bold text-slate-900">
                      {alert.patientName} (MRN: {alert.mrn})
                    </p>
                    <p className="shrink-0 text-[11px] text-slate-400">{alert.timeAgo}</p>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <button
        onClick={() => navigate('/assessments/new')}
        className="fixed bottom-20 right-4 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-bold text-white shadow-[0_6px_8px_rgba(37,99,235,0.4)] hover:bg-blue-700 lg:bottom-8 lg:right-8 lg:px-5 lg:py-3.5"
      >
        <Plus className="size-4" />
        <span className="hidden sm:inline">New Assessment</span>
        <span className="sm:hidden">New</span>
      </button>
    </AppShell>
  )
}
