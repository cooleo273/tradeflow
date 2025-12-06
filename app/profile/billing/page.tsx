"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { CreditCard, Download, Filter, Loader2, Search, AlertTriangle } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { getUserId } from "@/lib/auth"

type BillingDirection = "CREDIT" | "DEBIT"

type BillingEntry = {
  id: string | number
  kind: string
  direction: BillingDirection
  amount: number
  currency: string
  status: string
  description?: string
  createdAt: string
  metadata?: Record<string, unknown>
}

const FALLBACK_ENTRIES: BillingEntry[] = [
  {
    id: "seed-1",
    kind: "PAYMENT",
    direction: "CREDIT",
    amount: 500,
    currency: "USDT",
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    description: "Manual top up",
  },
  {
    id: "seed-2",
    kind: "TRADE_PNL",
    direction: "CREDIT",
    amount: 42.3,
    currency: "USDT",
    status: "SETTLED",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    description: "Strategy payout",
  },
  {
    id: "seed-3",
    kind: "WITHDRAWAL",
    direction: "DEBIT",
    amount: 120,
    currency: "USDT",
    status: "PROCESSING",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    description: "Network confirmation pending",
  },
]

export default function BillingHistoryPage() {
  const [entries, setEntries] = useState<BillingEntry[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const token = localStorage.getItem("token")
        const userId = getUserId()
        if (!userId || !token) {
          setEntries(FALLBACK_ENTRIES)
          setError("Log in again to sync live billing data")
          return
        }
        const response = await fetch(`${API_BASE_URL}/users/${userId}/billing-history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) throw new Error("Failed to load billing history")
        const data = await response.json()
        const normalized: BillingEntry[] = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.id,
              kind: item.kind || item.type || "TRANSACTION",
              direction: item.direction === "DEBIT" ? "DEBIT" : "CREDIT",
              amount: typeof item.amount === "number" ? item.amount : Number(item.amount) || 0,
              currency: item.currency || "USDT",
              status: item.status || "PENDING",
              description: item.description,
              createdAt: item.createdAt || new Date().toISOString(),
              metadata: item.metadata,
            }))
          : []
        setEntries(normalized.length ? normalized : FALLBACK_ENTRIES)
        if (!normalized.length) {
          setError("No billing data returned yet – showing placeholders")
        } else {
          setError(null)
        }
      } catch (err) {
        console.error("Billing history load failed", err)
        setEntries(FALLBACK_ENTRIES)
        setError("Unable to reach billing service, showing cached sample")
      } finally {
        setLoading(false)
      }
    }

    void fetchBilling()
  }, [])

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const kindLower = entry.kind.toLowerCase()
      const searchValue = search.toLowerCase()
      const matchesFilter =
        filter === "all" ||
        (filter === "deposit" && entry.direction === "CREDIT" && kindLower !== "withdrawal") ||
        (filter === "withdrawal" && (kindLower === "withdrawal" || entry.direction === "DEBIT")) ||
        (filter === "fee" && (kindLower.includes("fee") || kindLower.includes("adjust")))
      const matchesSearch = search
        ? kindLower.includes(searchValue) ||
          entry.status.toLowerCase().includes(searchValue) ||
          (entry.description?.toLowerCase().includes(searchValue) ?? false)
        : true
      return matchesFilter && matchesSearch
    })
  }, [entries, filter, search])

  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => {
        const signedAmount = entry.direction === "DEBIT" ? -entry.amount : entry.amount
        return {
          inflow: signedAmount > 0 ? acc.inflow + signedAmount : acc.inflow,
          outflow: signedAmount < 0 ? acc.outflow + Math.abs(signedAmount) : acc.outflow,
        }
      },
      { inflow: 0, outflow: 0 }
    )
  }, [filteredEntries])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Profile · Billing</p>
            <h1 className="text-3xl font-bold mt-2">Billing History</h1>
            <p className="text-muted-foreground max-w-2xl">
              Track deposits, withdrawals, strategy fees and performance payouts in one timeline.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="rounded-2xl border border-border px-4 py-2 text-sm inline-flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </button>
            <button className="rounded-2xl border border-border px-4 py-2 text-sm inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters and overview */}
        <div className="rounded-3xl border border-border bg-card/60 p-5 space-y-4">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="flex gap-3">
              {[
                { label: "All", value: "all" },
                { label: "Deposits", value: "deposit" },
                { label: "Withdrawals", value: "withdrawal" },
                { label: "Fees", value: "fee" },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium border transition-colors ${
                    filter === option.value ? "border-primary text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search type or status"
                className="bg-transparent py-2 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="text-xs text-emerald-200 uppercase">Inflow</p>
              <p className="text-2xl font-semibold text-emerald-100">+{totals.inflow.toFixed(2)} USDT</p>
            </div>
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-xs text-red-200 uppercase">Outflow</p>
              <p className="text-2xl font-semibold text-red-100">-{totals.outflow.toFixed(2)} USDT</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="rounded-3xl border border-border/80 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading billing history...
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">No entries match your filters.</div>
            ) : (
              filteredEntries.map(entry => (
                <div key={entry.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 p-5 last:border-none">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-secondary/40 p-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{entry.kind.replaceAll("_", " ")}</p>
                      <p className="text-sm text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p>
                      {entry.description && <p className="text-xs text-muted-foreground/80 mt-1">{entry.description}</p>}
                      {entry.metadata && (
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          {Object.entries(entry.metadata)
                            .map(([key, value]) => `${key}: ${value as string}`)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${entry.direction === "DEBIT" ? "text-red-400" : "text-emerald-400"}`}>
                      {entry.direction === "DEBIT" ? "-" : "+"}
                      {entry.amount.toFixed(2)} {entry.currency}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{entry.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <Link href="/profile" className="inline-flex items-center gap-2 text-primary text-sm font-medium">
          ← Back to profile
        </Link>
      </div>
    </div>
  )
}
