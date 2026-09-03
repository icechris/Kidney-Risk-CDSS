import { ShieldAlert } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { AppShell } from '@/components/layout/AppShell'
import { Card } from '@/components/ui/Card'

const metrics = [
  { label: 'Accuracy', value: '94.2%', change: '+0.2% vs v3.1', trend: [1, 2, 2, 3, 3, 4, 4] },
  { label: 'Sensitivity', value: '91.8%', change: '+0.5%', trend: [2, 2, 3, 3, 4, 4, 5] },
  { label: 'Specificity', value: '95.1%', change: 'Stable', trend: [4, 4, 4, 4, 4, 4, 4] },
  { label: 'Precision', value: '89.3%', change: '-0.1%', trend: [5, 4, 4, 4, 3, 4, 4] },
  { label: 'F1 Score', value: '90.5%', change: '+0.3%', trend: [3, 3, 4, 4, 4, 5, 5] },
  { label: 'ROC-AUC', value: '0.967', change: '+0.002', trend: [3, 3, 4, 4, 5, 5, 6] },
]

const confusionMatrix = {
  truePositive: 1377,
  falseNegative: 123,
  falsePositive: 165,
  trueNegative: 8335,
}

const rocCurve = [
  { fpr: 0, model: 0, baseline: 0 },
  { fpr: 0.05, model: 0.45, baseline: 0.05 },
  { fpr: 0.1, model: 0.62, baseline: 0.1 },
  { fpr: 0.2, model: 0.78, baseline: 0.2 },
  { fpr: 0.4, model: 0.89, baseline: 0.4 },
  { fpr: 0.6, model: 0.95, baseline: 0.6 },
  { fpr: 0.8, model: 0.98, baseline: 0.8 },
  { fpr: 1, model: 1, baseline: 1 },
]

const featureImportance = [
  { label: 'eGFR (CKD-EPI Slope)', value: 88.4 },
  { label: 'Serum Creatinine', value: 82.1 },
  { label: 'Urine Protein-to-Creatinine', value: 74.5 },
  { label: 'HbA1c', value: 61.2 },
  { label: 'Patient Age', value: 54.8 },
  { label: 'Systolic Blood Pressure', value: 42.9 },
  { label: 'Biological Gender', value: 31.5 },
  { label: 'BMI', value: 20.1 },
  { label: 'Smoking History', value: 12.4 },
  { label: 'Serum Potassium', value: 8.2 },
]

function MetricSparkline({ trend }: { trend: number[] }) {
  const data = trend.map((v) => ({ v }))
  return (
    <div className="h-[20px] w-[50px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 1, right: 1, bottom: 0, left: 1 }}>
          <Area type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={1.5} fill="#16a34a" fillOpacity={0.12} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function ModelPerformance() {
  return (
    <AppShell
      title="Bayesian Engine Performance Monitor"
      subtitle="Deep Validation Audit Console · Operational Inference Parameters"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
        {metrics.map((m) => (
          <Card key={m.label} className="flex flex-col gap-2 p-4">
            <p className="text-xs font-semibold text-slate-600">{m.label}</p>
            <p className="text-2xl font-bold text-slate-900">{m.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold text-emerald-600">{m.change}</p>
              <MetricSparkline trend={m.trend} />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <Card className="flex flex-1 flex-col gap-5 p-4 lg:p-6">
          <p className="text-[15px] font-bold text-slate-900">
            Confusion Matrix (Validation Cohort n=10,000)
          </p>
          <div className="flex flex-col items-center gap-px overflow-x-auto">
            <div className="flex gap-1 text-[10px] font-bold text-slate-600 sm:text-[11px]">
              <span className="w-[64px] sm:w-[100px]" />
              <span className="w-[90px] text-center sm:w-[120px]">Predicted Positive</span>
              <span className="w-[90px] text-center sm:w-[120px]">Predicted Negative</span>
            </div>
            <div className="flex items-center gap-1 py-1">
              <p className="w-[64px] text-[10px] font-bold text-slate-600 sm:w-[100px] sm:text-[11px]">
                Actual Pos
              </p>
              <div className="flex h-[54px] w-[90px] flex-col items-center justify-center rounded bg-emerald-50 text-emerald-600 sm:h-[60px] sm:w-[120px]">
                <p className="text-base font-bold sm:text-lg">
                  {confusionMatrix.truePositive.toLocaleString()}
                </p>
                <p className="text-[9px] sm:text-[10px]">True Positive (TP)</p>
              </div>
              <div className="flex h-[54px] w-[90px] flex-col items-center justify-center rounded bg-red-50 text-red-600 sm:h-[60px] sm:w-[120px]">
                <p className="text-base font-bold sm:text-lg">
                  {confusionMatrix.falseNegative.toLocaleString()}
                </p>
                <p className="text-[9px] sm:text-[10px]">False Negative (FN)</p>
              </div>
            </div>
            <div className="flex items-center gap-1 py-1">
              <p className="w-[64px] text-[10px] font-bold text-slate-600 sm:w-[100px] sm:text-[11px]">
                Actual Neg
              </p>
              <div className="flex h-[54px] w-[90px] flex-col items-center justify-center rounded bg-red-50 text-red-600 sm:h-[60px] sm:w-[120px]">
                <p className="text-base font-bold sm:text-lg">
                  {confusionMatrix.falsePositive.toLocaleString()}
                </p>
                <p className="text-[9px] sm:text-[10px]">False Positive (FP)</p>
              </div>
              <div className="flex h-[54px] w-[90px] flex-col items-center justify-center rounded bg-emerald-50 text-emerald-600 sm:h-[60px] sm:w-[120px]">
                <p className="text-base font-bold sm:text-lg">
                  {confusionMatrix.trueNegative.toLocaleString()}
                </p>
                <p className="text-[9px] sm:text-[10px]">True Negative (TN)</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-1 flex-col gap-5 p-4 lg:p-6">
          <p className="text-[15px] font-bold text-slate-900">
            Receiver Operating Characteristic (ROC)
          </p>
          <div className="h-[150px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocCurve} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis
                  dataKey="fpr"
                  type="number"
                  domain={[0, 1]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <YAxis hide domain={[0, 1]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                  name="Random Classifier"
                />
                <Line
                  type="monotone"
                  dataKey="model"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  name="Bayesian Model"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex w-full items-center justify-between text-[10px] text-slate-400">
            <p>0.0 (False Positive Rate)</p>
            <p>1.0</p>
          </div>
        </Card>
      </div>

      <Card className="flex w-full flex-col gap-5 p-4 lg:p-6">
        <p className="text-[15px] font-bold text-slate-900">
          Predictive Feature Importance Scores (Bayesian Node Weights)
        </p>
        <div className="flex w-full flex-col gap-3">
          {featureImportance.map((f) => (
            <div key={f.label} className="flex w-full items-center gap-2 sm:gap-4">
              <p className="w-[110px] shrink-0 text-xs font-semibold text-slate-600 sm:w-[180px] sm:text-[13px]">
                {f.label}
              </p>
              <div className="h-3 w-full overflow-hidden rounded-md bg-slate-100">
                <div className="h-full rounded-md bg-blue-600" style={{ width: `${f.value}%` }} />
              </div>
              <p className="w-[38px] shrink-0 text-right text-xs font-bold text-slate-900 sm:w-[50px] sm:text-[13px]">
                {f.value}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex w-full items-center gap-3 rounded-md bg-slate-100 p-4">
        <ShieldAlert className="size-4 shrink-0 text-navy-900" />
        <p className="flex-1 text-xs text-navy-900">
          CDSS Bayesian Inference Model version 3.2.1 is FDA-cleared as Class II SaMD. Last
          calibrated on validation cohort on Oct 1, 2024. Next scheduled audit calibration Jan
          2025.
        </p>
      </div>
    </AppShell>
  )
}
