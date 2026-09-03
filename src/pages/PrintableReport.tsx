import { HeartPulse, Printer } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { assessments, patients } from '@/data/mockData'
import type { Patient, RiskLevel } from '@/types'
import { cn } from '@/lib/utils'

const riskBoxStyles: Record<RiskLevel, string> = {
  high: 'bg-risk-high-bg border-risk-high-fg text-risk-high-fg',
  moderate: 'bg-risk-moderate-bg border-risk-moderate-fg text-risk-moderate-fg',
  low: 'bg-risk-low-bg border-risk-low-fg text-risk-low-fg',
}

const riskLabels: Record<RiskLevel, string> = {
  high: 'HIGH RISK PREDICTION',
  moderate: 'MODERATE RISK PREDICTION',
  low: 'LOW RISK PREDICTION',
}

const riskNarrative: Record<RiskLevel, string> = {
  high: 'progression towards Stage 4 CKD within 6 months. Absolute risk slope is steepening.',
  moderate: 'progression to the next CKD stage within 12 months. Risk slope is gradually increasing.',
  low: 'clinically significant renal function decline within 24 months. Risk trajectory remains stable.',
}

const recommendedActions: Record<RiskLevel, string[]> = {
  high: [
    'Arrange nephrology clinical consultation within 7 days.',
    'Order repeat Urinary Albumin-to-Creatinine Ratio (UACR) test.',
    'Evaluate medication list for potential nephrotoxic adjustments.',
  ],
  moderate: [
    'Schedule nephrology follow-up within 60 days.',
    'Repeat eGFR panel in 3 months.',
    'Reinforce lifestyle and dietary counseling.',
  ],
  low: [
    'Continue routine annual renal function screening.',
    'Maintain current medication regimen.',
    'Reassess biomarkers in 12 months.',
  ],
}

function buildBiomarkers(patient: Patient) {
  const egfr = patient.latestEgfr
  const creatinine = Math.round((100 / egfr) * 0.6 * 100) / 100
  const uacr = Math.round(70 + patient.riskScore * 1.1)
  const potassium = Math.round((3.6 + (patient.riskScore / 100) * 1.6) * 10) / 10

  return [
    {
      name: 'Serum Creatinine',
      value: `${creatinine.toFixed(2)} mg/dL`,
      range: '0.50 - 1.10',
      abnormal: creatinine > 1.1 || creatinine < 0.5,
    },
    {
      name: 'eGFR (CKD-EPI)',
      value: `${egfr} ml/min`,
      range: '> 90',
      abnormal: egfr < 90,
    },
    {
      name: 'Urine Protein-to-Creatinine Ratio',
      value: `${uacr} mg/g`,
      range: '< 150',
      abnormal: uacr >= 150,
    },
    {
      name: 'Serum Potassium',
      value: `${potassium.toFixed(1)} mEq/L`,
      range: '3.5 - 5.1',
      abnormal: potassium < 3.5 || potassium > 5.1,
    },
  ]
}

export default function PrintableReport() {
  const { id } = useParams<{ id: string }>()

  const patient: Patient =
    patients.find((p) => p.id === id) ??
    patients.find((p) => p.id === assessments.find((a) => a.id === id)?.patientId) ??
    patients[0]

  const biomarkers = buildBiomarkers(patient)
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
  const reportId = `KID-CDSS-${patient.mrn.replace(/\D/g, '')}-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')}`

  return (
    <div className="flex min-h-screen w-full flex-col items-start gap-6 overflow-x-auto bg-slate-100 px-4 py-10 lg:items-center lg:px-0">
      <div className="flex w-full max-w-[794px] flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-slate-500">Printable A4 clinical report preview</p>
        <Button onClick={() => window.print()}>
          <Printer className="size-4" />
          Print Report
        </Button>
      </div>

      <div className="flex w-[794px] shrink-0 flex-col gap-6 bg-white p-12 shadow-[0_4px_16px_rgba(0,0,0,0.08)] print:shadow-none">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-extrabold text-slate-900">UNIVERSITY HOSPITAL NEPHROLOGY</p>
            <p className="text-xs text-slate-600">Clinical Decision Support System (CDSS) Report</p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <HeartPulse className="size-6 text-white" />
          </div>
        </div>

        <div className="h-0.5 w-full bg-slate-200" />

        <div className="flex w-full flex-col gap-3 rounded-md bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">PATIENT INFRASTRUCTURE INDEX</p>
          <div className="flex w-full items-start gap-8">
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[11px] text-slate-600">Full Name:</p>
              <p className="text-[13px] font-bold text-slate-900">{patient.name}</p>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[11px] text-slate-600">Date of Birth:</p>
              <p className="text-[13px] font-bold text-slate-900">{patient.dob}</p>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[11px] text-slate-600">Medical Record Num:</p>
              <p className="text-[13px] font-bold text-slate-900">{patient.mrn}</p>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-[11px] text-slate-600">Assigned Clinician:</p>
              <p className="text-[13px] font-bold text-slate-900">{patient.primaryPhysician}</p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-start gap-5">
          <div
            className={cn(
              'flex w-[280px] shrink-0 flex-col gap-3 rounded-lg border p-5',
              riskBoxStyles[patient.riskLevel],
            )}
          >
            <p className="text-xs font-bold">BAYESIAN PROBABILITY RISK</p>
            <p className="text-4xl font-extrabold">{patient.riskScore}%</p>
            <p className="text-[13px] font-bold">{riskLabels[patient.riskLevel]}</p>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-sm font-bold text-slate-900">Mathematical Prior Adjustments</p>
            <p className="text-xs leading-relaxed text-slate-600">
              Based on the Naive Bayes algorithm adjusted with institutional priors (p=0.158), this
              patient has a {patient.riskScore}% probability of {riskNarrative[patient.riskLevel]}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <p className="text-[13px] font-bold text-slate-900">RECENT CLINICAL OBSERVATIONS</p>
          <div className="flex w-full flex-col overflow-hidden rounded-md border border-slate-200">
            <div className="flex w-full bg-slate-50 p-2.5 text-[11px] font-bold text-slate-600">
              <p className="flex-1">Biomarker Test Name</p>
              <p className="w-[120px]">Value Recorded</p>
              <p className="w-[120px]">Reference Range</p>
              <p className="w-[100px]">Clinical Status</p>
            </div>
            {biomarkers.map((b) => (
              <div
                key={b.name}
                className="flex w-full border-b border-slate-200 p-2.5 text-xs last:border-b-0"
              >
                <p className="flex-1 text-slate-900">{b.name}</p>
                <p className="w-[120px] font-bold text-slate-900">{b.value}</p>
                <p className="w-[120px] text-slate-600">{b.range}</p>
                <p
                  className={cn(
                    'w-[100px] font-bold',
                    b.abnormal ? 'text-red-600' : 'text-emerald-600',
                  )}
                >
                  {b.abnormal ? 'Abnormal' : 'Normal'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full items-start gap-6">
          <div className="flex flex-1 flex-col gap-3">
            <p className="text-[13px] font-bold text-slate-900">RECOMMENDED CLINICAL ACTIONS</p>
            <div className="flex flex-col gap-2 text-xs leading-relaxed text-slate-600">
              {recommendedActions[patient.riskLevel].map((action, i) => (
                <p key={action}>
                  {i + 1}. {action}
                </p>
              ))}
            </div>
          </div>
          <div className="flex w-[140px] flex-col items-center gap-2">
            <div className="flex size-20 items-center justify-center rounded-md border border-slate-200 bg-slate-100 p-2">
              <div className="relative size-16">
                <div className="absolute left-0 top-0 size-[30px] bg-slate-900" />
                <div className="absolute left-[34px] top-[34px] size-[30px] bg-slate-900" />
                <div className="absolute left-0 top-[52px] size-3 bg-slate-900" />
                <div className="absolute left-[52px] top-0 size-3 bg-slate-900" />
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400">Scan to verify clinical signature</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-end gap-2">
          <div className="h-px w-full bg-slate-200" />
          <div className="flex w-full items-center justify-between text-[9px] text-slate-400">
            <p>Report ID: {reportId}</p>
            <p>Generated: {today} · Page 1 of 1</p>
          </div>
        </div>
      </div>
    </div>
  )
}
