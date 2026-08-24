# SpectraWHOIS

[中文](./README_CN.md) | **English**

A modern, fast WHOIS lookup service built with Next.js 16 and powered by RDAP (Registration Data Access Protocol). It uses the shadcn/ui Luma design system with fluid Motion interactions and supports traditional WHOIS queries through a Railway Node.js plugin.

## 🚀 Quick Deploy

### Deploy to Vercel (Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmarvinli001%2Fspectra-whois)

1. **One-Click Deploy**: Click the button above to deploy to Vercel
2. **Environment Variables**: Optionally set `NEXT_PUBLIC_WHOIS_PLUGIN_URL` for traditional WHOIS support
3. **Done**: Your WHOIS lookup service is live!

## ✨ Features

- 🌍 **Global TLD Support**: Supports all TLDs via IANA bootstrap registry
- 🌐 **IDN Support**: Full support for internationalized domain names with Punycode conversion
- 🔄 **Dual Protocol Support**: RDAP for modern domains + traditional WHOIS via Railway plugin
- ⚡ **IANA Discovery**: Dynamic WHOIS server discovery with 24-hour caching
- 🎨 **shadcn Luma UI**: Accessible, source-owned components with fluid Motion transitions
- 📱 **Responsive Design**: Optimized for mobile with smooth performance
- 🔒 **Privacy Compliant**: Uses RDAP for modern privacy standards
- 🚀 **Railway Plugin**: Native Node.js TCP connections for traditional WHOIS
- 🏷️ **Brand Customization**: Easily customize the brand name via environment variables
- 🛠️ **Developer Experience**: Built-in debug panel and environment detection
- 🌐 **Internationalization**: Full support for English and Chinese languages

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
# Brand Customization (optional)
NEXT_PUBLIC_BRAND_NAME=SpectraWHOIS

# For WHOIS plugin support (optional)
NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
```

4. **Run the development server:**
```bash
npm run dev
```

### Railway Plugin Setup

#### Option 1: One-Click Deploy (Recommended)

[![Deploy WHOIS Plugin on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=QluM1X)

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

## 🔌 Traditional WHOIS Plugin (Optional)

For enhanced functionality with traditional WHOIS queries, you can optionally deploy the Railway plugin:

### Deploy WHOIS Plugin to Railway

[![Deploy WHOIS Plugin on Railway](https://railway.app/button.svg)](https://railway.app/template/8YKvEb?referralCode=QluM1X)

**Setup Instructions:**
1. Click the deploy button above
2. Set **Root Directory** to `whois-plugin` in Railway dashboard
3. Copy the deployed URL (e.g., `https://your-app.railway.app`)
4. Add to your Vercel environment: `NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-app.railway.app/whois`

**📚 [Plugin Documentation](./whois-plugin/README.md)** | **📚 [中文文档](./whois-plugin/README_CN.md)**

## 📦 Deployment

### Frontend (Vercel)

1. **Connect to Vercel:**
   - Import your GitHub repository in Vercel
   - Vercel will automatically detect Next.js

2. **Set Environment Variables (Optional):**
   ```
   NEXT_PUBLIC_WHOIS_PLUGIN_URL=https://your-railway-app.railway.app/whois
   ```

3. **Deploy:**
   - Push to main branch triggers automatic deployment

## 🎛️ Environment Variables

### Frontend (.env.local)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_BRAND_NAME` | Custom brand name | `SpectraWHOIS` | No |
| `NEXT_PUBLIC_WHOIS_PLUGIN_URL` | Railway WHOIS plugin URL | - | Optional* |
| `NEXT_PUBLIC_WHOIS_API_URL` | Alternative plugin URL | - | Optional* |
| `DEBUG_ENV_CHECKER` | Show environment debug logs | `false` | No |

*Required only for traditional WHOIS tab functionality

#### Brand Customization

You can customize the brand name displayed throughout the application:

```bash
# .env.local or Vercel Environment Variables
NEXT_PUBLIC_BRAND_NAME=YourCustomName
```

This will update:
- Homepage title and logo
- Floating search bar header
- Browser tab title
- All UI references

If not set, defaults to "SpectraWHOIS"

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

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, shadcn/ui Luma, Motion
- **Backend**: Node.js, Express.js, Native TCP Sockets
- **Deployment**: Vercel (Frontend) + Railway (Backend)
- **Protocols**: RDAP (HTTPS), Traditional WHOIS (TCP Port 43)
- **Discovery**: IANA Bootstrap Registry

## 🎨 Customization Guide

### Brand Name

Change the brand name displayed throughout the application:

1. **Local Development:**
   ```bash
   # .env.local
   NEXT_PUBLIC_BRAND_NAME=YourBrandName
   ```

2. **Vercel Deployment:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `NEXT_PUBLIC_BRAND_NAME=YourBrandName`
   - Redeploy your application

### Styling

The project uses Tailwind CSS 4. Key customization points:

- **Colors**: Edit `tailwind.config.ts` for theme colors
- **Animations**: Adjust shared motion tokens in `src/lib/motion.ts`
- **Luma theme**: Update the shadcn preset configuration in `components.json` and semantic tokens in `src/app/globals.css`

## 🚀 Performance Optimizations

### Implemented

- ✅ Mobile-specific performance optimizations
- ✅ Static gradients on mobile (animated on desktop)
- ✅ Reduced motion for better mobile experience
- ✅ Fixed positioning optimizations
- ✅ Responsive spacing and layout

### Recommendations

- 📊 Add Service Worker for offline support
- 🔄 Implement virtual scrolling for large lists
- 💾 Add localStorage for query history
- 📦 Code splitting for better initial load
- 🖼️ Image optimization with Next.js Image

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
- [Motion](https://motion.dev/) for fluid, accessible interactions
- [shadcn/ui](https://ui.shadcn.com/) for the Luma component system

---

**Built with Next.js 16 and Railway**
