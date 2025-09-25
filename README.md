# SpectraWHOIS

A modern, fast WHOIS lookup service built with Next.js 15 and powered by RDAP (Registration Data Access Protocol). Features a beautiful Liquid Glass UI design inspired by iOS 18 and supports all global TLDs including internationalized domain names (IDN).

## ✨ Features

- 🌍 **Global TLD Support**: Supports all TLDs via IANA bootstrap registry
- 🌐 **IDN Support**: Full support for internationalized domain names with Punycode conversion
- ⚡ **Edge Computing**: Optimized for Vercel Edge Runtime and Cloudflare Workers
- 🎨 **Liquid Glass UI**: Modern design language with Framer Motion animations
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔒 **Privacy Compliant**: Uses RDAP for modern privacy standards
- ⚡ **Fast Caching**: Edge-cached responses for instant results
- 🔍 **Structured Data**: Clean, structured WHOIS information display

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/spectra-whois.git
cd spectra-whois
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fspectra-whois)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and configure the build settings
3. Deploy! The edge functions will automatically be optimized for global distribution

### Deploy to Cloudflare Workers

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Authenticate with Cloudflare:
```bash
wrangler auth login
```

3. Deploy:
```bash
wrangler publish
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production deployments, set these in your hosting platform's environment variables.

## 🏗️ Architecture

### RDAP Integration

The application uses RDAP (RFC 7483) instead of traditional WHOIS for several advantages:

- **Modern Protocol**: RDAP is the successor to WHOIS, designed for the modern internet
- **Structured Data**: Returns JSON instead of plain text
- **HTTP/HTTPS**: Works over standard web protocols, perfect for edge computing
- **Global Coverage**: IANA bootstrap registry covers all TLDs
- **Privacy Compliant**: Built-in privacy protections and rate limiting

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Runtime**: Edge Runtime for maximum performance
- **Styling**: Tailwind CSS with custom Liquid Glass components
- **Animations**: Framer Motion for smooth interactions
- **Typography**: Inter font for modern readability
- **Icons**: Lucide React for consistent iconography

### Liquid Glass Design

The UI implements a modern "Liquid Glass" design language featuring:

- **Glassmorphism**: Backdrop blur effects with transparency
- **Fluid Animations**: Spring-based animations with realistic physics
- **Dynamic Gradients**: Subtle color transitions and depth
- **Interactive Elements**: Responsive hover and touch states
- **Accessibility**: WCAG compliant with proper contrast and focus states

## 🛠️ Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/whois/         # RDAP API endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── ui/                # Reusable UI components
│   └── whois/             # WHOIS-specific components
├── lib/                   # Utility functions
├── services/              # External service integrations
└── types/                 # TypeScript type definitions
```

### Adding New Features

1. **New TLD Support**: The system automatically supports all TLDs via IANA bootstrap
2. **Custom Styling**: Extend the Liquid Glass components in `src/components/ui/`
3. **Additional Data**: Modify the RDAP parsing in `src/services/rdap.ts`

### Testing

Run the development server and test with various domains:

- Standard domains: `google.com`, `github.com`
- IDN domains: `中国.cn`, `москва.рф`
- New TLDs: `example.tech`, `company.app`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [IANA](https://www.iana.org/) for RDAP bootstrap registry
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework

## 🔗 Links

- [RDAP Specification (RFC 7483)](https://tools.ietf.org/html/rfc7483)
- [IANA RDAP Bootstrap Registry](https://data.iana.org/rdap/)
- [Next.js Edge Runtime Documentation](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
