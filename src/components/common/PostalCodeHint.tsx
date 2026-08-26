import { useEffect, useRef, useState, type ReactNode } from "react"

interface PostalCodeHintProps {
  children: ReactNode
  id: string
  postalCode: string
}

export function PostalCodeHint({ children, id, postalCode }: PostalCodeHintProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const isValid = /^\d{6}$/.test(postalCode)

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener("pointerdown", closeOnOutsideClick)
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick)
  }, [])

  return <div ref={containerRef} className="relative" onFocusCapture={() => setIsOpen(true)}>
    {children}
    {isOpen && <div id={id} role="status" className="absolute z-20 mt-2 w-full rounded-lg border border-primary/20 bg-card p-3 text-xs shadow-lg">
      <p className="font-semibold text-foreground">Cerință pentru codul poștal</p>
      <p className={`mt-1 ${isValid ? "font-semibold text-primary" : "text-muted-foreground"}`}>Codul poștal trebuie să conțină exact 6 cifre.</p>
    </div>}
  </div>
}
