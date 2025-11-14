"use client"

import { useState } from "react"
import Header from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import Hero from "@/components/hero"
import TradingPairs from "@/components/trading-pairs"

export default function Home() {
  const [activeTab, setActiveTab] = useState("cryptos")

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="max-w-7xl mx-auto">
          <Hero />

          <div className="px-4 md:px-6 py-12">
            <div className="flex gap-6 mb-8 border-b border-border/50">
              <button
                onClick={() => setActiveTab("cryptos")}
                className={`pb-3 font-semibold text-lg transition-all relative ${
                  activeTab === "cryptos"
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-primary after:to-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cryptocurrencies
              </button>
              <button
                onClick={() => setActiveTab("futures")}
                className={`pb-3 font-semibold text-lg transition-all relative ${
                  activeTab === "futures"
                    ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-primary after:to-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Binary Options
              </button>
            </div>

            {activeTab === "cryptos" && <TradingPairs />}
            {activeTab === "futures" && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">Binary options trading coming soon</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
