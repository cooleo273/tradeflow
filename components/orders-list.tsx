"use client"

import React, { useEffect } from "react"
import { useOrders } from "@/lib/context/OrdersContext"
import { getUserId } from "@/lib/auth"
import { Button } from "@/components/ui/button"

const isInProgressStatus = (status: string | undefined) => {
  const value = status?.toLowerCase()
  return value === "in-progress" || value === "pending"
}

export default function OrdersList({ pair, showCompleted = false }: { pair?: string; showCompleted?: boolean }) {
  const { orders, markOrderCompleted, refetch, syncing, loading } = useOrders()
  const userId = getUserId()

  useEffect(() => {
    refetch()
  }, [refetch])

  const filtered = orders.filter(order => {
    if (userId && order.userId !== userId) return false
    if (pair) {
      const normalizedPair = order.pair?.toUpperCase()
      if (normalizedPair && normalizedPair !== pair.toUpperCase()) return false
    }
    return showCompleted ? order.status === "completed" : isInProgressStatus(order.status)
  })

  if (!filtered || filtered.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        {loading || syncing ? "Loading orders..." : showCompleted ? "No completed orders" : "No active orders"}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map(order => {
        const statusLabel = order.result ?? order.status.toUpperCase()
        const statusTone = order.result === "LOSS" ? "loss" : order.result === "WIN" ? "win" : "pending"
        const statusStyles = {
          loss: "text-red-400 bg-red-500/10",
          win: "text-emerald-400 bg-emerald-500/10",
          pending: "text-yellow-300 bg-yellow-500/10",
        }[statusTone]
        const canManuallyComplete = order.origin === "local" && isInProgressStatus(order.status)
        const pendingLossAmount = order.expectedLossAmount ?? (typeof order.lossPercent === "number" ? (order.amount * order.lossPercent) / 100 : undefined)

        return (
          <div
            key={order.id}
            className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/80 via-[#050b24] to-[#03060f] p-5 shadow-[0_15px_35px_rgba(2,6,23,0.55)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="font-semibold text-white/70">{order.duration || "30s"}</span>
              <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${statusStyles}`}>{statusLabel}</span>
              <span className="text-[11px] text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div>
                <p className="text-sm text-primary/70">{order.pair}</p>
                <p className="text-2xl font-semibold text-white">{order.type} · {order.amount} {order.currency}</p>
              </div>
              {order.price && (
                <div className="ml-auto text-right text-sm text-muted-foreground">
                  <p>Entry ${order.price.toFixed(2)}</p>
                  {order.direction && <p className="mt-1 text-xs text-white/70">Direction · {order.direction}</p>}
                </div>
              )}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="space-y-1 text-sm">
                {isInProgressStatus(order.status) && order.forcedLossExpected && typeof pendingLossAmount === "number" && (
                  <p className="text-red-300 text-xs font-medium">
                    Forced loss pending: -${pendingLossAmount.toFixed(2)}
                    {typeof order.lossPercent === "number" ? ` (${order.lossPercent.toFixed(2)}%)` : ""}
                  </p>
                )}
                {order.status === "completed" && (
                  <p className={`text-sm font-medium ${statusTone === "win" ? "text-emerald-400" : statusTone === "loss" ? "text-red-400" : "text-white/70"}`}>
                    {order.result ? `Result: ${order.result}` : "Settled"}
                    {order.result === "LOSS" && typeof order.settledLossAmount === "number" && ` · Loss $${order.settledLossAmount.toFixed(2)}`}
                    {typeof order.settledPayout === "number" && ` · Payout $${order.settledPayout.toFixed(2)}`}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end gap-3">
                {canManuallyComplete && (
                  <Button variant="default" className="rounded-2xl px-4 py-2 text-xs" onClick={() => markOrderCompleted(order.id)}>
                    Mark Completed
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
