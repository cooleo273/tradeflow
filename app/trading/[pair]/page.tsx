"use client"

import { useState, useEffect, useRef } from "react"
import Header from "@/components/header"
import Link from "next/link"
import TradeModal from "@/components/trade-modal"
import { useParams } from "next/navigation"

interface PriceData {
  symbol: string
  price: number
  change: number
  high: number
  low: number
  open: number
  close: number
  volume: number
}

async function fetchPriceData(pairId: string): Promise<PriceData | null> {
  try {
    const cryptoMap: Record<string, string> = {
      btc: "bitcoin",
      eth: "ethereum",
      ltc: "litecoin",
      dot: "polkadot",
    }

    const cryptoId = cryptoMap[pairId] || pairId
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&market_data=true&community_data=false&developer_data=false`,
    )

    if (!response.ok) throw new Error("Failed to fetch data")

    const data = await response.json()
    const marketData = data.market_data

    return {
      symbol: `${data.symbol.toUpperCase()}/USDT`,
      price: marketData.current_price.usd,
      change: marketData.price_change_percentage_24h || 0,
      high: marketData.high_24h.usd,
      low: marketData.low_24h.usd,
      open: marketData.current_price.usd * (1 - marketData.price_change_percentage_24h / 100),
      close: marketData.current_price.usd,
      volume: marketData.total_volume.usd || 0,
    }
  } catch (error) {
    console.log("[v0] Failed to fetch crypto data:", error)
    return null
  }
}

function TradingViewChart({ pair }: { pair: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true

    script.onload = () => {
      const window_obj = window as any
      if (window_obj.TradingView) {
        const symbolMap: Record<string, string> = {
          btc: "BTCUSD",
          eth: "ETHUSD",
          ltc: "LTCUSD",
          dot: "DOTUSD",
        }

        const symbol = symbolMap[pair.toLowerCase()] || "BTCUSD"

        new window_obj.TradingView.widget({
          autosize: true,
          symbol: `COINBASE:${symbol}`,
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: "tradingview-widget",
          hide_side_toolbar: false,
          withdateranges: true,
        })
      }
    }

    container.appendChild(script)
  }, [pair])

  return (
    <div
      ref={containerRef}
      id="tradingview-widget"
      className="w-full rounded-xl overflow-hidden border border-border/50"
      style={{ minHeight: "700px", height: "700px" }}
    />
  )
}

export default function TradingPage() {
  const params = useParams()
  const pair = params?.pair as string
  const [selectedPrediction, setSelectedPrediction] = useState<"up" | "down" | null>(null)
  const [inProgressTab, setInProgressTab] = useState(true)
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await fetchPriceData(pair)
      if (data) {
        setPriceData(data)
      }
      setLoading(false)
    }

    fetchData()

    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [pair])

  const displayData = priceData || {
    symbol: pair?.toUpperCase() || "UNKNOWN",
    price: 102863.78,
    change: 1.1,
    high: 102989.26,
    low: 99260.86,
    open: 101798.79,
    close: 102863.78,
    volume: 0,
  }

  const handlePrediction = (prediction: "up" | "down") => {
    setSelectedPrediction(prediction)
    setShowTradeModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium hover:translate-x-1 duration-200"
        >
          ← Back to Markets
        </Link>

        <div className="card-premium mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Current Price</p>
              <h1 className="text-5xl font-bold mb-4">{displayData.symbol}</h1>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">
                  ${displayData.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                    displayData.change >= 0
                      ? "bg-accent/20 text-accent border border-accent/50"
                      : "bg-destructive/20 text-destructive border border-destructive/50"
                  }`}
                >
                  {displayData.change >= 0 ? "↑" : "↓"} {Math.abs(displayData.change).toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">24h Low</p>
                <p className="text-2xl font-bold text-primary">
                  ${displayData.low.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">24h High</p>
                <p className="text-2xl font-bold text-primary">
                  ${displayData.high.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">Open</p>
                <p className="text-2xl font-bold">
                  ${displayData.open.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Advanced Candlestick Chart</h2>
            <p className="text-sm text-muted-foreground">Real-time price data visualization from TradingView</p>
          </div>
          <div style={{ height: "700px", width: "100%" }}>
            <TradingViewChart pair={pair} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => handlePrediction("up")}
            className={`flex items-center justify-center gap-3 py-8 px-6 font-bold text-xl rounded-xl transition-all transform duration-200 ${
              selectedPrediction === "up"
                ? "bg-accent text-background scale-105 shadow-xl shadow-accent/30"
                : "bg-accent/10 text-accent hover:bg-accent/20 border border-accent/50 hover:border-accent hover:shadow-lg hover:shadow-accent/20"
            }`}
          >
            ↑ UP
          </button>
          <button
            onClick={() => handlePrediction("down")}
            className={`flex items-center justify-center gap-3 py-8 px-6 font-bold text-xl rounded-xl transition-all transform duration-200 ${
              selectedPrediction === "down"
                ? "bg-destructive text-background scale-105 shadow-xl shadow-destructive/30"
                : "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/50 hover:border-destructive hover:shadow-lg hover:shadow-destructive/20"
            }`}
          >
            ↓ DOWN
          </button>
        </div>

        <div className="card-premium">
          <div className="flex gap-8 mb-6 border-b border-border/30">
            <button
              onClick={() => setInProgressTab(true)}
              className={`pb-4 font-semibold text-sm uppercase tracking-wider transition-all relative ${
                inProgressTab
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-primary after:to-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setInProgressTab(false)}
              className={`pb-4 font-semibold text-sm uppercase tracking-wider transition-all relative ${
                !inProgressTab
                  ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-primary after:to-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed
            </button>
          </div>

          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {inProgressTab ? "No active orders" : "No completed orders"}
            </p>
          </div>
        </div>
      </main>

      {showTradeModal && selectedPrediction && (
        <TradeModal
          pair={{
            id: pair,
            symbol: displayData.symbol,
            price: displayData.price,
            change: displayData.change,
            icon: "",
            color: "",
          }}
          isOpen={showTradeModal}
          onClose={() => setShowTradeModal(false)}
        />
      )}
    </div>
  )
}
