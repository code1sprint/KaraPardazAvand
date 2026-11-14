#!/usr/bin/env bash
# Server-side deploy for Kara Pardaz.
# Workflow: push from local → on server run this script → pull + clean + rebuild.
#
# Usage (on the server, inside the repo):
#   ./deploy.sh
#   ./deploy.sh --no-pull          # clean + rebuild only
#   ./deploy.sh --clean-only       # only remove junk files
#   BRANCH=main ./deploy.sh
#
# From local (optional):
#   ssh root@YOUR_HOST 'cd /opt/karapardaz && ./deploy.sh'

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

NO_PULL=0
CLEAN_ONLY=0

for arg in "$@"; do
  case "$arg" in
    --no-pull) NO_PULL=1 ;;
    --clean-only) CLEAN_ONLY=1 ;;
    -h|--help)
      sed -n '2,14p' "$0"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg" >&2
      exit 1
      ;;
  esac
done

# Tracked / leftover paths that must not stay on the production disk.
# .env and public/uploads are intentionally NOT listed.
CLEAN_PATHS=(
  docs
  reports
  tests
  test-results
  Logo
  node_modules
  .next
  AGENTS.md
  LAUNCH_CHECKLIST.md
  README.md
  code_artifact.html
  playwright.config.ts
  eslint.config.mjs
  'پرامپت سئو و GEO.md'
  'پکیج v2 — همه صفحات.md'
  'کارا پرداز اوند — پکیج پرامپت فاز به فاز.md'
  'کارا پرداز اوند — پیشنمایش نسخه ۳.html'
  'قرارداد طراحی و توسعه.pdf'
)

clean_artifacts() {
  echo "==> Cleaning deploy artifacts"
  rm -rf "${CLEAN_PATHS[@]}"
}

if [[ "$NO_PULL" -eq 0 && "$CLEAN_ONLY" -eq 0 ]]; then
  if [[ ! -d .git ]]; then
    echo "Error: $ROOT is not a git repo. Clone the project here first." >&2
    exit 1
  fi

  BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
  if [[ "$BRANCH" == "HEAD" ]]; then
    BRANCH="${BRANCH_FALLBACK:-main}"
  fi

  echo "==> Fetch + reset to origin/${BRANCH}"
  git fetch --prune origin
  git reset --hard "origin/${BRANCH}"
fi

clean_artifacts

if [[ "$CLEAN_ONLY" -eq 1 ]]; then
  echo "==> Clean-only done."
  exit 0
fi

if [[ ! -f .env ]]; then
  echo "Warning: .env missing in $ROOT — compose may fail without secrets." >&2
fi

echo "==> docker compose up -d --build --force-recreate"
docker compose up -d --build --force-recreate

echo "==> Status"
docker compose ps

echo "==> Done."
