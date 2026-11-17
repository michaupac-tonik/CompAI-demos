#!/usr/bin/env python3
"""Integrate a finished section into web/homepage/index.html.

    python3 web/homepage/tools/integrate-section.py web/homepage/sections/02-the-shift.html
    python3 web/homepage/tools/integrate-section.py web/homepage/sections/02-the-shift.html --check

A section file carries up to three marked blocks (NN is the section number):

    /* @section:NN css:start */   ...   /* @section:NN css:end */
    <!-- @section:NN html:start -->  ...  <!-- @section:NN html:end -->
    <!-- @section:NN js:start -->    ...  <!-- @section:NN js:end -->

Everything outside the markers (head, fonts, dev bar, the mist copy used for previewing) stays in the section
file and is never integrated. For each block the script replaces the same block in index.html, or, when the
section is new, appends it (css before </style>, html before </main>, js before </body>).
Asset paths are rewritten from the sections/ folder to the homepage folder (../../hero/ -> ../hero/).

--check changes nothing: it reports whether index.html already matches the section file.
"""
import re
import sys
from pathlib import Path

HOME = Path(__file__).resolve().parent.parent
INDEX = HOME / 'index.html'

KINDS = {
    'css': ('/* @section:{n} css:start */', '/* @section:{n} css:end */'),
    'html': ('<!-- @section:{n} html:start -->', '<!-- @section:{n} html:end -->'),
    'js': ('<!-- @section:{n} js:start -->', '<!-- @section:{n} js:end -->'),
}
ANCHOR = {'css': '</style>', 'html': '</main>', 'js': '</body>'}


def block(text, kind, n):
    start, end = (m.format(n=n) for m in KINDS[kind])
    a = text.find(start)
    if a < 0:
        return None
    b = text.find(end, a)
    if b < 0:
        sys.exit(f'{kind}: found "{start}" but not its end marker')
    return a, b + len(end)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    check = '--check' in sys.argv
    if len(args) != 1:
        sys.exit(__doc__)
    sec_path = Path(args[0]).resolve()
    sec = sec_path.read_text(encoding='utf-8')
    found = set(re.findall(r'@section:(\d+)', sec))
    if len(found) != 1:
        sys.exit(f'expected markers of exactly one section in {sec_path.name}, found {sorted(found) or "none"}')
    n = found.pop()
    idx = INDEX.read_text(encoding='utf-8')
    report = []
    for kind in ('css', 'html', 'js'):
        rng = block(sec, kind, n)
        if not rng:
            report.append(f'{kind}: no block in the section file, skipped')
            continue
        new = sec[rng[0]:rng[1]].replace('../../hero/', '../hero/')
        if '.dev' in new and kind != 'css':
            sys.exit(f'{kind}: the block mentions the dev bar; keep dev code outside the markers')
        cur = block(idx, kind, n)
        if cur:
            same = idx[cur[0]:cur[1]] == new
            report.append(f'{kind}: {"already up to date" if same else "differs from index.html" + ("" if check else " -> replaced")}')
            if not check:
                idx = idx[:cur[0]] + new + idx[cur[1]:]
        else:
            report.append(f'{kind}: new in index.html' + ('' if check else ' -> appended'))
            if not check:
                at = idx.rindex(ANCHOR[kind])
                idx = idx[:at] + ('  ' if kind == 'css' else '') + new + '\n' + idx[at:]
    if not check:
        INDEX.write_text(idx, encoding='utf-8')
    print(f'section {n} ({sec_path.name}) -> {INDEX.relative_to(HOME.parent.parent)}' + (' [check only]' if check else ''))
    print('\n'.join('  ' + r for r in report))


main()
