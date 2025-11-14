"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/config"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", email.split("@")[0])
        localStorage.setItem("token", data.accessToken) // Backend returns accessToken
        // Note: user ID is in JWT token payload (sub field), no need to store separately
        router.push("/")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Login failed. Please try again.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-premium">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center font-bold text-3xl shadow-lg">
              T
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">TradeFlow</h1>
          <p className="text-center text-muted-foreground mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">{error}</div>
            )}

            <button type="submit" disabled={loading} className="w-full btn-primary">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            Don't have an account? <a href="/auth/register" className="text-primary hover:text-primary/80">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  )
}
