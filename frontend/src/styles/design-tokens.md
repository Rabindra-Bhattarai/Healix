# Healix Design Tokens

Extracted from the high-fidelity design reference (landing page export). These are the
**only** tokens to use across patient, doctor, and admin UI — do not invent new colors,
fonts, spacing, or radii. Mirrored 1:1 in `tailwind.config.ts`.

## Color roles (Material 3 style naming)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#574eb1` | Primary buttons, links, brand accents |
| `on-primary` | `#ffffff` | Text/icons on primary surfaces |
| `primary-container` | `#7067cc` | Primary container fills |
| `on-primary-container` | `#fffbff` | Text on primary-container |
| `primary-fixed` | `#e4dfff` | Fixed-tone primary tint |
| `primary-fixed-dim` | `#c5c0ff` | Fixed-tone primary tint (dim), also used for selection highlight |
| `on-primary-fixed` | `#140067` | Text on primary-fixed |
| `on-primary-fixed-variant` | `#41379b` | Secondary text on primary-fixed |
| `inverse-primary` | `#c5c0ff` | Primary on inverse surfaces |
| `secondary` | `#006c4e` | Secondary accents (success-leaning green) |
| `on-secondary` | `#ffffff` | Text on secondary |
| `secondary-container` | `#83f5c6` | Secondary container fills |
| `on-secondary-container` | `#007151` | Text on secondary-container |
| `secondary-fixed` / `-dim` | `#86f8c9` / `#68dbae` | Fixed-tone secondary |
| `on-secondary-fixed` / `-variant` | `#002115` / `#00513a` | Text on secondary-fixed |
| `tertiary` | `#745800` | Tertiary accents (warning-leaning amber) |
| `on-tertiary` | `#ffffff` | Text on tertiary |
| `tertiary-container` | `#926f00` | Tertiary container fills |
| `on-tertiary-container` | `#fffbff` | Text on tertiary-container |
| `tertiary-fixed` / `-dim` | `#ffdf98` / `#efc04c` | Fixed-tone tertiary |
| `on-tertiary-fixed` / `-variant` | `#251a00` / `#5a4300` | Text on tertiary-fixed |
| `error` | `#ba1a1a` | Error/destructive actions |
| `on-error` | `#ffffff` | Text on error |
| `error-container` | `#ffdad6` | Error container fills |
| `on-error-container` | `#93000a` | Text on error-container |
| `background` | `#fcf9f1` | Page background |
| `on-background` | `#1c1c17` | Default text on background |
| `surface` | `#fcf9f1` | Base surface |
| `on-surface` | `#1c1c17` | Default text on surface |
| `surface-dim` | `#dcdad2` | Dimmed surface |
| `surface-bright` | `#fcf9f1` | Bright surface |
| `surface-container-lowest` | `#ffffff` | Cards, modals (lowest elevation) |
| `surface-container-low` | `#f6f4eb` | Subtle section backgrounds |
| `surface-container` | `#f0eee5` | Default container fill |
| `surface-container-high` | `#eae8e0` | Raised container fill |
| `surface-container-highest` | `#e5e2da` | Highest elevation container |
| `surface-variant` | `#e5e2da` | Variant surface fill |
| `on-surface-variant` | `#474552` | Secondary/muted text |
| `outline` | `#787583` | Borders, dividers (default) |
| `outline-variant` | `#c8c4d4` | Borders, dividers (subtle) |
| `inverse-surface` | `#31312b` | Dark inverse surface (e.g. toasts) |
| `inverse-on-surface` | `#f3f1e8` | Text on inverse-surface |
| `surface-tint` | `#5951b4` | Elevation tint overlay |
| `action-teal` | `#1d9e75` | Quick-action tile accent (e.g. "My Queue") — dashboard-only accent, not a Material 3 role |
| `action-amber` | `#ef9f27` | Quick-action tile accent (e.g. "Health Vault") — dashboard-only accent |
| `action-neutral` | `#888780` | Quick-action tile accent (e.g. "Messages") — dashboard-only accent |

## Typography

Font family: **Inter** (weights 400/500/600/700/800), loaded via `next/font/google` and
self-hosted. Icons: **Material Symbols Outlined**.

| Token | Size | Line height | Letter spacing | Weight | Usage |
|---|---|---|---|---|---|
| `h1` | 32px | 40px | -0.02em | 600 | Page hero headings |
| `h2` | 24px | 32px | -0.01em | 600 | Section headings |
| `h3` | 18px | 26px | -0.01em | 600 | Card/subsection headings |
| `body-lg` | 16px | 24px | 0em | 400 | Lead paragraphs |
| `body-md` | 14px | 20px | 0em | 400 | Default body text |
| `label-sm` | 12px | 16px | 0.02em | 500 | Small labels, badges |
| `mono-label` | 11px | 14px | 0.05em | 600 | Uppercase micro-labels |

Use as `font-h1 text-h1`, `font-body-md text-body-md`, etc. (both family + size utilities
share the same token name).

## Spacing scale

| Token | Value | Usage |
|---|---|---|
| `stack_gap_sm` | 8px | Tight vertical stacks |
| `stack_gap_md` | 16px | Default vertical stacks |
| `stack_gap_lg` | 24px | Section-internal spacing |
| `container_padding` | 24px | Inner padding of cards/containers |
| `grid_margin` | 32px | Page/section horizontal margin |
| `grid_gutter` | 24px | Gap between grid columns |
| `sidebar_width` | 240px | Doctor/admin layout sidebar width |

## Radii

| Token | Value |
|---|---|
| `DEFAULT` | 0.25rem |
| `lg` | 0.5rem |
| `xl` | 0.75rem |
| `full` | 9999px |

Buttons and inputs use `rounded-xl`; badges/pills use `rounded-full`; small chips use
`rounded-lg`.

## Shadows

No custom shadow scale was defined in the reference — it relies on Tailwind's default
`shadow`, `shadow-lg`, `shadow-xl`, typically tinted with the primary color at low opacity
(e.g. `hover:shadow-lg hover:shadow-primary/20`) rather than plain grey shadows.

## Component patterns observed

- **Buttons (primary)**: `bg-primary text-on-primary rounded-xl font-semibold`, hover adds
  `shadow-lg hover:shadow-primary/20` and/or a slight `hover:translate-y-[-2px]` lift.
- **Buttons (secondary/outline)**: `bg-surface-container border border-outline-variant
  text-on-surface rounded-xl`, hover `bg-surface-container-high`.
- **Cards**: `bg-surface-container-lowest rounded-xl border border-outline-variant/30`,
  hover `border-primary/30`.
- **Icon chip**: 12x12 (w-12 h-12) `rounded-lg bg-primary/10`, hover inverts to
  `bg-primary text-on-primary`.
- **Nav bar**: sticky, `bg-surface/80 backdrop-blur-md border-b border-outline-variant/30`.
- **Pill/eyebrow badge**: `rounded-full bg-primary/10 text-primary font-label-sm`.
- **Max content width**: `1200px` (`max-w-content` in Tailwind config), horizontal padding
  `px-grid_margin`.
