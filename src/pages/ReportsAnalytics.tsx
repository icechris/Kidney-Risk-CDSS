import { Download, File, FileSpreadsheet, FileText } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { patients } from '@/data/mockData'

const monthlyRunVolume = [
  { month: 'Nov 23', runs: 180 },
  { month: 'Dec', runs: 240 },
  { month: 'Jan 24', runs: 310 },
  { month: 'Feb', runs: 400 },
  { month: 'Mar', runs: 385 },
  { month: 'Apr', runs: 510 },
  { month: 'May', runs: 470 },
  { month: 'Jun', runs: 590 },
  { month: 'Jul', runs: 680 },
  { month: 'Aug', runs: 655 },
  { month: 'Sep', runs: 780 },
  { month: 'Oct', runs: 845 },
]

const sparklineTrends = {
  reports: [{ v: 3 }, { v: 4 }, { v: 3 }, { v: 5 }, { v: 6 }, { v: 5 }, { v: 7 }],
  risk: [{ v: 6 }, { v: 5 }, { v: 7 }, { v: 6 }, { v: 8 }, { v: 9 }, { v: 9 }],
  etiology: [{ v: 4 }, { v: 4 }, { v: 5 }, { v: 5 }, { v: 5 }, { v: 6 }, { v: 6 }],
  utilization: [{ v: 7 }, { v: 6 }, { v: 8 }, { v: 7 }, { v: 8 }, { v: 9 }, { v: 8 }],
}

const ageDistribution = [
  { label: '18 - 39 yrs', patients: 124, color: 'bg-green-500' },
  { label: '40 - 59 yrs', patients: 482, color: 'bg-amber-500' },
  { label: '60 - 79 yrs', patients: 512, color: 'bg-red-500' },
  { label: '80+ yrs', patients: 129, color: 'bg-red-500' },
]

const genderDistribution = [
  { label: 'Female', patients: 654, color: 'bg-blue-600' },
  { label: 'Male', patients: 593, color: 'bg-navy-900' },
]

const recentReports = [
  { name: 'Monthly Performance Audit - Oct 2024', meta: 'PDF · 2.4 MB', date: 'Oct 24, 2024' },
  {
    name: 'Longitudinal CKD-3b Transition Matrix Report',
    meta: 'Spreadsheet CSV · 12.8 MB',
    date: 'Oct 22, 2024',
  },
  {
    name: 'Local Area Renal Health Biomarker Cohort Export',
    meta: 'Excel XLSX · 4.5 MB',
    date: 'Oct 18, 2024',
  },
]

function conditionEtiology() {
  const counts = new Map<string, number>()
  patients.forEach((p) => {
    p.conditions.forEach((c) => counts.set(c, (counts.get(c) ?? 0) + 1))
  })
  let top = ''
  let max = 0
  counts.forEach((count, condition) => {
    if (count > max) {
      max = count
      top = condition
    }
  })
  const pct = patients.length > 0 ? Math.round((max / patients.length) * 1000) / 10 : 0
  return { top: top || 'N/A', pct }
}

function Sparkline({ data, color }: { data: { v: number }[]; color: string }) {
  return (
    <div className="h-[35px] w-[85px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.12} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function ReportsAnalytics() {
  const etiology = conditionEtiology()
  const maxAge = Math.max(...ageDistribution.map((a) => a.patients))
  const maxGender = Math.max(...genderDistribution.map((g) => g.patients))

  return (
    <AppShell
      title="System Reports & Analytics"
      subtitle="CDSS Population Demographics and System Throughput Statistics"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <FileText className="size-3.5" />
            Export PDF
          </Button>
          <Button variant="secondary" size="sm">
            <FileSpreadsheet className="size-3.5" />
            Excel / CSV
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-5">
        <Card className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-[13px] font-semibold text-slate-600">Total Reports Run</p>
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[28px] font-bold text-slate-900">3,421</p>
              <p className="text-[11px] text-slate-400">All periods</p>
            </div>
            <Sparkline data={sparklineTrends.reports} color="#2563eb" />
          </div>
        </Card>
        <Card className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-[13px] font-semibold text-slate-600">Mean Patient Risk Score</p>
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[28px] font-bold text-slate-900">11.4%</p>
              <p className="text-[11px] text-slate-400">Median 6.8%</p>
            </div>
            <Sparkline data={sparklineTrends.risk} color="#dc2626" />
          </div>
        </Card>
        <Card className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-[13px] font-semibold text-slate-600">Most Common Etiology</p>
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[22px] font-bold leading-tight text-slate-900">{etiology.top}</p>
              <p className="text-[11px] text-slate-400">{etiology.pct}% of cohort</p>
            </div>
            <Sparkline data={sparklineTrends.etiology} color="#2563eb" />
          </div>
        </Card>
        <Card className="flex flex-1 flex-col gap-3 p-5">
          <p className="text-[13px] font-semibold text-slate-600">CDSS Utilization Rate</p>
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[28px] font-bold text-slate-900">98.8%</p>
              <p className="text-[11px] text-slate-400">Target reached</p>
            </div>
            <Sparkline data={sparklineTrends.utilization} color="#16a34a" />
          </div>
        </Card>
      </div>

      <Card className="flex w-full flex-col gap-5 p-6">
        <p className="text-[15px] font-bold text-slate-900">
          Monthly Computational Run Volume (12-Month Period)
        </p>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyRunVolume} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip />
              <Bar dataKey="runs" fill="#2563eb" fillOpacity={0.6} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="flex items-start gap-5">
        <Card className="flex flex-1 flex-col gap-4 p-6">
          <p className="text-[15px] font-bold text-slate-900">Cohort Risk Distribution by Age Group</p>
          <div className="flex flex-col gap-3">
            {ageDistribution.map((row) => (
              <div key={row.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">{row.patients} patients</p>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${(row.patients / maxAge) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flex flex-1 flex-col gap-4 p-6">
          <p className="text-[15px] font-bold text-slate-900">
            Cohort Risk Distribution by Biological Gender
          </p>
          <div className="flex flex-col gap-3">
            {genderDistribution.map((row) => (
              <div key={row.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <p className="font-semibold text-slate-900">{row.label}</p>
                  <p className="text-slate-600">{row.patients} patients</p>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${(row.patients / maxGender) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="flex w-full flex-col gap-4 p-6">
        <p className="text-[15px] font-bold text-slate-900">Recent Generated Population Reports</p>
        <div className="flex w-full flex-col">
          {recentReports.map((r) => (
            <div
              key={r.name}
              className="flex w-full items-center gap-4 border-b border-slate-100 py-3 last:border-b-0"
            >
              <File className="size-5 shrink-0 text-slate-400" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <p className="truncate text-[13px] font-semibold text-slate-900">{r.name}</p>
                <p className="text-[11px] text-slate-400">{r.meta}</p>
              </div>
              <p className="w-[120px] shrink-0 text-[13px] text-slate-600">{r.date}</p>
              <Button variant="secondary" size="sm">
                <Download className="size-3.5" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  )
}
