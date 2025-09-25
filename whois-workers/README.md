# WHOIS TCP Proxy Workers

This Cloudflare Workers handles traditional WHOIS queries via TCP port 43 for domains that don't support RDAP protocol.

## Features

- TCP connection to WHOIS servers (port 43)
- Support for 30+ TLD WHOIS servers
- Structured JSON response format
- CORS enabled for frontend integration
- Fallback for non-RDAP domains

## Deployment

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Deploy the worker:
   ```bash
   cd whois-workers
   wrangler deploy
   ```

4. Get your worker URL:
   ```
   https://spectra-whois-tcp-proxy.your-subdomain.workers.dev
   ```

## Usage

Make GET request to the worker:
```
https://your-worker-url.workers.dev?domain=example.com
```

## Environment Variables

Set the worker URL in your main application:
```bash
# In your Vercel environment or .env.local
WHOIS_WORKER_URL=https://spectra-whois-tcp-proxy.your-subdomain.workers.dev
```

## Response Format

```json
{
  "success": true,
  "domain": "example.com",
  "whoisServer": "whois.verisign-grs.com",
  "rawData": "Raw WHOIS response text...",
  "parsedData": {
    "domain": "example.com",
    "registrar": "Example Registrar",
    "registrationDate": "1995-08-14T04:00:00Z",
    "expirationDate": "2024-08-13T04:00:00Z",
    "nameServers": ["ns1.example.com", "ns2.example.com"],
    "status": ["clientTransferProhibited"]
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Supported TLDs

The worker includes WHOIS servers for:
- Generic TLDs: com, net, org, info, biz, name, etc.
- Country TLDs: uk, de, fr, jp, au, ca, etc.
- New gTLDs: io, co, me, tv, cc, etc.

Unsupported TLDs will fallback to IANA WHOIS server.