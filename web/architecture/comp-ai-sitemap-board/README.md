# Comp AI · Sitemap board

A board of the new website's pages: scope, status and design stage. Changes are saved to a JSON file in a GitHub repository (through a Vercel function), so everyone with the link sees the same state.

## Files
- `index.html` – the board (all logic and the page list: `GROUPS`, `PAGES`).
- `api/state.js` – Vercel function: reads and writes `sitemap-state.json` in the data repo.
- `vercel.json` – `noindex` on everything.

Opened from disk or localhost (no `/api`), the board saves changes in the browser and shows a **Download state** button (JSON). On Vercel without a working `/api`, editing is disabled and a "Cannot reach storage" message is shown.

## Setup (once)
1. **Data repo**: a separate private repo, e.g. `michaupac-tonik/compai-sitemap-data` (initialised with a README so it has a `main` branch). A separate repo means saves don't trigger builds of other Vercel projects.
2. **Token**: GitHub → Settings → Developer settings → Fine-grained tokens. Repository access: the data repo only. Permissions: *Contents: Read and write*.
3. **Vercel project**: import `michaupac-tonik/CompAI-demos`, Root Directory `web/architecture/comp-ai-sitemap-board`, Framework preset *Other*.
4. **Environment Variables** (Production): `GITHUB_TOKEN`, `GITHUB_REPO` = `michaupac-tonik/compai-sitemap-data`. Optional: `GITHUB_BRANCH` (default `main`), `GITHUB_PATH` (default `sitemap-state.json`).
5. Deploy. The top-right corner of the board should say "Saved · visible to everyone with the link".

## How it works
- Every change = one commit in the data repo (e.g. `sitemap: home: status → review`), so the history lives in GitHub.
- Concurrent saves: the function reads the latest file and retries on conflict (up to 4 times).
- The board refreshes every 20 s and when the tab regains focus.
- Server-side validation: only allowed field values; title ≤ 60 characters (not empty), subtitle ≤ 80.
- Starting values (nothing saved yet): no-scope · to do · no stage selected; per-page exceptions in `init`. Clicking the selected stage again clears it.
- Title and subtitle are edited by clicking the text (Enter saves, Esc cancels). Edited text is stored in the state; `name` and `sub` in `PAGES` are starting values.

## Adding pages
Add an object to `PAGES` in `index.html` (`id`, `group`, `name`, `type`, optional `sub` and `init`). State is keyed by `id`, so never change the `id` of an existing page.
