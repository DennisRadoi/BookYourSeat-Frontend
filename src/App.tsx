import { Routes, Route } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import HomePage from "@/pages/HomePage"
import SeatsPage from "@/pages/SeatsPage"
import NotificationsPage from "@/pages/NotificationsPage"
import "./App.css"

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seats" element={<SeatsPage />} />
          <Route path="/notificari" element={<NotificationsPage />} />
        </Routes>
      </main>
    </div>
  )
}
