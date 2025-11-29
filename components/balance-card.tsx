"use client"

import { useBalance } from "@/lib/hooks/useBalance"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BalanceCard() {
  const { balanceData, loading } = useBalance(5000) // Refresh every 5 seconds

  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 p-4 balance-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="stat-label">Account Balance</div>
          <div className="text-3xl font-bold">
            {loading ? (
              <div className="h-9 w-40 bg-secondary rounded-md animate-pulse" />
            ) : (
              `${balanceData?.balance ?? 0} ${balanceData?.currency || "USDT"}`
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/withdraw">
            <Button variant="default" className="text-sm">Withdraw</Button>
          </Link>
          <Link href="/deposit">
            <Button variant="primary" className="text-sm">Deposit</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
