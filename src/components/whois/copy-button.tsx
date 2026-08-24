"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon, Copy01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useLanguage } from "@/contexts/language-context"
import { controlSpring } from "@/lib/motion"

interface CopyButtonProps {
  value: string
  label?: string
  className?: string
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = value
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }

    setCopied(true)
    toast.success(t.results.copied)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const accessibleLabel = label ?? t.results.copyToClipboard

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            aria-label={accessibleLabel}
            className={className}
          />
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ opacity: 0, scale: 0.55, rotate: -18 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.55, rotate: 18 }}
            transition={controlSpring}
            className={copied ? "text-chart-3" : undefined}
          >
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
              strokeWidth={1.9}
            />
          </motion.span>
        </AnimatePresence>
      </TooltipTrigger>
      <TooltipContent>{copied ? t.results.copied : accessibleLabel}</TooltipContent>
    </Tooltip>
  )
}
