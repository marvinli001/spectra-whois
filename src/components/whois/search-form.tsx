'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Globe } from 'lucide-react'
import { LiquidButton, LiquidInput } from '@/components/ui/liquid-glass'
import { isValidDomain, normalizeDomain } from '@/lib/domain-utils'
import { useLanguage } from '@/contexts/language-context'

interface SearchFormProps {
  onSearch: (domain: string) => void
  loading?: boolean
  disabled?: boolean
  compact?: boolean
}

export function SearchForm({ onSearch, loading = false, disabled = false, compact = false }: SearchFormProps) {
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')
  const { t } = useLanguage()

  const handleSubmit = () => {
    if (!domain.trim()) {
      setError(t.errors.domainRequired)
      return
    }

    const normalized = normalizeDomain(domain.trim())

    if (!isValidDomain(normalized)) {
      setError(t.errors.invalidDomain)
      return
    }

    setError('')
    onSearch(normalized)
  }

  const handleInputChange = (value: string) => {
    setDomain(value)
    if (error) setError('')
  }

  if (compact) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <LiquidInput
              placeholder={t.searchPlaceholderCompact}
              value={domain}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              disabled={disabled || loading}
              icon={<Globe className="w-4 h-4" />}
              className="text-sm"
            />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LiquidButton
              onClick={handleSubmit}
              disabled={disabled || loading || !domain.trim()}
              loading={loading}
              size="sm"
              className="px-3 py-3 flex-shrink-0"
            >
              <Search className="w-3 h-3" />
            </LiquidButton>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full max-w-xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <LiquidInput
            placeholder={t.searchPlaceholder}
            value={domain}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            disabled={disabled || loading}
            icon={<Globe className="w-5 h-5" />}
            className="text-base sm:text-lg py-3 sm:py-4"
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full sm:w-auto"
        >
          <LiquidButton
            onClick={handleSubmit}
            disabled={disabled || loading || !domain.trim()}
            loading={loading}
            variant="primary"
            size="md"
            className="px-6 py-3 sm:py-4 whitespace-nowrap flex-shrink-0 w-full sm:w-auto justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.searching}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                {t.searchButton}
              </span>
            )}
          </LiquidButton>
        </motion.div>
      </div>

      {error && (
        <motion.div
          className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {error}
        </motion.div>
      )}

      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-white/60 text-sm">{t.exampleDomains.title}</span>
        <div className="flex flex-wrap gap-3 justify-center">
          {t.exampleDomains.domains.map((example) => (
            <motion.button
              key={example}
              onClick={() => {
                setDomain(example)
                setError('')
              }}
              className="text-sm text-white/70 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/10 backdrop-blur-sm"
              disabled={disabled || loading}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {example}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}