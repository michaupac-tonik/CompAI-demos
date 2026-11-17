#!/usr/bin/env bash
# Start work on a new homepage section in its own branch and worktree.
#
#   web/homepage/tools/new-section.sh 03 proof
#
# Run it from the main checkout with the homepage branch checked out. It creates
#   branch    section-03-proof            (cut from the homepage tip)
#   worktree  ../Comp AI worktrees/section-03-proof   (its own folder: switching branches there never touches other threads)
#   file      web/homepage/sections/03-proof.html     (from sections/_template.html)
#   preview   .claude/launch.json in the worktree with a server on port 8770 + number
# and links the git-ignored fonts into the worktree. Prints how to continue.
set -euo pipefail

N="${1:?section number, e.g. 03}"
NAME="${2:?short name, e.g. proof}"
ROOT="$(git rev-parse --show-toplevel)"
CUR="$(git -C "$ROOT" branch --show-current)"
[ "$CUR" = homepage ] || { echo "Check out the homepage branch first (now: ${CUR:-detached})." >&2; exit 1; }
if ! git -C "$ROOT" diff --quiet HEAD -- web; then
  echo "Warning: uncommitted changes under web/ are not part of the new branch (commit them first if the section needs them)." >&2
fi

BRANCH="section-$N-$NAME"
WT="$(dirname "$ROOT")/Comp AI worktrees/$BRANCH"
TITLE="$(echo "$NAME" | tr '-' ' ')"
PORT=$((8770 + 10#$N))
FILE="web/homepage/sections/$N-$NAME.html"

git -C "$ROOT" worktree add -b "$BRANCH" "$WT" homepage
mkdir -p "$WT/web/hero/comp-ai-hero-v01"
ln -s "$ROOT/web/hero/comp-ai-hero-v01/fonts" "$WT/web/hero/comp-ai-hero-v01/fonts"
sed -e "s/{{NN}}/$N/g" -e "s/{{TITLE}}/$TITLE/g" "$WT/web/homepage/sections/_template.html" > "$WT/$FILE"

mkdir -p "$WT/.claude"
cat > "$WT/.claude/launch.json" <<JSON
{
  "version": "0.0.1",
  "configurations": [
    { "name": "web-section-$N", "runtimeExecutable": "python3",
      "runtimeArgs": ["-m", "http.server", "$PORT", "--directory", "web"], "port": $PORT }
  ]
}
JSON

cat <<MSG

Section $N ready.
  branch    $BRANCH
  worktree  $WT
  file      $FILE
  preview   server "web-section-$N" (port $PORT) -> http://localhost:$PORT/homepage/sections/$N-$NAME.html

Open a new thread in the worktree folder and work only on $FILE.
When the section is accepted: commit it on $BRANCH, then in the main checkout (homepage branch):
  git merge --no-ff $BRANCH
  python3 web/homepage/tools/integrate-section.py $FILE
MSG
