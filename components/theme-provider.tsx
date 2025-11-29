'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use `class` so theme names apply as CSS classes: `.theme-ocean`, `.theme-neon`, etc.
  return (
    <NextThemesProvider attribute="class" defaultTheme="ocean" {...props}>
      {children}
    </NextThemesProvider>
  )
}
