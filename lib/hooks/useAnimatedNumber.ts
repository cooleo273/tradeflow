"use client"

import { useEffect, useRef, useState } from "react"

export function useAnimatedNumber(target: number, duration = 600) {
  const [value, setValue] = useState(target)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const startValRef = useRef(target)

  useEffect(() => {
    // If target is same as current value, do nothing
    if (value === target) return

    startRef.current = null
    startValRef.current = value

    function step(now: number) {
      if (!startRef.current) startRef.current = now
      const elapsed = now - startRef.current
      const progress = Math.min(1, elapsed / duration)
      const newVal = startValRef.current + (target - startValRef.current) * progress
      setValue(newVal)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // we intentionally do not add `value` to deps, it is read from ref
  }, [target, duration])

  return Math.round(value * 100) / 100
}
