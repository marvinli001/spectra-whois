# SpectraWHOIS WHOIS Plugin

<div align="center">

A standalone Node.js service that adds traditional WHOIS lookups to SpectraWHOIS.

[Main project](../README_EN.md) · [简体中文](./README.md) · [English](./README_EN.md)

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-ready-0B0D0E?logo=railway&logoColor=white)

</div>

The plugin uses Node.js `net.Socket` to query authoritative WHOIS servers over TCP port 43 and exposes the results through an HTTP API. It supports known non-RDAP TLDs and serves as an optional fallback when RDAP fails.

> This service is optional. SpectraWHOIS RDAP lookups do not depend on it.

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [API reference](#api-reference)
- [Error handling](#error-handling)
- [Testing](#testing)
- [Railway deployment](#railway-deployment)
- [Frontend integration](#frontend-integration)
- [Production checklist](#production-checklist)
- [Project structure](#project-structure)
- [License](#license)

## Features

- Authoritative server discovery through `whois.iana.org`.
- In-process discovery cache with a fixed 24-hour lifetime.
- Fallback query syntaxes for server compatibility.
- Native TCP port 43 requests with a fixed 10-second timeout.
- Parsing for common registrar, date, nameserver, status, and contact fields.
- Single lookup, parallel batch lookup for up to 10 domains, and health endpoints.
- Helmet, CORS, compression, and 1 MB request-body limits.
- Categorized network errors with troubleshooting metadata.

## Architecture

```text
SpectraWHOIS / API client
          │ HTTP
          ▼
  Express WHOIS plugin
          │
          ├── 1. Check the in-process cache
          ├── 2. Discover the authoritative server through IANA
          ├── 3. Try compatible query syntaxes
          ├── 4. Connect to TCP port 43
          └── 5. Clean and parse the response
```

If IANA discovery fails, the client uses built-in fallback servers for `.com`, `.net`, and `.org`, and falls back to `whois.iana.org` for other TLDs.

## Quick start

### Requirements

- Node.js `>=18.0.0`
- npm
- DNS and outbound TCP port 43 access

```bash
git clone https://github.com/marvinli001/spectra-whois.git
cd spectra-whois/whois-plugin
npm install
npm run dev
```

The service listens on [http://localhost:3001](http://localhost:3001) by default.

```bash
curl http://localhost:3001/health
curl "http://localhost:3001/whois?domain=example.com"
```

## Configuration

### Environment variables

The current implementation reads only these variables:

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | HTTP listen port | `3001` |
| `NODE_ENV` | Enables the production CORS allowlist when set to `production` | `development` |

```dotenv
PORT=3001
NODE_ENV=development
```

The query timeout is fixed at 10 seconds and the discovery cache lifetime is fixed at 24 hours. The current version does not expose environment variables for either value.

### CORS

Development permits `http://localhost:3000` and `http://127.0.0.1:3000`. Production permits the source-defined SpectraWHOIS Vercel origin, a placeholder custom domain, and `*.vercel.app`.

For a custom frontend domain, update the CORS `origin` list in [`server.js`](./server.js) and redeploy. The current version does not read an `ALLOWED_ORIGINS` environment variable.

## API reference

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Service metadata and endpoint list |
| `GET` | `/health` | Health and uptime information |
| `GET` | `/whois?domain=example.com` | Single-domain lookup |
| `POST` | `/whois/batch` | Batch lookup for up to 10 domains |

### Health response

```json
{
  "status": "healthy",
  "service": "spectra-whois-plugin",
  "version": "1.0.0",
  "timestamp": "2026-08-29T00:00:00.000Z",
  "uptime": 120.5
}
```

### Single lookup

```http
GET /whois?domain=example.com
```

```json
{
  "success": true,
  "domain": "example.com",
  "whoisServer": "whois.verisign-grs.com",
  "rawData": "Domain Name: EXAMPLE.COM\n...",
  "parsedData": {
    "domain": "example.com",
    "registrar": "RESERVED-Internet Assigned Numbers Authority",
    "registrationDate": "1995-08-14T04:00:00Z",
    "expirationDate": "2027-08-13T04:00:00Z",
    "nameServers": ["a.iana-servers.net", "b.iana-servers.net"],
    "status": ["client delete prohibited"]
  },
  "timestamp": "2026-08-29T00:00:00.000Z"
}
```

Missing `domain` returns `400`. Direct clients should submit ASCII/Punycode domains; the SpectraWHOIS frontend performs normalization before calling the plugin.

### Batch lookup

```http
POST /whois/batch
Content-Type: application/json

{
  "domains": ["example.com", "example.org"]
}
```

Each item is returned independently. A top-level item `success: true` means its Promise fulfilled; callers should also inspect the nested `data.success` field to determine whether the actual WHOIS query succeeded.

## Error handling

The WHOIS client returns these `reason` values:

| Reason | Meaning |
| --- | --- |
| `connection_refused` | The server refused the TCP connection |
| `timeout` | Connection or lookup timed out |
| `server_not_found` | The WHOIS hostname could not be resolved |
| `empty_response` | The server returned no useful content |
| `iana_discovery_failed` | Authoritative discovery through IANA failed |
| `unknown` | Unclassified error |

The single-domain route returns client-level `success: false` results directly, usually with HTTP `200`. Clients must inspect both the HTTP status and the JSON `success` field.

## Testing

```bash
npm test
```

The script performs live lookups for `google.com`, `github.com`, and `example.org`. It depends on external networks, IANA, third-party WHOIS services, and outbound TCP port 43. It is a smoke script, not an isolated assertion-based unit suite.

Manual checks:

```bash
npm run dev

curl "http://localhost:3001/whois?domain=example.com"

curl -X POST http://localhost:3001/whois/batch \
  -H "Content-Type: application/json" \
  -d '{"domains":["example.com","example.org"]}'

curl http://localhost:3001/health
```

## Railway deployment

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=QluM1X)

Use these settings when importing the repository:

| Setting | Value |
| --- | --- |
| Root Directory | `whois-plugin` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Railway normally injects `PORT` and `NODE_ENV`. Verify `/health`, a real `/whois` request, and outbound TCP port 43 connectivity after deployment. Update the source CORS allowlist when using a custom frontend domain.

## Frontend integration

Set the full query endpoint in the SpectraWHOIS root `.env.local` or frontend hosting environment:

```dotenv
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-plugin.example.com/whois
```

Restart or redeploy the frontend. This value is public and must not contain a secret.

## Production checklist

- Restrict the production CORS allowlist to real frontend origins.
- Add rate limiting and abuse protection at the gateway, proxy, or platform layer.
- Add authentication if the deployment requires it; the service has none built in.
- Review log collection so unnecessary query data is not retained.
- Verify DNS, outbound TCP 43, timeout, shutdown, and restart behavior.
- Account for the in-process cache being cleared on restart or redeployment.

## Project structure

```text
whois-plugin/
├── lib/
│   └── whois-client.js     # Discovery, TCP lookup, parsing, and errors
├── server.js               # Express app, CORS, and API routes
├── test.js                 # Live-network smoke script
├── package.json            # Dependencies, scripts, and Node requirement
├── Procfile                # Process start declaration
└── README.md               # Primary Chinese documentation
```

## License

`package.json` currently declares `MIT`, but the parent repository has no formal `LICENSE` file. Package metadata should not be treated as a complete grant until the maintainer adds and confirms the license text.
