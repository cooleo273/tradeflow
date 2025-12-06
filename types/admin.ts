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
  balances?: Record<string, number>
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
  currency?: string
  address?: string
  network?: string
  txHash?: string
  note?: string
  createdAt: string
  user?: User
}

export interface Withdrawal {
  id: number | string
  userId: number | string
  amount: number
  asset: string
  network: string
  address: string
  status: string
  txHash?: string
  memo?: string
  userNote?: string
  passcode?: string
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
  direction?: "UP" | "DOWN"
  status: string
  price?: number
  duration?: string
  createdAt: string
  user?: User
  result?: "WIN" | "LOSS"
  outcome?: "WIN" | "LOSS"
  settledLossAmount?: number
  settledPayout?: number
  forcedLossExpected?: boolean
  lossPercent?: number
  expectedLossAmount?: number
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
