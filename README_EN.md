# SpectraWHOIS

<div align="center">

A bilingual domain-registration lookup tool for developers, site administrators, and domain operators.

[简体中文](./README.md) · [English](./README_EN.md)

![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React 19](https://img.shields.io/badge/React-19-087EA4?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.9-339933?logo=nodedotjs&logoColor=white)

</div>

SpectraWHOIS uses RDAP (Registration Data Access Protocol) by default and discovers registry endpoints through the IANA bootstrap registry. An independently deployed Node.js plugin can fall back to traditional WHOIS over TCP port 43 for TLDs without RDAP support or when RDAP queries fail.

![SpectraWHOIS result view](./.impeccable/review/desktop-result.png)

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [API](#api)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Deployment](#deployment)
- [Traditional WHOIS plugin](#traditional-whois-plugin)
- [Development and contributing](#development-and-contributing)
- [Data and privacy](#data-and-privacy)
- [Known limitations](#known-limitations)
- [License](#license)

## Features

- Standards-first RDAP lookups with IANA bootstrap discovery.
- Optional traditional WHOIS fallback through a native TCP service.
- Domain validation, normalization, and Punycode handling for IDNs.
- Structured views for registrar, status, dates, nameservers, DNSSEC, contacts, notices, and raw responses.
- Simplified Chinese and English interfaces.
- Recent searches stored locally in the browser.
- Responsive light/dark UI with reduced-motion support.
- Configurable public-facing brand name.

## Architecture

```text
Browser
  │
  ▼
Next.js frontend ── GET /api/whois ──┬── RDAP services (HTTPS)
                                     │     └── IANA RDAP bootstrap registry
                                     │
                                     └── WHOIS plugin (optional, HTTP)
                                           ├── IANA WHOIS discovery
                                           └── Authoritative WHOIS servers (TCP 43)
```

The Next.js API validates the domain, uses traditional WHOIS first for known non-RDAP TLDs, and otherwise tries RDAP before falling back to the optional plugin. Results are normalized for the UI and marked with a `rdap` or `whois` source.

## Quick start

### Requirements

- Node.js `>=20.9.0`
- npm; `npm ci` is recommended because the repository includes a lockfile

### Run the frontend

```bash
git clone https://github.com/marvinli001/spectra-whois.git
cd spectra-whois
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No environment variables are required for RDAP-only operation.

### Run the optional WHOIS plugin

In a second terminal:

```bash
cd whois-plugin
npm install
npm run dev
```

Create `.env.local` in the repository root:

```dotenv
NEXT_PUBLIC_WHOIS_PLUGIN_URL=http://localhost:3001/whois
```

Restart the Next.js development server after changing environment variables. The plugin host must permit outbound TCP connections on port 43.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_BRAND_NAME` | Replaces the UI and page-title brand name | `SpectraWHOIS` |
| `NEXT_PUBLIC_WHOIS_PLUGIN_URL` | Full plugin query URL, including `/whois` | Not configured |
| `NEXT_PUBLIC_WHOIS_API_URL` | Compatibility alias for the plugin URL | Not configured |

```dotenv
NEXT_PUBLIC_BRAND_NAME=SpectraWHOIS
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-plugin.example.com/whois
```

Variables prefixed with `NEXT_PUBLIC_` are exposed in the browser bundle. Never store secrets in them.

## API

### Next.js lookup endpoint

```http
GET /api/whois?domain=example.com
```

| Status | Meaning |
| --- | --- |
| `200` | Lookup succeeded |
| `400` | Missing/invalid domain or unsupported TLD |
| `404` | Domain not found in the registry |
| `500` | RDAP and any available WHOIS fallback failed |

Successful responses contain normalized domain data and a `source` value of `rdap` or `whois`. Error responses include a stable `code` and readable `message`.

### Plugin endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` | Service information |
| `GET` | `/health` | Health check |
| `GET` | `/whois?domain=example.com` | Single-domain lookup |
| `POST` | `/whois/batch` | Batch lookup, up to 10 domains |

See the [plugin documentation](./whois-plugin/README_EN.md) for complete examples and deployment details.

## Scripts

### Frontend

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Turbopack development server |
| `npm run dev:webpack` | Start the Webpack development server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run build` | Create a production build |
| `npm run start` | Start the built production server |

### WHOIS plugin

```bash
cd whois-plugin
npm run dev   # Node.js watch mode
npm start     # Standard start
npm test      # Live network smoke script; requires outbound TCP 43
```

## Project structure

```text
spectra-whois/
├── src/
│   ├── app/                     # App Router UI and /api/whois
│   ├── components/              # Shared UI and lookup components
│   ├── contexts/                # Language state
│   ├── hooks/                   # Search-history hooks
│   ├── lib/                     # Domain, i18n, and shared helpers
│   ├── services/                # RDAP and traditional WHOIS clients
│   ├── types/                   # RDAP/WHOIS types
│   └── utils/                   # Environment and storage helpers
├── public/                      # Static assets
├── whois-plugin/                # Standalone Express WHOIS service
├── DESIGN.md                    # UI design constraints
├── PRODUCT.md                   # Product scope and behavior
└── package.json                 # Frontend dependencies and scripts
```

## Deployment

### Vercel frontend

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmarvinli001%2Fspectra-whois)

Use the repository root as the project root and keep the default Next.js build settings. If the WHOIS plugin is enabled, set `NEXT_PUBLIC_WHOIS_PLUGIN_URL` and redeploy so the public variable is included in the build.

### Railway plugin

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=QluM1X)

Set the Railway service root directory to `whois-plugin`. After deployment, configure the frontend with the plugin's full `/whois` URL. Custom frontend domains must also be added to the plugin's production CORS allowlist.

## Traditional WHOIS plugin

The standalone Express service performs IANA discovery, in-memory server caching, query-format fallback, TCP communication, common-field parsing, and batch requests.

- [中文插件文档](./whois-plugin/README.md)
- [English plugin documentation](./whois-plugin/README_EN.md)

Without the plugin, RDAP lookups continue to work, but known non-RDAP TLDs and post-RDAP fallback queries are unavailable.

## Development and contributing

Issues and pull requests are welcome. Before submitting a change, run:

```bash
npm run lint
npm run typecheck
npm run build

cd whois-plugin
npm test
```

The plugin test is a live-network smoke script rather than an isolated assertion-based unit suite. Keep public interfaces and configuration changes synchronized across the Chinese and English documentation.

## Data and privacy

- Domain input is sent to the applicable RDAP service and, when enabled, to IANA and authoritative WHOIS servers.
- Search history and language preferences are stored only in the current browser's `localStorage` and can be cleared from the UI.
- RDAP/WHOIS responses can contain public registry contact data, notices, and raw protocol output. Deployers are responsible for appropriate logging, caching, and display policies.
- The project does not implement user accounts, a persistent database, or server-side search-history storage.

## Known limitations

- Registry response shape, completeness, rate limits, and availability vary.
- Traditional WHOIS depends on third-party servers and outbound TCP port 43 connectivity.
- The plugin has no built-in authentication or rate limiting; public deployments should add protection at the proxy or platform layer.
- The production CORS allowlist is currently configured in source and must be updated for custom domains.

## License

The repository currently has no root `LICENSE` file, so the project-wide open-source terms cannot be confirmed from the README alone. Although `whois-plugin/package.json` declares MIT, that package metadata should not be treated as a complete repository-level grant until the maintainer adds a formal license file.
