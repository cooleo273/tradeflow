"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/config"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
}

interface Payment {
  id: number
  userId: number
  amount: number
  currency: string
  status: string
  proofUrl?: string
  createdAt: string
  user?: User
}

interface Transaction {
  id: number
  userId: number
  amount: number
  transactionType: string
  status: string
  createdAt: string
  user?: User
}

interface Order {
  id: number
  userId: number
  amount: number
  currency: string
  status: string
  createdAt: string
  user?: User
}

interface Stats {
  totalUsers: number
  activeUsers: number
  pendingApprovals: number
  pendingPayments: number
  recentTransactions: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    pendingApprovals: 0,
    pendingPayments: 0,
    recentTransactions: 0
  })
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Check admin role
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "ADMIN") {
      router.push("/")
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch stats
      const [usersRes, paymentsRes, transactionsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, { headers }),
        fetch(`${API_BASE_URL}/payments?status=PENDING`, { headers }),
        fetch(`${API_BASE_URL}/transactions`, { headers }),
        fetch(`${API_BASE_URL}/orders`, { headers })
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
        setStats(prev => ({
          ...prev,
          totalUsers: usersData.length,
          activeUsers: usersData.filter((u: User) => u.isActive).length
        }))
      }

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setPayments(paymentsData)
        setStats(prev => ({ ...prev, pendingPayments: paymentsData.length }))
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
        setStats(prev => ({ ...prev, recentTransactions: transactionsData.length }))
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentAction = async (paymentId: number, action: 'approve' | 'reject', comment?: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ comment })
      })

      if (response.ok) {
        fetchDashboardData() // Refresh data
        alert(`Payment ${action}d successfully`)
      } else {
        alert(`Failed to ${action} payment`)
      }
    } catch (error) {
      console.error(`Failed to ${action} payment:`, error)
      alert(`Failed to ${action} payment`)
    }
  }

  const handleUserStatusChange = async (userId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive })
      })

      if (response.ok) {
        fetchDashboardData() // Refresh data
        alert(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
      } else {
        alert('Failed to update user status')
      }
    } catch (error) {
      console.error('Failed to update user status:', error)
      alert('Failed to update user status')
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
              A
            </div>
            <span className="font-bold text-xl hidden sm:inline">Admin Dashboard</span>
          </div>
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
            Back to Trading
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'User Management', icon: '👥' },
            { id: 'payments', label: 'Payment Approvals', icon: '💰' },
            { id: 'transactions', label: 'Transactions', icon: '📈' },
            { id: 'orders', label: 'Orders', icon: '📋' },
            { id: 'audit', label: 'Audit Logs', icon: '🔍' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card-premium">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">👥</span>
                  <span className="text-sm text-muted-foreground">Total Users</span>
                </div>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="card-premium">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-sm text-muted-foreground">Active Users</span>
                </div>
                <p className="text-3xl font-bold">{stats.activeUsers}</p>
              </div>
              <div className="card-premium">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⏳</span>
                  <span className="text-sm text-muted-foreground">Pending Payments</span>
                </div>
                <p className="text-3xl font-bold">{stats.pendingPayments}</p>
              </div>
              <div className="card-premium">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📈</span>
                  <span className="text-sm text-muted-foreground">Total Transactions</span>
                </div>
                <p className="text-3xl font-bold">{stats.recentTransactions}</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-premium">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border/50">
                    <div>
                      <p className="font-medium">{tx.user?.email || 'Unknown User'}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.transactionType} - ${tx.amount}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      tx.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                      tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search users by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-input border border-border rounded-lg px-4 py-2"
              />
            </div>

            {/* Users Table */}
            <div className="card-premium">
              <h3 className="text-xl font-bold mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Joined</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            user.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleUserStatusChange(user.id, !user.isActive)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              user.isActive
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="card-premium">
              <h3 className="text-xl font-bold mb-4">Pending Payment Approvals</h3>
              <div className="space-y-4">
                {payments.map(payment => (
                  <div key={payment.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{payment.user?.email || 'Unknown User'}</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.currency} - ${payment.amount}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                        {payment.status}
                      </span>
                    </div>
                    {payment.proofUrl && (
                      <div className="mb-3">
                        <img
                          src={`${API_BASE_URL}${payment.proofUrl}`}
                          alt="Payment proof"
                          className="max-w-xs rounded border"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePaymentAction(payment.id, 'approve')}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handlePaymentAction(payment.id, 'reject')}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {payments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No pending payments</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
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
                  {transactions.map(tx => (
                    <tr key={tx.id} className="border-b border-border/50">
                      <td className="py-3 px-4">{tx.user?.email || 'Unknown'}</td>
                      <td className="py-3 px-4">{tx.transactionType}</td>
                      <td className="py-3 px-4">${tx.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          tx.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                          tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="card-premium">
            <h3 className="text-xl font-bold mb-4">Order Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Currency</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-border/50">
                      <td className="py-3 px-4">{order.user?.email || 'Unknown'}</td>
                      <td className="py-3 px-4">{order.currency}</td>
                      <td className="py-3 px-4">${order.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="card-premium">
            <h3 className="text-xl font-bold mb-4">Audit Logs</h3>
            <p className="text-muted-foreground">Audit logging functionality to be implemented</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="card-premium">
            <h3 className="text-xl font-bold mb-4">Send Notifications</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  className="w-full bg-input border border-border rounded-lg px-4 py-3 min-h-[100px]"
                  placeholder="Enter notification message..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target</label>
                <select className="w-full bg-input border border-border rounded-lg px-4 py-3">
                  <option>All Users</option>
                  <option>Active Users Only</option>
                  <option>Specific User</option>
                </select>
              </div>
              <button className="btn-primary">Send Notification</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}