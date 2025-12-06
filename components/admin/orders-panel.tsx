"use client"

import { useEffect, useState } from "react"
import { Eye } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { Order } from "@/types/admin"
import { Button } from "@/components/ui/button"

export function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    void load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_BASE_URL}/orders`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      if (!res.ok) throw new Error("Failed to fetch orders")
      const data: Order[] = await res.json()
      setOrders(data)
    } catch (err) {
      console.error(err)
      alert("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  // actions removed: admin now views orders read-only here; use separate endpoints for bulk actions if needed

  const renderRow = (order: Order) => {
    const normalizedStatus = order.status?.toString().toLowerCase()
    const normalizedResult = (order.result ?? order.outcome)?.toString().toUpperCase() as "WIN" | "LOSS" | undefined
    const statusLabel = normalizedResult ?? (normalizedStatus ? normalizedStatus.toUpperCase() : "PENDING")
    const badgeClass = normalizedResult === "LOSS"
      ? "bg-red-500/15 text-red-400"
      : normalizedResult === "WIN" || normalizedStatus === "completed"
        ? "bg-green-500/15 text-green-400"
        : normalizedStatus === "cancelled"
          ? "bg-red-500/15 text-red-400"
          : "bg-yellow-500/20 text-yellow-400"

    return (
      <div key={order.id} className="border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-shadow hover:shadow-lg hover:border-primary/30 bg-card/40">
        <div className="flex-1 w-full">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium truncate max-w-xs">{order.user?.firstName || order.user?.email || `User ${order.userId}`} {order.user?.lastName ? order.user.lastName : ''}</p>
              <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeClass}`}>{statusLabel}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-sm items-center">
            <div><span className="text-muted-foreground">Pair</span><p className="font-semibold">{order.pair}</p></div>
            <div><span className="text-muted-foreground">Amount</span><p className="font-semibold">${order.amount} {order.currency}</p></div>
            <div><span className="text-muted-foreground">Type</span><p className="font-semibold">{order.type}{order.direction ? ` (${order.direction})` : ""}</p></div>
            <div><span className="text-muted-foreground">Price</span><p className="font-semibold">{order.price ?? "--"}</p></div>
            <div>
              <span className="text-muted-foreground">Result</span>
              <p className="font-semibold">
                {normalizedResult ? normalizedResult : normalizedStatus === "completed" ? "SETTLED" : "PENDING"}
                {normalizedResult === "LOSS" && typeof order.settledLossAmount === "number" && ` · -$${order.settledLossAmount.toFixed(2)}`}
                {normalizedResult === "WIN" && typeof order.settledPayout === "number" && ` · $${order.settledPayout.toFixed(2)}`}
              </p>
            </div>
          </div>
          {order.forcedLossExpected && (
            <p className="mt-2 text-xs text-destructive">
              Forced loss applied · {typeof order.lossPercent === "number" ? `${order.lossPercent.toFixed(2)}%` : "Configured"}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Orders</h2>
        <div className="flex gap-2">
          <Button onClick={() => void load()} variant="default">Refresh</Button>
        </div>
      </div>
      <div className="space-y-4">
        {orders.map(renderRow)}
        {orders.length === 0 && <p className="text-center text-muted-foreground py-8">No orders found</p>}
      </div>
    </div>
  )
}
