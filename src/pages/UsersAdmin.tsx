import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Switch } from '@/components/ui/Switch'
import { users as initialUsers } from '@/data/mockData'
import type { UserAccount } from '@/types'
import { cn } from '@/lib/utils'

const roleStyles: Record<UserAccount['role'], string> = {
  Administrator: 'bg-red-100 text-red-600',
  Physician: 'bg-blue-100 text-blue-600',
  Nurse: 'bg-emerald-100 text-emerald-700',
  Researcher: 'bg-amber-100 text-amber-600',
}

const roles: UserAccount['role'][] = ['Administrator', 'Physician', 'Nurse', 'Researcher']

const permissionMatrix: { action: string; access: string; tone: string }[] = [
  { action: 'Access Patients Data', access: 'Clinician / Admin', tone: 'text-emerald-600' },
  { action: 'Override Bayesian Priors', access: 'Physician Only', tone: 'text-emerald-600' },
  { action: 'Modify Risk Thresholds', access: 'Admin Only', tone: 'text-red-600' },
  { action: 'Export De-identified Cohorts', access: 'Researcher / Admin', tone: 'text-amber-600' },
]

let nextId = initialUsers.length + 1

export default function UsersAdmin() {
  const [users, setUsers] = useState<UserAccount[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserAccount['role']>('all')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<UserAccount['role']>('Physician')
  const [inviteDept, setInviteDept] = useState('')

  function toggleStatus(id: string) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u)),
    )
  }

  function sendInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) return
    setUsers((prev) => [
      ...prev,
      {
        id: `u${nextId++}`,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        department: inviteDept.trim() || 'Unassigned',
        status: 'Pending',
        lastActive: 'Never',
      },
    ])
    setInviteName('')
    setInviteEmail('')
    setInviteDept('')
    setInviteRole('Physician')
    setInviteOpen(false)
  }

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <AppShell title="Users & Access Control" subtitle="CDSS Security · Audit Logs Compliant">
      <div className="flex items-start gap-6">
        <Card className="flex min-w-0 flex-1 flex-col gap-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-[16px] font-bold text-slate-900">Registered Clinical Users</p>
              <p className="text-xs text-slate-600">
                Currently authorized to access patient records and risk algorithms.
              </p>
            </div>
            <Button size="sm" onClick={() => setInviteOpen((v) => !v)}>
              <Plus className="size-3.5" />
              Add User
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
              <Search className="size-3.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name or email..."
                className="w-full text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="rounded-md border border-slate-200 px-3 py-2 text-[13px] text-slate-900 focus:outline-none"
            >
              <option value="all">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex w-full flex-col overflow-x-auto">
            <div className="flex min-w-[640px] border-b border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-600">
              <p className="flex-1">User Name &amp; Email</p>
              <p className="w-[100px]">Role</p>
              <p className="w-[110px]">Department</p>
              <p className="w-[60px]">Status</p>
              <p className="w-[95px]">Last Active</p>
              <p className="w-[60px]">Actions</p>
            </div>
            {filtered.map((user) => (
              <div
                key={user.id}
                className="flex min-w-[640px] items-center border-b border-slate-200 p-3 last:border-b-0"
              >
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                </div>
                <div className="w-[100px]">
                  <span className={cn('rounded-full px-2 py-1 text-[11px] font-bold', roleStyles[user.role])}>
                    {user.role}
                  </span>
                </div>
                <p className="w-[110px] text-[13px] text-slate-600">{user.department}</p>
                <div className="w-[60px]">
                  {user.status === 'Pending' ? (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-600">
                      Pending
                    </span>
                  ) : (
                    <Switch checked={user.status === 'Active'} onChange={() => toggleStatus(user.id)} />
                  )}
                </div>
                <p className="w-[95px] text-xs text-slate-600">{user.lastActive}</p>
                <button className="w-[60px] text-left text-[13px] font-semibold text-blue-600 hover:underline">
                  Manage
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="p-6 text-center text-sm text-slate-400">No users match this filter.</p>
            )}
          </div>
        </Card>

        <div className="flex w-[380px] shrink-0 flex-col gap-6">
          <Card className="flex flex-col gap-4 p-6">
            <p className="text-[15px] font-bold text-slate-900">Permission Matrix Preview</p>
            <p className="text-xs leading-relaxed text-slate-600">
              Institutional policies restrict operations by role to comply with HIPAA.
            </p>
            <div className="flex flex-col gap-3">
              {permissionMatrix.map((row) => (
                <div
                  key={row.action}
                  className="flex items-center justify-between rounded-md bg-slate-50 p-2.5"
                >
                  <p className="text-xs font-semibold text-slate-900">{row.action}</p>
                  <p className={cn('text-[11px] font-bold', row.tone)}>{row.access}</p>
                </div>
              ))}
            </div>
          </Card>

          {inviteOpen && (
            <Card className="flex flex-col gap-4 border-blue-600 bg-blue-50 p-5">
              <div className="flex items-center justify-between text-blue-600">
                <p className="text-sm font-bold">Draft: Invite Clinician</p>
                <p className="text-[11px]">Pending Approval</p>
              </div>
              <div className="flex flex-col gap-2.5">
                <input
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-md border border-slate-200 bg-white p-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <input
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-md border border-slate-200 bg-white p-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <input
                  value={inviteDept}
                  onChange={(e) => setInviteDept(e.target.value)}
                  placeholder="Department"
                  className="w-full rounded-md border border-slate-200 bg-white p-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserAccount['role'])}
                  className="w-full rounded-md border border-slate-200 bg-white p-2 text-[13px] text-slate-900 focus:outline-none"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={sendInvite}>
                  Send Invite
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  )
}
