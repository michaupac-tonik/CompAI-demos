# Homepage: how the work is split

One thread owns the whole homepage, and every section is built in its own thread. When a section is accepted,
it comes back to the homepage.

```
web/homepage/
  index.html                 the homepage: hero + all integrated sections (only the homepage thread edits it)
  sections/NN-name.html      one isolated page per section (the section thread edits only its own file)
  sections/_template.html    starting point for a new section
  shared/mist.js             the hero's print after it dissolved, used behind a section when previewing it alone
  tools/new-section.sh       creates a section's branch + worktree + file
  tools/integrate-section.py carries a finished section into index.html
```

## Branches and folders

| Thread | Branch | Folder |
|---|---|---|
| Homepage | `homepage` | the main checkout (`Comp AI`) |
| Section NN | `section-NN-name`, cut from the `homepage` tip | its own worktree: `Comp AI worktrees/section-NN-name` |

Every thread in the main checkout shares one working folder and one checked-out branch, so a branch switch
in one thread changes the files under all the others. A section therefore never works in the main checkout.

Git-ignored files (the licensed fonts in `web/hero/comp-ai-hero-v01/fonts`, `.claude/`) are not in a
worktree: `new-section.sh` links the fonts and writes the preview config.

## Start a section

From the main checkout, on the `homepage` branch, everything committed:

```bash
web/homepage/tools/new-section.sh 03 proof
```

It prints the worktree path and the preview URL. Start the section thread in that folder.

## Rules for a section file

- Only the three marked blocks are carried into `index.html`:
  `/* @section:NN css:start|end */`, `<!-- @section:NN html:start|end -->`, `<!-- @section:NN js:start|end -->`.
  Head, base styles, mist and dev bars live outside the markers and stay in the section file.
- Prefix class names with `.sec-NN` (all sections end up in one stylesheet). Use the variables of the base
  `:root` (`--mint`, `--cyan`, `--ink`, `--white`, `--mono`, `--sans`, `--ease`, `--edge`) and `.wrap`.
- Brand colours: `web/tokens/comp-ai-colours.css` (not wired into the page yet).
- Changes outside the section file (hero, tokens, shared files) go through the homepage thread.

## Bring a finished section back

Section thread: commit on `section-NN-name`. Then in the main checkout, `homepage` branch:

```bash
git merge --no-ff section-NN-name
python3 web/homepage/tools/integrate-section.py web/homepage/sections/NN-name.html
git add web/homepage/index.html && git commit
```

`integrate-section.py` replaces the section's blocks in `index.html` (or appends them for a new section) and
rewrites asset paths. `--check` only reports whether `index.html` already matches the section file.
Mark milestones with a tag, e.g. `git tag -a homepage-progress-YYYY-MM-DD -m "..."`.

## Known gap

`shared/mist.js` is a copy of the hero's print code with the hero already scrolled out (derived from
`index.html`). If the hero shader changes, update it too. Merging both into one file used by the homepage and
the previews is a separate refactor.
