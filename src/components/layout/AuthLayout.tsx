import type { ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-navy-900 to-navy-950 px-4 py-16">
      {children}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-wrap items-center justify-center gap-6 px-4 sm:left-10 sm:translate-x-0">
        <p className="text-xs text-slate-400">Version 2.4.1 (Stable Build)</p>
        <div className="hidden h-4 w-px bg-white/20 sm:block" />
        <div className="flex items-center gap-2">
          <span className="rounded border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-bold text-white">
            HIPAA COMPLIANT
          </span>
          <span className="rounded border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-bold text-white">
            ISO 27001 SECURE
          </span>
        </div>
      </div>
    </div>
  )
}
