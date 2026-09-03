import {
  AlertTriangle,
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Settings,
  TestTube2,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { clinicalAlerts } from '@/data/mockData'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  badge?: number
}

const unresolvedAlerts = clinicalAlerts.filter((a) => !a.resolved).length

export const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assessments/new', label: 'New Assessment', icon: TestTube2 },
  { to: '/patients', label: 'Patients', icon: UserRound },
  { to: '/assessments', label: 'Assessments', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: LineChart },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle, badge: unresolvedAlerts },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/help', label: 'Help', icon: HelpCircle },
]

/** The 4 items pinned to the mobile bottom tab bar; a 5th "More" tab opens the drawer with everything else. */
export const mobilePrimaryTabs: (NavItem & { shortLabel: string })[] = [
  { ...navItems[0], shortLabel: 'Dashboard' },
  { ...navItems[1], shortLabel: 'Assess' },
  { ...navItems[2], shortLabel: 'Patients' },
  { ...navItems[5], shortLabel: 'Alerts' },
]

export const mobileMoreItems: NavItem[] = navItems.filter(
  (item) => !mobilePrimaryTabs.some((tab) => tab.to === item.to),
)
