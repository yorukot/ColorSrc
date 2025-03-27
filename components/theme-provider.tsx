"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Define props type directly to avoid import issue
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force the client to handle theme detection entirely
  // This prevents server/client mismatch
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR and initial client render, render children without theme context
  // to avoid hydration mismatch
  if (!mounted) {
    return (
      <div 
        style={{ 
          visibility: "hidden",
          // Force at least some content to occupy space
          // This minimizes layout shift when the real content renders
          minHeight: "100vh",
          opacity: 0 
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
} 