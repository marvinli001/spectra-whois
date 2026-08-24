"use client"

import { ThemeProvider } from "next-themes"
import { MotionConfig } from "motion/react"

import { LanguageProvider } from "@/contexts/language-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { easeOutExpo } from "@/lib/motion"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.28, ease: easeOutExpo }}
      >
        <TooltipProvider delay={280}>
          <LanguageProvider>
            {children}
            <Toaster position="bottom-center" richColors closeButton />
          </LanguageProvider>
        </TooltipProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
