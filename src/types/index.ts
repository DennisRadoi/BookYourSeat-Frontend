
export type ReservationStatus = "confirmed" | "pending" | "completed" | "cancelled"
export type SeatArea = "window" | "quiet" | "team" | "open"
export type SeatType = "standard" | "standing" | "phone-booth"
export type Weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

export interface UserPreferences {
  preferredFloor: number
  preferredArea: SeatArea
  preferredStartTime: string
  preferredDays: Weekday[]
  workPreferences: string[]
}

export interface User {
  id: number
  firstName: string
  lastName: string
  initials: string
  email: string
  role: string
  department: string
  isOnline: boolean
  avatarUrl: string | null
  domiciliu?: string
  preferences: UserPreferences
}

export interface Seat {
  id: number
  code: string
  area: SeatArea
  type: SeatType
  hasMonitor: boolean
  isAvailable: boolean
}

export interface Floor {
  id: number
  number: number
  name: string
  seats: Seat[]
}

export interface Building {
  id: number
  name: string
  code: string
  address: string
  city: string
  floors: Floor[]
}

export interface Location {
  id: number
  name: string
  address: string
  city: string
  building: string
  floors: Floor[]
}

export interface Reservation {
  id: number
  userId: number
  locationId: number
  floorId: number
  seatId: number
  date: string       
  startTime: string 
  endTime: string   
  status: ReservationStatus
  createdAt: string 
}

export interface ReservationLocation {
  id: number
  name: string
  address: string
  building: string
}

export interface ReservationFloor {
  id: number
  number: number
  name: string
}

export interface ReservationSeat {
  id: number
  code: string
  area: SeatArea
  type: SeatType
}

export interface DetailedReservation extends Reservation {
  location: ReservationLocation | null
  floor: ReservationFloor | null
  seat: ReservationSeat | null
}

export interface Colleague {
  id: number
  initials: string
  name: string
  role: string
  color: string
  floor: string
  status: "La birou" | "Remote"
  isFavorite: boolean
  department?: string
}

export type NotificationType =
  | "favorite"
  | "freed"
  | "invite"
  | "confirmed"
  | "team"
  | "weather"
  | "recurring"
  | "canceled"
  | "verified"

export interface Notification {
  id: number
  type: NotificationType
  text: string
  time: string
  isUnread: boolean
}

export interface UserSettings {
  autoReserve: boolean
  notificationsEnabled: boolean
  defaultStartTime: string
  defaultEndTime: string
  preferredFloor: number
  preferredArea: SeatArea
  preferredDays: Weekday[]
}


export interface DepartureInsight {
  time: string
  minutesToLeave: number
  durationMin: number
  distanceKm: number
  trafficLevel: "Scăzut" | "Moderat" | "Ridicat"
  originAddress?: string
  destinationAddress?: string
  routeVia?: string
}

export interface WeatherInsight {
  temp: number
  condition: string
  humidity: number
  windKmh: number
  rainChance: number
  city: string
}

export interface TrafficAlert {
  id: string
  type: "warning" | "danger"
  location: string
  detail: string
}

export interface SeatRecommendation {
  colleagueName: string
  seat: string
  floor: string
}

export interface HistoryInsight {
  topFloor: string
  topArea: string
  reservationsThisMonth: number
}

export interface AIInsightsData {
  departure: DepartureInsight
  weather: WeatherInsight
  trafficAlerts: TrafficAlert[]
  seatRec: SeatRecommendation
  history: HistoryInsight
}
