"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/config"

export default function Header() {
  const [userInitials, setUserInitials] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const computeInitials = () => {
      const userName = localStorage.getItem("userName")
      const userEmail = localStorage.getItem("userEmail")

      let source = userName || ""
      if (!source && userEmail) {
        // take the part before @ as a fallback
        source = userEmail.split("@")[0]
      }

      if (source) {
        const parts = source.split(/[._\- ]+/).filter(Boolean)
        const initials = parts.map(p => p.charAt(0).toUpperCase()).slice(0, 2).join("")
        setUserInitials(initials)
      } else {
        setUserInitials("G") // preserve an unobtrusive default
      }
    }

    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true")
      setUserRole(localStorage.getItem("userRole") || "")
    }

    computeInitials()
    checkAuth()

    // Listen for other tabs updating auth info
    const onStorage = (e: StorageEvent) => {
      if (e.key === "userName" || e.key === "userEmail" || e.key === "isAuthenticated" || e.key === "userRole") {
        computeInitials()
        checkAuth()
      }
    }

    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear localStorage regardless
      localStorage.removeItem("isAuthenticated")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      localStorage.removeItem("userRole")
      window.location.href = "/auth/login"
    }
  }

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
              T
            </div>
            <span className="font-bold text-xl hidden sm:inline">TradeFlow</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Markets
            </a>
            {userRole === "ADMIN" && (
              <Link href="/admin" className="text-red-400 hover:text-red-300 transition-colors font-medium">
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden lg:inline">Welcome to TradeFlow platform</span>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <span className="text-lg text-muted-foreground hover:text-foreground">🔔</span>
          </button>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors text-sm font-medium"
            >
              Logout
            </button>
          )}
          <Link href="/profile">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center cursor-pointer font-bold text-sm shadow-lg hover:shadow-lg hover:shadow-primary/30 transition-all">
              {userInitials}
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
