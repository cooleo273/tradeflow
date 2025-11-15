"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Users as UsersIcon, CreditCard, ArrowLeftRight, Activity } from "lucide-react"
import { API_BASE_URL } from "@/lib/config"
import { AdminSidebar } from "@/components/admin/sidebar"
import { MobileNav } from "@/components/admin/mobile-nav"
import { OverviewPanel } from "@/components/admin/overview-panel"
import { UsersTable } from "@/components/admin/users-table"
import { PaymentsPanel } from "@/components/admin/payments-panel"
import { TransactionsTable } from "@/components/admin/transactions-table"
import { AdminLoadingScreen } from "@/components/admin/loading-screen"
import { User, Payment, Transaction, Stats, NavItem, SystemAlert } from "@/types/admin"

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: UsersIcon },
  { id: "payments", label: "Payment Approvals", icon: CreditCard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
]

const SYSTEM_ALERTS: SystemAlert[] = [
  { id: 1, title: "Suspicious login detected", severity: "High", detail: "Unrecognized device for user test@gmail.com", timestamp: "2m ago" },
  { id: 2, title: "Settlement delay", severity: "Medium", detail: "USDT withdrawals queue exceeds SLA", timestamp: "14m ago" },
  { id: 3, title: "New admin invitation", severity: "Low", detail: "Pending onboarding for ops@tradeflow.com", timestamp: "1h ago" },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, activeUsers: 0, pendingApprovals: 0, pendingPayments: 0, recentTransactions: 0 })
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
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
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      const [usersRes, paymentsRes, transactionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, { headers }),
        fetch(`${API_BASE_URL}/payments?status=PENDING`, { headers }),
        fetch(`${API_BASE_URL}/transactions`, { headers }),
      ])
      if (usersRes.ok) {
        const usersData: User[] = await usersRes.json()
        setUsers(usersData)
        setStats((prev) => ({ ...prev, totalUsers: usersData.length, activeUsers: usersData.filter((u) => u.isActive).length }))
      }
      if (paymentsRes.ok) {
        const paymentsData: Payment[] = await paymentsRes.json()
        setPayments(paymentsData)
        setStats((prev) => ({ ...prev, pendingPayments: paymentsData.length }))
      }
      if (transactionsRes.ok) {
        const txData: Transaction[] = await transactionsRes.json()
        setTransactions(txData)
        setStats((prev) => ({ ...prev, recentTransactions: txData.length }))
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

  const handlePaymentAction = async (paymentId: number, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      })
      response.ok ? fetchDashboardData() : alert(`Failed to ${action} payment`)
    } catch (error) {
      console.error(`Failed to ${action} payment`, error)
    }
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

  const statCards = useMemo(() => [
    { label: "Total Users", value: stats.totalUsers, icon: UsersIcon, helper: "+12 this week" },
    { label: "Active Users", value: stats.activeUsers, icon: Activity, helper: "Current trading" },
    { label: "Pending Payments", value: stats.pendingPayments, icon: CreditCard, helper: "Awaiting review" },
    { label: "Transactions", value: stats.recentTransactions, icon: ArrowLeftRight, helper: "Last 24h" },
  ], [stats])

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewPanel statCards={statCards} transactions={transactions} alerts={SYSTEM_ALERTS} />
      case "users":
        return <UsersTable users={users} searchTerm={search} onSearch={setSearch} onToggleStatus={handleUserStatusChange} />
      case "payments":
        return <PaymentsPanel payments={payments} onAction={handlePaymentAction} proofBaseUrl={API_BASE_URL} />
      case "transactions":
        return <TransactionsTable transactions={transactions} />
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
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
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
            <button onClick={fetchDashboardData} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary">
              Refresh Data
            </button>
          </div>
          {renderTab()}
        </main>
      </div>
    </div>
  )
}