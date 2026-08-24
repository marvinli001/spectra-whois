"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  ArrowDown01Icon,
  CodeIcon,
  Globe02Icon,
  ReloadIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"
import { panelTransition } from "@/lib/motion"
import { WhoisError } from "@/types/rdap"

export function LookupLoading({ domain }: { domain: string }) {
  const reduceMotion = useReducedMotion()
  const { t } = useLanguage()

  return (
    <motion.section
      key="loading"
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
      transition={panelTransition}
      className="space-y-5"
      role="status"
      aria-live="polite"
    >
      <Card>
        <CardHeader className="gap-3 border-b">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-3xl bg-primary/10 text-primary">
              <HugeiconsIcon icon={Globe02Icon} strokeWidth={1.8} className="size-5" />
            </span>
            <div>
              <p className="font-heading text-lg font-medium">{domain}</p>
              <p className="text-sm text-muted-foreground">{t.queryingServers}</p>
            </div>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-primary/10">
            <motion.div
              className="h-full origin-left rounded-full bg-primary"
              initial={{ scaleX: 0.12, opacity: 0.65 }}
              animate={
                reduceMotion
                  ? { scaleX: 0.55, opacity: 0.8 }
                  : { scaleX: [0.12, 0.86, 0.35], opacity: [0.65, 1, 0.72] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 1.8, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }
              }
            />
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 pt-1 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-4/5" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}

interface LookupErrorStateProps {
  error: WhoisError
  onRetry: () => void
  onReset: () => void
}

export function LookupErrorState({
  error,
  onRetry,
  onReset,
}: LookupErrorStateProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const { t } = useLanguage()

  const title =
    error.code === "INVALID_DOMAIN"
      ? t.errors.domainNotFound
      : error.code === "TLD_NOT_SUPPORTED"
        ? t.errors.tldNotSupported
        : error.code === "RATE_LIMITED"
          ? t.errors.rateLimited
          : error.code === "NETWORK_ERROR"
            ? t.errors.networkError
            : t.results.lookupFailed

  const detail = ["RDAP_ERROR", "QUERY_ERROR", "NETWORK_ERROR"].includes(
    error.code
  )
    ? error.message
    : null

  return (
    <motion.section
      key="error"
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.99 }}
      transition={panelTransition}
      className="mx-auto max-w-3xl"
    >
      <Card>
        <CardContent className="space-y-6 pt-1">
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={1.8} />
            <AlertTitle>{title}</AlertTitle>
            {detail && <AlertDescription>{detail}</AlertDescription>}
          </Alert>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onReset}>
              <HugeiconsIcon icon={Search01Icon} strokeWidth={1.8} />
              {t.actions.newSearch}
            </Button>
            <Button onClick={onRetry}>
              <HugeiconsIcon icon={ReloadIcon} strokeWidth={1.8} />
              {t.actions.retry}
            </Button>
          </div>
          {process.env.NODE_ENV === "development" && error.details && (
            <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
              <CollapsibleTrigger
                render={<Button variant="outline" size="sm" className="w-fit" />}
              >
                <HugeiconsIcon icon={CodeIcon} strokeWidth={1.8} />
                Technical details
                <motion.span
                  animate={{ rotate: detailsOpen ? 180 : 0 }}
                  transition={panelTransition}
                  className="grid place-items-center"
                >
                  <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={1.8} />
                </motion.span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 overflow-hidden rounded-2xl border bg-muted/40 text-xs text-muted-foreground data-open:animate-collapsible-down data-closed:animate-collapsible-up">
                <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words p-4">
                  {String(error.details)}
                </pre>
              </CollapsibleContent>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </motion.section>
  )
}
