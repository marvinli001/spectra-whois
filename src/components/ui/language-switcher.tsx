"use client"

import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, LanguagesIcon } from "@hugeicons/core-free-icons"

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
import { controlSpring } from "@/lib/motion"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="lg"
            className="h-10 min-w-[72px] px-3"
            aria-label={t.language}
          />
        }
      >
        <HugeiconsIcon icon={LanguagesIcon} strokeWidth={1.8} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={language}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={controlSpring}
          >
            {language === "zh" ? "EN" : "中文"}
          </motion.span>
        </AnimatePresence>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.language}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setLanguage("zh")}>
            <span className="flex-1">中文</span>
            {language === "zh" && (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={1.8} />
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage("en")}>
            <span className="flex-1">English</span>
            {language === "en" && (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={1.8} />
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
