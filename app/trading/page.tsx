"use client"

import { useState, useEffect, useRef } from "react"
import AnimatedPrice from "@/components/animated-price"
import Header from "@/components/header"
import TradeModal from "@/components/trade-modal"
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react"
import OrdersList from "@/components/orders-list"
import { fetchCryptoPrice } from "@/lib/price-service"

export default function TradingPage() {
  const [selectedPrediction, setSelectedPrediction] = useState<"up" | "down" | null>(null)
  const [inProgressTab, setInProgressTab] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [direction, setDirection] = useState<"up" | "down">("up")
  const [price, setPrice] = useState(98000) // Updated fallback price
  const [high, setHigh] = useState<number | null>(null)
  const [low, setLow] = useState<number | null>(null)
  const [close, setClose] = useState<number | null>(null)
  const [previousPrice, setPreviousPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const initialLoadedRef = useRef(false)

  const pair = { symbol: "BTC/USDT", price }

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        if (!initialLoadedRef.current) setLoading(true)
        const data = await fetchCryptoPrice("btc")
        setPrice(prev => {
          setPreviousPrice(prev)
          return data.price
        })
        setHigh(data.high ?? null)
        setLow(data.low ?? null)
        setClose(data.close ?? null)
      } catch (error) {
        console.error("Failed to fetch BTC price:", error)
      } finally {
        setLoading(false)
        initialLoadedRef.current = true
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 30000)

    return () => clearInterval(interval)
  }, [])

  const priceChange = previousPrice ? ((price - previousPrice) / previousPrice) * 100 : 0

  const handlePrediction = (dir: "up" | "down") => {
    setDirection(dir)
    setSelectedPrediction(dir)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Price Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">BTC/USDT</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold">{loading ? "Loading..." : <AnimatedPrice value={price} decimals={2} />}</span>
              {!loading && <span className={priceChange >= 0 ? "text-green-400" : "text-red-400"}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
              </span>}
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 mt-4 md:mt-0">
            <div>
              <span>Low</span>
              <span className="ml-2 font-semibold text-green-400">{low ? low.toLocaleString() : "—"}</span>
            </div>
            <div>
              <span>High</span>
              <span className="ml-2 font-semibold text-green-400">{high ? high.toLocaleString() : "—"}</span>
            </div>
            <div>
              <span>Close</span>
              <span className="ml-2 font-semibold">{close ? close.toLocaleString() : "—"}</span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 h-96 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Candlestick chart visualization</p>
          </div>
        </div>

        {/* Prediction Buttons (smaller) */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => handlePrediction("up")}
            className={`flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold rounded-xl transition-all ${
              selectedPrediction === "up"
                ? "bg-green-500 text-white"
                : "bg-green-500/30 text-green-400 hover:bg-green-500/50"
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Up
          </button>
          <button
            onClick={() => handlePrediction("down")}
            className={`flex items-center justify-center gap-2 py-2 px-4 text-sm font-semibold rounded-xl transition-all ${
              selectedPrediction === "down"
                ? "bg-red-500 text-white"
                : "bg-red-500/30 text-red-400 hover:bg-red-500/50"
            }`}
          >
            <TrendingDown className="w-5 h-5" />
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

          <div className="py-4">
            {inProgressTab ? <OrdersList /> : <OrdersList showCompleted />}
          </div>
        </div>
      </main>

      <TradeModal
        pair={pair}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        direction={direction}
      />
    </div>
  )
}
