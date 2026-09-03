import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { currentUser } from '@/data/mockData'

const inputClass =
  'w-full rounded-md border border-slate-200 bg-slate-50 p-2.5 text-[13px] text-slate-900 focus:border-blue-500 focus:outline-none'

const readOnlyClass = 'w-full rounded-md bg-slate-100 p-2.5 text-[13px] text-slate-600'

const initials = currentUser.name
  .replace(/^Dr\.\s*/, '')
  .split(' ')
  .map((p) => p[0])
  .join('')
  .slice(0, 2)
  .toUpperCase()

export default function ProfileSettings() {
  const [fullName, setFullName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [phone, setPhone] = useState('+1 (555) 492-3310')
  const [department, setDepartment] = useState('Nephrology (Primary)')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [emailHighRiskFlags, setEmailHighRiskFlags] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)

  const strength =
    newPassword.length === 0 ? 0 : newPassword.length < 8 ? 1 : newPassword.length < 12 ? 2 : 3
  const strengthLabel = ['', 'Weak', 'Good', 'Excellent'][strength]
  const strengthColor = ['bg-slate-200', 'bg-red-500', 'bg-amber-500', 'bg-emerald-600'][strength]

  return (
    <AppShell title="My Clinical Profile" subtitle="Manage your credentials and security tokens">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card className="flex min-w-0 flex-1 flex-col gap-6 p-6">
          <div className="flex items-center gap-5">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-500 text-2xl font-semibold text-white">
              {initials}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="text-[16px] font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-xs text-slate-600">{currentUser.institution} · Dept of Nephrology</p>
              <Button variant="secondary" size="sm" className="w-fit">
                Change Profile Photo
              </Button>
            </div>
          </div>

          <div className="h-px w-full bg-slate-200" />

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-600">Full Name</p>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-600">Institutional Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-600">Phone Number</p>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-600">Department</p>
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-600">Clinical Role (Read-only)</p>
                <p className={readOnlyClass}>Consulting Nephrologist &amp; {currentUser.role}</p>
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-xs font-semibold text-slate-600">Employee ID / NPI</p>
                <p className={readOnlyClass}>NPI-883492810</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </Card>

        <div className="flex w-full flex-col gap-6 lg:w-[420px] lg:shrink-0">
          <Card className="flex flex-col gap-4 p-6">
            <p className="text-[15px] font-bold text-slate-900">Change Secure Password</p>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-600">Current Password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-slate-600">New Password</span>
                <span className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2.5">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new password"
                    className="w-full bg-transparent text-[13px] text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((v) => !v)}
                    aria-label="Toggle password visibility"
                  >
                    {showNewPassword ? (
                      <EyeOff className="size-4 text-slate-400" />
                    ) : (
                      <Eye className="size-4 text-slate-400" />
                    )}
                  </button>
                </span>
              </label>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px]">
                  <p className="text-slate-600">Strength: {strengthLabel || 'Enter a password'}</p>
                  {strength > 0 && <p className="font-bold text-emerald-600">{strengthLabel}</p>}
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${i < strength ? strengthColor : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-4 p-6">
            <p className="text-[15px] font-bold text-slate-900">Audit &amp; Notification Alerts</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-900">High Risk Flags Email</p>
                  <p className="text-[11px] text-slate-400">Instant notification of critical slope drops</p>
                </div>
                <Switch checked={emailHighRiskFlags} onChange={setEmailHighRiskFlags} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-900">Weekly Summary Report</p>
                  <p className="text-[11px] text-slate-400">Aggregate Bayesian performance charts</p>
                </div>
                <Switch checked={weeklySummary} onChange={setWeeklySummary} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
