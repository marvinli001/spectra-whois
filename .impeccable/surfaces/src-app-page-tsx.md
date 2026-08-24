---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/components/whois/search-form.tsx","src/components/whois/result-display.tsx","src/components/whois/tabbed-result-display.tsx","src/components/whois/whois-result-display.tsx","src/components/whois/search-history.tsx"]
---

# SpectraWHOIS Lookup Surface

## Scope and mode

- Primary target: `src/app/page.tsx`
- Related UI: `src/components/whois/`, global shell, localization controls, theme controls
- Visitor mode: Operate

## Audience, job, and primary action

- Confirmed primary audience: developers, webmasters, and site operators checking or diagnosing domain and protocol details.
- Audience knowledge: users already understand WHOIS/RDAP tools; do not explain the purpose of lookup or narrate obvious controls.
- Job: enter a domain, understand whether lookup succeeded, scan registrar/status/dates/nameservers, and inspect source detail when needed.
- Primary action: submit a domain through the labeled lookup field. All other controls remain secondary.

## Proof, content, and constraints

- Use only live API output, existing localized copy, documented protocol behavior, and local search history.
- RDAP is always the primary source. Traditional WHOIS availability is conditional and must never be shown as supported when the plugin is absent.
- Preserve the single-route interaction, API semantics, IDN handling, bilingual UI, error recovery, raw data access, and conditional WHOIS tabs.
- Do not invent customer proof, usage metrics, pricing, registrant identities, product capabilities, or permanent routes.

## Chosen direction

- World: shadcn/ui Luma preset `b2D0wqNxT` as the sole component and theme language: luma style, neutral base, blue theme, emerald chart/status role, Hugeicons, Geist, default radius, subtle menu accent, inverted translucent menu.
- Approved comp: `.impeccable/mocks/option-a-v2-motion-workbench.png`.
- Quality bar: `.impeccable/quality-bar/luma-official.png`, sourced from the official shadcn preset preview for `b2D0wqNxT` and carrying embedded origin metadata.
- Approval: the user explicitly revised the direction twice. Idle contains only the labeled search control and real history when present, with no headline, helper paragraph, example chips, protocol cards, or result preview. Rich information panels appear only after lookup.
- Memorable moment: the idle search control compacts into a stable lookup strip while the domain result ledger enters beneath it, preserving input context and keyboard focus.
- Challenger raises kept as discipline only: Crouwel grid alignment, cracktro's avoidance of needless enclosure, origami's continuous state transition, cyclorama's state-based tonal hierarchy.

## Approved comp translation

- Carry forward: 68px shell header; 8/4 history-present composition; dominant labeled search; history rail only when history exists; calm neutral fields with one blue action; generous lower whitespace.
- Do not literalize: the comp's headline, helper copy, example chips, fabricated timestamps, unavailable history, result previews, protocol cards, feature cards, or any rich information panel before a search.
- Mobile: one column below 768px. Header controls remain reachable, the search button is full width, history follows the search surface only when present, and no fixed footer or debug surface may obscure content.

## Component and material grammar

| Ingredient | Comp commitment | Implementation medium |
| --- | --- | --- |
| Global shell | Cool near-white page, 68px header, quiet border | Semantic layout plus Luma theme tokens |
| Brand mark | Small blue globe with wordmark | Hugeicons icon plus live brand name text |
| Search workbench | Largest surface, visible label, 44px-plus input and one primary action | Luma `Card`, `Label`, `Input`/input group, `Button` |
| Recent history | Compact rows with domain, outcome, and clear action | Luma `Card`, `Button`, `ScrollArea` when needed |
| Loading | Layout-shaped placeholder with status announcement | Luma `Skeleton`, `aria-live` |
| Error | Cause, recovery copy, and retry/new-search action | Luma `Alert`, `Button` |
| Result summary | Domain, source, statuses, and key facts | Luma `Card`, `Badge`, `Tabs`, `Separator` |
| Detail groups | Registration, dates, nameservers, entities, notices | Luma `Table`/description rows, `Accordion` or `Collapsible`, copy `Button` |
| Raw data | Secondary disclosure with readable preformatted text | Luma `Collapsible` plus semantic `pre` |
| Language/theme controls | Compact, keyboard operable, truthful current state | Luma `DropdownMenu`, `Button`, Hugeicons |
| Shipping imagery | None required for this Operate surface | No raster referenced by product code; comps remain review-only |

## Sampled visual record

- Page ground: `#fdfdfd` sampled from the approved comp interior.
- Primary surface: `#ffffff` sampled from the approved comp.
- Quiet border: `#f0f1f3` sampled from the approved comp.
- Primary blue: `#0858d7` sampled from the approved comp's action edge; final code uses the closest preset token rather than an ad-hoc hex.
- Blue tint: `#eaf3fe` sampled from the approved comp.
- Positive state: `#1b772d` sampled from the approved comp; final code uses the preset semantic success/chart role.
- Ink: `#03040b` sampled from the approved comp; final code uses `foreground`.
- Corner language: the preset's default medium radius, consistently applied; no pill cards or mixed arbitrary radii.
- Line weight: one-pixel neutral separators; no decorative construction grid.
- Elevation: near-flat cards with border separation; shadows limited to transient overlay menus.
- Type ramp: Geist; 30-36px domain result heading, 18-20px section title, 16px body/input, 14px labels, 12-13px metadata. Idle has no visible display headline.

## Motion grammar

- Motion intensity: 7. The interface should feel animated and fluid while the content remains immediately usable.
- Primary transition: the idle search workbench compacts and moves toward the top as the result workspace enters below with spatial continuity.
- Buttons: all action buttons share hover lift, soft focus-ring expansion, active compression, and spring return. No layout-changing transforms and no decorative infinite loops.
- Result entry: summary first, then information panels in a short 40-60ms stagger. Animate only `transform` and `opacity`.
- Tabs, accordions, menus, copy feedback, theme switching, and language switching use 180-320ms transitions with consistent easing or spring tokens.
- Loading uses a layout-shaped skeleton and a restrained progress accent. Error and retry states transition in place instead of replacing the entire page abruptly.
- Every nonessential transition collapses to instant or simple opacity under `prefers-reduced-motion`; no feature or feedback depends on animation.

## Unresolved decisions

- Traditional WHOIS availability remains environment-dependent and is rendered from existing configuration/runtime evidence.
