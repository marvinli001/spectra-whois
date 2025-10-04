'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Clock, X, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { LiquidCard } from '@/components/ui/liquid-glass'
import { useSearchHistory } from '@/hooks/use-search-history'
import { useLanguage } from '@/contexts/language-context'

interface SearchHistoryProps {
  onSelectDomain: (domain: string) => void
  className?: string
}

export function SearchHistory({ onSelectDomain, className = '' }: SearchHistoryProps) {
  const { history, removeSearch, clearHistory } = useSearchHistory()
  const { t } = useLanguage()

  if (history.length === 0) {
    return null
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t.searchHistory?.justNow || 'Just now'
    if (minutes < 60) return `${minutes}${t.searchHistory?.minutesAgo || 'm ago'}`
    if (hours < 24) return `${hours}${t.searchHistory?.hoursAgo || 'h ago'}`
    return `${days}${t.searchHistory?.daysAgo || 'd ago'}`
  }

  return (
    <div className={className}>
      <LiquidCard padding="sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/60" />
            <h3 className="text-sm font-medium text-white/80">
              {t.searchHistory?.title || 'Recent Searches'}
            </h3>
            <span className="text-xs text-white/40">({history.length})</span>
          </div>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-red-400 transition-colors"
            title={t.searchHistory?.clearAll || 'Clear all'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.searchHistory?.clearAll || 'Clear all'}</span>
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {history.map((item, index) => (
              <motion.div
                key={`${item.domain}-${item.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
                  <button
                    onClick={() => onSelectDomain(item.domain)}
                    className="flex-1 flex items-center gap-2 sm:gap-3 text-left min-w-0"
                  >
                    {item.success ? (
                      <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white/90 truncate">{item.domain}</div>
                      <div className="text-xs text-white/40">{formatTime(item.timestamp)}</div>
                    </div>
                  </button>
                  <button
                    onClick={() => removeSearch(item.domain)}
                    className="p-1.5 sm:p-2 rounded-md hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0"
                    title={t.searchHistory?.remove || 'Remove'}
                  >
                    <X className="w-3.5 h-3.5 text-white/50 hover:text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LiquidCard>
    </div>
  )
}
