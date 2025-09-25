import * as punycode from 'punycode'

export function isValidDomain(domain: string): boolean {
  if (!domain || typeof domain !== 'string') return false

  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  // Check basic format
  if (!domainRegex.test(domain)) {
    // Try with IDN conversion
    try {
      const ascii = punycode.toASCII(domain.toLowerCase())
      return domainRegex.test(ascii)
    } catch {
      return false
    }
  }

  return true
}

export function normalizeDomain(domain: string): string {
  if (!domain) return ''

  let normalized = domain.toLowerCase().trim()

  // Remove protocol if present
  normalized = normalized.replace(/^https?:\/\//, '')

  // Remove www. prefix
  normalized = normalized.replace(/^www\./, '')

  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '')

  // Convert IDN to ASCII
  try {
    normalized = punycode.toASCII(normalized)
  } catch {
    // If conversion fails, use original
  }

  return normalized
}

export function extractTld(domain: string): string {
  const normalized = normalizeDomain(domain)
  const parts = normalized.split('.')

  if (parts.length < 2) return ''

  // Handle common ccTLDs with second-level domains
  if (parts.length >= 3) {
    const lastTwo = parts.slice(-2).join('.')
    const commonCcTlds = [
      'co.uk', 'co.jp', 'co.kr', 'co.in', 'co.za',
      'com.au', 'com.br', 'com.cn', 'com.mx', 'com.tw',
      'org.uk', 'net.au', 'gov.uk', 'ac.uk', 'edu.au',
      'co.nz', 'org.nz', 'net.nz', 'govt.nz', 'mil.nz', 'iwi.nz'
    ]

    if (commonCcTlds.includes(lastTwo)) {
      return lastTwo
    }
  }

  return parts[parts.length - 1]
}

export function isIDN(domain: string): boolean {
  return /[^\x00-\x7F]/.test(domain)
}

export function convertIDNToUnicode(domain: string): string {
  try {
    return punycode.toUnicode(domain)
  } catch {
    return domain
  }
}

export function convertIDNToASCII(domain: string): string {
  try {
    return punycode.toASCII(domain)
  } catch {
    return domain
  }
}