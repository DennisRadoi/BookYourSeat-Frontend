import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Office Seat Booking
      </h1>
      <p className="text-slate-500 mb-8">
        Reserve your spot in the office for the day.
      </p>

      {/* shadcn/ui example: Card + Button + Badge */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Today's availability</CardTitle>
            <Badge variant="secondary">12 / 20 free</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-slate-500">
            Pick a seat from the map and book it with your name.
          </p>
          <Button onClick={() => navigate("/seats")}>
            View seat map
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
