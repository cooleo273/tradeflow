"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/config"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })

      if (response.ok) {
        // Registration successful - navigate to login
        router.push("/auth/login")
      } else {
        const err = await response.json()
        setError(err.message || "Registration failed")
      }
    } catch (err) {
      setError("Registration failed. Please check your connection.")
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

          <h1 className="text-3xl font-bold text-center mb-2">Create an account</h1>
          <p className="text-center text-muted-foreground mb-8">Sign up to TradeFlow</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="John"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
                placeholder="Doe"
                required
              />
            </div>

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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            Already have an account? <a href="/auth/login" className="text-primary">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  )
}
