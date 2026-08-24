"use client"

import { motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  ExternalLinkIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { panelTransition } from "@/lib/motion"
import type { WhoisResponse } from "@/services/whois/traditional"
import type { ContactInfo, WhoisResult } from "@/types/rdap"
import { ResultDisplay } from "./result-display"

interface WhoisResultDisplayProps {
  result: WhoisResponse
}

interface RestrictedWhoisError {
  success: false
  domain: string
  whoisServer?: string
  error: string
  restricted?: boolean
  manualCheckUrl?: string
  timestamp: string
}

export function WhoisResultDisplay({ result }: WhoisResultDisplayProps) {
  const { t } = useLanguage()

  if (!result.success) {
    const errorResult = result as RestrictedWhoisError
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={panelTransition}
      >
        <Card>
          <CardContent className="space-y-5 pt-1">
            <Alert>
              <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={1.8} />
              <AlertTitle>{t.results.whoisRestricted}</AlertTitle>
              <AlertDescription>
                <p>{errorResult.error}</p>
                {errorResult.restricted && (
                  <p>
                    {errorResult.domain.split(".").pop()?.toUpperCase()}
                    {t.results.restrictionNotice}
                  </p>
                )}
              </AlertDescription>
            </Alert>
            {errorResult.manualCheckUrl && (
              <Button
                render={
                  <a
                    href={errorResult.manualCheckUrl}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
                className="w-fit"
              >
                {t.results.manualCheck} {errorResult.domain}
                <HugeiconsIcon icon={ExternalLinkIcon} strokeWidth={1.8} />
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const data = result.parsedData

  if (!data) {
    return (
      <Alert>
        <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={1.8} />
        <AlertTitle>{t.results.noDataAvailable}</AlertTitle>
      </Alert>
    )
  }

  const normalized: WhoisResult = {
    domain: data.domain,
    registrar: data.registrar ?? undefined,
    registrant: normalizeContact(data.registrant),
    admin: normalizeContact(data.admin),
    tech: normalizeContact(data.tech),
    billing: normalizeContact(data.billing),
    nameservers: data.nameServers,
    status: data.status,
    created: data.registrationDate ?? undefined,
    updated: data.updatedDate ?? undefined,
    expires: data.expirationDate ?? undefined,
    source: "whois",
  }

  return (
    <ResultDisplay
      result={normalized}
      sourceDetail={result.whoisServer ? `WHOIS / ${result.whoisServer}` : "WHOIS"}
      rawText={result.rawData}
    />
  )
}

function normalizeContact(record: Record<string, string | null>) {
  const entries = Object.entries(record).filter(([, value]) => Boolean(value))
  if (entries.length === 0) return undefined
  return Object.fromEntries(entries) as unknown as ContactInfo
}
