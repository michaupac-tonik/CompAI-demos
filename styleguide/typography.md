# Typography v0.2

The type system of the Comp AI homepage. Every text style on the page belongs to one of the roles below. There are no
variants of a role: if two elements have the same function, they share one role and look the same.
The product UI mock-ups (the app windows in sections 03, 04, 06 and 08, the cards in 05) illustrate the product and are
outside this system.

Implemented in `homepage/index.html` as tokens (`--fs-*` on `:root`) and one CSS rule per role at the end of the
stylesheet (block “Type system v0.2”).

## Scale

Ratio 1.272 (√φ) on a 16 px base, rounded to whole pixels:
**13 · 16 · 20 · 26 · 33 · 53 · 68**, plus one half-step, **14**, for secondary text and eyebrows.

## Fonts and weights

- Sans: ABC Favorit Pro. Mono: ABC Favorit Mono.
- **Light (300)** for text above 16 px. **Regular** for text at 16 px and below. Regular is registered as weight `450`
  so it does not replace Book (`400`).
- Mono at 16 px and below resolves to Book, because Favorit Mono has no Regular cut.
- Medium (500) is not used.

## Roles (desktop, from 1024 px)

| Role | Font | Size | Line-height | Letter-spacing | Weight | Case | Used for |
|---|---|---|---|---|---|---|---|
| `display-xl` | Sans | 68 | 1 | −4% | 300 | | The page headline (h1) |
| `display-l` | Sans | 53 | 1 | −4% | 300 | | Section headlines (h2) |
| `title-m` | Sans | 33 | 1.05 | −4% | 300 | | Module and featured-card titles, key figures |
| `lead-l` | Sans | 26 | 1.4 | −1% | 300 | | The hero subline |
| `lead-m` | Sans | 20 | 1.4 | −1% | 300 | | Section leads |
| `title-s` | Sans | 20 | 1.3 | −1% | 300 | | Tab titles, card titles, list titles, FAQ questions |
| `body-m` | Sans | 16 | 1.55 | 0 | Regular | | Running text, menu item titles, footer links |
| `body-s` | Sans | 14 | 1.45 | 0 | Regular | | Secondary text: descriptions, notes, answers, captions, small print |
| `eyebrow` | Mono | 14 | 1.3 | +5% | Book | Upper | One per section head |
| `label-s` | Mono | 13 | 1.3 | +4% | Book | Upper | Short labels (badges, categories, column heads, step numbers, legends, metric labels) and tertiary actions (text links with an arrow) |
| `button` | Sans | 13 | 1 | 0 | Regular | | Primary, secondary and quiet buttons; nav links |

Mono is used only in `eyebrow` and `label-s`. Nav links and buttons are in sans.

## Text colour

Two levels, set from the ground's full-strength text colour (`--fg`: white on dark, ink on the light sections):

| Token | Value | Roles |
|---|---|---|
| `--text-1` | 100% of `--fg` | `display-xl`, `display-l`, `title-m`, `title-s`, `button`; menu item titles |
| `--text-2` | 72% of `--fg` | `lead-l`, `lead-m`, `body-m`, `body-s` |

Contrast: about 10:1 on black and 7:1 on the light grey ground, both above WCAG AA.
Interactive states (inactive tabs and steps, hover) keep their own values. Eyebrows and labels keep their own colours.

## Mobile

Not defined yet: below 1024 px the page still uses each section's own sizes. To be decided in a later round.

## Changes from v0.1 (17.11)

- Weight: Regular for text at 16 px and below (was Light only).
- Mono: no longer in nav links and buttons; eyebrows get their own role (14 px, Book, +5%).
- New roles: `title-m`, `title-s`, `body-s` (the half-step 14), `eyebrow`, `button`.
- `menu-l` (mobile menu) waits for the mobile round.
