import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const links = [
  { to: "/", label: "Home" },
  { to: "/seats", label: "Seats" },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="border-b bg-white px-6 py-4 flex items-center gap-8">
      <span className="font-semibold text-slate-800 text-lg">
        Office Seats
      </span>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "text-sm font-medium transition-colors hover:text-blue-600",
              pathname === link.to
                ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                : "text-slate-500"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
