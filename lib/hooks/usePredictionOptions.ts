"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/config"

export interface PredictionOption {
  id: string
  optionId?: string
  seconds: number
  returnRate: number
  capitalMin: number
  capitalMax: number
  currency: string
  pair?: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export function usePredictionOptions(pair?: string) {
  const [options, setOptions] = useState<PredictionOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const query = pair ? `?pair=${pair}` : ""
        const res = await fetch(`${API_BASE_URL}/prediction-options${query}`)
        if (!res.ok) throw new Error("Failed to fetch prediction options")
        const data: PredictionOption[] = await res.json()
        setOptions(data)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to fetch options"
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [pair])

  return { options, loading, error, setOptions }
}
