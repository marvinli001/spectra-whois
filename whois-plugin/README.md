# SpectraWHOIS Plugin

[中文](./README_CN.md) | **English**

Traditional WHOIS query service for SpectraWHOIS - Node.js implementation for Railway deployment. This plugin handles WHOIS queries for domains that don't support RDAP using native TCP connections.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=alphasec)

## ✨ Features

- 🔍 **IANA-based server discovery** - Automatically discovers authoritative WHOIS servers
- 🔄 **Query syntax fallback** - Tries multiple query formats for better compatibility
- 🏃‍♂️ **Fast caching** - 24-hour cache for discovered WHOIS servers
- 🛡️ **Error handling** - Comprehensive error categorization and troubleshooting
- 📊 **Batch queries** - Support for multiple domain queries
- 🌐 **Railway ready** - Optimized for Railway deployment
- 🔒 **Security** - Built-in CORS, Helmet, and compression middleware
- 📈 **Health monitoring** - Health check endpoint for uptime monitoring

## 🚀 Quick Deploy

### One-Click Railway Deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=alphasec)

**Important**: When deploying on Railway, make sure to:
1. Set the **Root Directory** to `whois-plugin`
2. Railway will automatically detect the Node.js project
3. No additional environment variables needed

### Manual Deployment

1. **Clone the repository:**
```bash
git clone https://github.com/marvinli001/spectra-whois.git
cd spectra-whois/whois-plugin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run locally:**
```bash
npm start        # Production mode
npm run dev      # Development mode with watch
```

4. **Test the service:**
```bash
npm test         # Run basic tests
```

## 📡 API Endpoints

### Single Domain Query
```http
GET /whois?domain=example.com
```

**Response:**
```json
{
  "success": true,
  "domain": "example.com",
  "whoisServer": "whois.verisign-grs.com",
  "rawData": "Domain Name: EXAMPLE.COM\nRegistrar: ...",
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

### Batch Query
```http
POST /whois/batch
Content-Type: application/json

{
  "domains": ["example.com", "github.com", "vercel.com"]
}
```

**Response:**
```json
{
  "success": true,
  "batch": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "results": [
    {
      "domain": "example.com",
      "success": true,
      "data": { ... },
      "error": null
    }
  ]
}
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "spectra-whois-plugin",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1234.567
}
```

### Service Info
```http
GET /
```

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3001` | Auto-set by Railway |
| `NODE_ENV` | Environment mode | `production` | Auto-set by Railway |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | All origins | No |
| `RATE_LIMIT` | Requests per minute per IP | `60` | No |
| `WHOIS_TIMEOUT` | WHOIS query timeout (ms) | `10000` | No |
| `IANA_TIMEOUT` | IANA query timeout (ms) | `8000` | No |

### CORS Configuration

For production, update the CORS origins in `server.js`:

```javascript
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://your-vercel-app.vercel.app'
  ]
}))
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│  Railway API    │───▶│  WHOIS Servers  │
│  (SpectraWHOIS) │    │   (Node.js)     │    │  (Port 43)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  IANA Discovery │
                       │ whois.iana.org  │
                       └─────────────────┘
```

## 🔍 How It Works

1. **Server Discovery**: Query IANA first to find the authoritative WHOIS server for each TLD
2. **Caching**: Cache discovered servers for 24 hours to improve performance
3. **Query Fallback**: Try multiple query formats:
   - `domain example.com` (for Verisign servers)
   - `=example.com` (alternative format)
   - `example.com` (bare domain)
4. **TCP Connection**: Use native Node.js `net.Socket` with proper handshake
5. **Error Handling**: Categorize errors and provide troubleshooting suggestions

## 🌟 Advantages over Cloudflare Workers

- ✅ **No network restrictions** - Railway allows outbound TCP connections to WHOIS servers
- ✅ **Better compatibility** - Standard Node.js net.Socket instead of Workers TCP API
- ✅ **No rate limits** - Cloudflare's exit nodes are often blocked by WHOIS servers
- ✅ **Full control** - Complete control over network stack and error handling
- ✅ **Better debugging** - Comprehensive logging and error categorization

## 🧪 Testing

### Basic Test
```bash
npm test
```

### Manual Testing
```bash
# Start the server
npm run dev

# Test single domain query
curl "http://localhost:3001/whois?domain=google.com"

# Test batch query
curl -X POST http://localhost:3001/whois/batch \
  -H "Content-Type: application/json" \
  -d '{"domains": ["google.com", "github.com"]}'

# Test health check
curl http://localhost:3001/health
```

## 📦 Integration with Frontend

After deploying to Railway, update your frontend environment variables:

```bash
# .env.local in your Next.js project
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
```

The frontend will automatically detect the plugin and show the WHOIS tab for supported domains.

## 🐛 Error Handling

The service categorizes errors into:

- `connection_refused` - WHOIS server unavailable
- `timeout` - Query timeout
- `server_not_found` - DNS resolution failed
- `empty_response` - Server returned no data
- `iana_discovery_failed` - Failed to find authoritative server

Each error includes troubleshooting suggestions:

```json
{
  "success": false,
  "error": "Connection timeout",
  "reason": "timeout",
  "troubleshooting": {
    "description": "Query timed out waiting for response",
    "suggestions": [
      "Server may be experiencing high load",
      "Try again later",
      "Consider using manual WHOIS lookup"
    ]
  }
}
```

## 📈 Performance

- **Cold start**: ~100ms
- **WHOIS query**: 1-3 seconds (depending on server)
- **Cached queries**: ~50ms
- **Batch queries**: Parallel processing
- **Memory usage**: ~50MB baseline

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Test your changes with `npm test`
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Built with ❤️ for SpectraWHOIS**