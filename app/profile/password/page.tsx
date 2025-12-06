"use client"

import Link from "next/link"
import { Lock, KeyRound, Shield } from "lucide-react"
import { useState, ChangeEvent, FormEvent } from "react"
import { API_BASE_URL } from "@/lib/config"
import { getUserId } from "@/lib/auth"

export default function PasswordSettingsPage() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleChange = (field: "current" | "next" | "confirm") => (event: ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }))
  }

  const validate = () => {
    if (!form.current || !form.next || !form.confirm) {
      return "Please fill out every field"
    }
    if (form.next.length < 8) {
      return "New password must be at least 8 characters"
    }
    if (form.next !== form.confirm) {
      return "New password and confirmation must match"
    }
    if (form.current === form.next) {
      return "Please choose a different password than your current one"
    }
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setMessage({ type: "error", text: validationError })
      return
    }

    setSubmitting(true)
    setMessage(null)
    try {
      const token = localStorage.getItem("token")
      const userId = getUserId()
      if (!userId || !token) {
        setMessage({ type: "error", text: "Please log in again to change your password" })
        return
      }
      const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || "Failed to update password")
      }

      setMessage({ type: "success", text: "Password updated successfully" })
      setForm({ current: "", next: "", confirm: "" })
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to update password"
      setMessage({ type: "error", text })
    } finally {
      setSubmitting(false)
    }
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
        {message && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/40 bg-red-500/10 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card/60 p-6 space-y-5">
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-primary text-primary-foreground py-3 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save password"}
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
