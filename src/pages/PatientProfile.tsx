import { useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { egfrHistory, patients } from '@/data/mockData'
import type { EgfrReading, Patient, RiskLevel } from '@/types'

const riskRingColor: Record<RiskLevel, string> = {
  low: '#16a34a',
  moderate: '#f59e0b',
  high: '#dc2626',
}

const tabs = ['Overview', 'Assessments', 'Lab Trends', 'Medical History', 'Clinical Reports'] as const
type Tab = (typeof tabs)[number]

const conditionStyles = (condition: string) => {
  if (/stage|disease|diabetes/i.test(condition)) return 'bg-red-100 text-red-600'
  if (/hypertension/i.test(condition)) return 'bg-amber-100 text-amber-600'
  return 'bg-slate-50 text-slate-600 border border-slate-200'
}

function getPrescriptions(conditions: string[]) {
  const list: { name: string; dose: string; tag: string }[] = []
  if (conditions.some((c) => /diabetes/i.test(c))) {
    list.push(
      { name: 'Metformin HCl', dose: '1000mg BID', tag: 'Glycemic Control' },
      { name: 'Empagliflozin (SGLT2i)', dose: '10mg QD', tag: 'Cardiorenal Risk Reduction' },
    )
  }
  if (conditions.some((c) => /hypertension/i.test(c))) {
    list.push({ name: 'Lisinopril', dose: '20mg QD', tag: 'Renoprotective / BP' })
  }
  if (conditions.some((c) => /hyperlipid/i.test(c))) {
    list.push({ name: 'Atorvastatin', dose: '40mg QD', tag: 'Lipid Lowering' })
  }
  if (conditions.some((c) => /chronic kidney disease/i.test(c))) {
    list.push({ name: 'Sodium Bicarbonate', dose: '650mg TID', tag: 'Acidosis Management' })
  }
  if (list.length === 0) {
    list.push({ name: 'No active prescriptions on file', dose: '—', tag: '—' })
  }
  return list
}

function synthEgfrHistory(patient: Patient): EgfrReading[] {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']
  const end = patient.latestEgfr
  const slope = patient.riskLevel === 'high' ? 3.2 : patient.riskLevel === 'moderate' ? 1.2 : 0.3
  return months.map((date, i) => ({
    date,
    egfr: Math.max(5, Math.round(end + slope * (months.length - 1 - i))),
  }))
}

function biomarkersFor(patient: Patient) {
  const gap = Math.max(0, 90 - patient.latestEgfr)
  const creatinine = +(1.0 + gap * 0.03).toFixed(2)
  const bun = Math.round(14 + gap * 0.35)
  const potassium = +(4.0 + gap * 0.01).toFixed(1)
  const albumin = +(4.2 - gap * 0.006).toFixed(1)
  const calcium = +(9.6 - gap * 0.004).toFixed(1)
  return [
    { label: 'eGFR (CKD-EPI)', value: `${patient.latestEgfr} ml/min/1.73m²`, dot: patient.latestEgfr < 30 ? 'bg-red-600' : patient.latestEgfr < 60 ? 'bg-amber-500' : 'bg-emerald-600' },
    { label: 'Serum Creatinine', value: `${creatinine} mg/dL`, dot: creatinine > 2 ? 'bg-red-600' : creatinine > 1.3 ? 'bg-amber-500' : 'bg-emerald-600' },
    { label: 'Blood Urea Nitrogen', value: `${bun} mg/dL`, dot: bun > 30 ? 'bg-red-600' : bun > 20 ? 'bg-amber-500' : 'bg-emerald-600' },
    { label: 'Serum Potassium', value: `${potassium} mEq/L`, dot: potassium > 5.2 ? 'bg-red-600' : potassium > 4.4 ? 'bg-amber-500' : 'bg-emerald-600' },
    { label: 'Serum Albumin', value: `${albumin} g/dL`, dot: albumin < 3.5 ? 'bg-red-600' : albumin < 3.9 ? 'bg-amber-500' : 'bg-emerald-600' },
    { label: 'Serum Calcium', value: `${calcium} mg/dL`, dot: calcium < 8.5 ? 'bg-red-600' : 'bg-emerald-600' },
  ]
}

function timelineFor(patient: Patient) {
  const priorLevels: Record<RiskLevel, RiskLevel[]> = {
    high: ['moderate', 'moderate', 'low'],
    moderate: ['moderate', 'low', 'low'],
    low: ['low', 'low', 'low'],
  }
  const notes: Record<RiskLevel, string> = {
    high: 'UACR spiked above baseline threshold. Bayesian prior updated.',
    moderate: 'eGFR trend plateaued. Recommendation to monitor diet and repeat panel.',
    low: 'Screening within expected local boundaries. Posterior check ran.',
  }
  return [
    { date: patient.lastCheckedAt, level: patient.riskLevel, note: notes[patient.riskLevel] },
    { date: '3 months prior', level: priorLevels[patient.riskLevel][0], note: notes[priorLevels[patient.riskLevel][0]] },
    { date: '9 months prior', level: priorLevels[patient.riskLevel][1], note: notes[priorLevels[patient.riskLevel][1]] },
    { date: '18 months prior', level: priorLevels[patient.riskLevel][2], note: 'Initial clinical intake profile loaded.' },
  ]
}

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>()
  const patient = patients.find((p) => p.id === id) ?? patients[0]
  const [tab, setTab] = useState<Tab>('Overview')

  const history = egfrHistory[patient.id] ?? synthEgfrHistory(patient)
  const biomarkers = useMemo(() => biomarkersFor(patient), [patient])
  const timeline = useMemo(() => timelineFor(patient), [patient])
  const prescriptions = useMemo(() => getPrescriptions(patient.conditions), [patient])

  const initials = patient.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')

  const ringColor = riskRingColor[patient.riskLevel]
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const dash = (patient.riskScore / 100) * circumference

  return (
    <AppShell title="Patient Health Profile" subtitle={`${patient.mrn} · Active File`}>
      <Card className="flex w-full items-center gap-6 p-6">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          {initials}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-[22px] font-bold text-slate-900">{patient.name}</p>
              <p className="text-sm text-slate-600">
                {patient.age} Year Old {patient.sex}
              </p>
            </div>
            <RiskBadge level={patient.riskLevel} />
          </div>
          <div className="flex w-full items-start gap-6 text-[13px] text-slate-600">
            <p>
              MRN: <span className="font-semibold text-slate-900">{patient.mrn}</span>
            </p>
            <p>
              Phone: <span className="font-semibold text-slate-900">{patient.phone ?? 'Not on file'}</span>
            </p>
            <p>
              Email: <span className="font-semibold text-slate-900">{patient.email ?? 'Not on file'}</span>
            </p>
          </div>
        </div>
      </Card>

      <div className="flex w-full items-start gap-2 border-b border-slate-200">
        {tabs.map((t) =>
          t === 'Lab Trends' ? (
            <Link
              key={t}
              to="/history"
              className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              {t}
            </Link>
          ) : (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm ${
                tab === t
                  ? 'border-b-[3px] border-blue-600 font-bold text-blue-600'
                  : 'font-medium text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'Assessments' ? `${t} (6)` : t}
            </button>
          ),
        )}
      </div>

      {tab !== 'Overview' ? (
        <Card className="flex w-full flex-col items-center justify-center gap-2 p-16 text-center">
          <p className="text-sm font-semibold text-slate-900">{tab}</p>
          <p className="text-[13px] text-slate-400">
            No {tab.toLowerCase()} data recorded for this mock patient yet.
          </p>
        </Card>
      ) : (
        <>
          <div className="flex w-full items-start gap-5">
            <div className="flex flex-1 flex-col gap-5">
              <Card className="flex w-full flex-col gap-4 p-5">
                <p className="text-[15px] font-bold text-slate-900">
                  Primary Diagnoses &amp; Comorbidities
                </p>
                <div className="flex w-full flex-wrap items-start gap-2">
                  {patient.conditions.length === 0 ? (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      No diagnoses on file
                    </span>
                  ) : (
                    patient.conditions.map((c) => (
                      <span
                        key={c}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${conditionStyles(c)}`}
                      >
                        {c}
                      </span>
                    ))
                  )}
                </div>
              </Card>

              <Card className="flex w-full flex-col gap-4 p-5">
                <p className="text-[15px] font-bold text-slate-900">Active Prescriptions</p>
                <div className="flex w-full flex-col gap-3">
                  {prescriptions.map((rx) => (
                    <div
                      key={rx.name}
                      className="flex w-full items-center justify-between rounded-md border border-slate-200 p-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[13px] font-bold text-slate-900">{rx.name}</p>
                        <p className="text-[11px] text-slate-400">{rx.dose}</p>
                      </div>
                      <p className="text-xs font-medium text-blue-600">{rx.tag}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="flex w-[420px] shrink-0 flex-col gap-5">
              <Card className="flex w-full flex-col gap-3 p-5">
                <p className="text-[15px] font-bold text-slate-900">Latest Bayesian Risk Level</p>
                <div className="flex w-full items-center gap-4">
                  <div className="relative flex size-20 shrink-0 items-center justify-center">
                    <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                      <circle cx="40" cy="40" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="none"
                        stroke={ringColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${dash} ${circumference}`}
                      />
                    </svg>
                    <p className="absolute text-base font-extrabold" style={{ color: ringColor }}>
                      {patient.riskScore}%
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm font-bold text-slate-900">Renal Decline Probability</p>
                    <p className="text-xs text-slate-600">
                      Computed from 14 risk nodes. Primary driver: eGFR slope change.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="flex w-full flex-col gap-3 p-5">
                <p className="text-[15px] font-bold text-slate-900">Renal Biomarker Values</p>
                <div className="flex w-full flex-col">
                  {biomarkers.map((b) => (
                    <div
                      key={b.label}
                      className="flex w-full items-center justify-between border-b border-slate-200 py-2 last:border-b-0"
                    >
                      <p className="text-[13px] text-slate-600">{b.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] font-bold text-slate-900">{b.value}</p>
                        <span className={`size-1.5 rounded-full ${b.dot}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <Card className="flex w-full flex-col gap-5 p-6">
            <p className="text-[15px] font-bold text-slate-900">
              eGFR Trend (ml/min/1.73m²)
            </p>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ left: 0, right: 12, top: 4, bottom: 0 }}>
                  <XAxis
                    dataKey="date"
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
                  <Line
                    type="monotone"
                    dataKey="egfr"
                    stroke={ringColor}
                    strokeWidth={2}
                    dot={{ r: 3, fill: ringColor }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="flex w-full flex-col gap-5 p-6">
            <p className="text-[15px] font-bold text-slate-900">Historical Risk Progression</p>
            <div className="flex w-full flex-col gap-4">
              {timeline.map((t, i) => (
                <div key={i} className="flex w-full items-start gap-4">
                  <div className="flex w-[120px] shrink-0 flex-col gap-1">
                    <p className="text-[13px] font-bold text-slate-900">{t.date}</p>
                    <RiskBadge level={t.level} />
                  </div>
                  <div className="flex-1 border-l-2 border-slate-200 pl-4">
                    <p className="text-[13px] text-slate-600">{t.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </AppShell>
  )
}
