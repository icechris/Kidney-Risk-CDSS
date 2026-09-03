import {
  AlertTriangle,
  BarChart3,
  HeartPulse,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Settings,
  TestTube2,
  UserRound,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { currentUser, clinicalAlerts } from '@/data/mockData'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assessments/new', label: 'New Assessment', icon: TestTube2 },
  { to: '/patients', label: 'Patients', icon: UserRound },
  { to: '/assessments', label: 'Assessments', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: LineChart },
  {
    to: '/alerts',
    label: 'Alerts',
    icon: AlertTriangle,
    badge: clinicalAlerts.filter((a) => !a.resolved).length,
  },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help', icon: HelpCircle },
]

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col gap-6 self-stretch bg-navy-900 p-5">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-blue-600">
            <HeartPulse className="size-4 text-white" />
          </div>
          <p className="text-lg font-bold text-white">KidneyRisk CDSS</p>
        </div>
        <p className="text-[10px] font-medium uppercase text-slate-400">Bayesian Risk Platform</p>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white',
                isActive && 'bg-blue-600 font-semibold text-white hover:bg-blue-600',
              )
            }
          >
            <span className="flex items-center gap-3">
              <item.icon className="size-4" />
              {item.label}
            </span>
            {!!item.badge && (
              <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-1 flex-col justify-end">
        <NavLink
          to="/settings/profile"
          className="flex items-center gap-2.5 rounded-lg bg-white/5 p-3 hover:bg-white/10"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
            SJ
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <p className="truncate text-[13px] font-semibold text-white">{currentUser.name}</p>
            <p className="truncate text-[10px] text-slate-400">{currentUser.institution}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
