"use client"

import { useState } from "react"
import { CreditCard, WalletIcon, TrendingUp, ArrowDownUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import AnimatedPrice from "@/components/animated-price"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const BALANCES = [
  { symbol: "USDC", balance: 2500.0, value: "$2,500.00", change: 0 },
  { symbol: "ETH", balance: 1.25, value: "$2,931.25", change: 2.5 },
  { symbol: "BTC", balance: 0.05, value: "$2,350.00", change: -1.2 },
]

const MARKET_TRADES = [
  { symbol: "BTC/USDC", price: 47000, change24h: 3.2, high: 48500, low: 45200 },
  { symbol: "ETH/USDC", price: 2345.5, change24h: 2.5, high: 2450, low: 2200 },
  { symbol: "SOL/USDC", price: 145.3, change24h: -0.8, high: 152, low: 142 },
]

interface CexInterfaceProps {
  walletAddress: string
}

export default function CexInterface({ walletAddress }: CexInterfaceProps) {
  const [activeTab, setActiveTab] = useState<"balances" | "trade" | "markets">("balances")
  const [selectedMarket, setSelectedMarket] = useState("BTC/USDC")
  const [orderType, setOrderType] = useState<"limit" | "market">("market")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")

  const totalBalance = BALANCES.reduce((acc, b) => acc + Number.parseFloat(b.value.slice(1)), 0)

  const handlePlaceOrder = () => {
    if (process.env.NODE_ENV === "development") console.log("[v0] Order placed:", { market: selectedMarket, type: orderType, quantity, price })
  }

  return (
    <div className="space-y-6">
      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Balance</div>
          <div className="text-2xl font-bold">${totalBalance.toFixed(2)}</div>
          <div className="text-xs text-accent mt-2">+$145.30 (2.4%)</div>
        </Card>
        <Card className="border-border bg-card p-4">
          <div className="text-sm text-muted-foreground mb-1">Available</div>
          <div className="text-2xl font-bold">${(totalBalance * 0.95).toFixed(2)}</div>
        </Card>
        <Card className="border-border bg-card p-4">
          <div className="text-sm text-muted-foreground mb-1">On Order</div>
          <div className="text-2xl font-bold">${(totalBalance * 0.05).toFixed(2)}</div>
        </Card>
        <Card className="border-border bg-card p-4">
          <div className="text-sm text-muted-foreground mb-1">KYC Status</div>
          <div className="text-lg font-bold text-accent">Verified</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balances & Markets */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Card className="border-border bg-card p-4">
            <div className="flex gap-2 mb-4 border-b border-border">
              {(["balances", "trade", "markets"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Balances Tab */}
            {activeTab === "balances" && (
              <div className="space-y-3">
                {BALANCES.map((balance) => (
                  <div key={balance.symbol} className="flex items-center justify-between p-3 bg-secondary rounded-2xl">
                    <div>
                      <div className="font-semibold">{balance.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {balance.balance} {balance.symbol}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{balance.value}</div>
                      <div className={`text-sm ${balance.change >= 0 ? "text-accent" : "text-destructive"}`}>
                        {balance.change >= 0 ? "+" : ""}
                        {balance.change}%
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-3 grid grid-cols-2 gap-2">
                  <Button variant="outline" className="border-border bg-transparent">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Deposit
                  </Button>
                  <Button variant="outline" className="border-border bg-transparent">
                    <WalletIcon className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                </div>
              </div>
            )}

            {/* Markets Tab */}
            {activeTab === "markets" && (
              <div className="space-y-3">
                {MARKET_TRADES.map((market) => (
                  <div
                    key={market.symbol}
                    onClick={() => {
                      setSelectedMarket(market.symbol)
                      setActiveTab("trade")
                    }}
                    className="p-4 bg-secondary rounded-2xl border border-border hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold">{market.symbol}</div>
                      <div
                        className={`text-sm font-medium ${market.change24h >= 0 ? "text-accent" : "text-destructive"}`}
                      >
                        {market.change24h >= 0 ? "+" : ""}
                        {market.change24h}%
                      </div>
                    </div>
                      <div className="text-lg font-bold"><AnimatedPrice value={market.price} decimals={2} /></div>
                    <div className="text-xs text-muted-foreground mt-2">
                      H: ${market.high.toFixed(2)} L: ${market.low.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Trade Tab */}
            {activeTab === "trade" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Market</label>
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-2xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {MARKET_TRADES.map((m) => (
                      <option key={m.symbol} value={m.symbol}>
                        {m.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Order Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["market", "limit"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderType(type)}
                        className={`px-3 py-2 rounded-2xl font-medium transition-all ${
                          orderType === type
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary border border-border hover:border-primary"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {orderType === "limit" && (
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Price</label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="bg-secondary border-border"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Quantity</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                    className="bg-secondary border-border"
                  />
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-10 font-semibold"
                >
                  <ArrowDownUp className="h-4 w-4 mr-2" />
                  Place Order
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="border-border bg-card p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <div className="p-4 bg-secondary rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-semibold">Deposit Funds</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Add funds to your account</p>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                  Deposit
                </Button>
              </div>

              <div className="p-4 bg-secondary rounded-2xl border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-semibold">View Charts</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Advanced trading charts</p>
                <Button size="sm" variant="outline" className="w-full border-border bg-transparent">
                  Charts
                </Button>
              </div>

              <div className="p-4 bg-secondary rounded-2xl border border-border">
                <div className="text-xs text-muted-foreground mb-2">Trading Limits</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Daily:</span>
                    <span className="text-xs font-semibold">$10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Monthly:</span>
                    <span className="text-xs font-semibold">$100,000</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
