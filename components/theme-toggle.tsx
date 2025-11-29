"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const PALETTES = [
  { id: "ocean", label: "Ocean" },
  { id: "neon", label: "Neon" },
  { id: "gold", label: "Gold" },
  { id: "midnight", label: "Midnight" },
  { id: "system", label: "System" },
]

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const current = theme === "system" ? systemTheme : theme

  return (
    <div className="flex items-center gap-2">
      <label className="sr-only">Theme</label>
      <select
        value={theme || "ocean"}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-background border border-border rounded-2xl px-2 py-1 text-sm"
      >
        {PALETTES.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ThemeToggle
