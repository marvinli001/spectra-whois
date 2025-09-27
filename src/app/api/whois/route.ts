import { NextRequest, NextResponse } from 'next/server'
import { queryRdap, parseRdapResponse } from '@/services/rdap'
import { isValidDomain, normalizeDomain } from '@/lib/domain-utils'
import { WhoisError } from '@/types/rdap'
import { queryTraditionalWhois, convertWhoisToRdap, needsTraditionalWhois } from '@/services/whois/traditional'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const domain = searchParams.get('domain')

    if (!domain) {
      const error: WhoisError = {
        code: 'INVALID_DOMAIN',
        message: 'Domain parameter is required'
      }
      return NextResponse.json(error, { status: 400 })
    }

    const normalizedDomain = normalizeDomain(domain)

    if (!isValidDomain(normalizedDomain)) {
      const error: WhoisError = {
        code: 'INVALID_DOMAIN',
        message: 'Invalid domain format'
      }
      return NextResponse.json(error, { status: 400 })
    }

    let whoisResult
    let source = 'rdap'

    // Check if domain needs traditional WHOIS first
    if (needsTraditionalWhois(normalizedDomain)) {
      console.log(`${normalizedDomain} requires traditional WHOIS, skipping RDAP`)

      const whoisResponse = await queryTraditionalWhois(normalizedDomain)

      if (whoisResponse.success) {
        whoisResult = convertWhoisToRdap(whoisResponse)
        source = 'whois'
      } else {
        throw new Error(whoisResponse.error || 'Traditional WHOIS query failed')
      }
    } else {
      // Try RDAP first for domains that support it
      try {
        const rdapResponse = await queryRdap(normalizedDomain)
        whoisResult = parseRdapResponse(rdapResponse)
      } catch (rdapError) {
        console.log(`RDAP failed for ${normalizedDomain}, trying traditional WHOIS:`, rdapError)

        // Fallback to traditional WHOIS
        try {
          const whoisResponse = await queryTraditionalWhois(normalizedDomain)

          if (whoisResponse.success) {
            whoisResult = convertWhoisToRdap(whoisResponse)
            source = 'whois'
          } else {
            throw new Error(whoisResponse.error || 'Traditional WHOIS query failed')
          }
        } catch (whoisError) {
          console.error(`Both RDAP and WHOIS failed for ${normalizedDomain}:`, whoisError)
          // Re-throw the original RDAP error if both methods fail
          throw rdapError
        }
      }
    }

    // Add source information to result
    if (whoisResult) {
      whoisResult.source = source
    }

    // Set cache headers
    const headers = new Headers()
    headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400') // 5min cache, 1day stale
    headers.set('Content-Type', 'application/json')

    return NextResponse.json(whoisResult, { headers })

  } catch (error) {
    console.error('WHOIS query error:', error)

    let whoisError: WhoisError

    if (error instanceof Error) {
      if (error.message.includes('Domain not found')) {
        whoisError = {
          code: 'INVALID_DOMAIN',
          message: 'Domain not found in registry'
        }
        return NextResponse.json(whoisError, {
          status: 404,
          headers: {
            'Cache-Control': 'public, s-maxage=60' // Short cache for 404s
          }
        })
      }

      if (error.message.includes('TLD')) {
        whoisError = {
          code: 'TLD_NOT_SUPPORTED',
          message: 'TLD not supported by RDAP or traditional WHOIS'
        }
        return NextResponse.json(whoisError, { status: 400 })
      }

      whoisError = {
        code: 'QUERY_ERROR',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    } else {
      whoisError = {
        code: 'NETWORK_ERROR',
        message: 'An unexpected error occurred'
      }
    }

    return NextResponse.json(whoisError, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache' // Don't cache errors
      }
    })
  }
}

// CORS headers for browser requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}