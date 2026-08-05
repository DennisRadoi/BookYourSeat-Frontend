import { Routes, Route } from "react-router-dom"
import { AppLayout } from "@/layouts/AppLayout"
import HomePage from "@/pages/HomePage"
import SeatsPage from "@/pages/SeatsPage"
import ContPage from "@/pages/ContPage"
import CompanyPage from "@/pages/CompanyPage"
import ColleagueProfilePage from "@/pages/ColleagueProfilePage"
import NotificationsPage from "@/pages/NotificationsPage"
import AnalyticsPage from "@/pages/AnalyticsPage"
import SetariPage from "@/pages/SetariPage"
import Login from "@/pages/Login"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import Register from "@/pages/Register"

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
