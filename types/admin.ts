import { LucideIcon } from "lucide-react"

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  forceLossEnabled?: boolean
  balance?: number
  currency?: string
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

export interface Order {
  id: number
  userId: number
  pair: string
  amount: number
  currency: string
  type: string
  status: string
  price?: number
  duration?: string
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

export interface PredictionOptionType {
  id: string
  seconds: number
  returnRate: number
  capitalMin: number
  capitalMax: number
  currency: string
  pair?: string | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}
