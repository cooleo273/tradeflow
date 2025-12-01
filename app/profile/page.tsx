"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Clock, Lock, ArrowUpRight, ArrowRight } from "lucide-react"
import { useBalance } from "@/lib/hooks/useBalance"

export default function ProfilePage() {
  const { balanceData, loading, error } = useBalance(5000) // Refresh every 5 seconds
  const userEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") || "user@example.com" : "user@example.com"
  const userName = userEmail.split("@")[0]

  // Insights removed per request; clean header

  const settingsLinks = [
    {
      label: "Real Name Authentication",
      icon: ShieldCheck,
      description: "Verify your identity and unlock higher limits",
      href: "/profile/real-name",
    },
    {
      label: "Billing History",
      icon: Clock,
      description: "See every deposit, withdrawal and fee",
      href: "/profile/billing",
    },
    {
      label: "Change Password",
      icon: Lock,
      description: "Keep your account secure with regular updates",
      href: "/profile/password",
    },
  ]

  const quickActions = [
    { label: "Deposit", href: "/deposit" },
    { label: "Withdraw", href: "/withdraw" },
    { label: "Start Trading", href: "/trading" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
              C
            </div>
            <span className="font-bold text-xl hidden sm:inline">CryptoSphere Trade</span>
          </div>
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
            Back to Trading
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Profile Header */}
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-900 via-slate-900/40 to-slate-900/80 p-8 mb-10">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row gap-8 items-center lg:items-start">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold shadow-xl">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Welcome back</p>
                <h1 className="text-3xl font-semibold">{userName}</h1>
                <p className="text-muted-foreground">{userEmail}</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center lg:justify-end">
              <div className="hidden lg:flex items-center gap-3">
                <Link href="/deposit">
                  <Button variant="primary" className="px-4 py-2">Deposit</Button>
                </Link>
                <Link href="/withdraw">
                  <Button variant="default" className="px-4 py-2">Withdraw</Button>
                </Link>
                <Link href="/trading">
                  <Button variant="primary" className="px-4 py-2">Start Trading</Button>
                </Link>
              </div>
              <div className="lg:hidden text-sm text-muted-foreground">Welcome back — explore your account below</div>
            </div>
          </div>
        </section>

        {/* Account Balance & quick actions */}
        <section className="grid xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 mb-10">
          <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-primary/10 p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Account balance</p>
                <h2 className="text-4xl font-bold text-blue-100 mt-2">
                  {loading ? (
                    <div role="status" aria-live="polite" className="space-y-2">
                      <div className="h-8 w-40 bg-white/20 rounded-2xl animate-pulse" />
                    </div>
                  ) : error ? (
                    <span className="text-red-300 text-base">{error}</span>
                  ) : (
                    `$${(balanceData?.balance ?? 0).toFixed(2)} ${balanceData?.currency || "USDT"}`
                  )}
                </h2>
                <p className="text-xs text-blue-100/80 mt-2">
                  Updated every 5 seconds · Trading profits auto-compounded
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <Link href="/deposit" className="w-full">
                  <Button variant="primary" className="w-full rounded-2xl shadow-md">Deposit</Button>
                </Link>
                <Link href="/withdraw" className="w-full">
                  <Button variant="default" className="w-full rounded-2xl border border-white/10 bg-white/5 text-white">Withdraw</Button>
                </Link>
                <Link href="/trading" className="w-full">
                  <Button variant="primary" className="w-full rounded-2xl shadow-md">Start Trading</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security status</p>
                <p className="text-lg font-semibold">High</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-emerald-400" />
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> 2FA enabled
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Withdrawal whitelist active
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Device monitoring running
              </li>
            </ul>
            <Link href="/profile/real-name" className="inline-flex items-center gap-2 text-sm text-primary font-medium">
              Manage verification
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Settings cards */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mb-10">
          {settingsLinks.map(({ label, description, icon: Icon, href }) => (
            <Link key={label} href={href} className="group">
              <div className="h-full rounded-2xl border border-border bg-card/70 p-5 transition-all group-hover:border-primary/50 group-hover:-translate-y-0.5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/60 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <span className="inline-flex items-center text-sm text-muted-foreground group-hover:text-primary">
                  Open
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </section>

        {/* Support & logout */}
        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start">
          <div className="rounded-3xl border border-border bg-card/70 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Need help?</p>
                <h3 className="text-xl font-semibold">24/7 concierge desk</h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Live</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with a human specialist for account reviews, transfer disputes or verification support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-2xl" variant="default">Open chat</Button>
              <Button className="rounded-2xl" variant="ghost">Schedule call</Button>
            </div>
          </div>

          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6">
            <h3 className="text-lg font-semibold text-red-200 mb-3">Sign out securely</h3>
            <p className="text-sm text-red-100/80 mb-4">Always log out on shared devices to protect funds.</p>
            <button
              onClick={() => {
                localStorage.removeItem("isAuthenticated")
                localStorage.removeItem("userEmail")
                localStorage.removeItem("userName")
                localStorage.removeItem("token")
                localStorage.removeItem("userId")
                window.location.href = "/auth/login"
              }}
              className="w-full btn-danger rounded-2xl"
            >
              Logout
            </button>
          </div>
        </div>

      </main>
    </div>
  )
}
