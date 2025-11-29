"use client"

import { useState, useEffect, useCallback, useContext } from "react"
import { API_BASE_URL } from "@/lib/config"
import { getUserId } from "@/lib/auth"
import { BalanceContext } from "@/lib/context/BalanceContext"

interface BalanceData {
  balance: number
  currency: string
}

export function useBalance(refreshInterval: number = 5000) {
  // Prefer shared context if available to avoid duplicate polling/fetches
  const context = useContext(BalanceContext)
  if (context) {
    return context
  }
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

      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`)
      }

      const data = await response.json()
      
      // The endpoint returns an array, get the first item
      if (Array.isArray(data) && data.length > 0) {
        setBalanceData(data[0])
        setError(null)
      } else if (data && typeof data === "object" && "balance" in data) {
        // Handle case where response is a single object
        setBalanceData(data as BalanceData)
        setError(null)
      } else {
        throw new Error("Invalid balance data format")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch balance"
      setError(errorMessage)
      console.error("Balance fetch error:", errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch balance immediately on mount
    fetchBalance()

    // Set up periodic refresh
    const interval = setInterval(fetchBalance, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchBalance, refreshInterval])

  return { balanceData, loading, error, refetch: fetchBalance }
}
