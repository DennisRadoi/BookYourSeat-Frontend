import { Routes, Route } from "react-router-dom"
import Navbar from "@/components/Navbar"
import HomePage from "@/pages/HomePage"
import SeatsPage from "@/pages/SeatsPage"

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seats" element={<SeatsPage />} />
        </Routes>
      </main>
    </div>
  )
}
