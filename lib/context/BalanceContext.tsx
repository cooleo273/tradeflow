"use client"

import React, { createContext, useCallback, useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/config"
import { getUserId } from "@/lib/auth"

interface BalanceData {
  balance: number
  currency: string
}

interface BalanceContextValue {
  balanceData: BalanceData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const BalanceContext = createContext<BalanceContextValue | null>(null)

export function BalanceProvider({ children, refreshInterval = 5000 }: React.PropsWithChildren<{ refreshInterval?: number }>) {
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const userId = getUserId()

      if (!userId) {
        setError("User ID not found")
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error(`Failed to fetch balance: ${response.statusText}`)

      const data = await response.json()
      if (Array.isArray(data) && data.length > 0) {
        setBalanceData(data[0])
        setError(null)
      } else if (data && typeof data === "object" && "balance" in data) {
        setBalanceData(data as BalanceData)
        setError(null)
      } else {
        throw new Error("Invalid balance data format")
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch balance"
      setError(msg)
      console.error("Balance fetch error:", msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBalance()
    const intervalId = setInterval(fetchBalance, refreshInterval)
    return () => clearInterval(intervalId)
  }, [fetchBalance, refreshInterval])

  const value: BalanceContextValue = {
    balanceData,
    loading,
    error,
    refetch: fetchBalance,
  }

  return <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
}
