/**
 * WHOIS Client for Node.js
 * Implements IANA-based server discovery and traditional WHOIS queries
 */

import { Socket } from 'net';
import { promisify } from 'util';

export class WhoisClient {
  constructor() {
    // Cache for WHOIS server mappings discovered via IANA
    this.whoisServerCache = new Map();
    this.cacheDuration = 24 * 60 * 60 * 1000; // 24 hours

    // TLDs with known WHOIS restrictions
    this.restrictedTlds = new Set([
      'nz', // New Zealand has strict API restrictions
      'au', // Australia may have restrictions
      'uk', // Some UK domains have restrictions
    ]);

    // Fallback servers for well-known TLDs
    this.fallbackServers = {
      'com': 'whois.verisign-grs.com',
      'net': 'whois.verisign-grs.com',
      'org': 'whois.publicinterestregistry.org',
      'default': 'whois.iana.org'
    };
  }

  /**
   * Main query method
   */
  async query(domain) {
    if (!domain || typeof domain !== 'string') {
      throw new Error('Domain is required and must be a string');
    }

    const cleanDomain = domain.trim().toLowerCase();
    if (!this.isValidDomain(cleanDomain)) {
      throw new Error('Invalid domain format');
    }

    const tld = this.extractTld(cleanDomain);
    console.log(`Querying WHOIS for domain: ${cleanDomain} (TLD: ${tld})`);

    try {
      // Get authoritative WHOIS server via IANA discovery
      const whoisServer = await this.getAuthoritativeWhoisServer(tld);

      // Check if this TLD has known restrictions
      if (this.restrictedTlds.has(tld)) {
        console.log(`Warning: ${tld} TLD has known WHOIS API restrictions`);
      }

      // Try different query syntax formats with fallback
      const response = await this.queryWithSyntaxFallback(whoisServer, cleanDomain);

      // Parse and clean the response
      const cleanedResponse = this.cleanWhoisResponse(response);
      const parsedData = this.parseWhoisResponse(cleanedResponse, cleanDomain);

      return {
        success: true,
        domain: cleanDomain,
        whoisServer: whoisServer,
        rawData: cleanedResponse,
        parsedData: parsedData,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`WHOIS query failed for ${cleanDomain}:`, error.message);

      return {
        success: false,
        domain: cleanDomain,
        error: error.message,
        source: 'whois',
        reason: this.categorizeError(error),
        restricted: this.restrictedTlds.has(tld),
        manualCheckUrl: this.getManualCheckUrl(tld),
        timestamp: new Date().toISOString(),
        troubleshooting: this.getTroubleshootingInfo(error)
      };
    }
  }

  /**
   * Get authoritative WHOIS server for a TLD by querying IANA
   */
  async getAuthoritativeWhoisServer(tld) {
    // Check cache first
    if (this.whoisServerCache.has(tld)) {
      const cached = this.whoisServerCache.get(tld);
      if (Date.now() - cached.timestamp < this.cacheDuration) {
        console.log(`Using cached WHOIS server for ${tld}: ${cached.server}`);
        return cached.server;
      } else {
        // Cache expired, remove entry
        this.whoisServerCache.delete(tld);
      }
    }

    console.log(`Discovering WHOIS server for TLD: ${tld}`);

    try {
      // Query IANA for TLD information
      const ianaResponse = await this.queryWhoisServer('whois.iana.org', tld);

      if (!ianaResponse || ianaResponse.trim().length === 0) {
        console.log(`No response from IANA for TLD: ${tld}`);
        throw new Error('No response from IANA');
      }

      console.log(`IANA response for ${tld}: ${ianaResponse.substring(0, 200)}...`);

      // Parse the IANA response to find the whois server
      const whoisServerMatch = ianaResponse.match(/whois:\s*(.+)/i);

      if (whoisServerMatch) {
        const authoritativeServer = whoisServerMatch[1].trim();
        console.log(`Found authoritative WHOIS server for ${tld}: ${authoritativeServer}`);

        // Cache the result
        this.whoisServerCache.set(tld, {
          server: authoritativeServer,
          timestamp: Date.now()
        });

        return authoritativeServer;
      } else {
        console.log(`No whois server found in IANA response for ${tld}`);
        throw new Error('No whois server in IANA response');
      }

    } catch (error) {
      console.error(`Failed to discover WHOIS server for ${tld}:`, error.message);

      // Fall back to known servers or default
      const fallbackServer = this.fallbackServers[tld] || this.fallbackServers['default'];
      console.log(`Using fallback server for ${tld}: ${fallbackServer}`);

      return fallbackServer;
    }
  }

  /**
   * Query WHOIS server with syntax fallback
   */
  async queryWithSyntaxFallback(server, domain) {
    console.log(`Starting syntax fallback query for ${domain} on ${server}`);

    // Define query formats to try in order
    const queryFormats = [];

    // Special handling for Verisign servers (com/net)
    if (server === 'whois.verisign-grs.com') {
      queryFormats.push(`domain ${domain}`, `=${domain}`, domain);
    } else {
      queryFormats.push(domain, `=${domain}`, `domain ${domain}`);
    }

    let lastError = null;

    for (let i = 0; i < queryFormats.length; i++) {
      const query = queryFormats[i];
      console.log(`Trying query format ${i + 1}/${queryFormats.length}: "${query}"`);

      try {
        const response = await this.queryWhoisServer(server, query);

        // Check if we got a meaningful response
        if (response && response.trim().length > 0) {
          // Check for common "no match" or error responses
          const lowerResponse = response.toLowerCase();
          const isErrorResponse =
            lowerResponse.includes('no match') ||
            lowerResponse.includes('not found') ||
            lowerResponse.includes('no data found') ||
            lowerResponse.includes('invalid query') ||
            lowerResponse.includes('bad request') ||
            (response.trim().length < 50 && lowerResponse.includes('error'));

          if (!isErrorResponse) {
            console.log(`Success with query format: "${query}" (${response.length} chars)`);
            return response;
          } else {
            console.log(`Query format "${query}" returned error response, trying next format`);
            lastError = new Error(`Server returned error: ${response.substring(0, 200)}`);
          }
        } else {
          console.log(`Query format "${query}" returned empty response, trying next format`);
          lastError = new Error('Empty response from server');
        }

      } catch (error) {
        console.log(`Query format "${query}" failed: ${error.message}`);
        lastError = error;

        // If it's a connection/handshake error, don't try other formats
        if (error.message.includes('ECONNREFUSED') ||
            error.message.includes('ETIMEDOUT') ||
            error.message.includes('ENOTFOUND')) {
          console.log('Connection-related error detected, skipping remaining formats');
          break;
        }
      }

      // Small delay between attempts
      if (i < queryFormats.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // All formats failed
    console.log(`All query formats failed for ${domain} on ${server}`);
    throw lastError || new Error('All query syntax formats failed');
  }

  /**
   * Query a WHOIS server and return the raw response using Node.js net.Socket
   */
  async queryWhoisServer(server, query) {
    return new Promise((resolve, reject) => {
      console.log(`Connecting to ${server}:43 for query: "${query}"`);

      const socket = new Socket();
      const timeoutMs = 10000; // 10 seconds
      let response = '';
      let isConnected = false;

      // Set timeout
      socket.setTimeout(timeoutMs);

      // Connection handler
      socket.on('connect', () => {
        console.log(`Connected to ${server}`);
        isConnected = true;

        // Send query with CRLF
        const queryData = query + '\r\n';
        socket.write(queryData, 'utf8');
        console.log(`Query sent: "${query}"`);

        // Close write end (half-close)
        socket.end();
        console.log('Write end closed, waiting for response');
      });

      // Data handler
      socket.on('data', (chunk) => {
        const chunkStr = chunk.toString('utf8');
        response += chunkStr;
        console.log(`Received ${chunk.length} bytes (total: ${response.length})`);
      });

      // End handler
      socket.on('end', () => {
        console.log(`Connection closed by ${server}, total response: ${response.length} chars`);

        if (response.length === 0) {
          reject(new Error(`Empty response from ${server} - possible connection or rate limiting issue`));
        } else {
          resolve(response);
        }
      });

      // Error handler
      socket.on('error', (error) => {
        console.error(`Socket error for ${server}:`, error.message);

        if (error.code === 'ECONNREFUSED') {
          reject(new Error(`Connection refused by ${server}`));
        } else if (error.code === 'ETIMEDOUT') {
          reject(new Error(`Connection timeout to ${server}`));
        } else if (error.code === 'ENOTFOUND') {
          reject(new Error(`Server not found: ${server}`));
        } else {
          reject(new Error(`Connection error to ${server}: ${error.message}`));
        }
      });

      // Timeout handler
      socket.on('timeout', () => {
        console.error(`Query timeout for ${server} after ${timeoutMs}ms`);
        socket.destroy();
        reject(new Error(`Query timeout after ${timeoutMs}ms`));
      });

      // Close handler
      socket.on('close', (hadError) => {
        if (hadError) {
          console.error(`Connection to ${server} closed with error`);
          if (!isConnected) {
            reject(new Error(`Failed to connect to ${server}`));
          }
        } else {
          console.log(`Connection to ${server} closed normally`);
        }
      });

      // Start connection
      socket.connect(43, server);
    });
  }

  /**
   * Utility methods
   */
  isValidDomain(domain) {
    // Basic domain validation
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    return domainRegex.test(domain) && domain.length <= 253;
  }

  extractTld(domain) {
    return domain.split('.').pop().toLowerCase();
  }

  categorizeError(error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('Connection refused')) {
      return 'connection_refused';
    } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
      return 'timeout';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('not found')) {
      return 'server_not_found';
    } else if (error.message.includes('Empty response')) {
      return 'empty_response';
    } else if (error.message.includes('No response from IANA')) {
      return 'iana_discovery_failed';
    } else {
      return 'unknown';
    }
  }

  getTroubleshootingInfo(error) {
    const category = this.categorizeError(error);
    const troubleshooting = {
      'connection_refused': {
        description: 'WHOIS server refused the connection',
        suggestions: [
          'Server may be down or blocking connections',
          'Try again later',
          'Use manual WHOIS lookup'
        ]
      },
      'timeout': {
        description: 'Query timed out waiting for response',
        suggestions: [
          'Server may be experiencing high load',
          'Network connectivity issues',
          'Try again with shorter timeout'
        ]
      },
      'server_not_found': {
        description: 'WHOIS server hostname could not be resolved',
        suggestions: [
          'DNS resolution failed',
          'Server hostname may be incorrect',
          'Check internet connectivity'
        ]
      },
      'empty_response': {
        description: 'Server connected but returned no data',
        suggestions: [
          'Query format may not be accepted',
          'Server rate limiting may be in effect',
          'Try manual lookup'
        ]
      },
      'iana_discovery_failed': {
        description: 'Failed to discover authoritative WHOIS server',
        suggestions: [
          'IANA service may be unavailable',
          'Using fallback servers',
          'Check connectivity to whois.iana.org'
        ]
      },
      'unknown': {
        description: 'Unexpected error during query',
        suggestions: [
          'Check domain name format',
          'Try manual WHOIS lookup',
          'Contact support if issue persists'
        ]
      }
    };

    return troubleshooting[category] || troubleshooting['unknown'];
  }

  getManualCheckUrl(tld) {
    const urls = {
      'nz': 'https://whois.srs.net.nz',
      'au': 'https://whois.auda.org.au',
      'uk': 'https://whois.nic.uk',
    };
    return urls[tld] || null;
  }

  cleanWhoisResponse(text) {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{3,}/g, '\n\n');
  }

  parseWhoisResponse(text, domain) {
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
}