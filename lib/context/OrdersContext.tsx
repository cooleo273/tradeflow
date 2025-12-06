"use client"

import React, { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { API_BASE_URL } from "@/lib/config"
import { getUserId } from "@/lib/auth"

export interface OrderItem {
  id: string
  userId: string | null
  pair: string
  amount: number
  currency: string
  type: "BUY" | "SELL"
  direction?: "UP" | "DOWN"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  createdAt: string
  updatedAt?: string
  price?: number
  duration?: string
  forcedLossExpected?: boolean
  lossPercent?: number
  expectedLossAmount?: number
  result?: "WIN" | "LOSS"
  settledPayout?: number
  settledLossAmount?: number
  origin?: "server" | "local"
}

interface OrdersContextValue {
  orders: OrderItem[]
  loading: boolean
  addOrder: (order: Omit<OrderItem, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: string }) => OrderItem
  markOrderCompleted: (id: string) => void
  refetch: () => void
  syncing: boolean
}

export const OrdersContext = createContext<OrdersContextValue | null>(null)

const normalizeStatus = (status?: string | null): OrderItem["status"] => {
  const value = status?.toString().toLowerCase()
  if (value === "completed") return "completed"
  if (value === "cancelled" || value === "rejected") return "cancelled"
  if (value === "in-progress") return "in-progress"
  return "pending"
}

const normalizeNumber = (value: unknown) => {
  const num = typeof value === "string" ? parseFloat(value) : typeof value === "number" ? value : NaN
  return Number.isFinite(num) ? num : undefined
}

const normalizePair = (order: any): string => {
  if (order?.pair) return order.pair
  if (order?.symbol) return order.symbol
  if (order?.predictionOption?.pair) return order.predictionOption.pair
  return ""
}

const normalizeOrder = (order: any): OrderItem => {
  const normalized: OrderItem = {
    id: (order?.id ?? order?._id ?? crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).toString(),
    userId: order?.userId ? order.userId.toString() : null,
    pair: normalizePair(order),
    amount: normalizeNumber(order?.amount) ?? 0,
    currency: order?.currency ?? "USDT",
    type: (order?.type ?? order?.positionType ?? order?.direction ?? "BUY").toUpperCase() === "SELL" ? "SELL" : "BUY",
    direction: order?.direction === "DOWN" ? "DOWN" : order?.direction === "UP" ? "UP" : undefined,
    status: normalizeStatus(order?.status),
    createdAt: order?.createdAt ?? new Date().toISOString(),
    updatedAt: order?.updatedAt,
    price: normalizeNumber(order?.price),
    duration: order?.duration ?? (order?.option?.seconds ? `${order.option.seconds}s` : order?.predictionOption?.seconds ? `${order.predictionOption.seconds}s` : undefined),
    forcedLossExpected: Boolean(order?.forcedLossExpected),
    lossPercent: normalizeNumber(order?.lossPercent) ?? normalizeNumber(order?.returnRate),
    expectedLossAmount: normalizeNumber(order?.expectedLossAmount ?? order?.forcedLossAmount),
    result: order?.result === "WIN" ? "WIN" : order?.result === "LOSS" ? "LOSS" : order?.outcome === "WIN" ? "WIN" : order?.outcome === "LOSS" ? "LOSS" : undefined,
    settledPayout: normalizeNumber(order?.settledPayout),
    settledLossAmount: normalizeNumber(order?.settledLossAmount),
    origin: "server",
  }

  if (normalized.status === "completed" && !normalized.result && normalized.settledLossAmount) {
    normalized.result = "LOSS"
  }

  return normalized
}

export function OrdersProvider({ children }: React.PropsWithChildren) {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token")
    const userId = getUserId()

    if (!userId) {
      setOrders([])
      setLoading(false)
      return
    }

    setSyncing(true)
    try {
      const url = new URL(`${API_BASE_URL}/orders`)
      url.searchParams.set("userId", userId)

      const res = await fetch(url.toString(), {
        cache: "no-store",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      })

      if (res.status === 304) {
        return
      }

      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`)

      const data = await res.json()
      const serverOrders = Array.isArray(data) ? data.map(normalizeOrder) : []

      setOrders(prev => {
        const prevMap = new Map(prev.map(order => [order.id, order]))
        const serverIds = new Set(serverOrders.map(order => order.id))

        const merged = serverOrders.map(order => {
          const existing = prevMap.get(order.id)
          if (!existing) return order

          return {
            ...order,
            pair: order.pair && order.pair !== "Unknown" ? order.pair : existing.pair,
            duration: order.duration ?? existing.duration,
            price: order.price ?? existing.price,
            forcedLossExpected: order.forcedLossExpected ?? existing.forcedLossExpected,
            lossPercent: order.lossPercent ?? existing.lossPercent,
            expectedLossAmount: order.expectedLossAmount ?? existing.expectedLossAmount,
          }
        })

        const localOnly = prev.filter(order => order.origin === "local" && !serverIds.has(order.id))
        return [...merged, ...localOnly]
      })
    } catch (err) {
      console.error("Order fetch failed", err)
    } finally {
      setLoading(false)
      setSyncing(false)
    }
  }, [])

  useEffect(() => {
    void fetchOrders()
  }, [fetchOrders])

  const addOrder = useCallback(
    (order: Omit<OrderItem, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: string }) => {
      const id =
        order.id ?? (typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)
      const createdAt = order.createdAt ?? new Date().toISOString()
      const item: OrderItem = { ...order, id, createdAt, origin: order.origin ?? "local" }
      setOrders(prev => [item, ...prev.filter(existing => existing.id !== id)])
      return item
    },
    [],
  )

  const markOrderCompleted = useCallback((id: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id
          ? {
              ...order,
              status: "completed",
              updatedAt: new Date().toISOString(),
            }
          : order,
      ),
    )
  }, [])

  const refetch = useCallback(() => {
    void fetchOrders()
  }, [fetchOrders])

  const value = useMemo(
    () => ({ orders, addOrder, markOrderCompleted, loading, refetch, syncing }),
    [orders, addOrder, markOrderCompleted, loading, refetch, syncing],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export function useOrders() {
  const ctx = React.useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}
