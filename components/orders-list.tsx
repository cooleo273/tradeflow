"use client"

import React from "react"
import { useOrders } from "@/lib/context/OrdersContext"
import { getUserId } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function OrdersList({ pair, showCompleted = false }: { pair?: string; showCompleted?: boolean }) {
  const { orders, markOrderCompleted } = useOrders()
  const userId = getUserId()

  const filtered = orders.filter(o => (userId ? o.userId === userId : true) && (pair ? o.pair === pair : true) && (showCompleted ? o.status === "completed" : o.status === "in-progress"))

  if (!filtered || filtered.length === 0) {
    return <div className="text-center text-muted-foreground py-6">{showCompleted ? "No completed orders" : "No active orders"}</div>
  }

  return (
    <div className="space-y-3">
      {filtered.map(order => (
        <div key={order.id} className="flex items-center justify-between bg-secondary border border-border rounded-xl p-3">
          <div>
            <div className="text-sm text-muted-foreground">{order.pair}</div>
            <div className="font-medium">{order.type} · {order.amount} {order.currency}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</div>
            {order.status === "in-progress" && (
              <Button variant="default" className="py-1 px-2 text-xs" onClick={() => markOrderCompleted(order.id)}>Mark Completed</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
