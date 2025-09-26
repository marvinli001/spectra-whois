/**
 * Environment variable checker utility
 * Provides consistent access to WHOIS Plugin URL across the application
 * Supports both local development and Vercel deployment scenarios
 */

export interface EnvCheck {
  hasWorkerUrl: boolean
  workerUrl: string | undefined
  source: 'build-time' | 'runtime' | 'vercel-env' | 'none'
  platform?: 'local' | 'vercel' | 'other'
}

/**
 * Detect current deployment platform
 */
function detectPlatform(): 'local' | 'vercel' | 'other' {
  // Check for Vercel-specific environment variables
  if (typeof window !== 'undefined') {
    // Client-side detection
    return location.hostname.includes('vercel.app') ? 'vercel' :
           location.hostname === 'localhost' ? 'local' : 'other'
  } else {
    // Server-side detection
    return process.env.VERCEL ? 'vercel' :
           process.env.NODE_ENV === 'development' ? 'local' : 'other'
  }
}

/**
 * Check if WHOIS Plugin URL is configured
 * Returns detailed information about the configuration
 * Supports multiple environment variable sources and deployment platforms
 */
export function checkWhoisWorkerConfig(): EnvCheck {
  const platform = detectPlatform()
  const isDebug = process.env.DEBUG_ENV_CHECKER === 'true' || process.env.NODE_ENV === 'development'

  if (isDebug) {
    console.log('[SpectraWHOIS] Environment detection:', { platform })
  }

  // 1. Try primary environment variable (build-time)
  if (process.env.NEXT_PUBLIC_WHOIS_PLUGIN_URL) {
    const url = process.env.NEXT_PUBLIC_WHOIS_PLUGIN_URL.trim()
    if (isDebug) {
      console.log('[SpectraWHOIS] Found NEXT_PUBLIC_WHOIS_PLUGIN_URL:', url)
    }
    return {
      hasWorkerUrl: url.length > 0,
      workerUrl: url.length > 0 ? url : undefined,
      source: 'build-time',
      platform
    }
  }

  // 2. Try alternative environment variable names
  const altEnvVars = [
    'NEXT_PUBLIC_WHOIS_API_URL',
    'WHOIS_PLUGIN_URL',
    'WHOIS_API_URL'
  ]

  for (const envVar of altEnvVars) {
    if (process.env[envVar]) {
      const url = process.env[envVar]!.trim()
      if (isDebug) {
        console.log(`[SpectraWHOIS] Found ${envVar}:`, url)
      }
      return {
        hasWorkerUrl: url.length > 0,
        workerUrl: url.length > 0 ? url : undefined,
        source: 'build-time',
        platform
      }
    }
  }

  // 3. Check Vercel-injected environment variables (runtime)
  if (typeof window !== 'undefined') {
    const windowEnv = window as {
      NEXT_PUBLIC_WHOIS_PLUGIN_URL?: string
      NEXT_PUBLIC_WHOIS_API_URL?: string
      __NEXT_DATA__?: {
        buildId: string
        props?: {
          pageProps?: {
            env?: Record<string, string>
          }
        }
      }
    }

    // Check direct window injection
    const envVarNames = [
      'NEXT_PUBLIC_WHOIS_PLUGIN_URL',
      'NEXT_PUBLIC_WHOIS_API_URL'
    ]

    for (const envVar of envVarNames) {
      if (windowEnv[envVar as keyof typeof windowEnv]) {
        const url = (windowEnv[envVar as keyof typeof windowEnv] as string).trim()
        return {
          hasWorkerUrl: url.length > 0,
          workerUrl: url.length > 0 ? url : undefined,
          source: 'runtime',
          platform
        }
      }
    }

    // Check Next.js data injection (Vercel automatic injection)
    if (windowEnv.__NEXT_DATA__?.props?.pageProps?.env) {
      const envData = windowEnv.__NEXT_DATA__.props.pageProps.env
      for (const envVar of envVarNames) {
        if (envData[envVar]) {
          const url = envData[envVar].trim()
          return {
            hasWorkerUrl: url.length > 0,
            workerUrl: url.length > 0 ? url : undefined,
            source: 'vercel-env',
            platform
          }
        }
      }
    }
  }

  // 4. Platform-specific defaults for development
  if (platform === 'local' && process.env.NODE_ENV === 'development') {
    // Check if local WHOIS plugin is running
    const defaultLocalUrl = 'http://localhost:3001/whois'
    return {
      hasWorkerUrl: false, // Don't assume it's available
      workerUrl: undefined, // User needs to configure explicitly
      source: 'none',
      platform
    }
  }

  if (isDebug) {
    console.log('[SpectraWHOIS] No WHOIS plugin URL configured')
    console.log('[SpectraWHOIS] Available env vars:', Object.keys(process.env).filter(key =>
      key.includes('WHOIS') || key.includes('WORKER')
    ))
  }

  return {
    hasWorkerUrl: false,
    workerUrl: undefined,
    source: 'none',
    platform
  }
}

/**
 * Get the WHOIS Plugin URL (simplified version)
 */
export function getWhoisWorkerUrl(): string | undefined {
  const config = checkWhoisWorkerConfig()
  return config.workerUrl
}

/**
 * Get configuration status for debugging
 */
export function getConfigDebugInfo(): {
  config: EnvCheck
  envVars: Record<string, string | undefined>
  suggestions: string[]
} {
  const config = checkWhoisWorkerConfig()

  const envVars = {
    NEXT_PUBLIC_WHOIS_PLUGIN_URL: process.env.NEXT_PUBLIC_WHOIS_PLUGIN_URL,
    NEXT_PUBLIC_WHOIS_API_URL: process.env.NEXT_PUBLIC_WHOIS_API_URL,
    VERCEL: process.env.VERCEL,
    NODE_ENV: process.env.NODE_ENV
  }

  const suggestions = []

  if (!config.hasWorkerUrl) {
    suggestions.push('Configure WHOIS plugin URL in environment variables')

    if (config.platform === 'local') {
      suggestions.push('For local development: NEXT_PUBLIC_WHOIS_PLUGIN_URL=http://localhost:3001/whois')
      suggestions.push('Make sure your Railway WHOIS plugin is running')
    } else if (config.platform === 'vercel') {
      suggestions.push('Set NEXT_PUBLIC_WHOIS_PLUGIN_URL in Vercel dashboard')
      suggestions.push('Example: https://your-railway-app.railway.app/whois')
    } else {
      suggestions.push('Set NEXT_PUBLIC_WHOIS_PLUGIN_URL environment variable')
    }
  }

  return { config, envVars, suggestions }
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