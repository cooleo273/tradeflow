"use client"

import Link from "next/link"
import { CreditCard, Download, Filter } from "lucide-react"

const mockEntries = [
  { id: 1, type: "Deposit", amount: "+500.00 USDT", status: "Completed", timestamp: "Nov 25, 10:12" },
  { id: 2, type: "Trade PnL", amount: "+42.30 USDT", status: "Settled", timestamp: "Nov 24, 16:40" },
  { id: 3, type: "Withdrawal", amount: "-120.00 USDT", status: "Processing", timestamp: "Nov 24, 09:02" },
]

export default function BillingHistoryPage() {
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

        <div className="rounded-3xl border border-border bg-card/60 divide-y divide-border/60">
          {mockEntries.map(entry => (
            <div key={entry.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-secondary/50 p-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{entry.type}</p>
                  <p className="text-sm text-muted-foreground">{entry.timestamp}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${entry.amount.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>
                  {entry.amount}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{entry.status}</p>
              </div>
            </div>
          ))}
        </div>

        <Link href="/profile" className="inline-flex items-center gap-2 text-primary text-sm font-medium">
          ← Back to profile
        </Link>
      </div>
    </div>
  )
}
