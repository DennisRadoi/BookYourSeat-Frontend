import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Star, Monitor, Bell, CheckCircle2, Users, CloudRain, Repeat, Moon, User } from "lucide-react"

const notificationsData = [
  {
    id: 1,
    type: "favorite",
    icon: Star,
    text: "Ruxandra B. (favorit) a rezervat Loc 15, Etaj 1",
    time: "acum 12 min",
    isUnread: true,
  },
  {
    id: 2,
    type: "freed",
    icon: Monitor,
    text: "Locul 9, Parter s-a eliberat - era pe lista ta de asteptare",
    time: "acum 40 min",
    isUnread: true,
  },
  {
    id: 3,
    type: "invite",
    icon: Bell,
    text: "Ai fost invitat de George B. la birou, joi 30 iulie.",
    time: "acum 2 ore",
    isUnread: true,
  },
  {
    id: 4,
    type: "confirmed",
    icon: CheckCircle2,
    text: "Rezervarea ta pentru Loc 14, Etaj 1 a fost confirmata",
    time: "ieri, 18:02",
    isUnread: false,
  },
  {
    id: 5,
    type: "team",
    icon: Users,
    text: "Denis R. s-a alaturat echipei tale de favoriti.",
    time: "ieri, 11:20",
    isUnread: false,
  },
  {
    id: 6,
    type: "weather",
    icon: CloudRain,
    text: "Trafic intens pe ruta ta de dimineata - pleaca cu 15 min mai devreme",
    time: "ieri, 7:20",
    isUnread: false,
  },
  {
    id: 7,
    type: "recurring",
    icon: Repeat,
    text: "Rezervarea ta recurenta pentru Etaj 2 a fost creata automat.",
    time: "2 zile",
    isUnread: false,
  },
  {
    id: 8,
    type: "canceled",
    icon: Bell,
    text: "Anna H. a anulat rezervarea pentru Loc 3, Parter",
    time: "2 zile",
    isUnread: false,
  },
  {
    id: 9,
    type: "verified",
    icon: CheckCircle2,
    text: "Contul tau a fost verificat cu succes",
    time: "3 zile",
    isUnread: false,
  },
]

export default function NotificationsPage() {
  const totalNotifications = notificationsData.length
  const unreadCount = notificationsData.filter((n) => n.isUnread).length

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header Pagina */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-slate-800 mb-1 uppercase tracking-wide">
            NOTIFICARI
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Echipa/colegi actualizari recente
          </p>
        </div>
        
        {/* Optiuni Header Dreapta */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm border-slate-200">
            <Moon size={18} className="text-slate-700" />
          </Button>
          
          <Button variant="outline" size="icon" className="rounded-full shadow-sm border-slate-200 relative">
            <Bell size={18} className="text-slate-700" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] p-0 flex items-center justify-center text-[10px]"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full bg-teal-100 hover:bg-teal-200 shadow-sm">
            <User size={18} className="text-teal-800" />
          </Button>
        </div>
      </div>

      {/* Lista Notificari */}
      <Card className="border-none shadow-md overflow-hidden bg-white rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white py-4 px-6 space-y-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              {totalNotifications} notificari
            </CardTitle>
            <span className="text-sm font-medium text-slate-500">
              {unreadCount} necitite
            </span>
          </div>
          
          <Button variant="link" className="text-teal-600 hover:text-teal-800 p-0 h-auto font-medium text-sm">
            Marcheaza toate ca citite
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col">
          {notificationsData.map((notif) => {
            const Icon = notif.icon
            return (
              <div
                key={notif.id}
                className={cn(
                  "flex items-center justify-between px-6 py-4 border-b border-slate-50 last:border-0 transition-colors",
                  notif.isUnread ? "bg-[#F2FCFA]" : "bg-white"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-100/60 text-teal-600 shrink-0">
                    <Icon size={18} strokeWidth={2.5} />
                  </div>
                  
                  <div className="w-4 flex justify-center shrink-0">
                    {notif.isUnread && (
                      <div className="w-2 h-2 rounded-full bg-teal-500 shadow-sm" />
                    )}
                  </div>
                  
                  <p className="text-[13px] md:text-sm text-slate-700 font-medium leading-tight">
                    {notif.text}
                  </p>
                </div>
                
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap pl-4">
                  {notif.time}
                </span>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}