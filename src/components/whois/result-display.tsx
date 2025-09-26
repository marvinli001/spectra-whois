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
  ExternalLink
} from 'lucide-react'
import { LiquidCard } from '@/components/ui/liquid-glass'
import { WhoisResult, ContactInfo, Notice } from '@/types/rdap'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'
import { useState } from 'react'

interface ResultDisplayProps {
  result: WhoisResult
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { t } = useLanguage()

  const translateStatus = (status: string) => {
    const statusLower = status.toLowerCase().trim()
    const translations = t.domainStatus as Record<string, string>
    return translations[statusLower] || status
  }

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

  const getStatusColor = (status?: string[]) => {
    if (!status || status.length === 0) return 'text-gray-400'

    const hasActive = status.some(s => s.includes('active') || s.includes('ok'))
    const hasInactive = status.some(s => s.includes('inactive') || s.includes('expired'))

    if (hasActive) return 'text-green-400'
    if (hasInactive) return 'text-red-400'
    return 'text-yellow-400'
  }

  const getStatusIcon = (status?: string[]) => {
    if (!status || status.length === 0) return <AlertCircle className="w-4 h-4" />

    const hasActive = status.some(s => s.includes('active') || s.includes('ok'))
    const hasInactive = status.some(s => s.includes('inactive') || s.includes('expired'))

    if (hasActive) return <CheckCircle className="w-4 h-4" />
    if (hasInactive) return <XCircle className="w-4 h-4" />
    return <AlertCircle className="w-4 h-4" />
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
          <h1 className="text-3xl font-bold text-white">{result.domain}</h1>
        </div>

        <div className={`flex items-center justify-center gap-2 ${getStatusColor(result.status)}`}>
          {getStatusIcon(result.status)}
          <span className="font-medium">
            {result.status?.map(status => translateStatus(status)).join(', ') || t.results.statusUnknown}
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
            {result.registrar && (
              <InfoRow
                label={t.results.registrar}
                value={result.registrar}
                icon={<Building className="w-4 h-4" />}
                onCopy={() => copyToClipboard(result.registrar!, 'registrar')}
                copied={copiedField === 'registrar'}
                copyButtonTitle={t.results.copyToClipboard}
              />
            )}

            {result.created && (
              <InfoRow
                label={t.results.created}
                value={formatDate(result.created)}
                subValue={formatRelativeTime(result.created)}
                icon={<Calendar className="w-4 h-4" />}
              />
            )}

            {result.updated && (
              <InfoRow
                label={t.results.updated}
                value={formatDate(result.updated)}
                subValue={formatRelativeTime(result.updated)}
                icon={<Calendar className="w-4 h-4" />}
              />
            )}

            {result.expires && (
              <InfoRow
                label={t.results.expires}
                value={formatDate(result.expires)}
                subValue={formatRelativeTime(result.expires)}
                icon={<Calendar className="w-4 h-4" />}
                highlight={new Date(result.expires) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              />
            )}

            {result.dnssec !== undefined && (
              <InfoRow
                label={t.results.dnssec}
                value={result.dnssec ? t.results.enabled : t.results.disabled}
                icon={<Shield className="w-4 h-4" />}
                valueClassName={result.dnssec ? 'text-green-400' : 'text-red-400'}
              />
            )}
          </div>
        </LiquidCard>

        {/* Nameservers */}
        {result.nameservers && result.nameservers.length > 0 && (
          <LiquidCard>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5" />
              {t.results.nameServers}
            </h2>

            <div className="space-y-2">
              {result.nameservers.map((ns, index) => (
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

      {/* Contacts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {result.registrant && (
          <ContactCard title={t.results.registrant} contact={result.registrant} />
        )}
        {result.admin && (
          <ContactCard title={t.results.administrative} contact={result.admin} />
        )}
        {result.tech && (
          <ContactCard title={t.results.technical} contact={result.tech} />
        )}
        {result.billing && (
          <ContactCard title={t.results.billing} contact={result.billing} />
        )}
      </div>

      {/* Notices */}
      {result.notices && result.notices.length > 0 && (
        <LiquidCard>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {t.results.registryNotices}
          </h2>

          <div className="space-y-4">
            {result.notices.map((notice, index) => (
              <NoticeCard key={index} notice={notice} />
            ))}
          </div>
        </LiquidCard>
      )}

      {/* Raw Data */}
      <details className="group">
        <summary className="cursor-pointer text-white/70 hover:text-white/90 transition-colors">
          <span className="text-sm">{t.results.viewRawResponse}</span>
        </summary>
        <LiquidCard className="mt-4">
          <pre className="text-xs text-white/70 overflow-auto max-h-96 whitespace-pre-wrap">
            {JSON.stringify(result.raw, null, 2)}
          </pre>
        </LiquidCard>
      </details>
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
    // Layout with copy button on the right side, content truly centered
    return (
      <div className={`relative p-3 rounded-lg border ${
        highlight ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/10'
      }`}>
        {/* Content centered in the full container */}
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
        {/* Copy button positioned absolutely on the right */}
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

  // Default centered layout for fields without copy button
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
  contact: ContactInfo
}

function ContactCard({ title, contact }: ContactCardProps) {
  return (
    <LiquidCard padding="sm">
      <h3 className="font-semibold text-white mb-3">{title}</h3>

      <div className="space-y-2 text-sm">
        {contact.name && (
          <div className="text-white/90">{contact.name}</div>
        )}

        {contact.organization && (
          <div className="text-white/70">{contact.organization}</div>
        )}

        {contact.email && (
          <div className="flex items-center gap-2 text-white/80">
            <Mail className="w-3 h-3" />
            <span className="break-all">{contact.email}</span>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-center gap-2 text-white/80">
            <Phone className="w-3 h-3" />
            <span>{contact.phone}</span>
          </div>
        )}

        {contact.address && contact.address.length > 0 && (
          <div className="flex items-start gap-2 text-white/80">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <div>
              {contact.address.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          </div>
        )}

        {contact.country && (
          <div className="text-white/60 text-xs uppercase tracking-wider">
            {contact.country}
          </div>
        )}
      </div>
    </LiquidCard>
  )
}

interface NoticeCardProps {
  notice: Notice
}

function NoticeCard({ notice }: NoticeCardProps) {
  return (
    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
      {notice.title && (
        <h3 className="font-medium text-white mb-2">{notice.title}</h3>
      )}

      {notice.description && (
        <div className="text-white/80 text-sm space-y-1">
          {notice.description.map((desc, index) => (
            <p key={index}>{desc}</p>
          ))}
        </div>
      )}

      {notice.links && notice.links.length > 0 && (
        <div className="mt-3 space-y-2">
          {notice.links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 text-sm transition-colors"
            >
              {link.title || link.href}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}