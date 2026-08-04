import { Routes, Route } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import HomePage from "@/pages/HomePage"
import SeatsPage from "@/pages/SeatsPage"
import ContPage from "@/pages/ContPage"
import "./App.css"

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-content">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/seats" element={<SeatsPage />} />
            <Route path="/cont" element={<ContPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
