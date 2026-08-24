# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Confirmed primary users are developers, webmasters, and site operators checking or diagnosing domain registration, lifecycle status, registrar, nameservers, and protocol-level details.
- These users already understand what WHOIS and RDAP tools are. The interface should not explain the purpose of domain lookup or narrate obvious controls.

## Product Purpose

SpectraWHOIS provides a fast, bilingual domain lookup workflow that turns a domain name into readable registration data. Success means a user can enter an international or ASCII domain, understand whether the lookup succeeded, identify the returned source and key facts, and recover clearly when a registry or network request fails.

## Positioning

SpectraWHOIS combines standards-first RDAP lookup with optional traditional WHOIS fallback in one interface. It supports internationalized domain names, discovers authoritative WHOIS servers through IANA, and presents the result in English or Chinese without requiring users to understand the protocol split first.

## Operating Context

- Users arrive with a domain name and expect a single, immediate lookup task.
- Successful results may include registration status, registrar, registry identifiers, events and dates, nameservers, entities, notices, raw protocol data, and source links.
- Recent searches are stored locally in the browser for quick repeat access.
- Traditional WHOIS availability depends on an optional separately deployed Railway plugin; RDAP remains the default web path.

## Capabilities and Constraints

- The frontend is an existing Next.js 16 App Router application with a single primary lookup route and a `/api/whois` endpoint.
- The product supports English and Simplified Chinese UI copy.
- Domain validation and Punycode conversion support internationalized domain names.
- Search must represent idle, validating, loading, success, partial/protocol-specific, empty, and error states.
- The default brand name is `SpectraWHOIS` and can be replaced through `NEXT_PUBLIC_BRAND_NAME`.
- Traditional WHOIS UI must remain conditional on plugin configuration and reachability.
- Existing route structure, API semantics, local search history, and returned data meaning must be preserved during visual redesign.

## Brand Commitments

- Confirmed name: `SpectraWHOIS`, unless overridden by the documented environment variable.
- Confirmed language commitment: English and Simplified Chinese.
- Confirmed voice: concise, technically accurate, and written at developer or webmaster altitude. Do not add beginner-oriented explanations for obvious lookup tasks.
- The incumbent purple liquid-glass visual treatment is not treated as a binding identity because the current request explicitly authorizes a full Luma redesign.

## Evidence on Hand

- Product and deployment documentation: `README.md`, `README_CN.md`.
- Primary application workflow: `src/app/page.tsx`.
- Search, history, result, and protocol views: `src/components/whois/`.
- Domain and API behavior: `src/app/api/whois/route.ts`, `src/services/`, `src/lib/domain-utils.ts`.
- Localization source: `src/lib/i18n.ts`, `src/contexts/language-context.tsx`.
- No verified testimonials, customer logos, usage metrics, pricing claims, or proprietary imagery are present. Future UI must not fabricate them.

## Product Principles

1. Make the domain lookup the unmistakable primary action.
2. Translate protocol complexity into a clear summary while keeping source detail available.
3. Preserve global-domain and bilingual behavior throughout every state.
4. Be honest about unavailable sources, partial results, errors, and recovery steps.
5. Keep repeat lookup fast through stable navigation, keyboard access, and recent history.
