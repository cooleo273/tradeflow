"use client"

import Link from "next/link"
import { ShieldCheck, FileText, Upload } from "lucide-react"

export default function RealNamePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <div>
          <p className="text-sm text-muted-foreground">Profile · Verification</p>
          <h1 className="text-3xl font-bold mt-2">Real Name Authentication</h1>
          <p className="text-muted-foreground max-w-2xl">
            Complete your KYC to unlock higher withdrawal limits and access to institutional features. All data is
            encrypted in transit and at rest.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <div>
              <p className="font-semibold">Verification checklist</p>
              <p className="text-sm text-muted-foreground">Submit documents in high resolution (at least 300 DPI).</p>
            </div>
          </div>
          <ol className="space-y-4 text-sm text-muted-foreground list-decimal list-inside">
            <li>Government-issued ID (passport, driver’s license or national ID)</li>
            <li>Selfie while holding the ID and note with today’s date</li>
            <li>Proof of address dated within the last 3 months (utility bill or bank statement)</li>
          </ol>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="rounded-2xl border border-border/70 bg-card/40 p-4 flex items-center gap-3 text-left">
              <FileText className="h-5 w-5 text-primary" />
              Download submission guide
            </button>
            <button className="rounded-2xl border border-primary/40 bg-primary/10 p-4 flex items-center gap-3 text-left">
              <Upload className="h-5 w-5 text-primary" />
              Upload documents
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-3xl border border-border/70 bg-card/40 p-6">
          <div>
            <p className="text-sm text-muted-foreground">Need a hand?</p>
            <p className="font-semibold">Our verification specialists reply in under 5 minutes.</p>
          </div>
          <Link href="/profile" className="text-primary text-sm font-medium">
            Back to profile
          </Link>
        </div>
      </div>
    </div>
  )
}
