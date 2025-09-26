/**
 * Cloudflare Workers TCP Proxy for WHOIS Queries
 *
 * This worker handles traditional WHOIS lookups via TCP port 43
 * for domains that don't support RDAP protocol.
 */

import { connect } from 'cloudflare:sockets';

// TLDs with known WHOIS restrictions or blocks
const RESTRICTED_TLDS = new Set([
  'nz', // New Zealand has strict API restrictions
  'au', // Australia may have restrictions
  'uk', // Some UK domains have restrictions
]);

// WHOIS server mappings for different TLDs
const WHOIS_SERVERS = {
  // Generic TLDs
  'com': 'whois.verisign-grs.com',
  'net': 'whois.verisign-grs.com',
  'org': 'whois.publicinterestregistry.org',
  'biz': 'whois.nic.biz',
  'name': 'whois.nic.name',
  'mobi': 'whois.nic.mobi',
  'travel': 'whois.nic.travel',
  'museum': 'whois.nic.museum',
  'coop': 'whois.nic.coop',
  'aero': 'whois.aero',
  'edu': 'whois.educause.edu',
  'gov': 'whois.nic.gov',
  // Note: 'info', 'pro', 'mil' no longer have official WHOIS servers per IANA

  // Country code TLDs (alphabetical order)
  'ae': 'whois.aeda.net.ae',
  'af': 'whois.nic.af',
  'ag': 'whois.nic.ag',
  'ai': 'whois.nic.ai',
  // 'al': No official WHOIS server per IANA
  'am': 'whois.amnic.net',
  'ao': 'whois.nic.ao',
  'ar': 'whois.nic.ar',
  'at': 'whois.nic.at',
  'au': 'whois.auda.org.au',
  // 'az': No official WHOIS server per IANA

  'ba': 'whois.ripe.net',
  'bd': 'whois.btcl.net.bd',
  'be': 'whois.dns.be',
  'bg': 'whois.register.bg',
  'bh': 'whois.nic.bh',
  'bn': 'whois.bnnic.bn',
  'bo': 'whois.nic.bo',
  'br': 'whois.registro.br',
  'by': 'whois.cctld.by',
  'bz': 'whois.belizenic.bz',

  'ca': 'whois.cira.ca',
  'cc': 'whois.nic.cc',
  'ch': 'whois.nic.ch',
  'cl': 'whois.nic.cl',
  'cn': 'whois.cnnic.net.cn',
  'co': 'whois.nic.co',
  'cr': 'whois.nic.cr',
  'cu': 'whois.nic.cu',
  // 'cy': No official WHOIS server per IANA (web-based only)
  'cz': 'whois.nic.cz',

  'de': 'whois.denic.de',
  'dk': 'whois.punktum.dk',
  'do': 'whois.nic.do',
  'dz': 'whois.nic.dz',

  'ec': 'whois.nic.ec',
  'ee': 'whois.tld.ee',
  'eg': 'whois.ripe.net',
  'es': 'whois.nic.es',
  'eu': 'whois.eu',

  'fi': 'whois.fi',
  'fk': 'whois.nic.fk',
  'fr': 'whois.afnic.fr',

  'ga': 'whois.nic.ga',
  'gh': 'whois.nic.gh',
  // 'gr': No official WHOIS server per IANA (web-based only)
  'gt': 'whois.gt',

  'hk': 'whois.hkirc.hk',
  'hm': 'whois.registry.hm',
  'hr': 'whois.dns.hr',
  'hu': 'whois.nic.hu',

  'id': 'whois.id',
  'ie': 'whois.weare.ie',
  'il': 'whois.isoc.org.il',
  'in': 'whois.registry.in',
  'io': 'whois.nic.io',
  'iq': 'whois.cmc.iq',
  'ir': 'whois.nic.ir',
  'is': 'whois.isnic.is',
  'it': 'whois.nic.it',

  'jm': 'whois.nic.jm',
  'jo': 'whois.nic.jo',
  'jp': 'whois.jprs.jp',

  'ke': 'whois.kenic.or.ke',
  'kh': 'whois.nic.kh',
  'kr': 'whois.kr',
  'kw': 'whois.nic.kw',
  'kz': 'whois.nic.kz',

  'li': 'whois.nic.li',
  'lk': 'whois.nic.lk',
  'lt': 'whois.domreg.lt',
  'lu': 'whois.dns.lu',
  'lv': 'whois.nic.lv',
  'ly': 'whois.nic.ly',

  'ma': 'whois.registre.ma',
  'me': 'whois.nic.me',
  'mm': 'whois.nic.mm',
  'mn': 'whois.nic.mn',
  'mo': 'whois.monic.mo',
  'mt': 'whois.nic.org.mt',
  'mx': 'whois.mx',
  'my': 'whois.mynic.my',

  'ng': 'whois.nic.net.ng',
  'ni': 'whois.nic.ni',
  'nl': 'whois.domain-registry.nl',
  'no': 'whois.norid.no',
  'np': 'whois.mos.com.np',
  'nz': 'whois.irs.net.nz',

  'pe': 'kero.yachay.pe',
  'ph': 'whois.nic.ph',
  'pk': 'whois.pknic.net.pk',
  'pl': 'whois.dns.pl',
  'pt': 'whois.dns.pt',

  'qa': 'whois.registry.qa',

  'ro': 'whois.rotld.ro',
  'rs': 'whois.rnids.rs',
  'ru': 'whois.tcinet.ru',

  'sa': 'whois.nic.net.sa',
  'se': 'whois.iis.se',
  'sg': 'whois.sgnic.sg',
  'si': 'whois.arnes.si',
  'sk': 'whois.sk-nic.sk',
  'st': 'whois.nic.st',
  'su': 'whois.tcinet.ru',

  'tg': 'whois.nic.tg',
  'th': 'whois.thnic.co.th',
  'tk': 'whois.dot.tk',
  'tr': 'whois.trabis.gov.tr',
  'tv': 'whois.nic.tv',
  'tw': 'whois.twnic.net.tw',

  'ua': 'whois.ua',
  'uk': 'whois.nic.uk',
  'uy': 'whois.nic.org.uy',
  'uz': 'whois.cctld.uz',

  've': 'whois.nic.ve',
  'vn': 'whois.nic.vn',

  'ws': 'whois.website.ws',

  // IDN ccTLDs
  '中国': 'cwhois.cnnic.cn',
  '中國': 'cwhois.cnnic.cn',
  'рф': 'whois.tcinet.ru',
  'укр': 'whois.ua',
  'الاردن': 'whois.dns.jo',
  'قطر': 'whois.registry.qa',
  '新加坡': 'whois.sgnic.sg',
  'мкд': 'whois.marnet.mk',
  'فلسطين': 'whois.pnina.ps',
  'سورية': 'whois.tld.sy',
  'ලංකා': 'whois.nic.lk',
  'ભારત': 'whois.registry.in',

  // Default fallback
  'default': 'whois.iana.org'
};

/**
 * Get manual check URL for restricted TLDs
 */
function getManualCheckUrl(tld) {
  const urls = {
    'nz': 'https://whois.srs.net.nz',
    'au': 'https://whois.auda.org.au',
    'uk': 'https://whois.nic.uk',
  };

  return urls[tld] || null;
}

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

      // Check if this TLD has known restrictions
      if (RESTRICTED_TLDS.has(tld)) {
        console.log(`Warning: ${tld} TLD has known WHOIS API restrictions`);
      }

      console.log(`Querying WHOIS for ${domain} via ${whoisServer}`);

      // Connect to WHOIS server using Cloudflare's connect API
      const socket = connect({
        hostname: whoisServer,
        port: 43,
      });

      // Prepare query with proper format for different registries
      let query = domain;

      // Special query formats for specific registries
      if (whoisServer === 'whois.verisign-grs.com') {
        query = `domain ${domain}`;
      } else if (whoisServer === 'whois.nic.uk') {
        query = domain;
      }

      console.log(`Sending query: "${query}"`);

      // Send domain query
      const writer = socket.writable.getWriter();
      const encoder = new TextEncoder();
      await writer.write(encoder.encode(query + '\r\n'));

      // Don't close the writer immediately, give it time to flush
      await writer.ready;
      await writer.close();

      // Read response with timeout and better stream handling
      const reader = socket.readable.getReader();
      const decoder = new TextDecoder();
      let response = '';
      let totalBytesRead = 0;

      // Set up a timeout for reading - longer timeout for slow servers
      const readTimeout = setTimeout(() => {
        console.log('WHOIS query timeout after 30 seconds');
        reader.cancel();
      }, 30000); // 30 second timeout

      try {
        // Keep reading until stream is done or timeout
        while (true) {
          const readPromise = reader.read();
          const { done, value } = await readPromise;

          if (done) {
            console.log('Stream ended naturally');
            break;
          }

          if (value && value.length > 0) {
            const chunk = decoder.decode(value, { stream: true });
            response += chunk;
            totalBytesRead += value.length;
            console.log(`Received chunk: ${value.length} bytes (total: ${totalBytesRead})`);
          }

          // Small delay to prevent overwhelming the connection
          await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Final decode to handle any remaining bytes
        const finalChunk = decoder.decode();
        if (finalChunk) {
          response += finalChunk;
          console.log(`Final chunk: ${finalChunk.length} chars`);
        }

      } catch (error) {
        console.error('Error reading WHOIS response:', error);
        throw error;
      } finally {
        clearTimeout(readTimeout);
        try {
          await reader.releaseLock();
        } catch (e) {
          console.log('Reader already released');
        }
      }

      console.log(`Total response length: ${response.length} bytes`);

      // Parse and clean the response
      const cleanedResponse = cleanWhoisResponse(response);
      const parsedData = parseWhoisResponse(cleanedResponse, domain);

      // Check if we got a meaningful response
      if (!response || response.trim().length === 0) {
        console.log('Empty response received from WHOIS server');

        let errorMessage = 'No data received from WHOIS server';

        // Provide specific error messages for known restricted TLDs
        if (RESTRICTED_TLDS.has(tld)) {
          if (tld === 'nz') {
            errorMessage = 'New Zealand (.nz) domains have strict WHOIS API restrictions that block automated queries. Please check manually at whois.srs.net.nz';
          } else if (tld === 'au') {
            errorMessage = 'Australian (.au) domains may have WHOIS API restrictions. Please check manually at whois.auda.org.au';
          } else if (tld === 'uk') {
            errorMessage = 'UK domains may have WHOIS API restrictions. Please check manually at whois.nic.uk';
          } else {
            errorMessage = `${tld.toUpperCase()} domains may have WHOIS API restrictions that block automated queries`;
          }
        }

        return new Response(JSON.stringify({
          success: false,
          domain: domain,
          whoisServer: whoisServer,
          error: errorMessage,
          restricted: RESTRICTED_TLDS.has(tld),
          manualCheckUrl: getManualCheckUrl(tld),
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS
          }
        });
      }

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