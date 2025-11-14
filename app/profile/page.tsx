"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/config"

export default function ProfilePage() {
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") || "user@example.com" : "user@example.com"
  const userName = userEmail.split("@")[0]

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")
        const response = await fetch(`${API_BASE_URL}/transactions?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const transactions = await response.json()
          // Assuming BUY increases balance, SELL decreases
          const bal = transactions.reduce((sum: number, tx: any) => {
            return tx.transactionType === "BUY" ? sum + tx.amount : sum - tx.amount
          }, 0)
          setBalance(bal)
        }
      } catch (err) {
        console.error("Failed to fetch balance")
      } finally {
        setLoading(false)
      }
    }
    fetchBalance()
  }, [])

  const menuItems = [
    { label: "Top-up Rewards", icon: "🎁" },
    { label: "Real Name Authentication", icon: "🛡️" },
    { label: "Billing History", icon: "⏱️" },
    { label: "Second Contract Order", icon: "📋" },
    { label: "Liquidity Pool Order", icon: "💧" },
    { label: "Change Password", icon: "🔐" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
              T
            </div>
            <span className="font-bold text-xl hidden sm:inline">TradeFlow</span>
          </div>
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
            Back to Trading
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-4xl shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{userName}</h1>
            <p className="text-muted-foreground">{userEmail}</p>
          </div>
        </div>

        {/* Account Balance Card */}
        <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/10 border border-blue-400/30 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Account Balance</p>
              <h2 className="text-4xl font-bold text-blue-300">
                {loading ? "Loading..." : `$${balance.toFixed(2)} USDT`}
              </h2>
            </div>
            <div className="flex gap-3">
              <Link href="/deposit">
                <button className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors font-medium">
                  Deposit
                </button>
              </Link>
              <Link href="/withdraw">
                <button className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors font-medium">
                  Withdraw
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid gap-3 max-w-2xl mx-auto">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:bg-secondary transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">→</span>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="max-w-2xl mx-auto mt-8">
          <button
            onClick={() => {
              localStorage.removeItem("isAuthenticated")
              localStorage.removeItem("userEmail")
              localStorage.removeItem("userName")
              localStorage.removeItem("token")
              localStorage.removeItem("userId")
              window.location.href = "/auth/login"
            }}
            className="w-full btn-danger"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  )
}
