import { useEffect, useRef, useState, type ReactNode } from "react"

interface PasswordRequirementsHintProps {
  children: ReactNode
  id: string
  password: string
}

/** Shows password requirements only while the password control is being used. */
export function PasswordRequirementsHint({ children, id, password }: PasswordRequirementsHintProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const requirements = [
    { text: "minimum 8 caractere", isMet: password.length >= 8 },
    { text: "cel puțin o literă", isMet: /[A-Za-z]/.test(password) },
    { text: "cel puțin o cifră", isMet: /\d/.test(password) },
    { text: "cel puțin un simbol", isMet: /[^A-Za-z0-9]/.test(password) },
  ]

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  return (
    <div ref={containerRef} className="relative" onFocusCapture={() => setIsOpen(true)}>
      {children}
      {isOpen && (
        <div
          id={id}
          role="status"
          className="absolute z-20 mt-2 w-full rounded-lg border border-primary/20 bg-card p-3 text-xs leading-relaxed text-muted-foreground shadow-lg"
        >
          <p className="font-semibold text-foreground">Cerințe pentru parolă</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4">
            {requirements.map(({ text, isMet }) => (
              <li key={text} className={isMet ? "font-semibold text-primary" : undefined}>
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
