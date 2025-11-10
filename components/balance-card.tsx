export default function BalanceCard() {
  return (
    <div className="balance-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="stat-label">Account Balance</div>
          <div className="text-3xl font-bold">-148.08 USDT</div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">Withdraw</button>
          <button className="btn-secondary text-sm">Deposit</button>
        </div>
      </div>
    </div>
  )
}
