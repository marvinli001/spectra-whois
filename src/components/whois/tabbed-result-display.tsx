"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  Database02Icon,
  ReloadIcon,
  ServerStack01Icon,
} from "@hugeicons/core-free-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { panelTransition } from "@/lib/motion"
import {
  needsTraditionalWhois,
  type WhoisResponse,
} from "@/services/whois/traditional"
import type { WhoisResult } from "@/types/rdap"
import {
  getWhoisPluginUrl,
  shouldShowWhoisTab,
} from "@/utils/env-checker"
import { ResultDisplay } from "./result-display"
import { WhoisResultDisplay } from "./whois-result-display"

interface TabbedResultDisplayProps {
  rdapResult: WhoisResult
  domain: string
}

type ProtocolTab = "rdap" | "whois"

export function TabbedResultDisplay({
  rdapResult,
  domain,
}: TabbedResultDisplayProps) {
  const needsWhoisOnly = needsTraditionalWhois(domain)
  const [activeTab, setActiveTab] = useState<ProtocolTab>("rdap")
  const [whoisResult, setWhoisResult] = useState<WhoisResponse | null>(null)
  const [whoisLoading, setWhoisLoading] = useState(false)
  const [whoisError, setWhoisError] = useState<string | null>(null)
  const [showWhoisTab, setShowWhoisTab] = useState(false)
  const whoisRequestRef = useRef<AbortController | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    setShowWhoisTab(shouldShowWhoisTab() && !needsWhoisOnly)
    return () => whoisRequestRef.current?.abort()
  }, [needsWhoisOnly])

  const fetchWhoisData = async () => {
    const pluginUrl = getWhoisPluginUrl()
    if (!pluginUrl) {
      setWhoisError(
        "WHOIS plugin is not configured. Set NEXT_PUBLIC_WHOIS_PLUGIN_URL to enable comparison."
      )
      return
    }

    whoisRequestRef.current?.abort()
    const controller = new AbortController()
    whoisRequestRef.current = controller
    setWhoisLoading(true)
    setWhoisError(null)

    try {
      const response = await fetch(
        `${pluginUrl}?domain=${encodeURIComponent(domain)}`,
        {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: WhoisResponse = await response.json()
      if (!data.success) {
        throw new Error(data.error || "WHOIS query failed")
      }
      setWhoisResult(data)
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setWhoisError(
        error instanceof Error ? error.message : t.results.failedToLoadWhois
      )
    } finally {
      if (!controller.signal.aborted) setWhoisLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    const nextTab = value as ProtocolTab
    setActiveTab(nextTab)
    if (nextTab === "whois" && !whoisResult && !whoisLoading && !whoisError) {
      void fetchWhoisData()
    }
  }

  if (needsWhoisOnly || !showWhoisTab) {
    return <ResultDisplay result={rdapResult} />
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="gap-5">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={panelTransition}
        className="flex justify-center"
      >
        <TabsList aria-label={t.results.source}>
          <TabsTrigger value="rdap" className="min-h-11">
            <HugeiconsIcon icon={Database02Icon} strokeWidth={1.8} />
            RDAP
          </TabsTrigger>
          <TabsTrigger value="whois" className="min-h-11">
            <HugeiconsIcon icon={ServerStack01Icon} strokeWidth={1.8} />
            WHOIS
          </TabsTrigger>
        </TabsList>
      </motion.div>

      <TabsContent value={activeTab}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
            transition={panelTransition}
          >
            {activeTab === "rdap" && <ResultDisplay result={rdapResult} />}
            {activeTab === "whois" && (
              <WhoisPanel
                loading={whoisLoading}
                error={whoisError}
                result={whoisResult}
                onRetry={() => void fetchWhoisData()}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </TabsContent>
    </Tabs>
  )
}

function WhoisPanel({
  loading,
  error,
  result,
  onRetry,
}: {
  loading: boolean
  error: string | null
  result: WhoisResponse | null
  onRetry: () => void
}) {
  const { t } = useLanguage()

  if (loading) {
    return (
      <Card>
        <CardContent className="grid gap-4 pt-1 lg:grid-cols-2" role="status">
          <span className="sr-only">{t.results.loadingWhoisData}</span>
          <div className="space-y-3">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="space-y-5 pt-1">
          <Alert variant="destructive">
            <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={1.8} />
            <AlertTitle>{t.results.failedToLoadWhois}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={onRetry}>
            <HugeiconsIcon icon={ReloadIcon} strokeWidth={1.8} />
            {t.results.retry}
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (result) return <WhoisResultDisplay result={result} />

  return null
}
