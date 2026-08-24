import { apiClient, setToken, removeToken } from "./apiClient"

// ─── Auth Service ──────────────────────────────────────────────────────────────
// POST /auth/login  → autentifică utilizatorul și salvează token-ul JWT
// POST /auth/register → creează un cont nou

interface LoginResponse {
  token: string
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
  phoneNumber?: string
  departmentId?: number | null
  addressId?: number | null
}

export async function login(credentials: LoginCredentials): Promise<void> {
  const data = await apiClient.post<LoginResponse>("/auth/login", credentials)
  if (!data?.token) {
    throw new Error("Răspuns invalid de la server: lipsă token.")
  }
  setToken(data.token)
}

export async function register(data: RegisterData): Promise<void> {
  const body = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    phoneNumber: data.phoneNumber || "",
    departmentId: data.departmentId ?? null,
    addressId: data.addressId ?? null,
  }
  const response = await apiClient.post<RegisterResponse>("/auth/register", body)
  if (response?.token) {
    setToken(response.token)
  }
}

export function requestPasswordReset(email: string): Promise<void> {
  return apiClient.post<void>("/auth/forgot-password", { email })
}

export function resetForgottenPassword(token: string, newPassword: string): Promise<void> {
  return apiClient.post<void>("/auth/reset-password", { token, newPassword })
}

export function logout(): void {
  removeToken()
}
