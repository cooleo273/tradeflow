import { useState } from "react"
import { X, Eye } from "lucide-react"
import { Payment } from "@/types/admin"

interface PaymentsPanelProps {
  payments: Payment[]
  onAction: (paymentId: number, action: "approve" | "reject", amount?: number) => Promise<void>
  proofBaseUrl: string
}

export function PaymentsPanel({ payments, onAction, proofBaseUrl }: PaymentsPanelProps) {
  // proofBaseUrl should be the API host (e.g. http://localhost:3001) and
  // payment.proofUrl can be either an absolute url (http://...) or a
  // relative path (/uploads/... or uploads/...). This helper builds a safe
  // absolute URL for the <img> src so the UI works for any backend response.
  const buildProofUrl = (base: string, proof?: string) => {
    if (!proof) return undefined
    // If the proof URL is already absolute, return as-is
    if (/^https?:\/\//i.test(proof)) return proof
    const normalizedBase = base?.replace(/\/$/, "") || ""
    // If it starts with a leading slash, concatenate directly
    if (proof.startsWith("/")) return `${normalizedBase}${proof}`
    // Otherwise ensure a slash between base and path
    return `${normalizedBase}/${proof}`
  }
  // Track edited amounts for each payment
  const [editedAmounts, setEditedAmounts] = useState<Record<number, string>>({})
  const [actionLoading, setActionLoading] = useState<Record<number, "approve" | "reject" | null>>({})

  const setPaymentLoading = (paymentId: number, action: "approve" | "reject" | null) => {
    setActionLoading(prev => ({ ...prev, [paymentId]: action }))
  }

  const handleAmountChange = (paymentId: number, value: string) => {
    setEditedAmounts(prev => ({ ...prev, [paymentId]: value }))
  }

  const getAmount = (payment: Payment) => {
    if (editedAmounts[payment.id] !== undefined) {
      return editedAmounts[payment.id];
    }
    return payment.amount != null ? String(payment.amount) : "";
  }

  const handleApprove = async (payment: Payment) => {
    const amount = parseFloat(getAmount(payment))
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount")
      return
    }
    setPaymentLoading(payment.id, "approve")
    try {
      await onAction(payment.id, "approve", amount)
    } finally {
      setPaymentLoading(payment.id, null)
    }
  }

  const handleReject = async (paymentId: number) => {
    setPaymentLoading(paymentId, "reject")
    try {
      await onAction(paymentId, "reject")
    } finally {
      setPaymentLoading(paymentId, null)
    }
  }

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const getStatusClass = (status: string | undefined) => {
    if (status === "APPROVED") return "bg-green-500/20 text-green-400"
    if (status === "REJECTED") return "bg-red-500/20 text-red-400"
    return "bg-yellow-500/20 text-yellow-400"
  }

  const renderPaymentRow = (payment: Payment) => {
    const url = buildProofUrl(proofBaseUrl, payment.proofUrl)
    const amountVal = Number(payment.amount ?? 0)
    const amountDisplay = isNaN(amountVal) ? 0 : amountVal
    const approveLoading = actionLoading[payment.id] === "approve"
    const rejectLoading = actionLoading[payment.id] === "reject"

    return (
      <div key={payment.id} className="border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-shadow hover:shadow-lg hover:border-primary/30 bg-card/40">
        <div className="flex-shrink-0">
          {payment.proofUrl ? (
            <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-md border border-border cursor-pointer relative" onClick={() => { if (url) setPreviewUrl(url) }}>
              <img src={url} alt={`Proof for payment ${payment.id}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5 text-white/90" />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-secondary rounded-md flex items-center justify-center text-sm text-muted-foreground">No Proof</div>
          )}
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium truncate max-w-xs">{payment.user?.email || "Unknown User"}</p>
              <p className="text-sm text-muted-foreground">{new Date(payment.createdAt).toLocaleString()}</p>
            </div>
            <span className={`px-2 py-1 ${getStatusClass(payment.status)} rounded text-xs`}>{payment.status}</span>
          </div>
          <div className="mt-2">
              <div className="text-lg sm:text-xl font-semibold text-foreground">${amountDisplay.toFixed(2)} {payment.currency}</div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <div className="flex gap-2 items-center">
              <span className="text-muted-foreground">$</span>
              <input
                type="number"
                value={getAmount(payment)}
                onChange={(e) => handleAmountChange(payment.id, e.target.value)}
                min="0"
                step="0.01"
                className="flex-1 bg-input border border-border rounded-2xl px-3 py-2 text-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <span className="text-muted-foreground">{payment.currency}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">You can edit the amount before approving</p>
          </div>

          {payment.proofUrl && (
            <div className="mb-3">
              <p className="text-sm text-muted-foreground">Click the thumbnail to view full payment proof.</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2 justify-end mt-2 sm:mt-0">
            {url && (
              <button onClick={() => setPreviewUrl(url)} className="px-3 py-2 border border-border rounded-2xl hover:bg-secondary text-sm w-full sm:w-auto">View</button>
            )}
            <button
              onClick={() => void handleApprove(payment)}
              disabled={approveLoading}
              className="px-4 py-2 bg-green-500/20 text-green-400 rounded-2xl hover:bg-green-500/30 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {approveLoading ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={() => void handleReject(payment.id)}
              disabled={rejectLoading}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-2xl hover:bg-red-500/30 w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {rejectLoading ? "Rejecting..." : "Reject"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card-premium">
        <h3 className="text-xl font-bold mb-4">Pending Payment Approvals</h3>
        <div className="space-y-4">
          {payments.map(renderPaymentRow)}
          {payments.length === 0 && <p className="text-center text-muted-foreground py-8">No pending payments</p>}
        </div>
      </div>
      {previewUrl && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-premium max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div />
              <button onClick={() => setPreviewUrl(null)} className="p-1.5 hover:bg-secondary rounded-2xl">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center">
              <img src={previewUrl} alt="Payment proof preview" className="max-h-[80vh] w-auto rounded-2xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
