"use client"

import React, { useEffect, useRef, useState } from "react"
import { useAnimatedNumber } from "@/lib/hooks/useAnimatedNumber"

export default function AnimatedPrice({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const animatedValue = useAnimatedNumber(value, 600)
  const [previous, setPrevious] = useState(value)
  const [trendClass, setTrendClass] = useState("")
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (value > previous) setTrendClass("text-emerald-400")
    else if (value < previous) setTrendClass("text-red-400")
    else setTrendClass("")

    setPrevious(value)

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    // Remove the color after 700ms
    timeoutRef.current = window.setTimeout(() => setTrendClass("") , 700)

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [value])

  // Format with locale thousand separators
  const formatted = animatedValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

  return <span className={`text-2xl font-bold ${trendClass}`}>${formatted}</span>
}
