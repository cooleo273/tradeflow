"use client"

import Link from "next/link"

interface TradingPair {
  id: string
  symbol: string
  price: number
  change: number
  icon: string
  color: string
  iconClass: string
}

const tradingPairs: TradingPair[] = [
  {
    id: "btc",
    symbol: "BTC/USDT",
    price: 102863.78,
    change: 1.1,
    icon: "₿",
    color: "bg-orange-500",
    iconClass: "crypto-icon-btc",
  },
  {
    id: "eth",
    symbol: "ETH/USDT",
    price: 2345.5,
    change: 2.5,
    icon: "Ξ",
    color: "bg-blue-500",
    iconClass: "crypto-icon-eth",
  },
  {
    id: "ltc",
    symbol: "LTC/USDT",
    price: 185.32,
    change: 0.8,
    icon: "Ł",
    color: "bg-gray-400",
    iconClass: "crypto-icon-ltc",
  },
  {
    id: "dot",
    symbol: "DOT/USDT",
    price: 7.45,
    change: 1.5,
    icon: "●",
    color: "bg-pink-500",
    iconClass: "crypto-icon-dot",
  },
]

export default function TradingPairs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {tradingPairs.map((pair) => (
        <Link
          key={pair.id}
          href={`/trading/${pair.id}`}
          className="group card-premium hover:border-primary/50 cursor-pointer"
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

          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">${pair.price.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Current Price</p>
            </div>
            <div className={`flex items-center gap-1 badge-success`}>
              <span>↑</span>
              <span>+{pair.change.toFixed(2)}%</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
