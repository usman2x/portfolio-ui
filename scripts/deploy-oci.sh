#!/usr/bin/env bash

set -Eeuo pipefail

DEPLOY_ROOT="${PORTFOLIO_DEPLOY_ROOT:-/srv/portfolio}"
CMS_DIR="${PORTFOLIO_CMS_DIR:-${DEPLOY_ROOT}/portfolio-cms}"
UI_DIR="${PORTFOLIO_UI_DIR:-${DEPLOY_ROOT}/portfolio-ui}"
BRANCH="${PORTFOLIO_DEPLOY_BRANCH:-main}"
NODE_VERSION="${PORTFOLIO_NODE_VERSION:-22}"
CMS_SERVICE="${PORTFOLIO_CMS_SERVICE:-portfolio-cms}"
LOCK_FILE="${TMPDIR:-/tmp}/portfolio-deploy-${UID}.lock"
STARTED_AT="$(date +%s)"

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

fail() {
  printf '\nDeployment failed: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command not found: $1"
}

require_repo() {
  local directory="$1"
  local name="$2"

  [[ -d "${directory}/.git" ]] || fail "${name} repository not found at ${directory}"
  [[ -f "${directory}/package-lock.json" ]] || fail "${name} package-lock.json not found"
}

pull_repo() {
  local directory="$1"
  local name="$2"

  log "Updating ${name}"
  git -C "$directory" diff --quiet || fail "${name} has uncommitted tracked changes"
  git -C "$directory" diff --cached --quiet || fail "${name} has staged changes"
  git -C "$directory" fetch origin "$BRANCH"
  git -C "$directory" checkout "$BRANCH"
  git -C "$directory" merge --ff-only "origin/${BRANCH}"
  printf '%s commit: %s\n' "$name" "$(git -C "$directory" rev-parse --short HEAD)"
}

main() {
  local nvm_dir="${NVM_DIR:-${HOME}/.nvm}"
  local elapsed

  require_command git
  require_command curl
  require_command flock
  require_command sudo
  require_repo "$CMS_DIR" "CMS"
  require_repo "$UI_DIR" "UI"

  exec 9>"$LOCK_FILE"
  flock -n 9 || fail "Another portfolio deployment is already running"

  [[ -s "${nvm_dir}/nvm.sh" ]] || fail "NVM was not found at ${nvm_dir}/nvm.sh"
  # shellcheck source=/dev/null
  source "${nvm_dir}/nvm.sh"
  nvm use "$NODE_VERSION" >/dev/null

  log "Preflight checks"
  [[ -f "${CMS_DIR}/.env" ]] || fail "Missing ${CMS_DIR}/.env"
  [[ -f "${UI_DIR}/.env.production" ]] || fail "Missing ${UI_DIR}/.env.production"
  sudo -v
  printf 'Node: %s | npm: %s | branch: %s\n' "$(node --version)" "$(npm --version)" "$BRANCH"

  pull_repo "$CMS_DIR" "CMS"

  log "Installing CMS dependencies"
  npm --prefix "$CMS_DIR" ci

  log "Checking database and running migrations"
  (
    cd "$CMS_DIR"
    set -a
    # shellcheck source=/dev/null
    source .env
    set +a
    npm run db:check
    npm run migrate
    npm run migrate:status
  )

  log "Building CMS"
  (
    cd "$CMS_DIR"
    set -a
    # shellcheck source=/dev/null
    source .env
    set +a
    npm run build
  )

  log "Restarting CMS"
  sudo systemctl restart "$CMS_SERVICE"
  sudo systemctl is-active --quiet "$CMS_SERVICE"
  curl --fail --silent --show-error --head --retry 10 --retry-all-errors \
    --retry-delay 2 http://127.0.0.1:3001/admin >/dev/null

  pull_repo "$UI_DIR" "UI"

  log "Installing UI dependencies"
  npm --prefix "$UI_DIR" ci

  log "Building a clean static UI export"
  (
    cd "$UI_DIR"
    npm run clean
    npm run build
    test -f out/index.html
    test -n "$(find out/_next/static/css -type f -name '*.css' -print -quit)"
  )

  log "Verifying services through Caddy"
  sudo systemctl is-active --quiet caddy
  curl --fail --silent --show-error --head http://127.0.0.1/ >/dev/null
  curl --fail --silent --show-error --head http://127.0.0.1:8080/admin >/dev/null

  elapsed="$(( $(date +%s) - STARTED_AT ))"
  log "Deployment completed successfully in ${elapsed}s"
  printf 'CMS: %s\n' "$(git -C "$CMS_DIR" rev-parse --short HEAD)"
  printf 'UI:  %s\n' "$(git -C "$UI_DIR" rev-parse --short HEAD)"
}

main "$@"
