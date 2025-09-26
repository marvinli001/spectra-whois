'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Zap, Shield, Search } from 'lucide-react'
import { LiquidGlass, LiquidCard } from '@/components/ui/liquid-glass'
import { SearchForm } from '@/components/whois/search-form'
import { ResultDisplay } from '@/components/whois/result-display'
import { WhoisResult, WhoisError } from '@/types/rdap'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/ui/language-switcher'

export default function Home() {
  const [result, setResult] = useState<WhoisResult | null>(null)
  const [error, setError] = useState<WhoisError | null>(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const { t } = useLanguage()

  const handleSearch = async (domain: string) => {
    setHasSearched(true)
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data)
      } else {
        setResult(data)
      }
    } catch {
      setError({
        code: 'NETWORK_ERROR',
        message: t.errors.failedToConnect
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = () => {
    setHasSearched(false)
    setResult(null)
    setError(null)
    setLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Language Switcher */}
      <LanguageSwitcher />
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">

        {/* Centered Search Interface (Default State) */}
        <AnimatePresence>
          {!hasSearched && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center p-4"
              initial={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -100,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
              }}
            >
              <div className="max-w-3xl w-full mx-auto">
                <LiquidGlass className="p-4 sm:p-6 md:p-8 lg:p-12 text-center" blur={'none'} opacity={0.12}>
                  {/* Logo and Title */}
                  <motion.div
                    className="mb-4 sm:mb-6 md:mb-8 lg:mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                      <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 border border-white/30 shadow-xl backdrop-blur-sm">
                        <Globe className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white" />
                      </div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent text-center">
                        {t.title}
                      </h1>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed text-center px-2">
                      {t.subtitle}
                    </p>
                  </motion.div>

                  {/* Search Form */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SearchForm onSearch={handleSearch} loading={loading} />
                  </motion.div>

                  {/* Features - Hidden on mobile */}
                  <motion.div
                    className="hidden sm:grid grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <LiquidCard className="text-center" padding="sm" hover={true}>
                      <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 border border-white/30 shadow-lg">
                        <Zap className="w-full h-full text-blue-200" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-2">{t.features.fastTitle}</h3>
                      <p className="text-white/70 text-xs leading-relaxed">
                        {t.features.fastDesc}
                      </p>
                    </LiquidCard>

                    <LiquidCard className="text-center" padding="sm" hover={true}>
                      <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500/30 to-green-600/30 border border-white/30 shadow-lg">
                        <Globe className="w-full h-full text-green-200" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-2">{t.features.globalTitle}</h3>
                      <p className="text-white/70 text-xs leading-relaxed">
                        {t.features.globalDesc}
                      </p>
                    </LiquidCard>

                    <LiquidCard className="text-center" padding="sm" hover={true}>
                      <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-white/30 shadow-lg">
                        <Shield className="w-full h-full text-purple-200" />
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white mb-2">{t.features.privacyTitle}</h3>
                      <p className="text-white/70 text-xs leading-relaxed">
                        {t.features.privacyDesc}
                      </p>
                    </LiquidCard>
                  </motion.div>
                </LiquidGlass>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Search Bar (After Search) - Floating Window Style */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div
              className="fixed top-1 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-2 sm:px-4"
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
              }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
            >
              <LiquidGlass className="p-2 sm:p-4 md:p-6" blur={'none'} opacity={0.12}>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-4 md:gap-6">
                  <button
                    onClick={handleNewSearch}
                    className="flex items-center gap-1.5 sm:gap-3 text-white/90 hover:text-white transition-all duration-300 hover:scale-105 shrink-0"
                  >
                    <div className="p-1 sm:p-2 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-600/30 border border-white/30 shadow-lg">
                      <Globe className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6" />
                    </div>
                    <span className="text-base sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent text-center">
                      {t.title}
                    </span>
                  </button>
                  <div className="w-full sm:flex-1 max-w-sm sm:max-w-md flex justify-center">
                    <SearchForm onSearch={handleSearch} loading={loading} compact />
                  </div>
                </div>
              </LiquidGlass>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Area */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div
              className="pt-28 sm:pt-32 md:pt-36 pb-12"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.3, duration: 0.8 }
              }}
              exit={{ opacity: 0 }}
            >
              <div className="container mx-auto px-4 md:px-6">
                {/* Loading State */}
                {loading && (
                  <motion.div
                    className="flex justify-center items-center mb-12 w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <LiquidGlass className="px-8 py-6" blur={'none'}>
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-white/90">{t.queryingServers}</span>
                      </div>
                    </LiquidGlass>
                  </motion.div>
                )}

                {/* Error Display */}
                {error && (
                  <motion.div
                    className="flex justify-center mb-12"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <LiquidCard className="text-center border-red-500/30 bg-red-500/10 max-w-2xl" padding="lg">
                      <div className="w-16 h-16 mx-auto mb-4 p-4 rounded-full bg-red-500/20 border border-red-500/30">
                        <Search className="w-full h-full text-red-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-red-300 mb-2">
                        {error.code === 'INVALID_DOMAIN' && t.errors.domainNotFound}
                        {error.code === 'TLD_NOT_SUPPORTED' && t.errors.tldNotSupported}
                        {error.code === 'RDAP_ERROR' && t.errors.rdapError}
                        {error.code === 'QUERY_ERROR' && t.errors.queryError}
                        {error.code === 'RATE_LIMITED' && t.errors.rateLimited}
                        {error.code === 'NETWORK_ERROR' && t.errors.networkError}
                      </h3>
                      <p className="text-white/70">{error.message}</p>
                      {process.env.NODE_ENV === 'development' && error.details && (
                        <details className="mt-4 text-left">
                          <summary className="cursor-pointer text-red-300/70 text-sm">
                            Technical Details
                          </summary>
                          <pre className="mt-2 p-3 bg-black/20 rounded-lg text-xs text-white/50 overflow-auto">
                            {error.details}
                          </pre>
                        </details>
                      )}
                    </LiquidCard>
                  </motion.div>
                )}

                {/* Results */}
                {result && <ResultDisplay result={result} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer - Only show in default state */}
        <AnimatePresence>
          {!hasSearched && (
            <motion.footer
              className="fixed bottom-0 left-0 right-0 text-center py-6 text-white/40 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p>{t.footer}</p>
            </motion.footer>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}