import { Transaction } from "@/types/admin"

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
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
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-border/50">
                <td className="py-3 px-4">{tx.user?.email || "Unknown"}</td>
                <td className="py-3 px-4">{tx.transactionType}</td>
                <td className="py-3 px-4">${tx.amount}</td>
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
                <td className="py-3 px-4 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
