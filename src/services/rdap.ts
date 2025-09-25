import { BootstrapRegistry, DomainResponse, WhoisResult, ContactInfo } from '@/types/rdap'
import { extractTld, normalizeDomain, convertIDNToUnicode } from '@/lib/domain-utils'

const IANA_BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json'
const DEFAULT_RDAP_SERVERS = [
  'https://rdap.verisign.com/com/v1/',
  'https://rdap.iana.org/'
]

// Custom RDAP servers for TLDs not in IANA bootstrap
const CUSTOM_RDAP_SERVERS: Record<string, string[]> = {
  'nz': ['https://client.rdap.org/'],
  'org.nz': ['https://client.rdap.org/'],
  'co.nz': ['https://client.rdap.org/'],
  'net.nz': ['https://client.rdap.org/'],
  'govt.nz': ['https://client.rdap.org/'],
  'mil.nz': ['https://client.rdap.org/'],
  'iwi.nz': ['https://client.rdap.org/']
}

// Cache for bootstrap registry
let bootstrapCache: { data: BootstrapRegistry; expires: number } | null = null

export async function getBootstrapRegistry(): Promise<BootstrapRegistry> {
  // Check cache
  if (bootstrapCache && bootstrapCache.expires > Date.now()) {
    return bootstrapCache.data
  }

  try {
    const response = await fetch(IANA_BOOTSTRAP_URL, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch bootstrap registry: ${response.status}`)
    }

    const data: BootstrapRegistry = await response.json()

    // Cache for 1 hour
    bootstrapCache = {
      data,
      expires: Date.now() + 3600 * 1000
    }

    return data
  } catch (error) {
    console.error('Failed to fetch bootstrap registry:', error)
    throw error
  }
}

export async function findRdapServer(domain: string): Promise<string[]> {
  const tld = extractTld(domain)

  if (!tld) {
    throw new Error('Invalid domain: cannot extract TLD')
  }

  // Check custom RDAP servers first
  if (CUSTOM_RDAP_SERVERS[tld.toLowerCase()]) {
    console.log(`Using custom RDAP server for TLD: ${tld}`)
    return CUSTOM_RDAP_SERVERS[tld.toLowerCase()]
  }

  try {
    const bootstrap = await getBootstrapRegistry()

    // Find matching service
    for (const service of bootstrap.services) {
      const [tlds, servers] = service

      if (tlds.includes(tld.toLowerCase())) {
        return servers
      }
    }

    // Fallback to default servers
    console.warn(`No RDAP server found for TLD: ${tld}, using defaults`)
    return DEFAULT_RDAP_SERVERS
  } catch (error) {
    console.error('Error finding RDAP server:', error)
    return DEFAULT_RDAP_SERVERS
  }
}

export async function queryRdap(domain: string): Promise<DomainResponse> {
  const normalizedDomain = normalizeDomain(domain)
  const servers = await findRdapServer(normalizedDomain)

  let lastError: Error | null = null

  // Try each server until one succeeds
  for (const server of servers) {
    try {
      const url = `${server.replace(/\/$/, '')}/domain/${encodeURIComponent(normalizedDomain)}`

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/rdap+json, application/json',
          'User-Agent': 'SpectraWHOIS/1.0'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      })

      if (response.status === 404) {
        throw new Error('Domain not found in registry')
      }

      if (!response.ok) {
        throw new Error(`RDAP query failed: ${response.status} ${response.statusText}`)
      }

      const data: DomainResponse = await response.json()

      // Validate response
      if (!data.rdapConformance || data.objectClassName !== 'domain') {
        throw new Error('Invalid RDAP response format')
      }

      return data
    } catch (error) {
      console.error(`RDAP query failed for server ${server}:`, error)
      lastError = error as Error
      continue
    }
  }

  throw lastError || new Error('All RDAP servers failed')
}

export function parseRdapResponse(response: DomainResponse): WhoisResult {
  const result: WhoisResult = {
    domain: response.unicodeName || response.ldhName || '',
    raw: response
  }

  // Extract registrar from entities
  const registrarEntity = response.entities?.find(e =>
    e.roles?.includes('registrar')
  )

  if (registrarEntity) {
    result.registrar = extractEntityName(registrarEntity)
  }

  // Extract contacts
  const contacts = response.entities?.filter(e =>
    e.roles?.some(role => ['registrant', 'administrative', 'technical', 'billing'].includes(role))
  ) || []

  for (const entity of contacts) {
    const contact = parseContactEntity(entity)

    if (entity.roles?.includes('registrant')) {
      result.registrant = contact
    }
    if (entity.roles?.includes('administrative')) {
      result.admin = contact
    }
    if (entity.roles?.includes('technical')) {
      result.tech = contact
    }
    if (entity.roles?.includes('billing')) {
      result.billing = contact
    }
  }

  // Extract nameservers
  if (response.nameservers) {
    result.nameservers = response.nameservers
      .map(ns => convertIDNToUnicode(ns.ldhName || ns.unicodeName || ''))
      .filter(Boolean)
  }

  // Extract DNSSEC info
  if (response.secureDNS) {
    result.dnssec = response.secureDNS.delegationSigned || false
  }

  // Extract status
  result.status = response.status

  // Extract dates from events
  const events = response.events || []

  for (const event of events) {
    switch (event.eventAction) {
      case 'registration':
        result.created = event.eventDate
        break
      case 'last update of RDAP database':
      case 'last changed':
        result.updated = event.eventDate
        break
      case 'expiration':
        result.expires = event.eventDate
        break
    }
  }

  // Extract notices
  result.notices = response.notices

  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractEntityName(entity: any): string {
  // Try to get name from vCard
  if (entity.vcardArray && Array.isArray(entity.vcardArray)) {
    for (const vcard of entity.vcardArray) {
      if (Array.isArray(vcard)) {
        for (const prop of vcard) {
          if (Array.isArray(prop) && prop[0] === 'fn') {
            return prop[3] || ''
          }
        }
      }
    }
  }

  // Fallback to handle
  return entity.handle || ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseContactEntity(entity: any): ContactInfo {
  const contact: ContactInfo = {}

  if (!entity.vcardArray || !Array.isArray(entity.vcardArray)) {
    return contact
  }

  // Parse vCard data
  for (const vcard of entity.vcardArray) {
    if (!Array.isArray(vcard)) continue

    for (const prop of vcard) {
      if (!Array.isArray(prop) || prop.length < 4) continue

      const [name, , , value] = prop

      switch (name) {
        case 'fn':
          contact.name = value
          break
        case 'org':
          contact.organization = value
          break
        case 'email':
          contact.email = value
          break
        case 'tel':
          contact.phone = value
          break
        case 'adr':
          if (Array.isArray(value)) {
            contact.address = value.filter(Boolean)
          }
          break
        case 'country-name':
          contact.country = value
          break
      }
    }
  }

  return contact
}