"use client"

import { useState } from "react"
import Link from "next/link"
import { API_BASE_URL } from "@/lib/config"
import { getUserId } from "@/lib/auth"

export default function WithdrawPage() {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const networkDefaults: Record<string, string> = {
    BTC: "BTC",
    ETH: "ERC20",
    USDT: "TRC20",
  }
  const [amount, setAmount] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const cryptoOptions = ["BTC", "ETH", "USDT"]
  const selectedNetwork = networkDefaults[selectedCrypto] || "USDT"

  const handleWithdraw = async () => {
    if (!amount || !withdrawAddress) {
      setError("Please enter amount and address")
      setSuccess("")
      return
    }
    const parsedAmount = parseFloat(amount)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than zero")
      setSuccess("")
      return
    }
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const token = localStorage.getItem("token")
      const userId = getUserId()
      if (!token || !userId) {
        setError("Please log in again to withdraw")
        return
      }
      const response = await fetch(`${API_BASE_URL}/withdrawals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          amount: parsedAmount,
          currency: selectedCrypto,
          asset: selectedCrypto,
          address: withdrawAddress,
          network: selectedNetwork?.toUpperCase(),
        }),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const message = errorData?.message || "Failed to submit withdrawal"
        setError(message)
        return
      }
      setSuccess("Withdrawal request submitted successfully")
      setAmount("")
      setWithdrawAddress("")
    } catch (err) {
      console.error("Failed to submit withdrawal", err)
      setError("Failed to submit withdrawal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold">Withdraw {selectedCrypto}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Info Banner */}
        <div className="banner-info mb-8">
          <span className="text-xl">ℹ️</span>
          <p>Enter your withdrawal address and amount. You will receive your funds within 24-48 hours.</p>
        </div>

        {/* Cryptocurrency Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-4">Select Cryptocurrency</label>
          <div className="grid grid-cols-3 gap-4">
            {cryptoOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedCrypto(option)}
                className={`p-4 rounded-2xl border-2 font-medium transition-all ${selectedCrypto === option
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/50"
                    : "bg-secondary border-border hover:border-primary"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawal Amount */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <label className="block text-sm font-medium mb-3">Withdrawal Amount</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="flex-1 bg-input border border-border rounded-2xl px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
            <span className="flex items-center px-4 py-3 bg-secondary border border-border rounded-2xl font-medium">
              {selectedCrypto}
            </span>
          </div>
        </div>

        {/* Withdrawal Address */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <label className="block text-sm font-medium mb-3">Withdrawal Address</label>
          <input
            type="text"
            value={withdrawAddress}
            onChange={(e) => setWithdrawAddress(e.target.value)}
            placeholder="Enter your wallet address"
            className="w-full bg-input border border-border rounded-2xl px-4 py-3 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Fee Info */}
        <div className="bg-secondary border border-border rounded-2xl p-4 mb-8 grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Network Fee</p>
            <p className="text-lg font-semibold">0.0005 {selectedCrypto}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">You Will Receive</p>
            <p className="text-lg font-semibold text-accent">
              {amount || "0"} {selectedCrypto}
            </p>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="banner-warning mb-8">
          <span className="text-xl">⚠️</span>
          <p>
            Double-check the withdrawal address before confirming. We cannot recover funds sent to incorrect addresses.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-2xl text-sm mb-4">{error}</div>
        )}
        {!error && success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-2xl text-sm mb-4">{success}</div>
        )}

        {/* CTA Button */}
        <button onClick={handleWithdraw} disabled={loading} className="w-full btn-success py-4 text-lg">
          {loading ? "Processing..." : "Confirm Withdrawal"}
        </button>
      </main>
    </div>
  )
}
