"use client"

import { useState } from "react"
import Header from "@/components/header"
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react"

export default function TradingPage() {
  const [selectedPrediction, setSelectedPrediction] = useState<"up" | "down" | null>(null)
  const [inProgressTab, setInProgressTab] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Price Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">BTC/USDT</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">102,863.78</span>
              <span className="text-green-400">+1.10%</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 mt-4 md:mt-0">
            <div>
              <span>Low</span>
              <span className="ml-2 font-semibold text-green-400">99,260.86</span>
            </div>
            <div>
              <span>High</span>
              <span className="ml-2 font-semibold text-green-400">102,989.26</span>
            </div>
            <div>
              <span>Close</span>
              <span className="ml-2 font-semibold">0.00</span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8 h-96 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Candlestick chart visualization</p>
          </div>
        </div>

        {/* Prediction Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setSelectedPrediction("up")}
            className={`flex items-center justify-center gap-2 py-4 px-6 font-bold rounded-lg transition-all ${
              selectedPrediction === "up"
                ? "bg-green-500 text-white scale-105"
                : "bg-green-500/30 text-green-400 hover:bg-green-500/50"
            }`}
          >
            <TrendingUp className="w-6 h-6" />
            Up
          </button>
          <button
            onClick={() => setSelectedPrediction("down")}
            className={`flex items-center justify-center gap-2 py-4 px-6 font-bold rounded-lg transition-all ${
              selectedPrediction === "down"
                ? "bg-red-500 text-white scale-105"
                : "bg-red-500/30 text-red-400 hover:bg-red-500/50"
            }`}
          >
            <TrendingDown className="w-6 h-6" />
            Down
          </button>
        </div>

        {/* Orders Tabs */}
        <div className="space-y-4">
          <div className="flex gap-8 border-b border-slate-700">
            <button
              onClick={() => setInProgressTab(true)}
              className={`py-3 font-medium transition-colors relative ${
                inProgressTab ? "text-cyan-400" : "text-muted-foreground"
              } ${inProgressTab ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-cyan-400" : ""}`}
            >
              In Progress
            </button>
            <button
              onClick={() => setInProgressTab(false)}
              className={`py-3 font-medium transition-colors ${
                !inProgressTab ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Has Ended
            </button>
          </div>

          <div className="text-center py-8 text-muted-foreground">No In Progress Orders</div>
        </div>
      </main>
    </div>
  )
}
