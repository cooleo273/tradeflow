import { LucideIcon } from "lucide-react"
import { Transaction, SystemAlert } from "@/types/admin"

interface StatCard {
  label: string
  value: number
  helper: string
  icon: LucideIcon
}

interface OverviewPanelProps {
  statCards: StatCard[]
  transactions: Transaction[]
  alerts: SystemAlert[]
}

export function OverviewPanel({ statCards, transactions, alerts }: OverviewPanelProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, helper, icon: Icon }) => (
          <div key={label} className="card-premium">
            <div className="flex items-center gap-3 mb-2 text-muted-foreground text-sm">
              <Icon className="h-4 w-4" />
              {label}
            </div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{helper}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest five transactions across the platform</p>
            </div>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50">
                <div>
                  <p className="font-medium">{tx.user?.email || "Unknown User"}</p>
                  <p className="text-sm text-muted-foreground">
                    {tx.transactionType} - ${tx.amount}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    tx.status === "COMPLETED"
                      ? "bg-green-500/15 text-green-400"
                      : tx.status === "PENDING"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-premium">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">System Alerts</h3>
              <p className="text-sm text-muted-foreground">Operational signals that need attention</p>
            </div>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-border/60 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{alert.title}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      alert.severity === "High"
                        ? "bg-red-500/15 text-red-400"
                        : alert.severity === "Medium"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-blue-500/15 text-blue-400"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.detail}</p>
                <p className="text-xs text-muted-foreground mt-2">{alert.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
