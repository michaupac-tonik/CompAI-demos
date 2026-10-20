# Comp AI — folder structure

Every new file goes into one of these folders. Nothing loose in the root except this README.

| Folder | What goes here | Examples |
|---|---|---|
| `brief/` | Client brief, kickoff prep, checklists, meeting notes, scope, UI/brand brainstorms | `comp-ai-kickoff-prep.html`, `Checklista kickoff Comp AI.html`, `comp-ai-ui-brainstorm.html` |
| `onboarding/` | Onboarding briefs and project-context docs | `onboard_me.html`, `onboard-demo.md` |
| `web/audit/` | Audits of the current site: page audits, findings, screenshots of the live site | `comp-ai-homepage-audit.html` |
| `web/wireframes/dev/` | Lo-fi wireframes for the team and dev (Sanity block notes, field names) | `comp-ai-homepage-wireframe-v04.html` |
| `web/wireframes/client/` | Client-facing versions of the wireframes (no dev notes) | |
| `web/wireframes/hi-fi/` | Hi-fi page designs (HTML, 1440). Current version in the folder, older ones in `hi-fi/_archive/` | `comp-ai-homepage-hifi-v02.html` |
| `web/architecture/` | Site/page structure, section maps, sitemaps, IA | `comp-ai-homepage-structure.html`, `comp-ai-homepage-sections-v0.html` |
| `web/tests/` | HTML prototypes, homepage versions and experiments | `comp-ai-homepage-v0.html` |
| `web/tools/` | Interactive utilities: shader/animation labs, generators, tuners | `comp-ai-hero-beam-lab.html` |
| `web/<sub>/_archive/` | Superseded versions, kept inside the subfolder they belong to | |
| `Loom & Supercuts/` | Loom and Supercut recording scripts for the client | `comp-ai-audit-loom-script.html` |
| `skills/<nazwa>/` | Reusable formulas and prompts for Claude, one subfolder per skill, each with a `read_me.txt` | `skills/comp-ai-section-contract/`, `skills/project-handoff/` |
| `resources/` | Images, screenshots, exports, reference assets (`resources/images/` for image sets) | `1.9.png` |
| `resources/app-screens/` | Screenshots of the Comp AI app (app.trycomp.ai), the source for product screens in hi-fi | `comp-app-setup-01-frameworks.png` |

## Rules
- Naming: `comp-ai-<topic>[-vN].html`, lowercase, hyphens.
- New version of a web file → keep the new one in its `web/` subfolder, move the old one to that subfolder's `_archive/`.
- Temp/scratch files → `resources/` subfolder, never the root.
- Unsure where something goes → `brief/` if it's text about the project, `web/` if it's something you open in a browser (structure → architecture, a utility → tools, everything else → tests), `resources/` if it's an asset.
