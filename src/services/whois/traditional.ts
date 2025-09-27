/**
 * Traditional WHOIS Service
 *
 * Handles WHOIS queries for domains that don't support RDAP
 * by proxying through Railway Node.js plugin with native TCP connections.
 */

export interface WhoisResponse {
  success: boolean;
  domain: string;
  whoisServer?: string;
  rawData?: string;
  parsedData?: WhoisParsedData;
  timestamp: string;
  error?: string;
}

export interface WhoisParsedData {
  domain: string;
  registrar: string | null;
  registrarUrl: string | null;
  registrarEmail: string | null;
  registrarPhone: string | null;
  registrationDate: string | null;
  expirationDate: string | null;
  updatedDate: string | null;
  nameServers: string[];
  status: string[];
  registrant: Record<string, string | null>;
  admin: Record<string, string | null>;
  tech: Record<string, string | null>;
  billing: Record<string, string | null>;
}

/**
 * TLDs that typically don't support RDAP and need traditional WHOIS
 * Based on RDAP.ORG deployment panel showing "RDAP = No"
 */
export const NON_RDAP_TLDS = new Set([
  // Legacy/special use TLDs
  'edu', 'gov', 'mil', 'int', 'arpa',

  // Free TLDs that don't support RDAP
  'tk', 'ml', 'ga', 'cf', 'ws', 'nu',

  // UK second-level domains
  'co.uk', 'org.uk', 'me.uk', 'ac.uk', 'gov.uk',

  // Country code TLDs without RDAP (alphabetical order)
  'ae', 'af', 'ag', 'al', 'am', 'ao', 'at', 'au', 'az',
  'ba', 'bd', 'be', 'bg', 'bh', 'bn', 'bo', 'by', 'bz',
  'ch', 'cl', 'cn', 'co', 'cr', 'cu', 'cy',
  'de', 'dk', 'do', 'dz',
  'ec', 'ee', 'eg', 'es', 'eu',
  'fk',
  'gh', 'gr', 'gt',
  'hk', 'hm', 'hr', 'hu',
  'ie', 'il', 'io', 'iq', 'ir', 'it',
  'jm', 'jo', 'jp',
  'kh', 'kr', 'kw', 'kz',
  'li', 'lk', 'lt', 'lu', 'lv',
  'ma', 'mm', 'mn', 'mo', 'mt', 'mx', 'my',
  'ng', 'ni', 'np', 'nz',
  'pe', 'ph', 'pk', 'pt',
  'qa',
  'ro', 'rs', 'ru',
  'sa', 'se', 'sg', 'sk', 'st', 'su',
  'tg', 'tr', 'tv',
  'uy', 'uz',
  've', 'vn',

  // IDN ccTLD variants
  '中国', '中國', 'рф', 'укр', 'الاردن', 'قطر', '新加坡',
  'мкд', 'فلسطين', 'سورية', 'ලංකා', 'ભારત'
]);

/**
 * Check if a domain likely needs traditional WHOIS lookup
 */
export function needsTraditionalWhois(domain: string): boolean {
  const tld = domain.toLowerCase().split('.').slice(-2).join('.');
  const lastTld = domain.toLowerCase().split('.').pop() || '';

  return NON_RDAP_TLDS.has(tld) || NON_RDAP_TLDS.has(lastTld);
}

/**
 * Query traditional WHOIS via Railway Plugin
 */
export async function queryTraditionalWhois(domain: string): Promise<WhoisResponse> {
  const pluginUrl = process.env.NEXT_PUBLIC_WHOIS_PLUGIN_URL || process.env.NEXT_PUBLIC_WHOIS_API_URL;

  if (!pluginUrl) {
    return {
      success: false,
      domain,
      timestamp: new Date().toISOString(),
      error: 'WHOIS Plugin URL not configured. Please set NEXT_PUBLIC_WHOIS_PLUGIN_URL environment variable.'
    };
  }

  try {
    const url = new URL(pluginUrl);
    url.searchParams.set('domain', domain);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'SpectraWHOIS/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: WhoisResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'WHOIS query failed');
    }

    return data;
  } catch (error) {
    console.error('Traditional WHOIS query error:', error);

    return {
      success: false,
      domain,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Convert traditional WHOIS response to RDAP-like format
 */
export function convertWhoisToRdap(whoisResponse: WhoisResponse) {
  if (!whoisResponse.success || !whoisResponse.parsedData) {
    return null;
  }

  const data = whoisResponse.parsedData;

  return {
    domain: data.domain,
    registrar: data.registrar,
    status: data.status,
    nameservers: data.nameServers,
    created: data.registrationDate,
    updated: data.updatedDate,
    expires: data.expirationDate,
    registrant: Object.keys(data.registrant).length > 0 ? data.registrant : null,
    admin: Object.keys(data.admin).length > 0 ? data.admin : null,
    tech: Object.keys(data.tech).length > 0 ? data.tech : null,
    billing: Object.keys(data.billing).length > 0 ? data.billing : null,
    raw: whoisResponse.rawData,
    source: 'whois',
    server: whoisResponse.whoisServer,
    timestamp: whoisResponse.timestamp
  };
}