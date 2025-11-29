"use client"

import React from "react"

export function Avatar({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${className || "bg-gradient-to-br from-cyan-400 to-blue-500"}`}>
      {children}
    </div>
  )
}

export default Avatar
