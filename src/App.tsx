import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import NewAssessment from '@/pages/NewAssessment'
import PredictionResult from '@/pages/PredictionResult'
import PatientsList from '@/pages/PatientsList'
import PatientProfile from '@/pages/PatientProfile'
import HistoryTrends from '@/pages/HistoryTrends'
import AllAssessments from '@/pages/AllAssessments'
import ReportsAnalytics from '@/pages/ReportsAnalytics'
import ModelPerformance from '@/pages/ModelPerformance'
import ClinicalAlerts from '@/pages/ClinicalAlerts'
import UsersAdmin from '@/pages/UsersAdmin'
import Settings from '@/pages/Settings'
import ProfileSettings from '@/pages/ProfileSettings'
import HelpFaq from '@/pages/HelpFaq'
import PrintableReport from '@/pages/PrintableReport'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessments/new" element={<NewAssessment />} />
      <Route path="/assessments/:id/result" element={<PredictionResult />} />
      <Route path="/assessments" element={<AllAssessments />} />
      <Route path="/patients" element={<PatientsList />} />
      <Route path="/patients/:id" element={<PatientProfile />} />
      <Route path="/history" element={<HistoryTrends />} />
      <Route path="/reports" element={<ReportsAnalytics />} />
      <Route path="/reports/:id/print" element={<PrintableReport />} />
      <Route path="/model-performance" element={<ModelPerformance />} />
      <Route path="/alerts" element={<ClinicalAlerts />} />
      <Route path="/admin/users" element={<UsersAdmin />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/profile" element={<ProfileSettings />} />
      <Route path="/help" element={<HelpFaq />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
