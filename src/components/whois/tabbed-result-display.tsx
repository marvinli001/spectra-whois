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
import { getWhoisPluginUrl, shouldShowWhoisTab, checkWhoisWorkerConfig } from '@/utils/env-checker'

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

  // Check if domain needs traditional WHOIS only (no RDAP support)
  const needsWhoisOnly = needsTraditionalWhois(domain)

  // Check if WHOIS plugin URL is configured
  useEffect(() => {
    // Only show WHOIS tab for domains that support RDAP
    const shouldShow = shouldShowWhoisTab() && !needsWhoisOnly
    setShowWhoisTab(shouldShow)

    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      const config = checkWhoisWorkerConfig()
      console.log('[SpectraWHOIS Debug] WHOIS Worker Config:', config)
      console.log('[SpectraWHOIS Debug] Domain:', domain)
      console.log('[SpectraWHOIS Debug] Needs Traditional WHOIS:', needsWhoisOnly)
      console.log('[SpectraWHOIS Debug] Show WHOIS tab:', shouldShow)

      if (!shouldShow) {
        console.log('[SpectraWHOIS Debug] WHOIS tab not shown - reason:',
          needsWhoisOnly ? 'Domain requires traditional WHOIS only' :
          !config.hasPluginUrl ? 'WHOIS plugin URL not configured' : 'Unknown reason'
        )
      }
    }
  }, [domain, needsWhoisOnly])

  const fetchWhoisData = async () => {
    const pluginUrl = getWhoisPluginUrl()
    if (!pluginUrl || pluginUrl.trim() === '') {
      console.warn('[SpectraWHOIS] WHOIS plugin URL not configured, skipping fetch')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${pluginUrl}?domain=${encodeURIComponent(domain)}`, {
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
      const pluginUrl = getWhoisPluginUrl()
      if (pluginUrl && pluginUrl.trim() !== '') {
        fetchWhoisData()
      } else {
        console.warn('[SpectraWHOIS] Cannot fetch WHOIS data: plugin URL not configured')
        setError('WHOIS plugin is not configured. Please set NEXT_PUBLIC_WHOIS_PLUGIN_URL environment variable.')
      }
    }
  }

  // For domains that need traditional WHOIS only, or if WHOIS tab is not configured
  // just display the regular result (API will automatically use WHOIS for non-RDAP TLDs)
  if (needsWhoisOnly || !showWhoisTab) {
    return <ResultDisplay result={rdapResult} />
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Simple Tab Navigation */}
      <div className="flex justify-center mb-4 sm:mb-6">
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