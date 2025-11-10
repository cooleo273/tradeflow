"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"

interface WalletConnectProps {
  connected: boolean
  address: string
  onConnect: () => void
  onDisconnect: () => void
  loading: boolean
}

export default function WalletConnect({ connected, address, onConnect, onDisconnect, loading }: WalletConnectProps) {
  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm text-muted-foreground font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        <Button onClick={onDisconnect} variant="outline" size="sm" className="border-border bg-transparent">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Disconnect</span>
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={onConnect} disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90">
      <Wallet className="h-4 w-4" />
      <span className="hidden sm:inline ml-2">{loading ? "Connecting..." : "Connect"}</span>
    </Button>
  )
}
