"use client"

import { useState } from "react"
import { ArrowUpDown, Zap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const TOKENS = [
  { symbol: "ETH", name: "Ethereum", price: 2345.5, change24h: 2.5 },
  { symbol: "USDC", name: "USD Coin", price: 1.0, change24h: 0.1 },
  { symbol: "DAI", name: "Dai", price: 1.0, change24h: 0.05 },
  { symbol: "MATIC", name: "Polygon", price: 0.62, change24h: -1.2 },
]

const POOLS = [
  { pair: "ETH/USDC", liquidity: "$2.5M", volume24h: "$450K", fee: "0.30%" },
  { pair: "DAI/USDC", liquidity: "$1.8M", volume24h: "$320K", fee: "0.05%" },
  { pair: "MATIC/USDC", liquidity: "$1.2M", volume24h: "$210K", fee: "0.30%" },
]

interface DexInterfaceProps {
  walletAddress: string
}

export default function DexInterface({ walletAddress }: DexInterfaceProps) {
  const [fromToken, setFromToken] = useState("ETH")
  const [toToken, setToToken] = useState("USDC")
  const [fromAmount, setFromAmount] = useState("1")
  const [toAmount, setToAmount] = useState("2345.50")
  const [showPrice, setShowPrice] = useState(true)
  const [isSwapping, setIsSwapping] = useState(false)

  const handleSwap = async () => {
    setIsSwapping(true)
    if (process.env.NODE_ENV === "development") console.log("[v0] Swap initiated:", { from: fromToken, to: toToken, amount: fromAmount })
    // Simulate swap
    setTimeout(() => {
      setIsSwapping(false)
      if (process.env.NODE_ENV === "development") console.log("[v0] Swap completed")
    }, 2000)
  }

  const switchTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Swap Panel */}
      <div className="lg:col-span-2">
        <Card className="border-border bg-card p-6">
          <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>

          {/* From Token */}
          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-2 block">From</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-secondary border-border text-foreground"
              />
                <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-2xl text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {TOKENS.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Balance: 10.5 {fromToken}</div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={switchTokens}
                className="p-2 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors border border-border"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>

          {/* To Token */}
          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block">To</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={toAmount}
                onChange={(e) => setToAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-secondary border-border text-foreground"
                disabled
              />
                <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                  className="px-4 py-2 bg-secondary border border-border rounded-2xl text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {TOKENS.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Balance: 500.00 {toToken}</div>
          </div>

          {/* Swap Details */}
          <div className="space-y-2 mb-6 p-3 bg-secondary rounded-2xl text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Price Impact</span>
              <span>0.12%</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Liquidity Provider Fee</span>
              <span>0.69 USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span>
                1 {fromToken} = {(Number.parseFloat(toAmount) / Number.parseFloat(fromAmount) || 0).toFixed(2)}{" "}
                {toToken}
              </span>
            </div>
          </div>

          <Button
            onClick={handleSwap}
            disabled={isSwapping || !fromAmount}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-10 font-semibold"
          >
            {isSwapping ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-transparent border-t-accent-foreground rounded-full animate-spin" />
                Swapping...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Zap className="h-4 w-4" />
                Swap
              </span>
            )}
          </Button>
        </Card>
      </div>

      {/* Liquidity Pools */}
      <div>
        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Liquidity Pools</h3>
            <Button size="sm" variant="outline" className="border-border bg-transparent">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {POOLS.map((pool) => (
              <div
                key={pool.pair}
                  className="p-3 bg-secondary rounded-2xl border border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="font-semibold text-sm mb-2">{pool.pair}</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Liquidity:</span>
                    <span>{pool.liquidity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Vol:</span>
                    <span>{pool.volume24h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee Tier:</span>
                    <span>{pool.fee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 border-border bg-transparent">
            View All Pools
          </Button>
        </Card>
      </div>
    </div>
  )
}
