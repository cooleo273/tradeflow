"use client"

import React from "react"
import clsx from "clsx"

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx("bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30", className)}
    />
  )
}

export default Input
