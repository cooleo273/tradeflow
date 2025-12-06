import { Button } from "@/components/ui/button"
import { Transaction } from "@/types/admin"

interface TransactionsTableProps {
  transactions: Transaction[]
  onApprove: (transactionId: number) => void
  onReject: (transactionId: number) => void
}

export function TransactionsTable({ transactions, onApprove, onReject }: TransactionsTableProps) {
  return (
    <div className="card-premium">
      <h3 className="text-xl font-bold mb-4">Transaction Management</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Asset</th>
              <th className="text-left py-3 px-4">Destination</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border/50">
                <td className="py-3 px-4">{tx.user?.email || "Unknown"}</td>
                <td className="py-3 px-4">{tx.transactionType}</td>
                <td className="py-3 px-4">
                  ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4">{tx.currency || "USDT"}</td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <p className="font-mono break-all max-w-xs">{tx.address || "—"}</p>
                    {tx.network && <p className="text-xs text-muted-foreground mt-1">{tx.network}</p>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      tx.status === "COMPLETED"
                        ? "bg-green-500/20 text-green-400"
                        : tx.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4">
                  {tx.status === "PENDING" ? (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="default" onClick={() => onApprove(tx.id)}>
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onReject(tx.id)}>
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {tx.txHash ? `Tx: ${tx.txHash}` : tx.note || "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
