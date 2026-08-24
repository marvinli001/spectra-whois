"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlertCircleIcon,
  Building03Icon,
  Calendar03Icon,
  Call02Icon,
  CodeIcon,
  Database02Icon,
  ExternalLinkIcon,
  Globe02Icon,
  InformationCircleIcon,
  Location01Icon,
  Mail01Icon,
  ServerStack01Icon,
  Shield02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { useLanguage } from "@/contexts/language-context"
import { panelTransition, panelVariants, staggerContainer } from "@/lib/motion"
import { cn, formatDate, formatRelativeTime } from "@/lib/utils"
import type { ContactInfo, Notice, WhoisResult } from "@/types/rdap"
import { CopyButton } from "./copy-button"

interface ResultDisplayProps {
  result: WhoisResult
  sourceDetail?: string
  rawText?: string
}

type ResultView = "overview" | "entities" | "notices" | "raw"

export function ResultDisplay({
  result,
  sourceDetail,
  rawText,
}: ResultDisplayProps) {
  const [view, setView] = useState<ResultView>("overview")
  const { language, t } = useLanguage()

  const contacts = useMemo(
    () =>
      [
        [t.results.registrant, result.registrant],
        [t.results.administrative, result.admin],
        [t.results.technical, result.tech],
        [t.results.billing, result.billing],
      ].filter((entry): entry is [string, ContactInfo] => Boolean(entry[1])),
    [result, t]
  )

  const translatedStatuses = (result.status ?? []).map((status) => ({
    raw: status,
    label: translateStatus(status, t.domainStatus as Record<string, string>),
  }))

  const rawContent =
    rawText ?? (result.raw ? JSON.stringify(result.raw, null, 2) : "")
  const source = (result.source ?? "rdap").toUpperCase()

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-5 sm:space-y-6"
    >
      <motion.div variants={panelVariants} transition={panelTransition}>
        <Card>
          <CardHeader className="border-b sm:grid-cols-[1fr_auto]">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-3xl bg-primary/10 text-primary sm:size-12">
                <HugeiconsIcon icon={Globe02Icon} strokeWidth={1.75} className="size-6" />
              </span>
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-all font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                    {result.domain}
                  </h1>
                  <Badge variant="outline">{source}</Badge>
                  {result.dnssec !== undefined && (
                    <Badge
                      variant="secondary"
                      className={result.dnssec ? "bg-chart-1/28 text-chart-4 dark:text-chart-2" : undefined}
                    >
                      <HugeiconsIcon icon={Shield02Icon} strokeWidth={1.8} />
                      DNSSEC {result.dnssec ? t.results.enabled : t.results.disabled}
                    </Badge>
                  )}
                </div>
                {sourceDetail && (
                  <CardDescription className="break-all">
                    {sourceDetail}
                  </CardDescription>
                )}
              </div>
            </div>
            <CardAction className="hidden sm:block">
              <CopyButton value={result.domain} />
            </CardAction>
          </CardHeader>

          {translatedStatuses.length > 0 && (
            <CardContent className="flex flex-wrap gap-2 pt-1">
              {translatedStatuses.map(({ raw, label }) => (
                <StatusBadge key={raw} status={raw} label={label} />
              ))}
            </CardContent>
          )}
        </Card>
      </motion.div>

      <motion.div variants={panelVariants} transition={panelTransition}>
        <Tabs
          value={view}
          onValueChange={(nextValue) => setView(nextValue as ResultView)}
          className="gap-5"
        >
          <div className="overflow-x-auto pb-1">
            <TabsList
              variant="line"
              aria-label={t.results.technicalDetails}
              className="group-data-horizontal/tabs:h-11"
            >
              <TabsTrigger value="overview" className="min-h-11">
                <HugeiconsIcon icon={Database02Icon} strokeWidth={1.8} />
                {t.results.overview}
              </TabsTrigger>
              <TabsTrigger value="entities" disabled={contacts.length === 0} className="min-h-11">
                <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.8} />
                {t.results.entities}
              </TabsTrigger>
              <TabsTrigger value="notices" disabled={!result.notices?.length} className="min-h-11">
                <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={1.8} />
                {t.results.notices}
              </TabsTrigger>
              <TabsTrigger value="raw" disabled={!rawContent} className="min-h-11">
                <HugeiconsIcon icon={CodeIcon} strokeWidth={1.8} />
                {t.results.rawData}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={view}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={{ opacity: 0, x: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                transition={panelTransition}
              >
                {view === "overview" && (
                  <OverviewPanels result={result} language={language} />
                )}
                {view === "entities" && (
                  <EntityPanels contacts={contacts} />
                )}
                {view === "notices" && (
                  <NoticePanels notices={result.notices ?? []} />
                )}
                {view === "raw" && (
                  <RawPanel value={rawContent} />
                )}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}

function OverviewPanels({
  result,
  language,
}: {
  result: WhoisResult
  language: "zh" | "en"
}) {
  const { t } = useLanguage()

  const registrationRows = [
    result.registrar && {
      label: t.results.registrar,
      value: result.registrar,
      copy: true,
    },
    {
      label: t.results.source,
      value: (result.source ?? "rdap").toUpperCase(),
    },
    result.dnssec !== undefined && {
      label: t.results.dnssec,
      value: result.dnssec ? t.results.enabled : t.results.disabled,
    },
  ].filter(Boolean) as Array<{ label: string; value: string; copy?: boolean }>

  const dates = [
    result.created && { label: t.results.created, value: result.created },
    result.updated && { label: t.results.updated, value: result.updated },
    result.expires && { label: t.results.expires, value: result.expires },
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-5 lg:grid-cols-12"
    >
      <motion.div variants={panelVariants} className="self-start lg:col-span-7">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2.5">
              <h2 className="flex items-center gap-2.5">
                <HugeiconsIcon icon={Building03Icon} strokeWidth={1.8} className="size-4.5 text-muted-foreground" />
                {t.results.registrationDetails}
              </h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-5">
            <Table>
              <TableBody>
                {registrationRows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="w-[38%] whitespace-normal text-muted-foreground">
                      {row.label}
                    </TableCell>
                    <TableCell className="whitespace-normal font-medium">
                      <span className="flex items-center justify-between gap-3">
                        <span className="min-w-0 break-words">{row.value}</span>
                        {row.copy && <CopyButton value={row.value} />}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={panelVariants} className="space-y-5 lg:col-span-5">
        {dates.length > 0 && (
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2.5">
                <h2 className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={Calendar03Icon} strokeWidth={1.8} className="size-4.5 text-muted-foreground" />
                  {t.results.keyDates}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 pt-1">
              {dates.map((date, index) => (
                <div key={date.label}>
                  {index > 0 && <Separator />}
                  <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:items-center">
                    <span className="text-sm text-muted-foreground">{date.label}</span>
                    <span className="sm:text-right">
                      <span className="block font-medium tabular-nums">
                        {formatDate(date.value, language)}
                      </span>
                      <span className="block text-xs tabular-nums text-muted-foreground">
                        {formatRelativeTime(date.value, language)}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {result.nameservers && result.nameservers.length > 0 && (
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2.5">
                <h2 className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={ServerStack01Icon} strokeWidth={1.8} className="size-4.5 text-muted-foreground" />
                  {t.results.nameServers}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-1">
              {result.nameservers.map((nameserver) => (
                <div
                  key={nameserver}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-2xl px-2.5 transition-colors duration-200 hover:bg-muted/70"
                >
                  <span className="min-w-0 break-all text-sm font-medium">
                    {nameserver}
                  </span>
                  <CopyButton value={nameserver} className="shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  )
}

function EntityPanels({ contacts }: { contacts: Array<[string, ContactInfo]> }) {
  const { t } = useLanguage()

  if (contacts.length === 0) {
    return (
      <Alert>
        <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={1.8} />
        <AlertTitle>{t.results.entities}</AlertTitle>
        <AlertDescription>{t.results.noContactDetails}</AlertDescription>
      </Alert>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-5 md:grid-cols-2"
    >
      {contacts.map(([title, contact]) => (
        <motion.div key={title} variants={panelVariants}>
          <ContactCard title={title} contact={contact} />
        </motion.div>
      ))}
    </motion.div>
  )
}

function ContactCard({ title, contact }: { title: string; contact: ContactInfo }) {
  const entries = Object.entries(contact).filter(([, value]) => {
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value)
  })

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2.5">
          <h2 className="flex items-center gap-2.5">
            <HugeiconsIcon icon={UserGroupIcon} strokeWidth={1.8} className="size-4.5 text-muted-foreground" />
            {title}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">
        {entries.map(([key, value]) => (
          <ContactRow key={key} field={key} value={value as string | string[]} />
        ))}
      </CardContent>
    </Card>
  )
}

function ContactRow({ field, value }: { field: string; value: string | string[] }) {
  const displayValue = Array.isArray(value) ? value.join(", ") : value
  const icon =
    field === "email"
      ? Mail01Icon
      : field === "phone"
        ? Call02Icon
        : field === "address" || field === "country"
          ? Location01Icon
          : Building03Icon

  const content = (
    <>
      <HugeiconsIcon icon={icon} strokeWidth={1.75} className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0">
        <span className="block text-xs capitalize text-muted-foreground">
          {humanizeField(field)}
        </span>
        <span className="block break-words text-sm font-medium">{displayValue}</span>
      </span>
    </>
  )

  if (field === "email") {
    return (
      <a href={`mailto:${displayValue}`} className="flex gap-2.5 rounded-2xl p-2 transition-colors hover:bg-muted/70">
        {content}
      </a>
    )
  }

  if (field === "phone") {
    return (
      <a href={`tel:${displayValue}`} className="flex gap-2.5 rounded-2xl p-2 transition-colors hover:bg-muted/70">
        {content}
      </a>
    )
  }

  return <div className="flex gap-2.5 rounded-2xl p-2">{content}</div>
}

function NoticePanels({ notices }: { notices: Notice[] }) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2.5">
          <h2 className="flex items-center gap-2.5">
            <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={1.8} className="size-4.5 text-muted-foreground" />
            {t.results.registryNotices}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1">
        <Accordion defaultValue={notices.length ? ["notice-0"] : []}>
          {notices.map((notice, index) => (
            <AccordionItem key={`${notice.title ?? "notice"}-${index}`} value={`notice-${index}`}>
              <AccordionTrigger>{notice.title ?? t.results.notices}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-muted-foreground">
                  {notice.description?.map((description) => (
                    <p key={description}>{description}</p>
                  ))}
                  {notice.links?.map((link) =>
                    link.href ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary"
                      >
                        {link.title || link.href}
                        <HugeiconsIcon icon={ExternalLinkIcon} strokeWidth={1.8} className="size-3.5" />
                        <span className="sr-only">{t.results.openExternalLink}</span>
                      </a>
                    ) : null
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

function RawPanel({ value }: { value: string }) {
  const { t } = useLanguage()

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2.5">
          <h2 className="flex items-center gap-2.5">
            <HugeiconsIcon icon={CodeIcon} strokeWidth={1.8} className="size-4.5 text-muted-foreground" />
            {t.results.rawData}
          </h2>
        </CardTitle>
        <CardAction>
          <CopyButton value={value} />
        </CardAction>
      </CardHeader>
      <CardContent className="pt-1">
        <ScrollArea className="h-[min(34rem,64vh)] rounded-2xl border bg-muted/35">
          <pre className="min-w-max p-4 text-xs leading-relaxed text-foreground/80">
            {value}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const normalized = status.toLowerCase()
  const positive = normalized === "ok" || normalized.includes("active")
  const negative = normalized.includes("expired") || normalized.includes("inactive")

  return (
    <Badge
      variant={negative ? "destructive" : "secondary"}
      className={cn(
        positive && "bg-chart-1/28 text-chart-4 dark:text-chart-2",
        !positive && !negative && "bg-muted text-muted-foreground"
      )}
    >
      <HugeiconsIcon
        icon={negative ? AlertCircleIcon : positive ? Shield02Icon : InformationCircleIcon}
        strokeWidth={1.8}
      />
      {label}
    </Badge>
  )
}

function translateStatus(status: string, translations: Record<string, string>) {
  return translations[status.toLowerCase().trim()] ?? status
}

function humanizeField(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
}
