"use client"

import { useCallback, useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/config"
import { getUserId } from "@/lib/auth"

export interface UserProfile {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  role?: string
  forceLossEnabled?: boolean
}

interface UseUserProfileResult {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserProfile(autoFetch: boolean = true): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const userId = getUserId()

      if (!token || !userId) {
        setError("Missing credentials")
        setProfile(null)
        setLoading(false)
        return
      }

      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`)
      }

      const data = await response.json()
      setProfile(data)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load profile"
      setError(message)
      console.error("User profile fetch error:", message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!autoFetch) return
    fetchProfile()
  }, [autoFetch, fetchProfile])

  return { profile, loading, error, refetch: fetchProfile }
}
