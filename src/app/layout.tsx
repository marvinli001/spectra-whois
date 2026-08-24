import type { Metadata } from "next"
import { Geist } from "next/font/google"

import "./globals.css"
import { Providers } from "@/components/providers"
import { getBrandName } from "@/lib/i18n"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const brandName = getBrandName();

export const metadata: Metadata = {
  title: `${brandName} - Domain lookup`,
  description:
    "Look up domain registration, registrar, nameservers, status, and key dates with RDAP and optional traditional WHOIS.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={geist.variable} suppressHydrationWarning>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <script
          id="impeccable-direction-contract"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: Domain lookup is a fluid workbench that expands only when evidence exists; it refuses the always-on feature dashboard.
OWN-WORLD: Luma neutral fields, one blue action, emerald verified states, Geist, Hugeicons, and the preset's rounded control language.
STORY: Enter a domain, follow the lookup state, scan the summary, then open protocol detail only when needed.
FIRST VIEWPORT: A 68px header above an asymmetric domain label and unified lookup control; recent history aligns beneath the input column when it exists.
FORM: Luma Motion Workbench, grounded direction 4, seed 1850edf3.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
