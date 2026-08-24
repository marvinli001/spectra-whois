"use client"

import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Globe02Icon,
  Loading03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useLanguage } from "@/contexts/language-context"
import { isValidDomain, normalizeDomain } from "@/lib/domain-utils"
import { microTransition } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface SearchFormProps {
  onSearch: (domain: string) => void
  value: string
  onValueChange: (value: string) => void
  loading?: boolean
  disabled?: boolean
  compact?: boolean
  prominent?: boolean
}

export function SearchForm({
  onSearch,
  value,
  onValueChange,
  loading = false,
  disabled = false,
  compact = false,
  prominent = false,
}: SearchFormProps) {
  const [error, setError] = useState("")
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const errorId = `${inputId}-error`
  const { t } = useLanguage()

  useEffect(() => {
    if (compact) return

    const focusFromShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping = target?.closest("input, textarea, [contenteditable='true']")

      if (
        event.key !== "/" ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTyping
      ) {
        return
      }

      event.preventDefault()
      inputRef.current?.focus()
    }

    window.addEventListener("keydown", focusFromShortcut)
    return () => window.removeEventListener("keydown", focusFromShortcut)
  }, [compact])

  const validate = (value: string, required = true) => {
    if (!value.trim()) {
      if (required) {
        setError(t.errors.domainRequired)
      }
      return false
    }

    const normalized = normalizeDomain(value.trim())
    if (!isValidDomain(normalized)) {
      setError(t.errors.invalidDomain)
      return false
    }

    setError("")
    return true
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate(value)) return
    onSearch(normalizeDomain(value.trim()))
  }

  const isDisabled = disabled || loading
  const hasValue = Boolean(value.trim())

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <Field
        data-invalid={Boolean(error)}
        className={cn(
          compact ? "gap-2" : "gap-3",
          prominent &&
            "gap-8 lg:grid lg:grid-cols-[minmax(13rem,0.62fr)_minmax(0,1.45fr)] lg:items-end lg:gap-x-14"
        )}
      >
        {prominent ? (
          <div className="lg:pb-1">
            <span className="mb-4 block text-xs font-medium tracking-[0.12em] text-muted-foreground">
              WHOIS / RDAP
            </span>
            <FieldLabel
              htmlFor={inputId}
              className="text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[0.95]"
            >
              {t.searchLabel}
            </FieldLabel>
          </div>
        ) : (
          <FieldLabel htmlFor={inputId} className={compact ? "sr-only" : undefined}>
            {t.searchLabel}
          </FieldLabel>
        )}

        <div className={cn(prominent && "lg:col-start-2 lg:row-start-1")}>
          <InputGroup
            className={cn(
              "border-border/70 bg-card shadow-xs transition-[box-shadow,background-color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] has-[[data-slot=input-group-control]:focus-visible]:border-primary/45 has-[[data-slot=input-group-control]:focus-visible]:bg-card has-[[data-slot=input-group-control]:focus-visible]:ring-4 has-[[data-slot=input-group-control]:focus-visible]:ring-primary/10 has-[[data-slot=input-group-control]:focus-visible]:shadow-md",
              compact ? "h-11" : prominent ? "h-16" : "h-14"
            )}
          >
            <InputGroupAddon className={compact ? "pl-3" : prominent ? "pl-5" : "pl-4"}>
              <HugeiconsIcon
                icon={Globe02Icon}
                strokeWidth={1.8}
                className={compact ? "size-4" : prominent ? "size-5.5" : "size-5"}
              />
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              id={inputId}
              value={value}
              onChange={(event) => {
                onValueChange(event.target.value)
                if (error) setError("")
              }}
              onBlur={() => validate(value, false)}
              placeholder={compact ? t.searchPlaceholderCompact : t.searchPlaceholder}
              disabled={isDisabled}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              aria-keyshortcuts={compact ? undefined : "/"}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="url"
              className={cn(
                "font-medium tracking-[-0.01em] placeholder:font-normal",
                compact ? "text-sm" : prominent ? "text-lg sm:text-xl" : "text-base sm:text-lg"
              )}
            />

            {prominent && !hasValue && (
              <kbd
                aria-hidden="true"
                className="mr-1 hidden size-7 place-items-center rounded-xl border bg-muted/65 text-xs font-medium text-muted-foreground lg:grid"
              >
                /
              </kbd>
            )}

            <Button
              type="submit"
              size="lg"
              variant={hasValue ? "default" : "secondary"}
              disabled={isDisabled || !hasValue}
              className={cn(
                "mr-1.5 h-11 min-w-[6.75rem] gap-2 px-4 disabled:opacity-100 disabled:text-muted-foreground",
                prominent && "h-12 min-w-28 px-5",
                compact && "mr-1 h-9 min-w-24 px-4"
              )}
            >
              <HugeiconsIcon
                icon={loading ? Loading03Icon : Search01Icon}
                strokeWidth={1.9}
                className={loading ? "animate-spin" : undefined}
              />
              {loading ? t.searching : t.searchButton}
            </Button>
          </InputGroup>
        </div>

        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              id={errorId}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={microTransition}
              className={cn(prominent && "lg:col-start-2")}
            >
              <FieldError>{error}</FieldError>
            </motion.div>
          )}
        </AnimatePresence>
      </Field>
    </form>
  )
}
