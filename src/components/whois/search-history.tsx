"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/contexts/language-context"
import { controlSpring, panelTransition } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { SearchHistoryItem } from "@/utils/storage"

interface SearchHistoryProps {
  onSelectDomain: (domain: string) => void
  history: SearchHistoryItem[]
  onRemoveSearch: (domain: string) => void
  onClearHistory: () => void
  className?: string
}

export function SearchHistory({
  onSelectDomain,
  history,
  onRemoveSearch,
  onClearHistory,
  className,
}: SearchHistoryProps) {
  const [clearOpen, setClearOpen] = useState(false)
  const { t } = useLanguage()

  if (history.length === 0) return null

  const visibleHistory = history.slice(0, 8)

  return (
    <motion.aside
      layout
      initial={{ opacity: 0, x: 18, filter: "blur(7px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 18, filter: "blur(7px)" }}
      transition={panelTransition}
      className={cn("self-start", className)}
      aria-label={t.searchHistory.title}
    >
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2.5">
            <h2 className="flex items-center gap-2.5">
              <HugeiconsIcon icon={Clock01Icon} strokeWidth={1.8} className="size-4.5 text-muted-foreground" />
              {t.searchHistory.title}
              <span className="text-xs font-normal tabular-nums text-muted-foreground">
                {history.length}
              </span>
            </h2>
          </CardTitle>
          <CardAction>
            <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t.searchHistory.clearAll}
                        />
                      }
                    />
                  }
                >
                  <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
                </TooltipTrigger>
                <TooltipContent>{t.searchHistory.clearAll}</TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.8} />
                  </AlertDialogMedia>
                  <AlertDialogTitle>{t.searchHistory.clearTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.searchHistory.clearDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.searchHistory.cancel}</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      onClearHistory()
                      setClearOpen(false)
                    }}
                  >
                    {t.searchHistory.confirmClear}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardAction>
        </CardHeader>

        <CardContent className="px-2">
          <ScrollArea
            className={cn(
              "pr-1",
              visibleHistory.length > 5 && "h-[min(21rem,46vh)]"
            )}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visibleHistory.map((item, index) => (
                <motion.div
                  layout
                  key={`${item.domain}-${item.timestamp}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 14, scale: 0.98 }}
                  transition={{ ...controlSpring, delay: index * 0.035 }}
                  className="group/history grid grid-cols-[minmax(0,1fr)_auto] items-center gap-1 border-b last:border-b-0"
                >
                  <Button
                    variant="ghost"
                    onClick={() => onSelectDomain(item.domain)}
                    className="h-auto min-h-14 min-w-0 justify-start rounded-2xl px-2.5 py-2 text-left shadow-none hover:shadow-none"
                  >
                    <HugeiconsIcon
                      icon={item.success ? CheckmarkCircle02Icon : AlertCircleIcon}
                      strokeWidth={1.8}
                      className={cn(
                        "size-4 shrink-0",
                        item.success ? "text-chart-3" : "text-destructive"
                      )}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{item.domain}</span>
                      <span className="block text-xs font-normal tabular-nums text-muted-foreground">
                        {formatTime(item.timestamp, t.searchHistory)}
                      </span>
                    </span>
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={1.8}
                      className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/history:translate-x-0.5 motion-reduce:transform-none"
                    />
                  </Button>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onRemoveSearch(item.domain)}
                          aria-label={`${t.searchHistory.remove} ${item.domain}`}
                          className="opacity-70 sm:opacity-0 sm:group-hover/history:opacity-100 sm:focus-visible:opacity-100"
                        />
                      }
                    >
                      <HugeiconsIcon icon={Cancel01Icon} strokeWidth={1.8} />
                    </TooltipTrigger>
                    <TooltipContent>{t.searchHistory.remove}</TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.aside>
  )
}

function formatTime(
  timestamp: number,
  labels: {
    justNow: string
    minutesAgo: string
    hoursAgo: string
    daysAgo: string
  }
) {
  const diff = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)

  if (minutes < 1) return labels.justNow
  if (minutes < 60) return `${minutes}${labels.minutesAgo}`
  if (hours < 24) return `${hours}${labels.hoursAgo}`
  return `${days}${labels.daysAgo}`
}
