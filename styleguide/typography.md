# Typography v0.2

> **Work in progress (v0.2), not final.** Describes the v3 layout in progress on branch `homepage-v3`, not the page currently in `main`. Do not build tokens or components from this yet. Last updated: 27.11.2026 (general fixes, branch `claude/v3-general-fixes-84f7b3`, not merged yet).

The type system of the Comp AI homepage. Every text style on the page belongs to one of the roles below. There are no
variants of a role: if two elements have the same function, they share one role and look the same.
The product UI mock-ups (the board in 02, the chat and cards in 04, the windows in 06) use the same roles: their text is
`body-s`, their meta (tools, times, channels, badges, tags, file paths, code, counts) is `label-s` in its own case, and the
title of a card or a window is `body-m`. There is no separate scale for them.

## Sizes per section (27.11)

A section uses **at most four sizes**. The section head (eyebrow, headline and lead) counts as **one component**, so the
four are: the head, one title size (`title-m` or `title-s`), `body-m` and `label-s`.

Accepted exceptions (five sizes): **02** (the stage names on the axis in `title-m`, next to the board's `body-s` rows and
`label-s` heads), **05** (figures in `title-m` with their units in `title-s`) and **07** (the featured card's title in
`title-m`, the small cards' titles in `title-s`).

Implemented in `homepage/index.html` as tokens (`--fs-*` on `:root`) and one CSS rule per role at the end of the
stylesheet (block “Type system v0.2”).

## Scale

Ratio 1.272 (√φ) on a 16 px base, rounded to whole pixels:
**13 · 16 · 20 · 26 · 33 · 53 · 68**. The half-step 14 was dropped on 27.11: secondary text and eyebrows are 13.

## Fonts and weights

- Sans: ABC Favorit Pro. Mono: ABC Favorit Mono.
- **Light (300)** for text above 16 px. **Book (400)** for text at 16 px and below, in sans and mono.
  Book was chosen over Regular (25.11): it is the lighter of the two (about 122% of Light's ink against 133%)
  and keeps the small text closer to the light character of the page.
- Medium (500) is not used.

## Fluid sizes (from 1024 px)

1920 px is the reference: the table below gives the sizes at 1920 px and wider. From 1920 down to 1280 px the large roles
slide to the step below them on the scale, and stay there below 1280 px:

| Role | 1920 px | 1280 px |
|---|---|---|
| `display-xl` | 68 | 53 |
| `display-l` | 53 | 42 |
| `title-m` | 33 | 26 |
| `lead-l` | 26 | 20 |

Roles of 20 px and less do not scale. In CSS: `clamp(lo, lo + (hi − lo) × (100vw − 1280px) / 640, hi)`.

## Roles (desktop, at 1920 px)

| Role | Font | Size | Line-height | Letter-spacing | Weight | Case | Used for |
|---|---|---|---|---|---|---|---|
| `display-xl` | Sans | 68 | 1 | −4% | 300 | | The page headline (h1) and the power quotes (03, 08) |
| `display-l` | Sans | 53 | 1 | −4% | 300 | | Section headlines (h2) |
| `title-m` | Sans | 33 | 1.05 | −4% | 300 | | Module and featured-card titles, key figures |
| `lead-l` | Sans | 26 | 1.4 | −1% | 300 | | The hero subline |
| `lead-m` | Sans | 20 | 1.4 | −1% | 300 | | Section leads |
| `title-s` | Sans | 20 | 1.3 | −1% | 300 | | Tab titles, card titles, list titles, FAQ questions |
| `body-m` | Sans | 16 | 1.55 | 0 | Book | | Running text, menu item titles, footer links |
| `body-s` | Sans | 13 | 1.45 | 0 | Book | | Secondary text: descriptions, notes, answers, captions, small print |
| `eyebrow` | Mono | 13 | 1.3 | +5% | Book | Upper | One per section head |
| `label-s` | Mono | 13 | 1.3 | +4% | Book | Upper | Short labels (badges, categories, column heads, step numbers, legends, metric labels) and tertiary actions (text links with an arrow) |
| `button` | Sans | 16 | 1 | 0 | Book | | Primary, secondary and quiet buttons; nav links (one size at every width) |

Mono is used only in `eyebrow` and `label-s`. Nav links and buttons are in sans.

## Line breaks (27.11)

**Balance**: a heading, lead or paragraph breaks into lines of even length and never ends on a short hanging line.
In CSS one global rule, `text-wrap: balance` on headings, paragraphs, quotes, list items, terms and legends. Browsers
balance up to about six lines; longer text keeps the normal break. Copy is still written so that it balances well:
when a block keeps breaking badly, shorten or reword it rather than adding manual line breaks.

## Actions (27.11)

| Action | Text | Icon | Gap | Hover |
|---|---|---|---|---|
| Button (primary, secondary, quiet, nav) | `button`, 16 | chevron 14 | 8 | the button's own fill change; the chevron moves 3 px |
| Tertiary (text link with a chevron: cards, panels, mega menu, announcement bar) | `label-s`, 13 mono, `--text-1` | chevron 13 | 8 | only the chevron moves 3 px: no backdrop, no colour change |

- One chevron for every action (path `M5.5 3.5 10.5 8l-5 4.5`); no arrows (→) on actions. ↗ marks an external link
  (the logo tables' "All customer stories", the footer) and stays.
- The chevron's centre sits on the middle of the capitals (tertiary chevrons are lifted 1 px for this).
- A whole card that is a link (07) moves its chevron when the card is hovered.
- Grid cells that are links (the logo tables) keep the cell backdrop on hover, as their neighbours.

## Mega menu (27.11)

Column heads `label-s`; items `body-m` with `body-s` under them; the card's title `body-m`, its text `body-s`; the title in
a card's art `title-m`; actions tertiary.

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

## Changes on 27.11 (general fixes)

- One mono size: eyebrows 13 like the labels. `body-s` 14 → 13 (the FAQ answers move to `body-m`).
- Buttons and nav links 16 (were 13), at every width.
- Off-scale sizes removed: 15 → 16, 22 → 20; the mock-ups lose their micro sizes (10 to 13.5) and use the roles.
- Hero figures (G2 rating, 1,000+) take `lead-l`; the price figure and the pricing steps take `lead-m`.
- Actions: one chevron, one gap (8) and one tertiary hover (the chevron moves) on the whole page; see Actions.
- Balanced line breaks everywhere (`text-wrap: balance`); see Line breaks.

## Changes from v0.1 (17.11)

- Weight: Book for text at 16 px and below (was Light only).
- Mono: no longer in nav links and buttons; eyebrows get their own role (14 px, Book, +5%).
- New roles: `title-m`, `title-s`, `body-s` (the half-step 14), `eyebrow`, `button`.
- `menu-l` (mobile menu) waits for the mobile round.
