"use client"

import React, { createContext, useCallback, useEffect, useState } from "react"

export interface OrderItem {
  id: string
  userId: string | null
  pair: string
  amount: number
  currency: string
  type: "BUY" | "SELL"
  status: "in-progress" | "completed"
  createdAt: string
  updatedAt?: string
  price?: number
  duration?: string
}

interface OrdersContextValue {
  orders: OrderItem[]
  loading: boolean
  addOrder: (order: Omit<OrderItem, "id" | "createdAt" | "updatedAt">) => OrderItem
  markOrderCompleted: (id: string) => void
  refetch: () => void
}

export const OrdersContext = createContext<OrdersContextValue | null>(null)

const ORDERS_KEY = "orders_v1"

export function OrdersProvider({ children }: React.PropsWithChildren) {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = useCallback(() => {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (!raw) {
      setOrders([])
      setLoading(false)
      return
    }
    try {
      const data = JSON.parse(raw) as OrderItem[]
      setOrders(data)
    } catch (err) {
      console.warn("Failed to parse stored orders", err)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const persist = (next: OrderItem[]) => {
    setOrders(next)
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next))
    } catch (err) {
      console.warn("Failed to persist orders to localStorage", err)
    }
  }

  const addOrder = (order: Omit<OrderItem, "id" | "createdAt" | "updatedAt">) => {
    const id = typeof crypto !== "undefined" && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const createdAt = new Date().toISOString()
    const item: OrderItem = { ...order, id, createdAt }
    const next = [item, ...orders]
    persist(next)
    return item
  }

  const markOrderCompleted = (id: string) => {
    const next = orders.map(o => (o.id === id ? { ...o, status: "completed" as const, updatedAt: new Date().toISOString() } : o)) as OrderItem[]
    persist(next)
  }

  const refetch = () => loadOrders()

  return (
    <OrdersContext.Provider value={{ orders, addOrder, markOrderCompleted, loading, refetch }}>{children}</OrdersContext.Provider>
  )
}

export function useOrders() {
  const ctx = React.useContext(OrdersContext)
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider")
  return ctx
}
