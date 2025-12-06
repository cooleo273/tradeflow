"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { API_BASE_URL } from "@/lib/config"
import ThemeToggle from "@/components/theme-toggle"
import { Bell } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import IconButton from "@/components/ui/icon-button"

export default function Header() {
  const [userInitials, setUserInitials] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState("")
  const pathname = usePathname()

  const navLinks = useMemo(
    () => [
      { label: "Home", href: "/" },
      { label: "News", href: "/news" },
    ],
    []
  )

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
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050914]/95 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#AB77FF] to-[#FF66C4] flex items-center justify-center text-xl font-black tracking-tight">
            U
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-lg">Uniswap</span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-white/50">Trade Network</span>
          </div>
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-center gap-10 text-sm font-medium">
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 transition-colors ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all ${
                    isActive ? "w-full bg-white" : "w-0 bg-transparent"
                  }`}
                />
              </Link>
            )
          })}
          {userRole === "ADMIN" && (
            <Link
              href="/admin"
              className={`relative pb-1 transition-colors ${
                pathname?.startsWith("/admin") ? "text-white" : "text-rose-200/70 hover:text-rose-100"
              }`}
            >
              Admin
              <span
                className={`absolute left-0 -bottom-1 h-[2px] rounded-full transition-all ${
                  pathname?.startsWith("/admin") ? "w-full bg-rose-300" : "w-0"
                }`}
              />
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 ml-auto">
          <p className="hidden lg:block text-xs tracking-[0.3em] uppercase text-white/45">
            Welcome to the Uniswap platform
          </p>
          <IconButton aria-label="Notifications" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white">
            <Bell className="h-4 w-4" />
          </IconButton>
          <ThemeToggle />
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="hidden md:inline px-3 py-2 rounded-full border border-white/15 text-xs font-semibold tracking-wide hover:border-white/40"
            >
              Logout
            </button>
          )}
          <Link href="/profile">
            <Avatar className="ring-1 ring-white/10 bg-white/10 text-white">{userInitials}</Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
