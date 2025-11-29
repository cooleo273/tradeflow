"use client"

import React from "react"
import clsx from "clsx"

export function IconButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={clsx("p-2 rounded-2xl hover:bg-secondary transition-colors", className)}>
      {children}
    </button>
  )
}

export default IconButton
