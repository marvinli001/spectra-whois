'use client'

import { motion } from 'framer-motion'
import {
  Calendar,
  Globe,
  Shield,
  Building,
  Mail,
  Phone,
  MapPin,
  Server,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react'
import { LiquidCard } from '@/components/ui/liquid-glass'
import { WhoisResponse } from '@/services/whois/traditional'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { useState } from 'react'

interface WhoisResultDisplayProps {
  result: WhoisResponse
}

export function WhoisResultDisplay({ result }: WhoisResultDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showRawData, setShowRawData] = useState(false)
  const { t } = useLanguage()

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const data = result.parsedData

  if (!data) {
    return (
      <LiquidCard className="text-center">
        <div className="text-white/60">
          {t.results.noDataAvailable || 'No WHOIS data available'}
        </div>
      </LiquidCard>
    )
  }

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto space-y-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <LiquidCard className="text-center" padding="lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">{data.domain}</h1>
        </div>

        <div className="flex items-center justify-center gap-2 text-blue-400">
          <Server className="w-4 h-4" />
          <span className="font-medium">
            WHOIS ({result.whoisServer})
          </span>
        </div>
      </LiquidCard>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Domain Info */}
        <LiquidCard>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t.results.domainInfo}
          </h2>

          <div className="space-y-3">
            {data.registrar && (
              <InfoRow
                label={t.results.registrar}
                value={data.registrar}
                icon={<Building className="w-4 h-4" />}
                onCopy={() => copyToClipboard(data.registrar!, 'registrar')}
                copied={copiedField === 'registrar'}
                copyButtonTitle={t.results.copyToClipboard}
              />
            )}

            {data.registrationDate && (
              <InfoRow
                label={t.results.created}
                value={data.registrationDate}
                icon={<Calendar className="w-4 h-4" />}
              />
            )}

            {data.updatedDate && (
              <InfoRow
                label={t.results.updated}
                value={data.updatedDate}
                icon={<Calendar className="w-4 h-4" />}
              />
            )}

            {data.expirationDate && (
              <InfoRow
                label={t.results.expires}
                value={data.expirationDate}
                icon={<Calendar className="w-4 h-4" />}
                highlight={true} // Could add expiry date checking logic here
              />
            )}
          </div>
        </LiquidCard>

        {/* Nameservers */}
        {data.nameServers && data.nameServers.length > 0 && (
          <LiquidCard>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5" />
              {t.results.nameServers}
            </h2>

            <div className="space-y-2">
              {data.nameServers.map((ns, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <span className="text-white/90 font-mono text-sm flex-1 text-center">{ns}</span>
                  <button
                    onClick={() => copyToClipboard(ns, `ns-${index}`)}
                    title={t.results.copyToClipboard}
                    className="text-white/60 hover:text-white/90 transition-colors ml-3 p-1 rounded hover:bg-white/10"
                  >
                    {copiedField === `ns-${index}` ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </LiquidCard>
        )}
      </div>

      {/* Status Information */}
      {data.status && data.status.length > 0 && (
        <LiquidCard>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Domain Status
          </h2>

          <div className="space-y-2">
            {data.status.map((status, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white/5 border border-white/10 text-center"
              >
                <span className="text-white/90 text-sm">{status}</span>
              </div>
            ))}
          </div>
        </LiquidCard>
      )}

      {/* Contacts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.keys(data.registrant).length > 0 && (
          <ContactCard title={t.results.registrant} contact={data.registrant} />
        )}
        {Object.keys(data.admin).length > 0 && (
          <ContactCard title={t.results.administrative} contact={data.admin} />
        )}
        {Object.keys(data.tech).length > 0 && (
          <ContactCard title={t.results.technical} contact={data.tech} />
        )}
        {Object.keys(data.billing).length > 0 && (
          <ContactCard title={t.results.billing} contact={data.billing} />
        )}
      </div>

      {/* Raw WHOIS Data */}
      <LiquidCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {t.results.rawWhoisData || 'Raw WHOIS Data'}
          </h2>
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            {showRawData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showRawData ? 'Hide' : 'Show'} Raw Data
          </button>
        </div>

        {showRawData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <pre className="text-xs text-white/70 overflow-auto max-h-96 whitespace-pre-wrap bg-black/20 p-4 rounded-lg border border-white/10">
              {result.rawData}
            </pre>
          </motion.div>
        )}
      </LiquidCard>
    </motion.div>
  )
}

interface InfoRowProps {
  label: string
  value: string
  subValue?: string
  icon?: React.ReactNode
  onCopy?: () => void
  copied?: boolean
  highlight?: boolean
  valueClassName?: string
  copyButtonTitle?: string
}

function InfoRow({
  label,
  value,
  subValue,
  icon,
  onCopy,
  copied,
  highlight,
  valueClassName,
  copyButtonTitle
}: InfoRowProps) {
  if (onCopy) {
    return (
      <div className={`relative p-3 rounded-lg border ${
        highlight ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'
      }`}>
        <div className="text-center pr-8">
          <div className="flex justify-center items-center gap-2 mb-1">
            {icon && <span className="text-white/60">{icon}</span>}
            <div className="text-white/70 text-sm">{label}</div>
          </div>
          <div className={`font-medium ${valueClassName || 'text-white/90'}`}>
            {value}
          </div>
          {subValue && (
            <div className="text-white/50 text-xs mt-1">{subValue}</div>
          )}
        </div>
        <button
          onClick={onCopy}
          title={copyButtonTitle}
          className="absolute top-3 right-3 text-white/60 hover:text-white/90 transition-colors p-1 rounded hover:bg-white/10"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    )
  }

  return (
    <div className={`p-3 rounded-lg border ${
      highlight ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'
    }`}>
      <div className="text-center">
        <div className="flex justify-center items-center gap-2 mb-1">
          {icon && <span className="text-white/60">{icon}</span>}
          <div className="text-white/70 text-sm">{label}</div>
        </div>
        <div className={`font-medium ${valueClassName || 'text-white/90'}`}>
          {value}
        </div>
        {subValue && (
          <div className="text-white/50 text-xs mt-1">{subValue}</div>
        )}
      </div>
    </div>
  )
}

interface ContactCardProps {
  title: string
  contact: Record<string, string | null>
}

function ContactCard({ title, contact }: ContactCardProps) {
  return (
    <LiquidCard padding="sm">
      <h3 className="font-semibold text-white mb-3">{title}</h3>

      <div className="space-y-2 text-sm">
        {Object.entries(contact).map(([key, value]) => (
          value && (
            <div key={key} className="text-white/80">
              <span className="text-white/60 text-xs uppercase tracking-wide">{key}:</span>
              <div className="text-white/90 mt-1">{value}</div>
            </div>
          )
        ))}
      </div>
    </LiquidCard>
  )
}