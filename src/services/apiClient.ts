// ─── API Client ────────────────────────────────────────────────────────────────
// Wrapper centralizat peste fetch.
// - Injectează automat Authorization: Bearer <token> din localStorage
// - Aruncă ApiError pentru orice răspuns non-2xx

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8081"

const TOKEN_KEY = "auth_token"

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Prepend /api ONLY for bookings and recurring-bookings endpoints
  const needsApiPrefix = path.startsWith("/bookings") || path.startsWith("/recurring-bookings")
  const finalUrl = needsApiPrefix
    ? `${BASE_URL.replace(/\/api$/, "")}/api${path}`
    : `${BASE_URL.replace(/\/api$/, "")}${path}`

  const response = await fetch(finalUrl, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    let message = `HTTP ${response.status}`
    try {
      const data = await response.json()
      message = data?.message ?? data?.error ?? message
    } catch {
      // ignorăm erorile de parsare JSON
    }

    // Token expirat sau invalid → delogăm și redirectăm la login
    if (response.status === 401 || (response.status === 403 && path === "/users/me")) {
      localStorage.removeItem(TOKEN_KEY)
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
        window.location.href = "/login"
      }
    }

    throw new ApiError(response.status, message)
  }


  // Răspuns fără body (ex: 204 No Content)
  const text = await response.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return text as T
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
}
