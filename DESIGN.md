---
name: SpectraWHOIS
description: A calm, evidence-led domain lookup workbench that reveals protocol depth only when it is useful.
colors:
  paper: "oklch(1 0 0)"
  ink: "oklch(0.145 0 0)"
  near-paper: "oklch(0.985 0 0)"
  coal: "oklch(0.205 0 0)"
  charcoal: "oklch(0.269 0 0)"
  quiet: "oklch(0.97 0 0)"
  quiet-ink: "oklch(0.556 0 0)"
  mid-ink: "oklch(0.708 0 0)"
  hairline: "oklch(0.922 0 0)"
  cool-quiet: "oklch(0.967 0.001 286.375)"
  cool-ink: "oklch(0.21 0.006 285.885)"
  cool-charcoal: "oklch(0.274 0.006 286.033)"
  primary-blue: "oklch(0.488 0.243 264.376)"
  primary-blue-dark: "oklch(0.424 0.199 265.638)"
  primary-on: "oklch(0.97 0.014 254.604)"
  destructive: "oklch(0.577 0.245 27.325)"
  destructive-dark: "oklch(0.704 0.191 22.216)"
  dark-hairline: "oklch(1 0 0 / 10%)"
  dark-input: "oklch(1 0 0 / 15%)"
  verified-wash: "oklch(0.845 0.143 164.978)"
  verified-highlight: "oklch(0.696 0.17 162.48)"
  verified-signal: "oklch(0.596 0.145 163.225)"
  verified-ink: "oklch(0.508 0.118 165.612)"
typography:
  headline:
    fontFamily: '"Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: '"Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: '"Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
  metadata:
    fontFamily: '"Geist", "Geist Fallback", ui-sans-serif, system-ui, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  "2xl": "18px"
  "3xl": "22px"
  "4xl": "26px"
  full: "9999px"
spacing:
  "2": "0.5rem"
  "2.5": "0.625rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.25rem"
  "6": "1.5rem"
  "8": "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-blue}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label}"
    rounded: "{rounded.4xl}"
    padding: "0 0.75rem"
    height: "2.25rem"
  button-primary-dark:
    backgroundColor: "{colors.primary-blue-dark}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label}"
    rounded: "{rounded.4xl}"
    padding: "0 0.75rem"
    height: "2.25rem"
  button-lookup:
    backgroundColor: "{colors.primary-blue}"
    textColor: "{colors.primary-on}"
    typography: "{typography.label}"
    rounded: "{rounded.4xl}"
    padding: "0 1.25rem"
    height: "3.5rem"
  button-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.4xl}"
    padding: "0 1rem"
    height: "2.5rem"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "1.5rem"
  card-dark:
    backgroundColor: "{colors.coal}"
    textColor: "{colors.near-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "1.5rem"
  search-input:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.4xl}"
    padding: "0 1rem"
    height: "3.5rem"
  badge-verified:
    textColor: "{colors.verified-ink}"
    typography: "{typography.metadata}"
    rounded: "{rounded.3xl}"
    padding: "0.125rem 0.5rem"
    height: "1.25rem"
  menu-inverted:
    backgroundColor: "{colors.coal}"
    textColor: "{colors.near-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.3xl}"
    padding: "0.375rem"
  tabs-detail:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.75rem"
    height: "2.75rem"
  app-header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 2rem"
    height: "4.25rem"
  result-summary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.2xl}"
    padding: "1.5rem"
---

# Design System: SpectraWHOIS

## Overview

**Creative North Star: "The Luma Motion Workbench"**

SpectraWHOIS is a calm technical instrument, not an always-on analytics dashboard. Its visual world comes from the exact shadcn/ui preset `b2D0wqNxT`: `base-luma` style, neutral base, blue theme, Base UI primitives, subtle menu accents, inverted translucent menus, Geist typography, and Hugeicons. Neutral fields carry the work; one blue action establishes priority; emerald appears only when the interface has positive evidence.

The interface expands with knowledge. Idle space is deliberate and contains only the lookup task plus real recent history when it exists. A search compacts that workbench into a stable strip, then reveals a readable result summary before protocol-specific tabs, entities, notices, and raw data. Light and dark modes preserve the same hierarchy rather than becoming separate visual identities.

The audience is developers, webmasters, and site operators. Idle UI does not explain WHOIS/RDAP, narrate the search control, or offer tutorial examples. Visible copy is limited to labels, state, data, consequence, and recovery actions.

**Key Characteristics:**

- Evidence-gated disclosure instead of a permanent feature dashboard.
- Near-achromatic Luma surfaces with one blue action and emerald verified states.
- Rounded, tactile controls inside quieter rounded containers.
- A spatially continuous idle-to-result transition with reduced-motion parity.
- Bilingual, keyboard-operable controls using Geist and Hugeicons throughout.
- No beginner-facing proposition, helper paragraph, or example-query strip.

**The Evidence Earns Space Rule.** Rich panels appear only after a lookup produces a state to explain; idle space never advertises capability, teaches the tool, or repeats what the labeled control already says.

## Colors

The palette is intentionally narrow: neutral fields do most of the work, blue marks the primary action, emerald confirms positive evidence, and red is reserved for destructive or error states.

### Primary

- **Action Blue** (`primary-blue`; dark mode `primary-blue-dark`): primary lookup actions, the brand icon, progress, selected text, and links that must read as actionable.
- **Blue-White** (`primary-on`): text and icons placed on Action Blue.

### Secondary

- **Verified Emerald Ramp** (`verified-wash`, `verified-highlight`, `verified-signal`, `verified-ink`): DNSSEC, successful history entries, copy confirmation, and genuinely positive statuses. The wash supplies restrained chip backgrounds; the deeper steps supply legible icons and text.
- **Failure Red** (`destructive`; dark mode `destructive-dark`): validation, failed lookups, failed history entries, destructive confirmation, and nothing decorative.

### Neutral

- **Paper** (`paper`): light-mode page, card, popover, and input focus ground.
- **Ink** (`ink`): light-mode foreground and dark-mode page ground.
- **Near Paper** (`near-paper`): dark-mode foreground and surface text.
- **Coal** (`coal`): dark-mode cards and popovers; also the light accent-foreground value.
- **Quiet Neutrals** (`quiet`, `quiet-ink`, `mid-ink`, `charcoal`): muted fills, secondary copy, focus rings, and low-emphasis states.
- **Cool Neutrals** (`cool-quiet`, `cool-ink`, `cool-charcoal`): secondary controls in light and dark modes.
- **Hairlines** (`hairline`, `dark-hairline`, `dark-input`): separators, light input pigment, and translucent dark-mode boundaries.

### Semantic role map

| Role | Light | Dark |
| --- | --- | --- |
| Page background | `paper` | `ink` |
| Foreground | `ink` | `near-paper` |
| Card / popover | `paper` | `coal` |
| Primary | `primary-blue` | `primary-blue-dark` |
| Primary foreground | `primary-on` | `primary-on` |
| Secondary | `cool-quiet` | `cool-charcoal` |
| Secondary foreground | `cool-ink` | `near-paper` |
| Muted / accent | `quiet` | `charcoal` |
| Muted foreground | `quiet-ink` | `mid-ink` |
| Border | `hairline` | `dark-hairline` |
| Input pigment | `hairline` | `dark-input` |
| Focus ring | `mid-ink` | `quiet-ink` |
| Destructive | `destructive` | `destructive-dark` |

**The One Blue Action Rule.** A task cluster gets one visually dominant blue action; neighboring actions remain outline, secondary, or ghost.

**The Verified Means Verified Rule.** Emerald is evidence, not decoration. Never use it for neutral protocol labels, navigation, or unconfirmed availability.

## Typography

**Display Font:** Geist (with Geist Fallback, UI sans-serif, and system sans-serif fallbacks)  
**Body Font:** Geist (with the same fallback stack)  
**Icon System:** Hugeicons at 1.7–1.9 stroke weight for product UI; 2.0 is limited to compact disclosure glyphs.

**Character:** One sans-serif family keeps Chinese and English product copy direct and contemporary. Hierarchy comes from size, weight, spacing, and muted color rather than a decorative display face.

### Hierarchy

- **Headline** (600; 1.5rem mobile, 1.875rem from 640px; -0.035em): the returned domain identity.
- **Title** (500; 1rem; 1.5 line-height): card and result-group headings.
- **Body** (400; 1rem; 1.5 line-height): search input and ordinary readable content.
- **Label** (500; 0.875rem; 1.25 line-height): fields, actions, tabs, table cells, and menus.
- **Metadata** (400; 0.75rem): timestamps, relative dates, badge text, counts, and secondary protocol annotations. Use tabular numerals for time and date values.

**The One-Family Rule.** Extend hierarchy within Geist; do not add a decorative display, serif, or monospace family to create artificial personality.

## Layout

The shell is a sticky 68px header over a centered content container capped at 1440px. Horizontal page padding is 16px by default, 24px from 640px, and 32px from 1024px. The header and main content share these edges so brand, workbench, and result ledger stay on one vertical grid.

Idle topology depends on evidence. With no history, the compact search card owns the width and begins after a viewport-aware 48–128px top offset. With real history, the section becomes a 2:1 search/history grid at 1024px with a 24px gutter; below 1024px it is one content-aligned column with history immediately after search. History height follows its rows until more than five entries require a bounded scroll area. The search card's working content is capped at 1024px so the field/action row stays readable on wide screens.

At 640px and above, the labeled search field and primary action sit side by side; below 640px they stack and the action stretches to the row width. The idle control height is 56px, mobile button targets never fall below 44px, and compact post-search controls are 44px. The search action is 128px minimum width on wider screens.

After submission, the workbench compacts into a sticky strip 84px below the viewport top and the result region follows with an 8–12px gap. The result story is summary first, then detail tabs, then a 7/5 registration-versus-dates/nameservers grid at 1024px. Contact cards become two columns from 768px; raw protocol data is bounded to the lesser of 34rem or 64vh. Tabs may scroll horizontally rather than wrap or shrink below legibility.

**The Stable Input Rule.** A lookup changes the workbench's size and position, not its identity; the entered domain remains editable in the compact strip while results enter below.

**The Touch Floor Rule.** Interactive targets are at least 44×44px below 640px, including icon-only controls.

## Elevation & Depth

Depth is a restrained hybrid of tonal layering, one-pixel rings, and low ambient shadows. Resting cards use a shallow surface shadow plus a 5% foreground ring in light mode or 10% in dark mode. Search fields begin with a 1px/2px ambient shadow and rise to a 4px/6px focus shadow; the compact sticky workbench and inverted menus use the larger 10px/15px overlay shadow. Dialogs alone may use the 20px/25px shadow. Header and translucent overlays use backdrop blur; ordinary information cards do not.

### Shadow Vocabulary

- **Field Rest** (`0 1px 2px 0 rgb(0 0 0 / 0.05)`): idle search field.
- **Surface Rest** (`0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`): cards and button hover.
- **Field Focus** (`0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): focused lookup field.
- **Overlay** (`0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): sticky compact workbench, skip link, and menus.
- **Dialog** (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`): destructive confirmation dialog only.

**The Flat Until Active Rule.** Information remains near-flat at rest. Stronger elevation belongs to focus, sticky continuity, or an overlay that genuinely sits above the page.

## Shapes

The radius source is the Luma default 10px base, expanded by the implemented scale: 6, 8, 10, 14, 18, 22, and 26px. Cards, alerts, accordions, raw-data wells, and row hover targets use gently rounded 18px corners. Menus and compact icon wells use 22px. Buttons and input groups use the fuller 26px control silhouette. Tabs and their active triggers are true pills; cards are never pills.

Borders are quiet one-pixel semantic hairlines. Cards use a ring rather than a heavy outline, section headers may add a single bottom divider, and repeated rows use separators instead of nested boxes. Icon wells are compact rounded squares with a 10% primary tint, never free-floating decorative blobs.

**The Rounded Controls, Quiet Containers Rule.** Controls may feel pill-like; information surfaces stop at the 18px container radius so the page retains structure.

**The One Divider Rule.** Use a single semantic separator between logical regions; do not stack border, ring, and decorative grid lines to explain the same boundary.

## Components

The component foundation is the exact shadcn `base-luma` preset `b2D0wqNxT` on Base UI. Extend existing primitives and preserve their focus, invalid, disabled, and reduced-motion behavior. Product icons come from Hugeicons; do not mix icon libraries.

### Buttons

- **Shape:** full Luma control radius (26px), medium-weight 14px text, transparent border at rest, and 300ms state transitions using the exponential-out curve.
- **Primary:** Action Blue with Blue-White content. The lookup variant is 56px high with 20px horizontal padding; it becomes 44px high in the compact workbench.
- **Outline:** Paper or transparent dark ground with a semantic hairline; muted fill on hover. Use for theme, language, cancellation, and secondary recovery actions.
- **Ghost:** visually quiet until hover; used for brand reset, history rows, copy, remove, and other subordinate icon actions.
- **Destructive:** a low-opacity red field with red text rather than a solid alarm block.
- **Hover / active:** translate upward 2px with a Surface Rest shadow, then compress to 97% with a 1px downward translation on press. Popup triggers do not compress. Disable all transforms and transitions for reduced motion.
- **Focus / disabled:** use a 3px ring at 30% ring color plus a semantic focus border. Disabled controls keep shape, remove elevation, block pointer input, and use 50% opacity.

### Badges

- **Style:** 20px-high rounded labels (22px radius) with 12px type, a compact Hugeicon, and 8px horizontal padding.
- **Verified:** a 28% Verified Wash background with Verified Ink text in light mode and Verified Highlight text in dark mode.
- **Neutral / protocol:** outline or muted neutral treatment. Negative status uses the destructive variant.

### Cards / Containers

- **Corner style:** quiet container radius (18px), clipped overflow, semantic card ground, shallow shadow, and a 5%/10% foreground ring.
- **Internal rhythm:** 24px default padding and gap; compact cards use 16px. A header divider receives matching bottom padding instead of a second nested surface.
- **Workbench:** compact labeled form while idle; after search it retains 16px rhythm, translucent card ground, and Overlay shadow.
- **Result summary:** domain and source lead; verified badges and statuses follow; copy remains subordinate. The summary is always read before protocol detail.

### Inputs / Fields

- **Style:** a labeled 56px input group with a 26px radius, globe icon, medium input text, transparent border, and 50% semantic input pigment over the page. The compact field is 44px high.
- **Focus:** lift 2px, return to the full background color, apply Field Focus elevation, then show the shared semantic border/ring treatment.
- **Validation:** set `aria-invalid`, connect the message with `aria-describedby`, color border/ring/message destructively, and announce the field error as an alert. Clear stale error copy while the user edits.
- **Disabled:** prevent input and use 50% opacity; the submit action is also disabled when the normalized value is empty.

### Navigation

- **Header:** 68px sticky translucent shell with shared container edges. The left-aligned brand reset is a ghost button with an 32px tinted globe well; language and theme are outline controls on the right.
- **Menus:** inverted translucent popovers use dark semantic tokens in both page themes, 70% popover fill, 40px backdrop blur, 150% saturation, 22px outer radius, 18px item radius, and 44px minimum item height.
- **Tabs:** protocol choice uses a muted pill track; result detail uses a line variant with a 2px foreground indicator. Tabs remain keyboard operable, disabled when no evidence exists, and horizontally scroll on narrow screens.

### History Rows

History exists only when local records exist. Show at most eight rows in a bounded scroll area; each 56px row contains truthful success/failure status, domain, relative time, replay affordance, and a separately labeled removal action. The removal control is always available to touch users and appears on hover or keyboard focus on larger screens.

### Lookup and Result States

Loading preserves the result layout with skeletons, a polite live region, and a restrained blue progress line. Error states remain in place with cause, recovery copy, retry, and new-search actions. Successful results enter summary-first, then panels at a 55ms stagger; contacts, notices, raw data, and optional WHOIS comparison stay behind enabled tabs or disclosures.

### Motion

The focal transition uses a workbench spring (stiffness 260, damping 30, mass 0.9). Controls use a faster spring (stiffness 420, damping 28, mass 0.55). General panels use 420ms exponential-out motion (`cubic-bezier(0.16, 1, 0.3, 1)`); the provider default is 280ms with the same easing. Panel sequences wait 80ms, then stagger by 55ms. Theme background and foreground changes run for 320ms and 240ms respectively. Loading progress cycles over 1.8s only when reduced motion is not requested.

**The Spatial Continuity Rule.** Animate opacity and transform to explain state movement; never animate layout for spectacle, hide feedback behind motion, or run decorative loops.

**The Reduced-Motion Parity Rule.** `prefers-reduced-motion` collapses nonessential animation and smooth scrolling to effectively instant behavior; content, focus, validation, and progress meaning remain available.

## Do's and Don'ts

### Do:

- **Do** begin with the labeled domain lookup and reveal information only when a loading, success, partial, empty, or error state exists.
- **Do** reuse the `base-luma` Base UI primitives, semantic CSS variables, Geist roles, Hugeicons strokes, radius scale, and motion tokens before extending the system.
- **Do** preserve the 68px shell, 1440px shared container, stable compact search strip, summary-first result story, and conditional history/protocol topology.
- **Do** keep English and Simplified Chinese layouts resilient to wrapping, long domains, long registrar names, and horizontal tab overflow.
- **Do** retain visible focus, skip navigation, semantic labels, live loading/error announcements, 44px touch targets, and reduced-motion parity in every extension.
- **Do** make new status colors prove a distinct semantic need and provide both light- and dark-mode behavior.

### Don't:

- **Don't** turn idle space into a headline, helper paragraph, example queries, feature cards, metrics, fake history, result previews, protocol marketing, or an always-on dashboard.
- **Don't** add accent colors, gradients, decorative grids, glass cards, imagery, customer proof, or new type/icon families that are absent from the shipped world.
- **Don't** use blue for multiple competing actions or emerald for neutral decoration.
- **Don't** make cards pill-shaped, mix arbitrary radii, stack redundant enclosures, or use strong shadows on resting information.
- **Don't** expose WHOIS comparison when runtime evidence says it is unavailable, or enable detail tabs when their data is absent.
- **Don't** ship hover-only actions, unlabeled icon buttons, color-only state, focus suppression, motion-dependent feedback, or sub-44px mobile targets.
