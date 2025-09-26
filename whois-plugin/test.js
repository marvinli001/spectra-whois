/**
 * Simple test for the WHOIS client
 */

import { WhoisClient } from './lib/whois-client.js';

async function testWhoisClient() {
  const client = new WhoisClient();

  console.log('🧪 Testing WHOIS Client...\n');

  // Test domains
  const testDomains = ['google.com', 'github.com', 'example.org'];

  for (const domain of testDomains) {
    console.log(`Testing ${domain}...`);

    try {
      const result = await client.query(domain);

      if (result.success) {
        console.log(`✅ ${domain}: Success (${result.rawData.length} chars)`);
        console.log(`   Registrar: ${result.parsedData.registrar || 'N/A'}`);
        console.log(`   Server: ${result.whoisServer}`);
      } else {
        console.log(`❌ ${domain}: Failed - ${result.error}`);
        console.log(`   Reason: ${result.reason}`);
      }
    } catch (error) {
      console.log(`💥 ${domain}: Exception - ${error.message}`);
    }

    console.log(''); // Empty line
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testWhoisClient().catch(console.error);
}