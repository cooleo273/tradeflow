"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Users as UsersIcon, CreditCard, ArrowLeftRight, Activity, BarChart3, Wallet } from "lucide-react"
import { PredictionsPanel } from "@/components/admin/predictions-panel"
import { OrdersPanel } from "@/components/admin/orders-panel"
import { API_BASE_URL } from "@/lib/config"
import { AdminSidebar } from "@/components/admin/sidebar"
import { MobileNav } from "@/components/admin/mobile-nav"
import { OverviewPanel } from "@/components/admin/overview-panel"
import { UsersTable } from "@/components/admin/users-table"
import { PaymentsPanel } from "@/components/admin/payments-panel"
import { TransactionsTable } from "@/components/admin/transactions-table"
import { WithdrawalsPanel } from "@/components/admin/withdrawals-panel"
import { AdminLoadingScreen } from "@/components/admin/loading-screen"
import { User, Payment, Transaction, Stats, NavItem, SystemAlert, Withdrawal } from "@/types/admin"

  const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: UsersIcon },
  { id: "payments", label: "Payment Approvals", icon: CreditCard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "withdrawals", label: "Withdrawals", icon: Wallet },
    { id: "orders", label: "Orders", icon: Activity },
  { id: "predictions", label: "Prediction Options", icon: BarChart3 },
]

const SYSTEM_ALERTS: SystemAlert[] = [
  { id: 1, title: "Suspicious login detected", severity: "High", detail: "Unrecognized device for user test@gmail.com", timestamp: "2m ago" },
  { id: 2, title: "Settlement delay", severity: "Medium", detail: "USDT withdrawals queue exceeds SLA", timestamp: "14m ago" },
  { id: 3, title: "New admin invitation", severity: "Low", detail: "Pending onboarding for ops@cryptosphere.trade", timestamp: "1h ago" },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeUsers: 0, pendingApprovals: 0, pendingPayments: 0, recentTransactions: 0 })
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "ADMIN") {
      router.push("/")
      return
    }
    void fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      const [usersRes, paymentsRes, transactionsRes, withdrawalsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, { headers }),
        fetch(`${API_BASE_URL}/payments?status=PENDING`, { headers }),
        fetch(`${API_BASE_URL}/transactions`, { headers }),
        fetch(`${API_BASE_URL}/withdrawals`, { headers }),
      ])
      let loadedUsers: User[] = []
      if (usersRes.ok) {
        const usersData: User[] = await usersRes.json()
        setUsers(usersData)
        setStats(prev => ({ ...prev, totalUsers: usersData.length, activeUsers: usersData.filter(u => u.isActive).length }))
        loadedUsers = usersData
      }
      const userMap = new Map<number, User>(loadedUsers.map((user) => [user.id, user]))
      if (paymentsRes.ok) {
        const paymentsData: Payment[] = await paymentsRes.json()
        setPayments(paymentsData)
        setStats(prev => ({ ...prev, pendingPayments: paymentsData.length }))
      }
      if (transactionsRes.ok) {
        const txData: Transaction[] = await transactionsRes.json()
        const enriched: Transaction[] = txData.map((tx) => ({
          ...tx,
          user: tx.user ?? userMap.get(tx.userId),
        }))
        setTransactions(enriched)
        setStats(prev => ({ ...prev, recentTransactions: txData.length }))
      }
      if (withdrawalsRes.ok) {
        const withdrawalData: Withdrawal[] = await withdrawalsRes.json()
        const enrichedWithdrawals = withdrawalData.map((wd) => {
          const numericId = typeof wd.userId === "string" ? Number(wd.userId) : wd.userId
          return {
            ...wd,
            user: wd.user ?? (Number.isFinite(numericId) ? userMap.get(numericId) : undefined),
          }
        })
        setWithdrawals(enrichedWithdrawals)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    router.push("/auth/login")
  }

  const handleUserStatusChange = async (userId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive }),
      })
      response.ok ? fetchDashboardData() : alert("Failed to update user status")
    } catch (error) {
      console.error("Failed to update user status", error)
    }
  }

  const handleForceLossToggle = async (userId: number, forceLossEnabled: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/${userId}/force-loss`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ forceLossEnabled }),
      })
      response.ok ? fetchDashboardData() : alert("Failed to update trade outcome")
    } catch (error) {
      console.error("Failed to toggle force loss", error)
    }
  }

  const handleForceLossAllUsers = async (nextValue: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      const targets = users.filter(user => Boolean(user.forceLossEnabled) !== nextValue)
      if (targets.length === 0) {
        alert(`All users are already ${nextValue ? "in" : "out of"} force loss mode`)
        return
      }
      await Promise.allSettled(
        targets.map(user =>
          fetch(`${API_BASE_URL}/users/${user.id}/force-loss`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ forceLossEnabled: nextValue }),
          })
        )
      )
      await fetchDashboardData()
    } catch (error) {
      console.error("Failed to force loss for all users", error)
      alert("Failed to toggle force loss for all users")
    }
  }

  const handleEditUserBalance = async (userId: number, currentBalance?: number) => {
    const nextBalance = window.prompt("Enter the new balance (USDT)", currentBalance !== undefined ? String(currentBalance) : "")
    if (nextBalance === null) return
    const parsed = Number(nextBalance)
    if (Number.isNaN(parsed)) {
      alert("Please enter a valid number for the balance")
      return
    }
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/${userId}/balance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ balance: parsed }),
      })
      response.ok ? fetchDashboardData() : alert("Failed to update user balance")
    } catch (error) {
      console.error("Failed to update balance", error)
      alert("Failed to update user balance")
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Delete this user? This cannot be undone.")) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      response.ok ? fetchDashboardData() : alert("Failed to delete user")
    } catch (error) {
      console.error("Failed to delete user", error)
      alert("Failed to delete user")
    }
  }

  const handlePaymentAction = async (paymentId: number, action: "approve" | "reject", amount?: number) => {
    try {
      const token = localStorage.getItem("token")
      const body = action === "approve" && amount !== undefined ? { amount } : {}
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      response.ok ? fetchDashboardData() : alert(`Failed to ${action} payment`)
    } catch (error) {
      console.error(`Failed to ${action} payment`, error)
    }
  }

  const handleTransactionAction = async (transactionId: number, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Missing admin token, please re-login")
        return
      }
      const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      let body: Record<string, unknown> = {}
      if (action === "approve") {
        const txHash = window.prompt("Enter blockchain transaction hash (optional)")?.trim()
        if (txHash) body = { txHash }
      } else {
        const reason = window.prompt("Provide a reason for rejection")?.trim()
        if (!reason) {
          alert("Rejection requires a reason")
          return
        }
        body = { reason }
      }
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/${action}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })
      response.ok ? fetchDashboardData() : alert(`Failed to ${action} transaction`)
    } catch (error) {
      console.error(`Failed to ${action} transaction`, error)
      alert(`Failed to ${action} transaction`)
    }
  }

  const handleWithdrawalApprove = async (
    withdrawalId: number | string,
    payload: { amount: number; txHash?: string; adminNote?: string }
  ) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Missing admin token, please re-login")
        return
      }
      const response = await fetch(`${API_BASE_URL}/withdrawals/${withdrawalId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
      response.ok ? fetchDashboardData() : alert("Failed to approve withdrawal")
    } catch (error) {
      console.error("Failed to approve withdrawal", error)
      alert("Failed to approve withdrawal")
    }
  }

  const handleWithdrawalReject = async (withdrawalId: number | string, reason: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Missing admin token, please re-login")
        return
      }
      const response = await fetch(`${API_BASE_URL}/withdrawals/${withdrawalId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      })
      response.ok ? fetchDashboardData() : alert("Failed to reject withdrawal")
    } catch (error) {
      console.error("Failed to reject withdrawal", error)
      alert("Failed to reject withdrawal")
    }
  }

  const statCards = useMemo(() => [
    { label: "Total Users", value: stats.totalUsers, icon: UsersIcon, helper: "+12 this week" },
    { label: "Active Users", value: stats.activeUsers, icon: Activity, helper: "Current trading" },
    { label: "Pending Payments", value: stats.pendingPayments, icon: CreditCard, helper: "Awaiting review" },
    { label: "Transactions", value: stats.recentTransactions, icon: ArrowLeftRight, helper: "Last 24h" },
  ], [stats])

  const renderTab = () => {
    const allForceLossEnabled = users.length > 0 && users.every(user => user.forceLossEnabled)
    switch (activeTab) {
      case "overview":
        return <OverviewPanel statCards={statCards} transactions={transactions} alerts={SYSTEM_ALERTS} />
      case "users":
        return (
          <UsersTable
            users={users}
            searchTerm={search}
            onSearch={setSearch}
            onToggleStatus={handleUserStatusChange}
            onToggleForceLoss={handleForceLossToggle}
            allForceLossEnabled={allForceLossEnabled}
            onForceLossAllToggle={handleForceLossAllUsers}
            onEditBalance={handleEditUserBalance}
            onDeleteUser={handleDeleteUser}
          />
        )
      case "payments":
        return <PaymentsPanel payments={payments} onAction={handlePaymentAction} proofBaseUrl={API_BASE_URL} />
      case "transactions":
        return (
          <TransactionsTable
            transactions={transactions}
            onApprove={(id) => void handleTransactionAction(id, "approve")}
            onReject={(id) => void handleTransactionAction(id, "reject")}
          />
        )
      case "withdrawals":
        return (
          <WithdrawalsPanel
            withdrawals={withdrawals}
            onApprove={handleWithdrawalApprove}
            onReject={handleWithdrawalReject}
          />
        )
        case "orders":
          return <OrdersPanel />
      case "predictions":
        return <PredictionsPanel />
      default:
        return null
    }
  }

  if (loading) return <AdminLoadingScreen />

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        navItems={NAV_ITEMS}
        activeTab={activeTab}
        collapsed={sidebarCollapsed}
        onSelect={setActiveTab}
        onExit={() => router.push("/")}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col">
        <MobileNav navItems={NAV_ITEMS} activeTab={activeTab} onSelect={setActiveTab} onLogout={handleLogout} />
        <main className="flex-1 px-4 md:px-8 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Control center</p>
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <button onClick={fetchDashboardData} className="rounded-2xl border border-border px-4 py-2 text-sm hover:bg-secondary">
              Refresh Data
            </button>
          </div>
          {renderTab()}
        </main>
      </div>
    </div>
  )
}