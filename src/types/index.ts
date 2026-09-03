export type RiskLevel = 'low' | 'moderate' | 'high'

export interface Patient {
  id: string
  name: string
  mrn: string
  age: number
  sex: 'Male' | 'Female'
  dob: string
  lastCheckedAt: string
  latestEgfr: number
  riskLevel: RiskLevel
  riskScore: number
  primaryPhysician: string
  conditions: string[]
  phone?: string
  email?: string
  address?: string
}

export interface EgfrReading {
  date: string
  egfr: number
}

export interface Assessment {
  id: string
  patientId: string
  patientName: string
  mrn: string
  date: string
  riskLevel: RiskLevel
  riskScore: number
  egfr: number
  status: 'Completed' | 'Pending Review' | 'Draft'
  clinician: string
}

export interface ClinicalAlert {
  id: string
  patientName: string
  mrn: string
  severity: RiskLevel
  message: string
  timeAgo: string
  resolved: boolean
}

export interface UserAccount {
  id: string
  name: string
  email: string
  role: 'Administrator' | 'Physician' | 'Nurse' | 'Researcher'
  department: string
  status: 'Active' | 'Inactive' | 'Pending'
  lastActive: string
}

export interface TrendPoint {
  month: string
  low: number
  moderate: number
  high: number
}
