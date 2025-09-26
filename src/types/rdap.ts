// RDAP response types based on RFC 7483

export interface RdapResponse {
  rdapConformance: string[]
  notices?: Notice[]
  links?: Link[]
  events?: Event[]
  status?: string[]
  port43?: string
  handle?: string
  entities?: Entity[]
}

export interface DomainResponse extends RdapResponse {
  objectClassName: 'domain'
  ldhName?: string
  unicodeName?: string
  variants?: Variant[]
  nameservers?: Nameserver[]
  secureDNS?: SecureDNS
  publicIds?: PublicId[]
}

export interface Notice {
  title?: string
  description?: string[]
  links?: Link[]
}

export interface Link {
  value?: string
  rel?: string
  href?: string
  hreflang?: string[]
  title?: string
  media?: string
  type?: string
}

export interface Event {
  eventAction: string
  eventActor?: string
  eventDate?: string
  links?: Link[]
}

export interface Entity {
  objectClassName: 'entity'
  handle?: string
  vcardArray?: VCard[]
  roles?: string[]
  publicIds?: PublicId[]
  entities?: Entity[]
  remarks?: Remark[]
  links?: Link[]
  events?: Event[]
  status?: string[]
  port43?: string
  networks?: Network[]
  autnums?: Autnum[]
}

// VCard format: [version, properties]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VCard = any[]

export interface Remark {
  title?: string
  type?: string
  description?: string[]
  links?: Link[]
}

export interface Network {
  objectClassName: 'ip network'
  handle?: string
  startAddress?: string
  endAddress?: string
  ipVersion?: 'v4' | 'v6'
  name?: string
  type?: string
  country?: string
  parentHandle?: string
  status?: string[]
  entities?: Entity[]
  remarks?: Remark[]
  links?: Link[]
  events?: Event[]
  port43?: string
}

export interface Autnum {
  objectClassName: 'autnum'
  handle?: string
  startAutnum?: number
  endAutnum?: number
  name?: string
  type?: string
  country?: string
  status?: string[]
  entities?: Entity[]
  remarks?: Remark[]
  links?: Link[]
  events?: Event[]
  port43?: string
}

export interface Nameserver {
  objectClassName: 'nameserver'
  ldhName?: string
  unicodeName?: string
  status?: string[]
  entities?: Entity[]
  remarks?: Remark[]
  links?: Link[]
  events?: Event[]
  port43?: string
}

export interface Variant {
  relation?: string[]
  idnTable?: string
  variantNames?: VariantName[]
}

export interface VariantName {
  ldhName?: string
  unicodeName?: string
}

export interface SecureDNS {
  zoneSigned?: boolean
  delegationSigned?: boolean
  maxSigLife?: number
  dsData?: DSData[]
  keyData?: KeyData[]
}

export interface DSData {
  keyTag: number
  algorithm: number
  digest: string
  digestType: number
  events?: Event[]
  links?: Link[]
}

export interface KeyData {
  flags: number
  protocol: number
  algorithm: number
  publicKey: string
  events?: Event[]
  links?: Link[]
}

export interface PublicId {
  type: string
  identifier: string
}

// IANA Bootstrap Registry types
export interface BootstrapRegistry {
  version: string
  publication: string
  description: string
  services: BootstrapService[]
}

// Format: [tlds_array, rdap_servers_array]
export type BootstrapService = [string[], string[]]

// Processed WHOIS result for frontend
export interface WhoisResult {
  domain: string
  registrar?: string
  registrant?: ContactInfo
  admin?: ContactInfo
  tech?: ContactInfo
  billing?: ContactInfo
  nameservers?: string[]
  dnssec?: boolean
  status?: string[]
  created?: string
  updated?: string
  expires?: string
  notices?: Notice[]
  raw?: DomainResponse
  source?: 'rdap' | 'whois'
}

export interface ContactInfo {
  name?: string
  organization?: string
  email?: string
  phone?: string
  address?: string[]
  country?: string
}

// Error types
export interface WhoisError {
  code: 'INVALID_DOMAIN' | 'TLD_NOT_SUPPORTED' | 'RDAP_ERROR' | 'QUERY_ERROR' | 'RATE_LIMITED' | 'NETWORK_ERROR'
  message: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any
}