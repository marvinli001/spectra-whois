"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ComputerIcon,
  Moon02Icon,
  Sun03Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { microTransition } from "@/lib/motion"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme, setTheme } = useTheme()
  const { t } = useLanguage()

  useEffect(() => setMounted(true), [])

  const icon = !mounted
    ? ComputerIcon
    : resolvedTheme === "dark"
      ? Moon02Icon
      : Sun03Icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon-lg"
            aria-label={t.appearance.theme}
            className="shrink-0"
          />
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mounted ? resolvedTheme : "system"}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={microTransition}
            className="grid place-items-center"
          >
            <HugeiconsIcon icon={icon} strokeWidth={1.8} />
          </motion.span>
        </AnimatePresence>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.appearance.theme}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            data-active={theme === "light" || undefined}
          >
            <HugeiconsIcon icon={Sun03Icon} strokeWidth={1.8} />
            {t.appearance.light}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            data-active={theme === "dark" || undefined}
          >
            <HugeiconsIcon icon={Moon02Icon} strokeWidth={1.8} />
            {t.appearance.dark}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            data-active={theme === "system" || undefined}
          >
            <HugeiconsIcon icon={ComputerIcon} strokeWidth={1.8} />
            {t.appearance.system}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
