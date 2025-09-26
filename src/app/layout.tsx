import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { EnvDebugPanel } from "@/components/debug/env-debug";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SpectraWHOIS - Modern Domain Lookup",
  description: "A modern, fast WHOIS lookup service using RDAP with liquid glass design",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen`}>
        <LanguageProvider>
          {children}
          <EnvDebugPanel />
        </LanguageProvider>
      </body>
    </html>
  );
}
