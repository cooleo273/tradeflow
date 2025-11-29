"use client"

import Link from "next/link"
import { Lock, KeyRound, Shield } from "lucide-react"
import { useState, ChangeEvent } from "react"

export default function PasswordSettingsPage() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" })

  const handleChange = (field: "current" | "next" | "confirm") => (event: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 space-y-10">
        <div>
          <p className="text-sm text-muted-foreground">Profile · Security</p>
          <h1 className="text-3xl font-bold mt-2">Change Password</h1>
          <p className="text-muted-foreground max-w-2xl">
            We recommend rotating your password every 90 days. Choose a unique phrase with at least 12 characters.
          </p>
        </div>

        <form className="rounded-3xl border border-border bg-card/60 p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <p className="font-semibold">Update credentials</p>
              <p className="text-sm text-muted-foreground">Password is encrypted before leaving your browser.</p>
            </div>
          </div>

          <label className="block text-sm">
            Current password
            <input
              type="password"
              className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3"
              value={form.current}
              onChange={handleChange("current")}
            />
          </label>
          <label className="block text-sm">
            New password
            <input
              type="password"
              className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3"
              value={form.next}
              onChange={handleChange("next")}
            />
          </label>
          <label className="block text-sm">
            Confirm new password
            <input
              type="password"
              className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-3"
              value={form.confirm}
              onChange={handleChange("confirm")}
            />
          </label>

          <button type="button" className="w-full rounded-2xl bg-primary text-primary-foreground py-3 font-semibold">
            Save password
          </button>
        </form>

        <div className="rounded-3xl border border-border/60 bg-card/40 p-6 space-y-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3 text-foreground">
            <KeyRound className="h-5 w-5 text-primary" />
            <span className="font-semibold">Security checklist</span>
          </div>
          <ul className="list-disc list-inside space-y-2">
            <li>Use a password manager to generate random strings</li>
            <li>Never reuse your email password</li>
            <li>Enable hardware-key 2FA for withdrawals</li>
          </ul>
          <div className="flex items-center gap-3 text-foreground">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span>Need help from security? <Link href="/profile" className="text-primary">Contact support</Link>.</span>
          </div>
        </div>

        <Link href="/profile" className="inline-flex items-center gap-2 text-primary text-sm font-medium">
          ← Back to profile
        </Link>
      </div>
    </div>
  )
}
