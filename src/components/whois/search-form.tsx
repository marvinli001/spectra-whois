"use client"

import { useId, useState } from "react"
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
import { panelTransition } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface SearchFormProps {
  onSearch: (domain: string) => void
  value: string
  onValueChange: (value: string) => void
  loading?: boolean
  disabled?: boolean
  compact?: boolean
}

export function SearchForm({
  onSearch,
  value,
  onValueChange,
  loading = false,
  disabled = false,
  compact = false,
}: SearchFormProps) {
  const [error, setError] = useState("")
  const inputId = useId()
  const errorId = `${inputId}-error`
  const { t } = useLanguage()

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

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <Field data-invalid={Boolean(error)} className={compact ? "gap-2" : "gap-3"}>
        <FieldLabel htmlFor={inputId} className={compact ? "sr-only" : undefined}>
          {t.searchLabel}
        </FieldLabel>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <InputGroup
            className={cn(
              "bg-background/72 shadow-xs transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-within:-translate-y-0.5 focus-within:bg-background focus-within:shadow-md motion-reduce:transform-none",
              compact ? "h-11" : "h-14"
            )}
          >
            <InputGroupAddon className={compact ? "pl-3" : "pl-4"}>
              <HugeiconsIcon
                icon={Globe02Icon}
                strokeWidth={1.8}
                className={compact ? "size-4" : "size-5"}
              />
            </InputGroupAddon>
            <InputGroupInput
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
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              inputMode="url"
              className={cn(
                "font-medium tracking-[-0.01em] placeholder:font-normal",
                compact ? "text-sm" : "text-base sm:text-lg"
              )}
            />
          </InputGroup>

          <Button
            type="submit"
            size="lg"
            disabled={isDisabled || !value.trim()}
            className={cn(
              "h-12 min-w-32 gap-2 px-5 sm:h-14",
              compact && "h-11 sm:h-11"
            )}
          >
            <HugeiconsIcon
              icon={loading ? Loading03Icon : Search01Icon}
              strokeWidth={1.9}
              className={loading ? "animate-spin" : undefined}
            />
            {loading ? t.searching : t.searchButton}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              id={errorId}
              initial={{ opacity: 0, y: -5, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
              transition={panelTransition}
            >
              <FieldError>{error}</FieldError>
            </motion.div>
          )}
        </AnimatePresence>
      </Field>

    </form>
  )
}
