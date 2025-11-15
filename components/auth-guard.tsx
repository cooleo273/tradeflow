"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/config"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token")
      const storedAuth = localStorage.getItem("isAuthenticated") === "true"

      if (!token || !storedAuth) {
        setIsAuthenticated(false)
        setIsLoading(false)
        if (pathname !== "/auth/login" && pathname !== "/auth/register") {
          router.push("/auth/login")
        }
        return
      }

      // Verify token with backend
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          console.log("/auth/verify response", userData)
          setIsAuthenticated(true)
          // Store user role for admin access
          const role = userData.role || userData.user?.role
          if (role) {
            localStorage.setItem("userRole", role)
          }
        } else {
          // Token invalid, clear storage
          localStorage.removeItem("isAuthenticated")
          localStorage.removeItem("userEmail")
          localStorage.removeItem("userName")
          localStorage.removeItem("token")
          localStorage.removeItem("userId")
          setIsAuthenticated(false)
          if (pathname !== "/auth/login" && pathname !== "/auth/register") {
            router.push("/auth/login")
          }
        }
      } catch (error) {
        console.error("Auth verification failed:", error)
        // On network error, allow access if token exists (offline mode)
        setIsAuthenticated(true)
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/auth/login" && pathname !== "/auth/register") {
    return null
  }

  return <>{children}</>
}
