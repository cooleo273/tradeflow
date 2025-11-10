"use client"

import { useState } from "react"
import Link from "next/link"

export default function DepositPage() {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [isDragging, setIsDragging] = useState(false)

  const address = "bc1qwwqj29x5hhrwy6360l0megpiq7d4ul5u6pm8x"
  const cryptos = ["BTC", "ETH", "USDT"]

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
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
          <h1 className="text-2xl font-bold">Deposit {selectedCrypto}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Info Banner */}
        <div className="banner-info mb-8">
          <span className="text-xl">ℹ️</span>
          <div>
            <p className="font-medium">How to deposit?</p>
            <a href="#" className="text-primary hover:text-primary/80 text-sm">
              View guide →
            </a>
          </div>
        </div>

        {/* Crypto Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-4">Select Cryptocurrency</label>
          <div className="grid grid-cols-3 gap-4">
            {cryptos.map((crypto) => (
              <button
                key={crypto}
                onClick={() => setSelectedCrypto(crypto)}
                className={`p-4 rounded-lg border-2 font-medium transition-all ${
                  selectedCrypto === crypto
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/50"
                    : "bg-secondary border-border hover:border-primary"
                }`}
              >
                {crypto}
              </button>
            ))}
          </div>
        </div>

        {/* Network Selection */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <label className="block text-sm font-medium mb-3">Network</label>
          <p className="text-foreground">Bitcoin Network</p>
        </div>

        {/* Deposit Address */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <label className="block text-sm font-medium mb-3">Deposit Address</label>
          <div className="flex items-center gap-3 bg-input border border-border rounded-lg p-4">
            <code className="flex-1 text-sm font-mono text-muted-foreground break-all">{address}</code>
            <button
              onClick={copyAddress}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Upload Proof */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <label className="block text-sm font-medium mb-4">Upload Deposit Proof</label>
          <div
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <div className="text-4xl mb-3">📁</div>
            <p className="text-foreground font-medium">Upload Proof</p>
            <p className="text-sm text-muted-foreground mt-1">or drag and drop</p>
            <input id="file-input" type="file" hidden />
          </div>
        </div>

        {/* Warning Banner */}
        <div className="banner-warning mb-8">
          <span className="text-xl">⚠️</span>
          <p>
            Important: Please ensure you are sending {selectedCrypto} on the correct network. Sending assets on
            incorrect networks may result in permanent loss.
          </p>
        </div>

        {/* CTA Button */}
        <button className="w-full btn-primary py-4 text-lg">View My Deposits</button>
      </main>
    </div>
  )
}
