import { ChevronDown, Play } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { patients } from '@/data/mockData'

type SmokingStatus = 'Never' | 'Former' | 'Active'

const labFields: { label: string; defaultValue: string; unit: string }[] = [
  { label: 'Serum Creatinine', defaultValue: '1.45', unit: 'mg/dL' },
  { label: 'eGFR (CKD-EPI)', defaultValue: '48', unit: 'ml/min/1.73m²' },
  { label: 'Blood Urea Nitrogen', defaultValue: '24', unit: 'mg/dL' },
  { label: 'Urine Protein-to-Cr', defaultValue: '180', unit: 'mg/g' },
  { label: 'Haemoglobin', defaultValue: '12.8', unit: 'g/dL' },
  { label: 'Fasting Glucose', defaultValue: '112', unit: 'mg/dL' },
  { label: 'HbA1c', defaultValue: '6.8', unit: '%' },
  { label: 'Serum Sodium', defaultValue: '139', unit: 'mEq/L' },
  { label: 'Serum Potassium', defaultValue: '4.2', unit: 'mEq/L' },
  { label: 'Serum Bicarbonate', defaultValue: '22', unit: 'mEq/L' },
  { label: 'Serum Albumin', defaultValue: '3.9', unit: 'g/dL' },
  { label: 'Serum Calcium', defaultValue: '9.2', unit: 'mg/dL' },
  { label: 'Serum Phosphate', defaultValue: '3.5', unit: 'mg/dL' },
]

function FieldLabel({ children }: { children: string }) {
  return <p className="text-xs font-semibold text-slate-600">{children}</p>
}

function TextInput({ defaultValue }: { defaultValue: string }) {
  return (
    <input
      type="text"
      defaultValue={defaultValue}
      className="w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-[13px] text-slate-900 focus:border-blue-500 focus:outline-none"
    />
  )
}

function UnitInput({ defaultValue, unit }: { defaultValue: string; unit: string }) {
  return (
    <label className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2.5">
      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full bg-transparent text-[13px] text-slate-900 focus:outline-none"
      />
      <span className="shrink-0 text-[11px] font-semibold text-slate-400">{unit}</span>
    </label>
  )
}

function Select({ defaultValue, options }: { defaultValue: string; options: string[] }) {
  return (
    <div className="relative w-full">
      <select
        defaultValue={defaultValue}
        className="w-full appearance-none rounded-md border border-slate-200 bg-slate-50 p-2.5 pr-8 text-[13px] text-slate-900 focus:border-blue-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

export default function NewAssessment() {
  const navigate = useNavigate()
  const [patientId, setPatientId] = useState('p1')
  const [hypertensive, setHypertensive] = useState(true)
  const [smoking, setSmoking] = useState<SmokingStatus>('Former')

  function handleRunPrediction() {
    navigate(`/assessments/${patientId}/result`)
  }

  return (
    <AppShell
      title="New Bayesian Risk Assessment"
      subtitle="System Status: Operational · October 24, 2024"
    >
      <Card className="flex w-full flex-col gap-8 p-8">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
          <p className="text-lg font-bold text-slate-900">Patient Risk Input Profile</p>
          <p className="text-[13px] text-slate-600">
            Fill in the following demographics and biometric observations to update risk
            parameters.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="text-sm font-bold uppercase text-blue-600">1. Patient Demographics</p>
          <div className="flex w-full items-start gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>Search Registered Patient</FieldLabel>
              <div className="relative w-full">
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full appearance-none rounded-md border border-slate-200 bg-slate-50 p-2.5 pr-8 text-[13px] text-slate-900 focus:border-blue-500 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>Date of Birth</FieldLabel>
              <TextInput defaultValue="11 / 14 / 1968" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>Biological Gender</FieldLabel>
              <TextInput defaultValue="Female" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="text-sm font-bold uppercase text-blue-600">
            2. Comorbidities &amp; Medical History
          </p>
          <div className="flex w-full items-center gap-6">
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>Diabetes Diagnosis</FieldLabel>
              <Select
                defaultValue="Type 2 Diabetes (Well-controlled)"
                options={[
                  'None',
                  'Type 1 Diabetes',
                  'Type 2 Diabetes (Well-controlled)',
                  'Type 2 Diabetes (Poorly-controlled)',
                ]}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>Hypertension Status</FieldLabel>
              <label className="flex w-full items-center gap-2.5 p-2.5">
                <input
                  type="checkbox"
                  checked={hypertensive}
                  onChange={(e) => setHypertensive(e.target.checked)}
                  className="size-[18px] rounded border-slate-300 accent-blue-600"
                />
                <span className="text-[13px] font-medium text-slate-900">
                  Hypertensive (Taking medication)
                </span>
              </label>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>Smoking History</FieldLabel>
              <div className="flex items-center gap-4 p-2.5">
                {(['Never', 'Former', 'Active'] as SmokingStatus[]).map((status) => (
                  <label key={status} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="smoking"
                      checked={smoking === status}
                      onChange={() => setSmoking(status)}
                      className="size-4 accent-blue-600"
                    />
                    <span
                      className={
                        smoking === status
                          ? 'text-[13px] font-semibold text-slate-900'
                          : 'text-[13px] text-slate-900'
                      }
                    >
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="text-sm font-bold uppercase text-blue-600">3. Clinical Measurements</p>
          <div className="flex w-full items-start gap-4">
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>Blood Pressure (Systolic / Diastolic)</FieldLabel>
              <div className="flex w-full gap-2">
                <UnitInput defaultValue="134" unit="mmHg" />
                <UnitInput defaultValue="82" unit="mmHg" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>BMI</FieldLabel>
              <UnitInput defaultValue="28.4" unit="kg/m²" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <FieldLabel>Heart Rate</FieldLabel>
              <UnitInput defaultValue="72" unit="bpm" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="text-sm font-bold uppercase text-blue-600">
            4. Laboratory Biomarkers &amp; Renal Panels
          </p>
          <div className="grid w-full grid-cols-3 gap-x-4 gap-y-4">
            {labFields.map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <FieldLabel>{f.label}</FieldLabel>
                <UnitInput defaultValue={f.defaultValue} unit={f.unit} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <p className="text-sm font-bold uppercase text-blue-600">
            5. Clinical Findings / Bayesian Priors Override
          </p>
          <div className="flex w-full flex-col gap-1.5">
            <FieldLabel>Observation Notes</FieldLabel>
            <textarea
              defaultValue="Patient has shown mild trace haematuria in prior testing. Retesting ordered. Bayesian inference will run with primary renal failure probability parameters tuned for local population averages."
              className="h-[100px] w-full resize-none rounded-md border border-slate-200 bg-slate-50 p-3 text-[13px] leading-relaxed text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-between border-t border-slate-200 pt-8">
          <div className="flex items-center gap-3">
            <Button variant="secondary">Save Draft</Button>
            <Button variant="ghost" className="text-red-600 hover:bg-red-50">
              Reset Form
            </Button>
          </div>
          <Button size="lg" onClick={handleRunPrediction} className="gap-2 px-6">
            <Play className="size-3.5" />
            Run Bayesian Prediction
          </Button>
        </div>
      </Card>
    </AppShell>
  )
}
