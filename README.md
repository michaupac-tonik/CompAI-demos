# Comp AI — homepage

Design reference for the new Comp AI homepage, built as one static HTML page.
This branch holds only what development needs; exploration and earlier rounds live in `archive/*` branches.

## Files

```
homepage/
  index.html            the homepage: all sections, styles and scripts in one file
  assets/img/           logo (mark + wordmark), nav chevron, share image (og:image), G2 mark (official, white)
  assets/js/            shapes-phase.js: data for the hero's fingerprint print
  assets/fonts/         Favorit fonts (not in git, see Fonts)
tokens/
  comp-ai-colours.css   brand colour tokens (reference; not linked by index.html yet)
styleguide/
  typography.md         type system v0.2: scale, roles, weights (implemented in index.html)
```

## Run it

Serve the `homepage/` folder over HTTP (the hero shader loads its data from `assets/js/`):

```bash
python3 -m http.server 8800 --directory homepage
```

Then open http://localhost:8800/.

## Fonts

The page uses ABC Favorit Pro (Light 300 for text above 16px, Book 400 for text at 16px and below; Medium 500 is loaded but parked) and ABC Favorit Mono (Book; Light is loaded but unused).
The font files are licensed and are not committed. Put these files into `homepage/assets/fonts/`:

- `ABCFavoritPro-Light.woff2`, `ABCFavoritPro-Book.woff2`, `ABCFavoritPro-Medium.woff2`
- `ABCFavoritMono-Light-Trial.woff2`, `ABCFavoritMono-Book-Trial.woff2`

Favorit Mono is a trial cut in this reference; production needs the licensed files.

## Versions

| Version | Date | Where |
|---|---|---|
| Demo shown to the client | 24.11.2026, 13:07 | tag `homepage-demo-2026-11-24` |
| Clean copy after the meeting fixes | 24.11.2026, evening | `main` |
| v3 (this round) | from 25.11.2026 | `homepage-v3` |
