import { useState, type ReactNode } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'

const tabs = [
  'General Information',
  'Risk Thresholds',
  'Model Configuration',
  'Security & Privacy',
  'Notifications',
  'Audit Log Settings',
] as const

type Tab = (typeof tabs)[number]

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-[13px] text-slate-900 focus:border-blue-500 focus:outline-none'

export default function Settings() {
  const [tab, setTab] = useState<Tab>('Risk Thresholds')

  // General Information
  const [institution, setInstitution] = useState('University Hospital')
  const [timezone, setTimezone] = useState('America/New_York')
  const [landingPage, setLandingPage] = useState('/dashboard')

  // Risk Thresholds
  const [lowBoundary, setLowBoundary] = useState(30)
  const [moderateBoundary, setModerateBoundary] = useState(60)

  // Model Configuration
  const [classifier, setClassifier] = useState('Naive Bayes Classifier (Stable)')
  const [priorRate, setPriorRate] = useState('0.158')
  const [credibleInterval, setCredibleInterval] = useState('95')

  // Security & Privacy
  const [sessionTimeout, setSessionTimeout] = useState('15')
  const [twoFactor, setTwoFactor] = useState(true)

  // Notifications
  const [emailHighRisk, setEmailHighRisk] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [maintenanceNotices, setMaintenanceNotices] = useState(false)

  // Audit Log Settings
  const [retention, setRetention] = useState('365')
  const [detailedLogging, setDetailedLogging] = useState(true)

  const clampedLow = Math.min(lowBoundary, moderateBoundary - 1)
  const clampedModerate = Math.max(moderateBoundary, lowBoundary + 1)

  return (
    <AppShell title="System Settings" subtitle="Clinical Risk Thresholds & Model Parameters">
      <div className="flex items-start gap-6">
        <div className="flex w-[200px] shrink-0 flex-col gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-md px-3 py-2.5 text-left text-[13px] font-semibold transition-colors',
                tab === t ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {tab === 'General Information' && (
            <Card className="flex flex-col gap-5 p-6">
              <p className="text-[15px] font-bold text-slate-900">General Information</p>
              <p className="text-xs text-slate-600">
                Basic institutional details shown across the CDSS platform.
              </p>
              <div className="flex gap-4">
                <Field label="Institution Name">
                  <input
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Timezone">
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputClass}>
                    <option value="America/New_York">Eastern (America/New_York)</option>
                    <option value="America/Chicago">Central (America/Chicago)</option>
                    <option value="America/Denver">Mountain (America/Denver)</option>
                    <option value="America/Los_Angeles">Pacific (America/Los_Angeles)</option>
                  </select>
                </Field>
              </div>
              <Field label="Default Landing Page">
                <select
                  value={landingPage}
                  onChange={(e) => setLandingPage(e.target.value)}
                  className={inputClass}
                >
                  <option value="/dashboard">Clinical Risk Dashboard</option>
                  <option value="/patients">Patients List</option>
                  <option value="/alerts">Clinical Alerts Console</option>
                </select>
              </Field>
            </Card>
          )}

          {tab === 'Risk Thresholds' && (
            <Card className="flex flex-col gap-5 p-6">
              <p className="text-[15px] font-bold text-slate-900">
                Risk Categorization Thresholds (CKD-EPI Adjusted)
              </p>
              <p className="text-xs text-slate-600">
                These thresholds determine the clinical flags in patient listings based on Bayesian
                predictive outputs.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <p className="font-semibold text-slate-900">Low Risk (Standard Monitoring)</p>
                    <p className="font-bold text-risk-low-fg">0% - {clampedLow}%</p>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full bg-emerald-600" style={{ width: `${clampedLow}%` }} />
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={95}
                    value={lowBoundary}
                    onChange={(e) => setLowBoundary(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <p className="font-semibold text-slate-900">
                      Moderate Risk (Urinary Biomarker Retests)
                    </p>
                    <p className="font-bold text-amber-500">
                      {clampedLow}% - {clampedModerate}%
                    </p>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div style={{ width: `${clampedLow}%` }} />
                    <div className="h-full bg-amber-500" style={{ width: `${clampedModerate - clampedLow}%` }} />
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={99}
                    value={moderateBoundary}
                    onChange={(e) => setModerateBoundary(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <p className="font-semibold text-slate-900">
                      High Risk (Nephrology CDSS Immediate Alert)
                    </p>
                    <p className="font-bold text-red-600">{clampedModerate}% - 100%</p>
                  </div>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div style={{ width: `${clampedModerate}%` }} />
                    <div className="h-full bg-red-600" style={{ width: `${100 - clampedModerate}%` }} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {tab === 'Model Configuration' && (
            <Card className="flex flex-col gap-5 p-6">
              <p className="text-[15px] font-bold text-slate-900">Bayesian Inference Engine Configuration</p>
              <div className="flex gap-4">
                <Field label="Primary Classifier Algorithm">
                  <select
                    value={classifier}
                    onChange={(e) => setClassifier(e.target.value)}
                    className={inputClass}
                  >
                    <option>Naive Bayes Classifier (Stable)</option>
                    <option>Bayesian Logistic Regression</option>
                    <option>Gaussian Process Classifier (Beta)</option>
                  </select>
                </Field>
                <Field label="Population Base Rate Prior (p)">
                  <input
                    value={priorRate}
                    onChange={(e) => setPriorRate(e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Credible Interval (CI)">
                  <select
                    value={credibleInterval}
                    onChange={(e) => setCredibleInterval(e.target.value)}
                    className={inputClass}
                  >
                    <option value="90">90% Bayesian Credible Interval</option>
                    <option value="95">95% Bayesian Credible Interval</option>
                    <option value="99">99% Bayesian Credible Interval</option>
                  </select>
                </Field>
              </div>
            </Card>
          )}

          {tab === 'Security & Privacy' && (
            <Card className="flex flex-col gap-5 p-6">
              <p className="text-[15px] font-bold text-slate-900">Security Controls</p>
              <div className="flex gap-8">
                <Field label="Inactivity Session Timeout (minutes)">
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className={inputClass}
                  >
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes (HIPAA Compliant standard)</option>
                    <option value="30">30 minutes</option>
                  </select>
                </Field>
                <div className="flex flex-1 flex-col gap-1.5">
                  <p className="text-xs font-semibold text-slate-600">Two-Factor Authentication (2FA)</p>
                  <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-2.5">
                    <Switch checked={twoFactor} onChange={setTwoFactor} />
                    <span className="text-[13px] font-semibold text-slate-900">
                      {twoFactor ? 'Enforced Institution-Wide' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rounded-md bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                Patient Record Encryption: AES-256 Active Status
              </div>
            </Card>
          )}

          {tab === 'Notifications' && (
            <Card className="flex flex-col gap-4 p-6">
              <p className="text-[15px] font-bold text-slate-900">Notification Preferences</p>
              {[
                {
                  label: 'High Risk Flags Email',
                  desc: 'Instant notification of critical slope drops',
                  checked: emailHighRisk,
                  set: setEmailHighRisk,
                },
                {
                  label: 'Weekly Summary Report',
                  desc: 'Aggregate Bayesian performance charts',
                  checked: weeklySummary,
                  set: setWeeklySummary,
                },
                {
                  label: 'System Maintenance Notices',
                  desc: 'Planned downtime and model retraining windows',
                  checked: maintenanceNotices,
                  set: setMaintenanceNotices,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-md border border-slate-200 p-3"
                >
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">{row.label}</p>
                    <p className="text-[11px] text-slate-400">{row.desc}</p>
                  </div>
                  <Switch checked={row.checked} onChange={row.set} />
                </div>
              ))}
            </Card>
          )}

          {tab === 'Audit Log Settings' && (
            <Card className="flex flex-col gap-5 p-6">
              <p className="text-[15px] font-bold text-slate-900">Audit Log Settings</p>
              <div className="flex gap-4">
                <Field label="Log Retention Period (days)">
                  <select value={retention} onChange={(e) => setRetention(e.target.value)} className={inputClass}>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">365 days (Regulatory default)</option>
                    <option value="2555">7 years</option>
                  </select>
                </Field>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                <div>
                  <p className="text-[13px] font-semibold text-slate-900">Detailed Access Logging</p>
                  <p className="text-[11px] text-slate-400">
                    Record every patient record view alongside model queries
                  </p>
                </div>
                <Switch checked={detailedLogging} onChange={setDetailedLogging} />
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="secondary">Reset to Defaults</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
