# SpectraWHOIS Plugin

Traditional WHOIS query service for SpectraWHOIS - Node.js implementation for Railway deployment.

## Features

- 🔍 **IANA-based server discovery** - Automatically discovers authoritative WHOIS servers
- 🔄 **Query syntax fallback** - Tries multiple query formats for better compatibility
- 🏃‍♂️ **Fast caching** - 24-hour cache for discovered WHOIS servers
- 🛡️ **Error handling** - Comprehensive error categorization and troubleshooting
- 📊 **Batch queries** - Support for multiple domain queries
- 🌐 **Railway ready** - Optimized for Railway deployment

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

## API Endpoints

### Single Domain Query
```http
GET /whois?domain=example.com
```

### Batch Query
```http
POST /whois/batch
Content-Type: application/json

{
  "domains": ["example.com", "github.com"]
}
```

### Health Check
```http
GET /health
```

## Response Format

### Success Response
```json
{
  "success": true,
  "domain": "example.com",
  "whoisServer": "whois.verisign-grs.com",
  "rawData": "Domain Name: EXAMPLE.COM...",
  "parsedData": {
    "domain": "example.com",
    "registrar": "Reserved Domain",
    "registrationDate": "1995-08-14",
    "expirationDate": "2024-08-13",
    "nameServers": ["a.iana-servers.net", "b.iana-servers.net"]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "domain": "example.com",
  "error": "Connection timeout",
  "source": "whois",
  "reason": "timeout",
  "troubleshooting": {
    "description": "Query timed out waiting for response",
    "suggestions": ["Server may be experiencing high load", "Try again later"]
  }
}
```

## Railway Deployment

1. **Connect Repository**: Link your GitHub repo to Railway
2. **Auto-detection**: Railway will automatically detect this as a Node.js project
3. **Environment Variables**: Set production environment variables in Railway dashboard
4. **Deploy**: Railway will build and deploy automatically

### Required Environment Variables for Production

- `NODE_ENV=production`
- `ALLOWED_ORIGINS=https://your-frontend-domain.com`
- `PORT` (automatically set by Railway)

## Integration with Frontend

Update your frontend environment variables to point to the Railway deployment:

```bash
# .env.local in your Next.js project
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│  Railway API    │───▶│  WHOIS Servers  │
│  (Next.js)      │    │   (Node.js)     │    │  (Port 43)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  IANA Discovery │
                       │ whois.iana.org  │
                       └─────────────────┘
```

## Why Railway vs Cloudflare Workers?

- ✅ **No network restrictions** - Railway allows outbound TCP connections to WHOIS servers
- ✅ **Better compatibility** - Standard Node.js net.Socket instead of Workers TCP API
- ✅ **No rate limits** - Cloudflare's exit nodes are often blocked by WHOIS servers
- ✅ **Full control** - Complete control over network stack and error handling

## Performance

- **Cold start**: ~100ms
- **WHOIS query**: 1-3 seconds (depending on server)
- **Cached queries**: ~50ms
- **Batch queries**: Parallel processing

## Error Handling

The service categorizes errors into:

- `connection_refused` - WHOIS server unavailable
- `timeout` - Query timeout
- `server_not_found` - DNS resolution failed
- `empty_response` - Server returned no data
- `iana_discovery_failed` - Failed to find authoritative server

Each error includes troubleshooting suggestions for better user experience.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Test your changes with `npm test`
4. Submit a pull request

## License

MIT License - see LICENSE file for details.