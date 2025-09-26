'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Globe, Server } from 'lucide-react'
import { LiquidCard } from '@/components/ui/liquid-glass'
import { ResultDisplay } from './result-display'
import { WhoisResultDisplay } from './whois-result-display'
import { WhoisResult } from '@/types/rdap'
import { WhoisResponse } from '@/services/whois/traditional'
import { useLanguage } from '@/contexts/language-context'
import { needsTraditionalWhois } from '@/services/whois/traditional'
import { getWhoisWorkerUrl, shouldShowWhoisTab, checkWhoisWorkerConfig } from '@/utils/env-checker'

interface TabbedResultDisplayProps {
  rdapResult: WhoisResult
  domain: string
}

export function TabbedResultDisplay({ rdapResult, domain }: TabbedResultDisplayProps) {
  const [activeTab, setActiveTab] = useState<'rdap' | 'whois'>('rdap')
  const [whoisResult, setWhoisResult] = useState<WhoisResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showWhoisTab, setShowWhoisTab] = useState(false)
  const { t } = useLanguage()

  // Check if Workers URL is configured and if domain supports RDAP
  useEffect(() => {
    const shouldShow = shouldShowWhoisTab(domain, needsTraditionalWhois)
    setShowWhoisTab(shouldShow)

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      const config = checkWhoisWorkerConfig()
      console.log('WHOIS Worker Config:', config)
      console.log('Domain:', domain)
      console.log('Needs Traditional WHOIS:', needsTraditionalWhois(domain))
      console.log('Show WHOIS tab:', shouldShow)
    }
  }, [domain])

  const fetchWhoisData = async () => {
    const workerUrl = getWhoisWorkerUrl()
    if (!workerUrl || workerUrl.trim() === '') return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${workerUrl}?domain=${encodeURIComponent(domain)}`, {
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: WhoisResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'WHOIS query failed')
      }

      setWhoisResult(data)
    } catch (err) {
      console.error('Failed to fetch WHOIS data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch WHOIS data')
    } finally {
      setLoading(false)
    }
  }

  const handleTabSwitch = (tab: 'rdap' | 'whois') => {
    setActiveTab(tab)

    // Fetch WHOIS data when switching to WHOIS tab for the first time
    if (tab === 'whois' && !whoisResult && !loading) {
      fetchWhoisData()
    }
  }

  // If WHOIS tab is not shown, just display the regular RDAP result
  if (!showWhoisTab) {
    return <ResultDisplay result={rdapResult} />
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header with Domain and Tabs */}
      <LiquidCard className="text-center" padding="lg">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Globe className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">{domain}</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="relative flex bg-white/5 rounded-lg p-1">
            {/* Active tab background */}
            <motion.div
              className="absolute inset-y-1 bg-white/10 rounded-md"
              initial={false}
              animate={{
                x: activeTab === 'rdap' ? 4 : '100%',
                width: activeTab === 'rdap' ? 'calc(50% - 8px)' : 'calc(50% - 8px)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />

            {/* RDAP Tab */}
            <button
              onClick={() => handleTabSwitch('rdap')}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'rdap'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Globe className="w-4 h-4" />
              RDAP
            </button>

            {/* WHOIS Tab */}
            <button
              onClick={() => handleTabSwitch('whois')}
              className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'whois'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <Server className="w-4 h-4" />
              WHOIS
            </button>
          </div>
        </div>
      </LiquidCard>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {activeTab === 'rdap' && (
          <div>
            <ResultDisplay result={rdapResult} />
          </div>
        )}

        {activeTab === 'whois' && (
          <div>
            {loading && (
              <LiquidCard className="text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/60"></div>
                  <span className="text-white/80">{t.results.loadingWhoisData}</span>
                </div>
              </LiquidCard>
            )}

            {error && (
              <LiquidCard className="text-center">
                <div className="text-red-400">
                  <p className="font-medium">{t.results.failedToLoadWhois}</p>
                  <p className="text-sm text-white/60 mt-2">{error}</p>
                  <button
                    onClick={fetchWhoisData}
                    className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white/80 hover:text-white"
                  >
                    {t.results.retry}
                  </button>
                </div>
              </LiquidCard>
            )}

            {whoisResult && !loading && !error && (
              <WhoisResultDisplay result={whoisResult} />
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}