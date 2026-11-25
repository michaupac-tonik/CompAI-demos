# Layout v0.1

Spacing and section layout of the Comp AI homepage, desktop (from 1024 px). Implemented in `homepage/index.html`
as tokens (`--sp-*` on `:root`) and the block “Layout system v0.1” at the end of the stylesheet.
The hero is outside this first pass; mobile is not defined yet.

## Spacing scale

φ × 8: each step is about 1.6 × the one before (the type scale uses its square root, 1.272). All values sit on the 8 px grid.

| Token | Value |
|---|---|
| `--sp-1` | 8 |
| `--sp-2` | 16 |
| `--sp-3` | 24 |
| `--sp-4` | 40 |
| `--sp-5` | 64 |
| `--sp-6` | 104 |
| `--sp-7` | 168 |

## Roles

| Role | Value |
|---|---|
| Section padding, top and bottom | `--sp-6` 104 |
| Eyebrow → h2 | `--sp-3` 24 |
| h2 → lead (stacked head) | `--sp-3` 24 |
| Lead → buttons | `--sp-4` 40 |
| Section head → content | `--sp-5` 64 |
| Blocks of content inside a section | `--sp-4` 40 |
| Between cards | `--sp-3` 24 |

### Inside a card or module

| Role | Value |
|---|---|
| Visual → the text under or beside it | `--sp-4` 40 |
| Card label → card title, title → text | `--sp-2` 16 |
| Text → the card's link | `--sp-3` 24 |
| Card text from the card's edge | 24 |

## Section head

The head follows the content under it. Everything is aligned left on the page's 12-column grid (24 px gutters).

- **Section head** where the content below runs the full width (02, 03, 05, 06, 07, 08): eyebrow, h2 (columns 1–7) and
  lead (columns 1–6) stacked on the left, h2 → lead 24; the buttons alone on the right (columns 9–12), on the lead's last
  baseline. Then a hairline 64 under the head (16% white on dark, 12% ink on light) and the content 40 under the line.
  In 03 the tabs are the line; in 08 each module opens with its own line.
- **Stacked head** where the section is two columns (04): eyebrow, h2, lead and buttons in the text column on the left,
  the visual on the right.

## Line breaks

Headings and leads use `text-wrap: balance` (lines of even length); running text uses `text-wrap: pretty`
(no lone last word).
