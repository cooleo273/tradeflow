"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import AnimatedPrice from "@/components/animated-price"
import { fetchMultiplePrices, PriceData } from "@/lib/price-service"

interface TradingPair {
  id: string
  symbol: string
  price: number
  change: number
  icon: string
  color: string
  iconClass: string
}

const initialPairs: TradingPair[] = [
  {
    id: "btc",
    symbol: "BTC/USDT",
    price: 98000, // Updated fallback price
    change: 0,
    icon: "₿",
    color: "bg-orange-500",
    iconClass: "crypto-icon-btc",
  },
  {
    id: "eth",
    symbol: "ETH/USDT",
    price: 3500, // Updated fallback price
    change: 0,
    icon: "Ξ",
    color: "bg-blue-500",
    iconClass: "crypto-icon-eth",
  },
  {
    id: "sol",
    symbol: "SOL/USDT",
    price: 180,
    change: 0,
    icon: "◎",
    color: "bg-purple-500",
    iconClass: "crypto-icon-sol",
  },
  {
    id: "bnb",
    symbol: "BNB/USDT",
    price: 580,
    change: 0,
    icon: "🟡",
    color: "bg-yellow-500",
    iconClass: "crypto-icon-bnb",
  },
  {
    id: "ada",
    symbol: "ADA/USDT",
    price: 0.8,
    change: 0,
    icon: "₳",
    color: "bg-blue-400",
    iconClass: "crypto-icon-ada",
  },
  {
    id: "xrp",
    symbol: "XRP/USDT",
    price: 1.2,
    change: 0,
    icon: "✕",
    color: "bg-gray-500",
    iconClass: "crypto-icon-xrp",
  },
  {
    id: "doge",
    symbol: "DOGE/USDT",
    price: 0.3,
    change: 0,
    icon: "🐕",
    color: "bg-orange-400",
    iconClass: "crypto-icon-doge",
  },
  {
    id: "dot",
    symbol: "DOT/USDT",
    price: 12,
    change: 0,
    icon: "●",
    color: "bg-pink-500",
    iconClass: "crypto-icon-dot",
  },
  {
    id: "avax",
    symbol: "AVAX/USDT",
    price: 35,
    change: 0,
    icon: "🔺",
    color: "bg-red-500",
    iconClass: "crypto-icon-avax",
  },
  {
    id: "matic",
    symbol: "MATIC/USDT",
    price: 1.8,
    change: 0,
    icon: "⬡",
    color: "bg-purple-400",
    iconClass: "crypto-icon-matic",
  },
  {
    id: "link",
    symbol: "LINK/USDT",
    price: 15,
    change: 0,
    icon: "🔗",
    color: "bg-blue-600",
    iconClass: "crypto-icon-link",
  },
  {
    id: "uni",
    symbol: "UNI/USDT",
    price: 8,
    change: 0,
    icon: "🦄",
    color: "bg-pink-400",
    iconClass: "crypto-icon-uni",
  },
  {
    id: "aave",
    symbol: "AAVE/USDT",
    price: 180,
    change: 0,
    icon: "🏛️",
    color: "bg-indigo-500",
    iconClass: "crypto-icon-aave",
  },
  {
    id: "ltc",
    symbol: "LTC/USDT",
    price: 140,
    change: 0,
    icon: "Ł",
    color: "bg-gray-400",
    iconClass: "crypto-icon-ltc",
  },
]

export default function TradingPairs() {
  const [pairs, setPairs] = useState<TradingPair[]>([])
  const [loading, setLoading] = useState(true)
  const initialLoadedRef = useRef(false)

  useEffect(() => {
    const fetchAllPrices = async () => {
      try {
        // Only show skeleton the first time. On subsequent polls we just update prices
        if (!initialLoadedRef.current) setLoading(true)
        const priceData = await fetchMultiplePrices(initialPairs.map(p => p.id))
        const updatedPairs = initialPairs.map(pair => ({
          ...pair,
          price: priceData[pair.id].price,
          change: priceData[pair.id].change,
        }))
        setPairs(updatedPairs)
        initialLoadedRef.current = true
      } catch (error) {
        console.error("Failed to fetch prices:", error)
        // Keep existing prices if fetch fails
      } finally {
        setLoading(false)
      }
    }

    fetchAllPrices()

    const interval = setInterval(fetchAllPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {initialPairs.map((pair) => (
          <div key={pair.id} className="card-premium animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-full"></div>
                <div>
                  <div className="h-4 bg-secondary rounded w-20 mb-2"></div>
                  <div className="h-3 bg-secondary rounded w-16"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="h-6 bg-secondary rounded w-24 mb-2"></div>
              <div className="h-4 bg-secondary rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {pairs.map((pair) => (
        <Link
          key={pair.id}
          href={`/trading/${pair.id}`}
          className="group card-premium hover:border-primary/50 cursor-pointer w-full block"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`crypto-icon ${pair.iconClass}`}>{pair.icon}</div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">{pair.symbol}</h3>
                <p className="text-sm text-muted-foreground">Trading Pair</p>
              </div>
            </div>
            <span className="text-muted-foreground group-hover:text-primary transition-all transform group-hover:translate-x-1">
              →
            </span>
          </div>

          <div className="flex items-end justify-between w-full">
              <div>
              <AnimatedPrice value={pair.price} decimals={pair.price < 1 ? 4 : 2} />
              <p className="text-sm text-muted-foreground mt-1">Current Price</p>
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
              pair.change >= 0
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <span>{pair.change >= 0 ? '↑' : '↓'}</span>
              <span>{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
