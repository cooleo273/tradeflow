"use client"

import { X } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { usePredictionOptions } from "@/lib/hooks/usePredictionOptions"
import { API_BASE_URL } from "@/lib/config"
import { getUserId } from "@/lib/auth"
import { useOrders } from "@/lib/context/OrdersContext"
import { useBalance } from "@/lib/hooks/useBalance"
import type { UserProfile } from "@/lib/hooks/useUserProfile"

interface TradeModalProps {
  pair: { symbol: string; price: number }
  isOpen: boolean
  onClose: () => void
  direction: "up" | "down"
  userProfile?: UserProfile | null
}

export default function TradeModal({ pair, isOpen, onClose, direction, userProfile }: TradeModalProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isLeverage, setIsLeverage] = useState(false)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [amountError, setAmountError] = useState<string | null>(null)

  const { addOrder, refetch } = useOrders()
  const { balanceData } = useBalance(5000)
  const pairId = pair?.symbol?.split("/")[0]?.toLowerCase()
  const { options: predictionOptions } = usePredictionOptions(pairId)
  const forceLossActive = Boolean(userProfile?.forceLossEnabled)
  const orderDirection = direction === "up" ? "UP" : "DOWN"

  useEffect(() => {
    if (!selectedOptionId && predictionOptions && predictionOptions.length > 0) {
      const first = predictionOptions[0]
      setSelectedOptionId(first.optionId || first.id)
    }
  }, [predictionOptions, selectedOptionId])

  const selectedOption = predictionOptions?.find((option) => (option.optionId || option.id) === selectedOptionId)

  const parsedAmount = useMemo(() => {
    const value = parseFloat(amount)
    return Number.isFinite(value) ? value : NaN
  }, [amount])

  const expectedLoss = useMemo(() => {
    if (!forceLossActive || !selectedOption || !Number.isFinite(parsedAmount)) return null
    return (parsedAmount * selectedOption.returnRate) / 100
  }, [forceLossActive, parsedAmount, selectedOption])

  useEffect(() => {
    if (!selectedOption || !amount) {
      setAmountError(null)
      return
    }
    const parsedAmt = parseFloat(amount)
    if (isNaN(parsedAmt)) {
      setAmountError("Enter a valid amount")
      return
    }
    if (parsedAmt < selectedOption.capitalMin || parsedAmt > selectedOption.capitalMax) {
      setAmountError(`Amount must be between ${selectedOption.capitalMin} and ${selectedOption.capitalMax}`)
      return
    }
    setAmountError(null)
  }, [amount, selectedOption])

  const handleConfirm = async () => {
    if (!selectedOptionId || !selectedOption) {
      alert("Please select a trade duration option")
      return
    }
    if (!amount) {
      setAmountError("Enter a valid amount")
      return
    }
    setLoading(true)
    try {
      const parsedAmt = parseFloat(amount)
      if (isNaN(parsedAmt)) {
        setAmountError("Enter a valid amount")
        return
      }
      if (parsedAmt < selectedOption.capitalMin || parsedAmt > selectedOption.capitalMax) {
        setAmountError(`Amount must be between ${selectedOption.capitalMin} and ${selectedOption.capitalMax}`)
        return
      }
      setAmountError(null)
      const token = localStorage.getItem("token")
      const userId = getUserId()
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          optionId: selectedOption.optionId || selectedOption.id,
          amount: parsedAmt,
          currency: "USDT", // Assuming trading in USDT
          type: direction === "up" ? "BUY" : "SELL",
          direction: orderDirection,
        }),
      })
      if (response.ok) {
        let createdOrder: any = null
        try {
          createdOrder = await response.json()
        } catch (err) {
          createdOrder = null
        }

        if (createdOrder && createdOrder.id) {
          const serverStatus = typeof createdOrder.status === "string" ? createdOrder.status.toLowerCase() : undefined
          addOrder({
            id: createdOrder.id.toString(),
            userId,
            pair: createdOrder.pair ?? pair.symbol,
            amount: typeof createdOrder.amount === "number" ? createdOrder.amount : parsedAmt,
            currency: createdOrder.currency ?? "USDT",
            type: createdOrder.type === "SELL" ? "SELL" : direction === "up" ? "BUY" : "SELL",
            direction: createdOrder.direction === "DOWN" ? "DOWN" : createdOrder.direction === "UP" ? "UP" : orderDirection,
            status: serverStatus === "completed" ? "completed" : serverStatus === "cancelled" ? "cancelled" : "pending",
            price: typeof createdOrder.price === "number" ? createdOrder.price : pair.price,
            duration: createdOrder.duration ?? `${selectedOption.seconds}s`,
            forcedLossExpected: createdOrder.forcedLossExpected ?? forceLossActive,
            lossPercent: typeof createdOrder.lossPercent === "number" ? createdOrder.lossPercent : forceLossActive ? selectedOption.returnRate : undefined,
            expectedLossAmount:
              typeof createdOrder.expectedLossAmount === "number"
                ? createdOrder.expectedLossAmount
                : forceLossActive
                ? (parsedAmt * selectedOption.returnRate) / 100
                : undefined,
            origin: "server",
          })
        }
        refetch()
        alert("Order placed successfully")
        onClose()
        setAmount("")
      } else {
        // Try to add to context anyway so users see their order even when API is down
        try {
          const userId = getUserId()
          addOrder({
            userId,
            pair: pair.symbol,
            amount: parsedAmt,
            currency: "USDT",
            type: direction === "up" ? "BUY" : "SELL",
            direction: orderDirection,
            status: "pending",
            price: pair.price,
            duration: `${selectedOption.seconds}s`,
            forcedLossExpected: forceLossActive,
            lossPercent: forceLossActive ? selectedOption.returnRate : undefined,
            expectedLossAmount: forceLossActive ? (parsedAmt * selectedOption.returnRate) / 100 : undefined,
          })
        } catch (err) {
          console.warn("Failed to add order to context after API error", err)
        }
        alert("Failed to place order")
      }
    } catch (err) {
      alert("Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-premium max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{pair.symbol}</h2>
            <p className="text-sm text-muted-foreground mt-1">${pair.price.toFixed(2)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary rounded-2xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {predictionOptions?.length ? (
            predictionOptions.map((option) => {
              const optionKey = option.optionId || option.id
              const isSelected = optionKey === selectedOptionId
              return (
                <div
                  key={optionKey}
                  onClick={() => setSelectedOptionId(optionKey)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border-2 ${isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-secondary/50 border-border hover:border-primary/50"
                    }`}
                >
                  <div className="font-semibold text-foreground mb-2">{option.seconds}s</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Return Rate</p>
                      <p className="font-semibold text-primary">{option.returnRate.toFixed(2)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground mb-1">Capital Range</p>
                      <p className="font-semibold text-accent">${option.capitalMin} - ${option.capitalMax}</p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground">No prediction options available.</p>
          )}
        </div>

        <div className="flex items-center justify-between py-4 border-t border-border/50 mb-6">
          <label className="text-sm font-medium">Enable Leverage</label>
          <button
            onClick={() => setIsLeverage(!isLeverage)}
            className={`relative w-12 h-7 rounded-full transition-all ${isLeverage ? "bg-primary" : "bg-secondary"}`}
          >
            <div
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isLeverage ? "translate-x-6" : "translate-x-1"
                }`}
            />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min={selectedOption?.capitalMin}
              max={selectedOption?.capitalMax}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {selectedOption && (
              <p className="text-xs text-muted-foreground mt-2">
                Min {selectedOption.capitalMin} · Max {selectedOption.capitalMax}
              </p>
            )}
            {amountError && <p className="text-xs text-destructive mt-1">{amountError}</p>}
          </div>

          <div className="bg-secondary/50 border border-border/50 rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Available Amount</span>
              <span>${balanceData?.balance?.toFixed(2) ?? "0.00"}</span>
            </div>
            {selectedOption && (
              <div className="flex justify-between text-muted-foreground">
                <span>Return Target</span>
                <span>{selectedOption.returnRate.toFixed(2)}%</span>
              </div>
            )}
            {forceLossActive && selectedOption && Number.isFinite(parsedAmount) && parsedAmount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>Forced Loss</span>
                <span>- ${((parsedAmount * selectedOption.returnRate) / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Transaction Fee</span>
              <span>$0.00</span>
            </div>
          </div>
        </div>

        <button onClick={handleConfirm} disabled={loading} className="btn-primary">
          {loading ? "Placing Order..." : "Confirm Trade"}
        </button>
      </div>
    </div>
  )
}
