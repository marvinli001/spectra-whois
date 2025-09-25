/**
 * Cloudflare Workers TCP Proxy for WHOIS Queries
 *
 * This worker handles traditional WHOIS lookups via TCP port 43
 * for domains that don't support RDAP protocol.
 */

// WHOIS server mappings for different TLDs
const WHOIS_SERVERS = {
  // Generic TLDs
  'com': 'whois.verisign-grs.com',
  'net': 'whois.verisign-grs.com',
  'org': 'whois.pir.org',
  'info': 'whois.afilias.net',
  'biz': 'whois.nic.biz',
  'name': 'whois.nic.name',
  'mobi': 'whois.dotmobiregistry.net',
  'pro': 'whois.registrypro.pro',
  'travel': 'whois.nic.travel',
  'museum': 'whois.museum',
  'coop': 'whois.nic.coop',
  'aero': 'whois.information.aero',

  // Country code TLDs
  'uk': 'whois.nic.uk',
  'de': 'whois.denic.de',
  'fr': 'whois.afnic.fr',
  'it': 'whois.nic.it',
  'jp': 'whois.jprs.jp',
  'kr': 'whois.kr',
  'au': 'whois.auda.org.au',
  'ca': 'whois.cira.ca',
  'eu': 'whois.eu',
  'ru': 'whois.tcinet.ru',
  'br': 'whois.registro.br',
  'mx': 'whois.mx',
  'tw': 'whois.twnic.net.tw',
  'hk': 'whois.hkirc.hk',
  'sg': 'whois.sgnic.sg',
  'th': 'whois.thnic.co.th',
  'my': 'whois.mynic.my',
  'ph': 'whois.nic.ph',
  'vn': 'whois.nic.vn',
  'id': 'whois.pandi.or.id',

  // New gTLDs (examples)
  'io': 'whois.nic.io',
  'co': 'whois.nic.co',
  'me': 'whois.nic.me',
  'tv': 'whois.nic.tv',
  'cc': 'whois.nic.cc',
  'tk': 'whois.dot.tk',

  // Default fallback
  'default': 'whois.iana.org'
};

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: CORS_HEADERS
      });
    }

    try {
      const url = new URL(request.url);
      const domain = url.searchParams.get('domain');

      if (!domain) {
        return new Response(JSON.stringify({
          success: false,
          error: 'Domain parameter is required'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS
          }
        });
      }

      // Get TLD from domain
      const tld = domain.split('.').pop().toLowerCase();
      const whoisServer = WHOIS_SERVERS[tld] || WHOIS_SERVERS['default'];

      console.log(`Querying WHOIS for ${domain} via ${whoisServer}`);

      // Connect to WHOIS server
      const socket = connect({
        hostname: whoisServer,
        port: 43,
      });

      // Send domain query
      const writer = socket.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(domain + '\r\n'));
      await writer.close();

      // Read response
      const reader = socket.readable.getReader();
      const decoder = new TextDecoder();
      let response = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          response += decoder.decode(value, { stream: true });
        }
      } catch (error) {
        console.error('Error reading WHOIS response:', error);
      } finally {
        await reader.releaseLock();
      }

      // Parse and clean the response
      const cleanedResponse = cleanWhoisResponse(response);
      const parsedData = parseWhoisResponse(cleanedResponse, domain);

      return new Response(JSON.stringify({
        success: true,
        domain: domain,
        whoisServer: whoisServer,
        rawData: cleanedResponse,
        parsedData: parsedData,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        }
      });

    } catch (error) {
      console.error('WHOIS query error:', error);

      return new Response(JSON.stringify({
        success: false,
        error: error.message || 'Failed to query WHOIS server',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        }
      });
    }
  }
};

/**
 * Clean and normalize WHOIS response text
 */
function cleanWhoisResponse(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n{3,}/g, '\n\n');
}

/**
 * Parse WHOIS response into structured data
 */
function parseWhoisResponse(text, domain) {
  const lines = text.split('\n');
  const data = {
    domain: domain,
    registrar: null,
    registrationDate: null,
    expirationDate: null,
    updatedDate: null,
    nameServers: [],
    status: [],
    registrant: {},
    admin: {},
    tech: {},
    billing: {}
  };

  let currentSection = null;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('%') || trimmedLine.startsWith('#')) {
      continue;
    }

    const [key, ...valueParts] = trimmedLine.split(':');
    if (valueParts.length === 0) continue;

    const value = valueParts.join(':').trim();
    const lowerKey = key.toLowerCase().trim();

    // Parse common WHOIS fields
    if (lowerKey.includes('registrar') && !lowerKey.includes('whois')) {
      data.registrar = value;
    } else if (lowerKey.includes('creation') || lowerKey.includes('created') || lowerKey.includes('registration date')) {
      data.registrationDate = value;
    } else if (lowerKey.includes('expir') || lowerKey.includes('expires')) {
      data.expirationDate = value;
    } else if (lowerKey.includes('updated') || lowerKey.includes('last updated')) {
      data.updatedDate = value;
    } else if (lowerKey.includes('name server') || lowerKey.includes('nameserver') || lowerKey === 'nserver') {
      if (value && !data.nameServers.includes(value.toLowerCase())) {
        data.nameServers.push(value.toLowerCase());
      }
    } else if (lowerKey.includes('status')) {
      if (value && !data.status.includes(value)) {
        data.status.push(value);
      }
    }
  }

  return data;
}