# Comp AI · Homepage story & structure

Published copies for confirming the homepage structure with the client:
- `index.html` → `/` · `web/architecture/comp-ai-homepage-sections-v10.html` (story & structure, approved 29.10.2026)
- `wireframe.html` → `/wireframe` · `web/architecture/comp-ai-homepage-story-lofi-v02.html` (lo-fi wireframe, supporting visual)

- Vercel project: root directory `web/architecture/comp-ai-homepage-story`, framework preset *Other*, no build step.
- `vercel.json`: `noindex` on everything, `cleanUrls` (no `.html` in links).
- New version: copy the new `comp-ai-homepage-sections-vN.html` here as `index.html`, commit this folder only, push.
