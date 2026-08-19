import { apiClient, setToken, removeToken } from "./apiClient"

// ─── Auth Service ──────────────────────────────────────────────────────────────
// POST /auth/login  → autentifică utilizatorul și salvează token-ul JWT
// POST /auth/register → creează un cont nou

interface LoginResponse {
  token: string
  // backend-ul poate returna și date despre user; le ignorăm aici
  [key: string]: unknown
}

interface RegisterResponse {
  token?: string
  [key: string]: unknown
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export async function login(credentials: LoginCredentials): Promise<void> {
  const data = await apiClient.post<LoginResponse>("/auth/login", credentials)
  if (!data?.token) {
    throw new Error("Răspuns invalid de la server: lipsă token.")
  }
  setToken(data.token)
}

export async function register(data: RegisterData): Promise<void> {
  const response = await apiClient.post<RegisterResponse>("/auth/register", data)
  // Dacă backend-ul returnează și token la register, îl salvăm direct
  if (response?.token) {
    setToken(response.token)
  }
}

export function logout(): void {
  removeToken()
}
