"use client"

import React from "react"
import clsx from "clsx"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost" | "destructive"
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
        variant === "primary" && "btn-primary",
        variant === "destructive" && "btn-danger",
        variant === "ghost" && "bg-transparent hover:bg-secondary",
        className
      )}
    />
  )
}

export default Button
