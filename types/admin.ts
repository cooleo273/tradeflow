import { LucideIcon } from "lucide-react"

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt: string
}

export interface Payment {
  id: number
  userId: number
  amount: number
  currency: string
  status: string
  proofUrl?: string
  createdAt: string
  user?: User
}

export interface Transaction {
  id: number
  userId: number
  amount: number
  transactionType: string
  status: string
  createdAt: string
  user?: User
}

export interface Stats {
  totalUsers: number
  activeUsers: number
  pendingApprovals: number
  pendingPayments: number
  recentTransactions: number
}

export interface SystemAlert {
  id: number
  title: string
  severity: "High" | "Medium" | "Low"
  detail: string
  timestamp: string
}

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
}
