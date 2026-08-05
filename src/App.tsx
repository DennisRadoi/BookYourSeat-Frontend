import { useState } from "react"
import { Routes, Route, Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import HomePage from "@/pages/HomePage"
import SeatsPage from "@/pages/SeatsPage"
import ContPage from "@/pages/ContPage"
import CompanyPage from "@/pages/CompanyPage"
import NotificationsPage from "@/pages/NotificationsPage"
import AnalyticsPage from "@/pages/AnalyticsPage"
import SetariPage from "@/pages/SetariPage"
import Login from "@/pages/Login"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import Register from "@/pages/Register"
import "./App.css"

/** Shell for authenticated app routes: Sidebar + Navbar + page content via <Outlet /> */
function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="app-content">
        <Navbar onBurgerClick={() => setMobileOpen(true)} />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public routes — no Sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Authenticated app routes — wrapped in Sidebar + Navbar layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/seats" element={<SeatsPage />} />
        <Route path="/cont" element={<ContPage />} />
        <Route path="/companie" element={<CompanyPage />} />
        <Route path="/notificari" element={<NotificationsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/setari" element={<SetariPage />} />
      </Route>
    </Routes>
  )
}
