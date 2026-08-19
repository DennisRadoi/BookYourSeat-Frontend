import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/layouts/AppLayout"
import HomePage from "@/pages/home/HomePage"
import SeatsPage from "@/pages/seats/SeatsPage"
import ContPage from "@/pages/profile/ContPage"
import CompanyPage from "@/pages/company/CompanyPage"
import ColleagueProfilePage from "@/pages/colleague-profile/ColleagueProfilePage"
import NotificationsPage from "@/pages/notifications/NotificationsPage"
import AnalyticsPage from "@/pages/analytics/AnalyticsPage"
import SetariPage from "@/pages/settings/SetariPage"
import Login from "@/pages/login/Login"
import ForgotPassword from "@/pages/forgot-password/ForgotPassword"
import ResetPassword from "@/pages/reset-password/ResetPassword"
import Register from "@/pages/register/Register"
import OnboardingPage from "@/pages/onboarding/OnboardingPage"

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Authenticated layout routes */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/seats" element={<SeatsPage />} />
        <Route path="/cont" element={<ContPage />} />
        <Route path="/companie" element={<CompanyPage />} />
        <Route path="/companie/:colleagueId" element={<ColleagueProfilePage />} />
        <Route path="/notificari" element={<NotificationsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/setari" element={<SetariPage />} />
      </Route>
    </Routes>
  )
}
