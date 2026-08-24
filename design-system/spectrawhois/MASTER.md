# SpectraWHOIS Design System

This file reconciles the UI UX Pro Max recommendations with the user's binding shadcn/ui preset. The preset is authoritative whenever a generic recommendation conflicts.

## Foundation

- Preset: `b2D0wqNxT`
- shadcn style: `base-luma`
- Primitive library: Base UI
- Base color: neutral
- Primary theme: blue
- Positive/data accent family: emerald chart tokens
- Icon library: Hugeicons, stroke width 1.75-1.9
- Font: Geist for interface and headings
- Radius: Luma default (`0.625rem`) and its generated scale
- Menu: subtle accent with inverted translucent popovers
- Modes: complete light, dark, and system preference support

Use semantic tokens only for foundational surfaces: `background`, `foreground`, `card`, `muted`, `primary`, `secondary`, `destructive`, `border`, `input`, `ring`, and `chart-*`. Do not introduce page-level palette hex values.

## Product structure

### Idle state

- A 68px global header contains the live brand, development configuration control when applicable, language, and theme.
- The only body content is the labeled domain search workbench and recent local history when history exists.
- The audience is developers, webmasters, and site operators. Do not add a proposition headline, helper paragraph, example queries, or beginner-facing WHOIS/RDAP explanation.
- No protocol cards, feature cards, result preview, marketing proof, or fabricated metrics appear before a lookup.
- Center the idle workbench inside an 1180px maximum width. At 1024px and above, the large field label occupies the narrow left column and the unified input/action control occupies the wider right column.
- When recent history exists, align it below the input column instead of placing a competing card beside the primary task. Collapse the entire composition to one column below 1024px.

### Lookup state

- The same search workbench compacts below the header with spatial continuity.
- Loading uses a layout-shaped Luma skeleton and a meaningful progress accent.
- Success reveals a domain summary, source/status badges, tabs, registration details, dates, nameservers, contacts when present, notices, and raw protocol data.
- Errors state the cause and provide retry plus new-search recovery.

## Component policy

- Actions: Luma `Button`; no raw buttons.
- Forms: Luma `Field`, `InputGroup`, and `Input`; labels remain visible except in the compact searched state where they remain screen-reader accessible.
- Structure: Luma `Card`, `Separator`, `Table`, and `ScrollArea` only when they communicate real hierarchy.
- State: Luma `Badge`, `Alert`, `Skeleton`, `Sonner`, and `AlertDialog`.
- Disclosure/navigation: Luma `Tabs`, `Accordion`, `Collapsible`, `DropdownMenu`, and `Tooltip`.
- Do not nest cards. Use rows, separators, or spacing inside a card.

## Motion system

- Motion intensity: 4, optimized for a calm Operate surface.
- Focal transition: idle search workbench compacts while the result workspace enters below.
- Buttons use a 200ms exponential ease for color, border, and shadow feedback. Hover never changes their position; press feedback is a restrained 98.5% compression.
- Routine control transitions run 180-240ms; major layout continuity uses a critically damped spring.
- Result panels enter in a capped 55ms sibling stagger. Tabs and disclosures crossfade with short directional movement.
- Animate transforms, opacity, bounded blur, color, and shadow. Do not animate layout-driving dimensions in React.
- `prefers-reduced-motion` removes spatial motion while preserving state and feedback.

## Accessibility and quality floor

- Text contrast: WCAG AA minimum in both themes.
- Controls: 44px minimum touch target for primary paths and icon controls.
- Keyboard: logical tab order, visible focus ring, Escape closes overlays, all results tabs/disclosures operable.
- Forms: visible labels, validation on blur and submit, inline `role="alert"` errors.
- Status is never color-only; use icon plus text.
- Async result/error changes are announced and focus moves to the result region.
- Mobile: no horizontal page scroll and no content behind sticky surfaces.
- Avoid emoji icons, purple/glow/gradient visuals, decorative grids, raw controls, em dashes, and unsupported factual claims.
