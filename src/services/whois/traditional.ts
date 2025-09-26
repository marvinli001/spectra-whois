/**
 * Traditional WHOIS Service
 *
 * Handles WHOIS queries for domains that don't support RDAP
 * by proxying through Cloudflare Workers TCP connections.
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
 */
export const NON_RDAP_TLDS = new Set([
  // Some older or regional TLDs that may not have RDAP
  'tk', 'ml', 'ga', 'cf', 'ws', 'nu', 'co.uk', 'org.uk', 'me.uk',
  'edu', 'gov', 'mil', 'int', 'arpa',
  // Add more as needed
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
 * Query traditional WHOIS via Cloudflare Workers
 */
export async function queryTraditionalWhois(domain: string): Promise<WhoisResponse> {
  const workerUrl = process.env.WHOIS_WORKER_URL || process.env.NEXT_PUBLIC_WHOIS_WORKER_URL;

  if (!workerUrl) {
    return {
      success: false,
      domain,
      timestamp: new Date().toISOString(),
      error: 'WHOIS Worker URL not configured. Please set WHOIS_WORKER_URL environment variable.'
    };
  }

  try {
    const url = new URL(workerUrl);
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