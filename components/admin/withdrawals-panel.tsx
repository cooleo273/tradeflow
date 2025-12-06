import { useState } from "react"
import { Withdrawal } from "@/types/admin"
import { Button } from "@/components/ui/button"

interface WithdrawalsPanelProps {
  withdrawals: Withdrawal[]
  onApprove: (
    withdrawalId: number | string,
    payload: { amount: number; txHash?: string; adminNote?: string }
  ) => Promise<void>
  onReject: (withdrawalId: number | string, reason: string) => Promise<void>
}

const getStatusStyles = (status: string) => {
  const normalized = status?.toUpperCase()
  if (normalized === "COMPLETED" || normalized === "APPROVED") return "bg-green-500/20 text-green-400"
  if (normalized === "REJECTED" || normalized === "FAILED") return "bg-red-500/20 text-red-400"
  return "bg-yellow-500/20 text-yellow-400"
}

export function WithdrawalsPanel({ withdrawals, onApprove, onReject }: WithdrawalsPanelProps) {
  const [actionLoading, setActionLoading] = useState<Record<string, "approve" | "reject" | null>>({})

  const setLoading = (id: string | number, action: "approve" | "reject" | null) => {
    const key = String(id)
    setActionLoading(prev => ({ ...prev, [key]: action }))
  }

  const handleApproveClick = async (withdrawal: Withdrawal) => {
    const defaultAmount = withdrawal.amount != null ? String(withdrawal.amount) : ""
    const amountInput = window.prompt("Enter processed amount", defaultAmount)
    if (amountInput === null) return
    const parsedAmount = Number(amountInput)
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount greater than zero")
      return
    }
    const txHash = window.prompt("Enter blockchain transaction hash (optional)")?.trim()
    const adminNote = window.prompt("Add an admin note (optional)")?.trim()
    setLoading(withdrawal.id, "approve")
    try {
      await onApprove(withdrawal.id, {
        amount: parsedAmount,
        ...(txHash ? { txHash } : {}),
        ...(adminNote ? { adminNote } : {}),
      })
    } finally {
      setLoading(withdrawal.id, null)
    }
  }

  const handleRejectClick = async (withdrawal: Withdrawal) => {
    const reason = window.prompt("Provide a rejection reason")?.trim()
    if (!reason) {
      alert("Rejection requires a reason")
      return
    }
    setLoading(withdrawal.id, "reject")
    try {
      await onReject(withdrawal.id, reason)
    } finally {
      setLoading(withdrawal.id, null)
    }
  }

  const isActionable = (status: string | undefined) => {
    const normalized = status?.toUpperCase()
    return normalized !== "COMPLETED" && normalized !== "APPROVED" && normalized !== "REJECTED" && normalized !== "FAILED"
  }

  return (
    <div className="card-premium">
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-xl font-bold">Withdrawal Requests</h3>
        <p className="text-sm text-muted-foreground">
          Review user withdrawal submissions, verify addresses, and track network status in one view.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/60">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Asset</th>
              <th className="text-left py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Network</th>
              <th className="text-left py-3 px-4">Address</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Created</th>
              <th className="text-left py-3 px-4">Notes</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id} className="border-b border-border/40">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium">{withdrawal.user?.email || `User ${withdrawal.userId}`}</p>
                    <p className="text-xs text-muted-foreground">ID: {withdrawal.userId}</p>
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold">{withdrawal.asset}</td>
                <td className="py-3 px-4">
                  ${withdrawal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4">{withdrawal.network}</td>
                <td className="py-3 px-4">
                  <p className="font-mono text-sm break-all max-w-xs">{withdrawal.address}</p>
                  {withdrawal.txHash && <p className="text-xs text-muted-foreground mt-1">Tx: {withdrawal.txHash}</p>}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusStyles(withdrawal.status)}`}>
                    {withdrawal.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm">{new Date(withdrawal.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">
                  {withdrawal.userNote || withdrawal.memo || "—"}
                </td>
                <td className="py-3 px-4">
                  {isActionable(withdrawal.status) ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => void handleApproveClick(withdrawal)}
                        disabled={actionLoading[String(withdrawal.id)] === "approve"}
                      >
                        {actionLoading[String(withdrawal.id)] === "approve" ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => void handleRejectClick(withdrawal)}
                        disabled={actionLoading[String(withdrawal.id)] === "reject"}
                      >
                        {actionLoading[String(withdrawal.id)] === "reject" ? "Rejecting..." : "Reject"}
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No actions available</span>
                  )}
                </td>
              </tr>
            ))}
            {withdrawals.length === 0 && (
              <tr>
                <td colSpan={9} className="py-6 text-center text-muted-foreground">
                  No withdrawal requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
