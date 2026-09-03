import { Eye, EyeOff, HeartPulse } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { currentUser } from '@/data/mockData'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  function handleSignIn() {
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <div className="flex w-full max-w-[460px] flex-col gap-8 rounded-lg bg-white p-10 shadow-[0px_8px_12px_rgba(0,0,0,0.2)]">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600">
            <HeartPulse className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">KidneyRisk CDSS</h1>
          <p className="text-sm text-slate-600">Bayesian Clinical Decision Support System</p>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-slate-600">Institutional Email</span>
            <input
              type="email"
              defaultValue={currentUser.email}
              className="w-full rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="flex items-center justify-between text-[13px] font-semibold">
              <span className="text-slate-600">Password</span>
              <a href="#" className="font-semibold text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </span>
            <span className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3">
              <input
                type={showPassword ? 'text' : 'password'}
                defaultValue="clinicalpass123"
                className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="size-4 text-slate-400" />
                ) : (
                  <Eye className="size-4 text-slate-400" />
                )}
              </button>
            </span>
          </label>

          <label className="flex items-center gap-2 text-[13px] text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 rounded border-slate-300 accent-blue-600"
            />
            Remember my login on this secure device
          </label>
        </div>

        <Button size="lg" className="w-full" onClick={handleSignIn}>
          Secure Sign In
        </Button>

        <div className="flex flex-col gap-4 border-t border-slate-200 pt-4">
          <p className="text-[11px] leading-relaxed text-slate-400">
            Access restricted to authorized clinical staff. All connections, assessments, and
            patient lookup activities are audited under regulatory frameworks.
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
