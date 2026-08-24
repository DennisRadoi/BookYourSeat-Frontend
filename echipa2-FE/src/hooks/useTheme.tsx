import React, { createContext, useContext, useEffect, useState } from "react"

type ThemeContextType = {
  isDark: boolean
  toggle: () => void
  setDark: () => void
  setLight: () => void
  resetToLight: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    try {
      const stored = localStorage.getItem("theme")
      if (stored === "dark") return true
      if (stored === "light") return false
    } catch (e) {
      // ignore storage errors
    }
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      try {
        localStorage.setItem("theme", "dark")
      } catch (e) {}
    } else {
      root.classList.remove("dark")
      try {
        localStorage.setItem("theme", "light")
      } catch (e) {}
    }
  }, [isDark])

  useEffect(() => {
    // respond to system changes only when user has not set an explicit preference
    if (typeof window === "undefined") return
    try {
      const stored = localStorage.getItem("theme")
      if (stored) return
    } catch (e) {
      // ignore
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = (e: MediaQueryListEvent) => {
      try {
        const stored = localStorage.getItem("theme")
        if (stored) return
      } catch (e) {}
      setIsDark(e.matches)
    }
    if (mq.addEventListener) mq.addEventListener("change", listener)
    else mq.addListener(listener)
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", listener)
      else mq.removeListener(listener)
    }
  }, [])

  const toggle = () => setIsDark((v) => !v)
  const setDark = () => setIsDark(true)
  const setLight = () => setIsDark(false)
  const resetToLight = () => setIsDark(false)

  return (
    <ThemeContext.Provider value={{ isDark, toggle, setDark, setLight, resetToLight }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
