"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [currentTheme, setCurrentTheme] = React.useState<string | undefined>(undefined)

  // Only show the toggle after hydration to avoid SSR issues
  React.useEffect(() => {
    setMounted(true)
    // Use the resolved theme from next-themes after mounting
    setCurrentTheme(resolvedTheme || 'light')
  }, [resolvedTheme])

  // Update current theme when theme changes
  React.useEffect(() => {
    if (mounted && theme) {
      setCurrentTheme(theme)
    }
  }, [theme, mounted])

  // Theme toggle handler
  const toggleTheme = React.useCallback(() => {
    if (!currentTheme) return
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [currentTheme, setTheme])

  // Render nothing during SSR to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
    >
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg z-50 bg-background/80 backdrop-blur-sm border-2"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentTheme === "dark" ? "dark" : "light"}
            initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            {currentTheme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.div>
        </AnimatePresence>
      </Button>
    </motion.div>
  )
} 