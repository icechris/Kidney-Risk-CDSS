import { Download, Printer } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { useNavigate, useParams } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { patients } from '@/data/mockData'
import type { RiskLevel } from '@/types'
import { cn } from '@/lib/utils'

const riskColor: Record<RiskLevel, string> = {
  low: '#16a34a',
  moderate: '#f59e0b',
  high: '#dc2626',
}

const riskProbabilities: Record<RiskLevel, { low: number; moderate: number; high: number }> = {
  high: { low: 12, moderate: 10, high: 78 },
  moderate: { low: 25, moderate: 50, high: 25 },
  low: { low: 78, moderate: 15, high: 7 },
}

const declineSlope: Record<RiskLevel, string> = {
  high: '-8.4% / year',
  moderate: '-3.1% / year',
  low: '-0.4% / year',
}

const protocolsByRisk: Record<RiskLevel, { text: string; color: string }[]> = {
  high: [
    { text: 'Refer to Nephrologist within 14 Days', color: 'bg-red-600' },
    { text: 'Order Repeat UACR & Electrolytes', color: 'bg-amber-500' },
    { text: 'Initiate SGLT2 Inhibitor Therapy (If tolerated)', color: 'bg-blue-600' },
    { text: 'Schedule Renal Ultrasound Evaluation', color: 'bg-slate-400' },
  ],
  moderate: [
    { text: 'Refer to Nephrologist within 60 Days', color: 'bg-amber-500' },
    { text: 'Repeat eGFR Panel in 3 Months', color: 'bg-amber-500' },
    { text: 'Reinforce Lifestyle & Dietary Counseling', color: 'bg-blue-600' },
    { text: 'Monitor Blood Pressure Monthly', color: 'bg-slate-400' },
  ],
  low: [
    { text: 'Continue Routine Annual Screening', color: 'bg-emerald-600' },
    { text: 'Maintain Current Medication Regimen', color: 'bg-blue-600' },
    { text: 'Reassess in 12 Months', color: 'bg-slate-400' },
  ],
}

export default function PredictionResult() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const patient = patients.find((p) => p.id === id) ?? patients[0]

  const score = patient.riskScore
  const color = riskColor[patient.riskLevel]
  const probs = riskProbabilities[patient.riskLevel]

  const gaugeData = [
    { name: 'score', value: score },
    { name: 'remainder', value: 100 - score },
  ]

  const conditionsLabel =
    patient.conditions.length > 0 ? patient.conditions.join(', ') : 'No known comorbidities'

  const predictors = [
    {
      label: `eGFR Decrease (CKD-EPI, ${patient.latestEgfr} ml/min)`,
      influence: 34.2,
      color: '#dc2626',
    },
    { label: 'Elevated Serum Creatinine (1.45 mg/dL)', influence: 22.8, color: '#dc2626' },
    { label: 'Urine Protein-to-Creatinine Ratio (180 mg/g)', influence: 12.4, color: '#f59e0b' },
    { label: 'Blood Pressure Severity (134/82 mmHg)', influence: 8.6, color: '#f59e0b' },
  ]

  return (
    <AppShell
      title="Prediction Analysis Report"
      subtitle="Inference Engine: v3.2.1 · Generated on Oct 24, 2024"
    >
      <Card className="flex w-full items-start gap-6 p-6">
        <div className="relative flex size-[180px] shrink-0 flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                dataKey="value"
                innerRadius={60}
                outerRadius={70}
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                <Cell fill={color} />
                <Cell fill="#e2e8f0" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <p className="text-[32px] font-extrabold" style={{ color }}>
              {score}%
            </p>
            <p className="text-[11px] font-bold uppercase text-slate-600">
              {patient.riskLevel} Risk
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex w-full items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-[22px] font-bold text-slate-900">{patient.name}</p>
              <p className="text-[13px] text-slate-600">
                {patient.mrn} · {patient.age} Year Old {patient.sex} · {conditionsLabel}
              </p>
            </div>
            <RiskBadge level={patient.riskLevel} />
          </div>
          <div className="h-px w-full bg-slate-200" />
          <div className="flex w-full gap-8">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase text-slate-400">Computed Priors</p>
              <p className="text-sm font-semibold text-slate-900">
                {patient.conditions[0] ?? 'No prior conditions'}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase text-slate-400">Renal Decline Slope</p>
              <p className="text-sm font-semibold text-red-600">
                {declineSlope[patient.riskLevel]}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase text-slate-400">Bayesian Confidence</p>
              <p className="text-sm font-semibold text-slate-900">95% CI (± 3.2%)</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex w-full items-start gap-5">
        {(['low', 'moderate', 'high'] as RiskLevel[]).map((level) => (
          <Card key={level} className="flex flex-1 flex-col gap-3 p-5">
            <div className="flex w-full items-center justify-between">
              <p className="text-[13px] font-semibold text-slate-600 capitalize">
                {level} Risk Probability
              </p>
              <span className="size-2.5 rounded-full" style={{ backgroundColor: riskColor[level] }} />
            </div>
            <p className="text-[28px] font-bold" style={{ color: riskColor[level] }}>
              {probs[level]}%
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full"
                style={{ width: `${probs[level]}%`, backgroundColor: riskColor[level] }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex w-full items-start gap-5">
        <Card className="flex flex-1 flex-col gap-5 p-6">
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-bold text-slate-900">Top Clinical Risk Predictors</p>
            <p className="text-xs text-slate-600">
              Weighted Bayesian influence derived from current biometric observation vectors.
            </p>
          </div>
          <div className="flex w-full flex-col gap-4">
            {predictors.map((p) => (
              <div key={p.label} className="flex w-full flex-col gap-1.5">
                <div className="flex w-full items-start justify-between text-[13px] font-semibold">
                  <p className="text-slate-900">{p.label}</p>
                  <p style={{ color: p.color }}>+{p.influence}% Influence</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded bg-slate-50">
                  <div
                    className="h-full rounded"
                    style={{ width: `${p.influence * 2}%`, backgroundColor: p.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex w-[460px] shrink-0 flex-col gap-5">
          <Card className="flex w-full flex-col gap-3 p-5">
            <p className="text-sm font-bold text-slate-900">Inference Model Profile</p>
            <div className="flex w-full flex-col gap-2 text-[13px]">
              <div className="flex w-full items-start justify-between">
                <p className="text-slate-600">Classifier Architecture</p>
                <p className="font-semibold text-slate-900">Gaussian Naive Bayes</p>
              </div>
              <div className="flex w-full items-start justify-between">
                <p className="text-slate-600">Active Cohort Dataset</p>
                <p className="font-semibold text-slate-900">N = 12,400 Patient Records</p>
              </div>
              <div className="flex w-full items-start justify-between">
                <p className="text-slate-600">Calibration Date</p>
                <p className="font-semibold text-slate-900">September 2024</p>
              </div>
            </div>
          </Card>

          <Card className="flex w-full flex-col gap-3 p-5">
            <p className="text-sm font-bold text-slate-900">CDSS Clinical Protocols</p>
            <div className="flex w-full flex-col gap-2.5">
              {protocolsByRisk[patient.riskLevel].map((protocol, i) => (
                <div key={protocol.text} className="flex w-full items-center gap-2">
                  <span className={cn('size-2 shrink-0 rounded-full', protocol.color)} />
                  <p
                    className={cn(
                      'flex-1 text-[13px]',
                      i === 0 ? 'font-semibold text-slate-900' : 'text-slate-900',
                    )}
                  >
                    {protocol.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="w-full rounded-md border border-slate-200 bg-slate-100 p-4">
          <p className="text-xs leading-relaxed text-slate-600">
            <span className="font-bold text-slate-900">Disclaimer: </span>
            This prediction report is generated by a Bayesian clinical decision support system
            utilizing historical and biometric inputs. It is intended to assist medical
            professionals and should not replace patient-specific clinical evaluation or direct
            nephrology assessment.
          </p>
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => navigate(`/patients/${patient.id}`)}>
              Back to Patient Profile
            </Button>
            <Button variant="secondary" onClick={() => window.print()} className="gap-2">
              <Printer className="size-3.5" />
              Print Summary
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="gap-2">
              <Download className="size-3.5" />
              Download PDF Report
            </Button>
            <Button size="lg" onClick={() => navigate('/assessments/new')}>
              New Assessment
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
