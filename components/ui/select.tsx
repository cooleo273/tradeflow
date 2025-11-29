"use client"

import React from "react"
import clsx from "clsx"

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={clsx("bg-background border border-border rounded-2xl px-3 py-2 text-sm", className)}>
      {children}
    </select>
  )
}

export default Select
