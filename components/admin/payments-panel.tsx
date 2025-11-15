import { Payment } from "@/types/admin"

interface PaymentsPanelProps {
  payments: Payment[]
  onAction: (paymentId: number, action: "approve" | "reject") => void
  proofBaseUrl: string
}

export function PaymentsPanel({ payments, onAction, proofBaseUrl }: PaymentsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="card-premium">
        <h3 className="text-xl font-bold mb-4">Pending Payment Approvals</h3>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{payment.user?.email || "Unknown User"}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.currency} - ${payment.amount}
                  </p>
                </div>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">{payment.status}</span>
              </div>
              {payment.proofUrl && (
                <div className="mb-3">
                  <img src={`${proofBaseUrl}${payment.proofUrl}`} alt="Payment proof" className="max-w-xs rounded border" />
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => onAction(payment.id, "approve")}
                  className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                >
                  Approve
                </button>
                <button
                  onClick={() => onAction(payment.id, "reject")}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {payments.length === 0 && <p className="text-center text-muted-foreground py-8">No pending payments</p>}
        </div>
      </div>
    </div>
  )
}
