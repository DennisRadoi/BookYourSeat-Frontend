import { Routes, Route, Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import CompanyPage from "@/pages/CompanyPage"
import HomePage from "@/pages/HomePage"
import SeatsPage from "@/pages/SeatsPage"
import NotificationsPage from "@/pages/NotificationsPage"
import Login from "@/pages/Login"
import ForgotPassword from "@/pages/ForgotPassword"
import ResetPassword from "@/pages/ResetPassword"
import "./App.css"
import Register from "./pages/Register"

/** Shell for authenticated app routes: Sidebar + page content via <Outlet /> */
function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Outlet />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/companie" element={<CompanyPage />} />
          <Route path="/seats" element={<SeatsPage />} />
          <Route path="/notificari" element={<NotificationsPage />} />
        </Routes>
      </main>
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

      {/* Authenticated app routes — wrapped in Sidebar layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/seats" element={<SeatsPage />} />
      </Route>
    </Routes>
  )
}
