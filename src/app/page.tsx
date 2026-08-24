"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { AppHeader } from "@/components/ui/app-header"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { LookupErrorState, LookupLoading } from "@/components/whois/lookup-states"
import { SearchForm } from "@/components/whois/search-form"
import { SearchHistory } from "@/components/whois/search-history"
import { TabbedResultDisplay } from "@/components/whois/tabbed-result-display"
import { useLanguage } from "@/contexts/language-context"
import { useSearchHistory } from "@/hooks/use-search-history"
import { panelTransition, workbenchSpring } from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { WhoisError, WhoisResult } from "@/types/rdap"

export default function Home() {
  const [inputDomain, setInputDomain] = useState("")
  const [result, setResult] = useState<WhoisResult | null>(null)
  const [error, setError] = useState<WhoisError | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchedDomain, setSearchedDomain] = useState("")
  const requestRef = useRef<AbortController | null>(null)
  const resultsRegionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()
  const { addSearch, history, removeSearch, clearHistory } = useSearchHistory()

  useEffect(() => {
    return () => requestRef.current?.abort()
  }, [])

  useEffect(() => {
    if (hasSearched && !loading && (result || error)) {
      const frame = window.requestAnimationFrame(() => {
        resultsRegionRef.current?.focus({ preventScroll: true })
      })
      return () => window.cancelAnimationFrame(frame)
    }
  }, [error, hasSearched, loading, result])

  const handleSearch = async (domain: string) => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller

    setInputDomain(domain)
    setSearchedDomain(domain)
    setHasSearched(true)
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`, {
        signal: controller.signal,
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data)
        addSearch(domain, false)
        return
      }

      setResult(data)
      addSearch(domain, true)
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        return
      }

      setError({
        code: "NETWORK_ERROR",
        message: t.errors.failedToConnect,
      })
      addSearch(domain, false)
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  const handleReset = () => {
    requestRef.current?.abort()
    setHasSearched(false)
    setLoading(false)
    setResult(null)
    setError(null)
    setSearchedDomain("")
    setInputDomain("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const hasHistory = history.length > 0

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-50 -translate-y-20 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg transition-transform focus:translate-y-0"
      >
        {t.actions.skipToContent}
      </a>

      <AppHeader onReset={handleReset} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8"
      >
        {!hasSearched && <h1 className="sr-only">{t.title}</h1>}
        <motion.section
          layout
          transition={workbenchSpring}
          className={cn(
            hasSearched
              ? "sticky top-[84px] z-20 py-4 sm:py-5"
              : hasHistory
                ? "grid min-h-[calc(100dvh-68px)] content-start items-start gap-6 py-8 sm:py-12 lg:grid-cols-[minmax(0,2fr)_minmax(19rem,1fr)] lg:py-16"
                : "flex min-h-[calc(100dvh-68px)] w-full items-start pt-[clamp(3rem,12vh,8rem)]"
          )}
        >
          <motion.div
            layout="position"
            transition={workbenchSpring}
            className="w-full"
          >
            <Card
              size={hasSearched ? "sm" : "default"}
              className={cn(
                "w-full transition-[box-shadow,background-color] duration-300",
                hasSearched
                  ? "bg-card/95 shadow-lg supports-[backdrop-filter]:bg-card/88"
                  : "self-start"
              )}
            >
              <CardContent className={cn(hasSearched ? "py-0" : "mx-auto w-full max-w-5xl py-2 sm:py-4")}>
                <SearchForm
                  value={inputDomain}
                  onValueChange={setInputDomain}
                  onSearch={handleSearch}
                  loading={loading}
                  compact={hasSearched}
                />
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence initial={false}>
            {!hasSearched && hasHistory && (
              <SearchHistory
                history={history}
                onRemoveSearch={removeSearch}
                onClearHistory={clearHistory}
                onSelectDomain={(domain) => {
                  setInputDomain(domain)
                  void handleSearch(domain)
                }}
              />
            )}
          </AnimatePresence>
        </motion.section>

        <AnimatePresence mode="wait" initial={false}>
          {hasSearched && (
            <motion.section
              ref={resultsRegionRef}
              key="results-region"
              tabIndex={-1}
              aria-label={searchedDomain}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={panelTransition}
              className="mt-2 outline-none sm:mt-3"
            >
              <AnimatePresence mode="wait" initial={false}>
                {loading && <LookupLoading key="loading" domain={searchedDomain} />}
                {!loading && error && (
                  <LookupErrorState
                    key="error"
                    error={error}
                    onRetry={() => void handleSearch(searchedDomain)}
                    onReset={handleReset}
                  />
                )}
                {!loading && result && (
                  <TabbedResultDisplay
                    key={`result-${searchedDomain}`}
                    rdapResult={result}
                    domain={searchedDomain}
                  />
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
