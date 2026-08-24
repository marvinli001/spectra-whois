"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Globe02Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { EnvDebugPanel } from "@/components/debug/env-debug"
import { useLanguage } from "@/contexts/language-context"

interface AppHeaderProps {
  onReset: () => void
}

export function AppHeader({ onReset }: AppHeaderProps) {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={onReset}
          className="h-11 gap-2.5 px-2 text-base font-semibold tracking-[-0.02em] sm:text-lg"
          aria-label={`${t.title} - ${t.actions.returnHome}`}
        >
          <span className="grid size-8 place-items-center rounded-2xl bg-primary/10 text-primary">
            <HugeiconsIcon icon={Globe02Icon} strokeWidth={1.8} className="size-5" />
          </span>
          <span className="max-[359px]:sr-only">{t.title}</span>
        </Button>

        <div className="flex items-center gap-2">
          <EnvDebugPanel />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
