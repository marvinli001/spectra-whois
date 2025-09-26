/**
 * Environment variable checker utility
 * Provides consistent access to WHOIS Worker URL across the application
 */

export interface EnvCheck {
  hasWorkerUrl: boolean
  workerUrl: string | undefined
  source: 'build-time' | 'runtime' | 'none'
}

/**
 * Check if WHOIS Worker URL is configured
 * Returns detailed information about the configuration
 */
export function checkWhoisWorkerConfig(): EnvCheck {
  // First try to get from Next.js environment (build time)
  if (process.env.NEXT_PUBLIC_WHOIS_WORKER_URL) {
    const url = process.env.NEXT_PUBLIC_WHOIS_WORKER_URL.trim()
    return {
      hasWorkerUrl: url.length > 0,
      workerUrl: url.length > 0 ? url : undefined,
      source: 'build-time'
    }
  }

  // Fallback: check if running in browser and URL was injected at runtime
  if (typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_WHOIS_WORKER_URL) {
    const url = ((window as any).NEXT_PUBLIC_WHOIS_WORKER_URL as string).trim()
    return {
      hasWorkerUrl: url.length > 0,
      workerUrl: url.length > 0 ? url : undefined,
      source: 'runtime'
    }
  }

  return {
    hasWorkerUrl: false,
    workerUrl: undefined,
    source: 'none'
  }
}

/**
 * Get the WHOIS Worker URL (simplified version)
 */
export function getWhoisWorkerUrl(): string | undefined {
  const config = checkWhoisWorkerConfig()
  return config.workerUrl
}

/**
 * Check if WHOIS tab should be shown for a given domain
 * @param domain - The domain to check
 * @param needsTraditionalWhois - Function to check if domain needs traditional WHOIS
 */
export function shouldShowWhoisTab(
  domain: string,
  needsTraditionalWhois: (domain: string) => boolean
): boolean {
  const config = checkWhoisWorkerConfig()
  const supportsRdap = !needsTraditionalWhois(domain)

  // Show WHOIS tab only if:
  // 1. Workers URL is configured
  // 2. Domain supports RDAP (so we can show both tabs)
  return config.hasWorkerUrl && supportsRdap
}