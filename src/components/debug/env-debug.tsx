"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getConfigDebugInfo } from "@/utils/env-checker"
import { controlSpring } from "@/lib/motion"

export function EnvDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<ReturnType<typeof getConfigDebugInfo> | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setDebugInfo(getConfigDebugInfo())
  }, [])

  if (process.env.NODE_ENV !== "development" || !debugInfo) {
    return null
  }

  const { config, envVars, suggestions } = debugInfo
  const StatusIcon = config.hasPluginUrl
    ? CheckmarkCircle02Icon
    : AlertCircleIcon

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label="WHOIS configuration"
                  className={config.hasPluginUrl ? "text-chart-3" : "text-muted-foreground"}
                />
              }
            />
          }
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={controlSpring}
            className="grid place-items-center"
          >
            <HugeiconsIcon icon={Settings02Icon} strokeWidth={1.8} />
          </motion.span>
        </TooltipTrigger>
        <TooltipContent>
          WHOIS {config.hasPluginUrl ? "configured" : "not configured"}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-[min(23rem,calc(100vw-2rem))] p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 text-foreground">
            <HugeiconsIcon icon={StatusIcon} strokeWidth={1.8} />
            WHOIS configuration
          </DropdownMenuLabel>
          <div className="grid gap-2 px-3 py-2 text-xs text-muted-foreground">
            <DebugRow label="Platform" value={config.platform ?? "unknown"} />
            <DebugRow label="Source" value={config.source} />
            <DebugRow label="Plugin URL" value={config.pluginUrl ?? "Not configured"} />
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Environment</DropdownMenuLabel>
          <div className="grid gap-2 px-3 py-2 text-xs">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="min-w-0 truncate text-muted-foreground">{key}</span>
                <span className="flex shrink-0 items-center gap-1.5 text-foreground">
                  <HugeiconsIcon
                    icon={value ? CheckmarkCircle02Icon : AlertCircleIcon}
                    strokeWidth={1.8}
                    className={value ? "size-3.5 text-chart-3" : "size-3.5 text-muted-foreground"}
                  />
                  {value ? "Set" : "Missing"}
                </span>
              </div>
            ))}
          </div>
        </DropdownMenuGroup>
        {suggestions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Next step</DropdownMenuLabel>
              <div className="space-y-1.5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                {suggestions.map((suggestion) => (
                  <p key={suggestion}>{suggestion}</p>
                ))}
              </div>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DebugRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] gap-3">
      <span>{label}</span>
      <span className="min-w-0 break-all text-foreground">{value}</span>
    </div>
  )
}
