"use client"

import { useState } from "react"
import Link from "next/link"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
              T
            </div>
            <span className="font-bold text-xl hidden sm:inline">TradeFlow</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Markets
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden lg:inline">Welcome to TradeFlow platform</span>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <span className="text-lg text-muted-foreground hover:text-foreground">🔔</span>
          </button>
          <Link href="/profile">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center cursor-pointer font-bold text-sm shadow-lg hover:shadow-lg hover:shadow-primary/30 transition-all">
              G
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
