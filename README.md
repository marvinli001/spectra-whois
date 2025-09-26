# SpectraWHOIS

[中文](./README_CN.md) | **English**

A modern, fast WHOIS lookup service built with Next.js 15 and powered by RDAP (Registration Data Access Protocol). Features a beautiful Liquid Glass UI design and supports traditional WHOIS queries through Railway Node.js plugin.

## ✨ Features

- 🌍 **Global TLD Support**: Supports all TLDs via IANA bootstrap registry
- 🌐 **IDN Support**: Full support for internationalized domain names with Punycode conversion
- 🔄 **Dual Protocol Support**: RDAP for modern domains + traditional WHOIS via Railway plugin
- ⚡ **IANA Discovery**: Dynamic WHOIS server discovery with 24-hour caching
- 🎨 **Liquid Glass UI**: Modern design language with Framer Motion animations
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔒 **Privacy Compliant**: Uses RDAP for modern privacy standards
- 🚀 **Railway Plugin**: Native Node.js TCP connections for traditional WHOIS
- 🛠️ **Developer Experience**: Built-in debug panel and environment detection

## 🔌 WHOIS Plugin

For domains that don't support RDAP, SpectraWHOIS uses a dedicated Node.js plugin that runs on Railway to handle traditional WHOIS queries.

### Quick Deploy Plugin

[![Deploy WHOIS Plugin on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=alphasec)

**Setup Instructions:**
1. Click the deploy button above
2. Set **Root Directory** to `whois-plugin` in Railway dashboard
3. Copy the deployed URL (e.g., `https://your-app.railway.app`)
4. Add to your frontend env: `NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-app.railway.app/whois`

### Plugin Features

- 🔍 **IANA Discovery**: Automatically finds authoritative WHOIS servers
- 🚀 **Native TCP**: Direct socket connections without Cloudflare Workers limitations
- 📊 **Batch Processing**: Handle multiple domains simultaneously
- 🛡️ **Error Categorization**: Detailed error handling and troubleshooting
- 📈 **Health Monitoring**: Built-in health checks and monitoring endpoints

**📚 [Plugin Documentation](./whois-plugin/README.md)** | **📚 [中文文档](./whois-plugin/README_CN.md)**

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│  Railway API    │───▶│  WHOIS Servers  │
│  (Next.js)      │    │   (Node.js)     │    │  (Port 43)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  RDAP Servers   │    │  IANA Discovery │
│  (HTTPS API)    │    │ whois.iana.org  │
└─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Frontend Setup

1. **Clone the repository:**
```bash
git clone https://github.com/marvinli001/spectra-whois.git
cd spectra-whois
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# For WHOIS plugin support (optional)
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
```

4. **Run the development server:**
```bash
npm run dev
```

### Railway Plugin Setup

#### Option 1: One-Click Deploy (Recommended)

[![Deploy WHOIS Plugin on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=alphasec)

**Important**: When deploying, make sure to:
1. Set the **Root Directory** to `whois-plugin`
2. Railway will auto-detect Node.js and deploy
3. Copy the deployed URL for frontend integration

#### Option 2: Manual Setup

1. **Navigate to the plugin directory:**
```bash
cd whois-plugin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run locally for testing:**
```bash
npm run dev
```

4. **Deploy to Railway:**
   - Connect your GitHub repository to Railway
   - Set **Root Directory** to `whois-plugin`
   - Railway will automatically detect the Node.js project

## 📦 Deployment

### Frontend (Vercel)

1. **Connect to Vercel:**
   - Import your GitHub repository in Vercel
   - Vercel will automatically detect Next.js

2. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
   ```

3. **Deploy:**
   - Push to main branch triggers automatic deployment

### Backend (Railway)

1. **Connect Repository:**
   - Link your GitHub repository to Railway
   - Select the `whois-plugin` directory

2. **Auto Deploy:**
   - Railway automatically detects Node.js and deploys
   - No additional configuration needed

## 🎛️ Environment Variables

### Frontend (.env.local)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_WHOIS_PLUGIN_URL` | Railway WHOIS plugin URL | - | Optional* |
| `NEXT_PUBLIC_WHOIS_API_URL` | Alternative plugin URL | - | Optional* |
| `DEBUG_ENV_CHECKER` | Show environment debug logs | `false` | No |

*Required only for traditional WHOIS tab functionality

### Railway Plugin

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3001` | Auto-set by Railway |
| `NODE_ENV` | Environment mode | `production` | Auto-set by Railway |
| `ALLOWED_ORIGINS` | CORS origins | `*` | No |

## 🔧 Configuration

### WHOIS Tab Display

The traditional WHOIS tab appears when:
1. ✅ WHOIS plugin URL is configured
2. ✅ Domain supports RDAP (so both tabs can be shown)
3. ✅ Frontend can reach the Railway plugin

### Debug Panel (Development)

In development mode, a debug panel appears in the bottom-right corner showing:
- Configuration status (green = configured, yellow = not configured)
- Environment variables detection
- Platform detection (local/Vercel/other)
- Configuration suggestions

## 📡 API Endpoints

### WHOIS Plugin (Railway)

#### Single Domain Query
```http
GET /whois?domain=example.com
```

#### Batch Query
```http
POST /whois/batch
Content-Type: application/json

{
  "domains": ["example.com", "github.com", "vercel.com"]
}
```

#### Health Check
```http
GET /health
```

### Response Format

#### Success Response
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

#### Error Response
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

## 🛠️ Development

### Project Structure

```
spectra-whois/
├── src/                          # Next.js frontend
│   ├── app/                      # App Router pages
│   ├── components/               # React components
│   │   ├── debug/               # Debug panel
│   │   ├── ui/                  # UI components
│   │   └── whois/               # WHOIS-specific components
│   ├── contexts/                # React contexts
│   ├── services/                # API services
│   └── utils/                   # Utilities
├── whois-plugin/                # Railway Node.js plugin
│   ├── lib/                     # WHOIS client library
│   ├── server.js               # Express server
│   ├── test.js                 # Basic tests
│   └── package.json            # Plugin dependencies
└── public/                      # Static assets
```

### Testing

#### Frontend
```bash
npm run build    # Test build
npm run lint     # Lint check
npm run dev      # Development server
```

#### WHOIS Plugin
```bash
cd whois-plugin
npm test         # Run basic tests
npm start        # Production server
npm run dev      # Development server with watch
```

## 🌟 Key Technologies

- **Frontend**: Next.js 15, React 18, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, Native TCP Sockets
- **Deployment**: Vercel (Frontend) + Railway (Backend)
- **Protocols**: RDAP (HTTPS), Traditional WHOIS (TCP Port 43)
- **Discovery**: IANA Bootstrap Registry

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [IANA](https://www.iana.org/) for maintaining the WHOIS server registry
- [Vercel](https://vercel.com/) for excellent Next.js hosting
- [Railway](https://railway.app/) for reliable backend deployment
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for beautiful animations

---

**Built with ❤️ using Next.js 15 and Railway**