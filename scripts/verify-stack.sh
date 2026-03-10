#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ok() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; }
step() { echo -e "${BLUE}==>${NC} $1"; }

BACKEND_STARTED=0
BACKEND_PID=""

cleanup() {
  if [[ "$BACKEND_STARTED" == "1" && -n "$BACKEND_PID" ]]; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

step "Preflight tools"
command -v node >/dev/null 2>&1 || { err "node not found"; exit 1; }
command -v npm >/dev/null 2>&1 || { err "npm not found"; exit 1; }
command -v curl >/dev/null 2>&1 || { err "curl not found"; exit 1; }
command -v jq >/dev/null 2>&1 || { err "jq not found"; exit 1; }
ok "Tools ready (node, npm, curl, jq)"

step "Config files"
[[ -f "backend/.env.example" ]] || { err "backend/.env.example missing"; exit 1; }
[[ -f "platforms/pwa/.env.example" ]] || { err "platforms/pwa/.env.example missing"; exit 1; }
[[ -f "platforms/kiosk/.env.example" ]] || { err "platforms/kiosk/.env.example missing"; exit 1; }
[[ -f "platforms/desktop/.env.example" ]] || warn "platforms/desktop/.env.example missing (optional)"
[[ -f "platforms/admin/.env.example" ]] || warn "platforms/admin/.env.example missing (optional)"
ok "Env examples checked"

if [[ -f "backend/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source backend/.env
  set +a
  ok "Loaded backend/.env"
else
  warn "backend/.env not found (runtime checks may fail)"
fi

step "Backend availability"
if curl -fsS "http://localhost:8000/health" >/dev/null 2>&1; then
  ok "Backend already running"
else
  warn "Backend not running, starting temporary backend process..."
  node backend/src/index.js >/tmp/cantik-backend-verify.log 2>&1 &
  BACKEND_PID=$!
  BACKEND_STARTED=1
  for _ in $(seq 1 40); do
    if curl -fsS "http://localhost:8000/health" >/dev/null 2>&1; then
      ok "Temporary backend started"
      break
    fi
    sleep 0.5
  done
  curl -fsS "http://localhost:8000/health" >/dev/null 2>&1 || {
    err "Backend failed to start. See /tmp/cantik-backend-verify.log"
    exit 1
  }
fi

step "Backend smoke endpoints"
HEALTH_JSON="$(curl -fsS "http://localhost:8000/health")"
echo "$HEALTH_JSON" | jq -e '.status == "healthy"' >/dev/null || { err "/health is not healthy"; exit 1; }
ok "/health"

PUBLIC_SETTINGS_JSON="$(curl -fsS "http://localhost:8000/api/v2/settings/public")"
echo "$PUBLIC_SETTINGS_JSON" | jq -e '.settings and .map' >/dev/null || { err "/api/v2/settings/public invalid response"; exit 1; }
ok "/api/v2/settings/public"

KIOSK_HEALTH_JSON="$(curl -fsS "http://localhost:8000/api/v2/kiosk/system/health")"
echo "$KIOSK_HEALTH_JSON" | jq -e '.success == true and .checks.backend_ok == true and .checks.database_ok == true and .checks.kiosk_tables_ok == true and .checks.uploads_writable == true' >/dev/null || {
  err "Kiosk system health checks failed"
  echo "$KIOSK_HEALTH_JSON" | jq '.'
  exit 1
}
ok "/api/v2/kiosk/system/health"

GEMINI_CONFIGURED="$(echo "$KIOSK_HEALTH_JSON" | jq -r '.services.gemini_configured')"
GROQ_CONFIGURED="$(echo "$KIOSK_HEALTH_JSON" | jq -r '.services.groq_configured')"
if [[ "$GEMINI_CONFIGURED" != "true" ]]; then
  err "GEMINI_API_KEY not configured. AI analysis is not production-ready."
  exit 1
fi
if [[ "$GROQ_CONFIGURED" != "true" ]]; then
  warn "GROQ_API_KEY not configured (optional fallback reduced)"
else
  ok "AI providers configured (Gemini + Groq)"
fi

step "Auth smoke flow (register/login/me)"
EMAIL="smoke.$(date +%s)@cantik.ai"
PASSWORD="SmokeTest!123"
REGISTER_STATUS="$(curl -s -o /tmp/cantik-register.json -w "%{http_code}" \
  -X POST "http://localhost:8000/api/v2/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\",\"name\":\"Smoke Verify\"}")"
if [[ "$REGISTER_STATUS" != "200" ]]; then
  err "Register failed (HTTP ${REGISTER_STATUS})"
  cat /tmp/cantik-register.json
  exit 1
fi
ok "Register endpoint"

LOGIN_STATUS="$(curl -s -o /tmp/cantik-login.json -w "%{http_code}" \
  -X POST "http://localhost:8000/api/v2/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")"
if [[ "$LOGIN_STATUS" != "200" ]]; then
  err "Login failed (HTTP ${LOGIN_STATUS})"
  cat /tmp/cantik-login.json
  exit 1
fi
TOKEN="$(jq -r '.token // empty' /tmp/cantik-login.json)"
[[ -n "$TOKEN" ]] || { err "Login token missing"; cat /tmp/cantik-login.json; exit 1; }
ok "Login endpoint"

ME_STATUS="$(curl -s -o /tmp/cantik-me.json -w "%{http_code}" \
  "http://localhost:8000/api/v2/auth/me" \
  -H "Authorization: Bearer ${TOKEN}")"
if [[ "$ME_STATUS" != "200" ]]; then
  err "Auth me failed (HTTP ${ME_STATUS})"
  cat /tmp/cantik-me.json
  exit 1
fi
ok "Auth me endpoint"

step "Kiosk session smoke flow (start/close)"
START_STATUS="$(curl -s -o /tmp/cantik-kiosk-start.json -w "%{http_code}" \
  -X POST "http://localhost:8000/api/v2/kiosk/sessions/start" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke Session","gender":"other","whatsapp":"","device_id":"verify-script"}')"
if [[ "$START_STATUS" != "200" ]]; then
  err "Kiosk start failed (HTTP ${START_STATUS})"
  cat /tmp/cantik-kiosk-start.json
  exit 1
fi
SESSION_UUID="$(jq -r '.session.session_uuid // empty' /tmp/cantik-kiosk-start.json)"
[[ -n "$SESSION_UUID" ]] || { err "Session UUID missing in kiosk start"; cat /tmp/cantik-kiosk-start.json; exit 1; }
ok "Kiosk session start"

CLOSE_STATUS="$(curl -s -o /tmp/cantik-kiosk-close.json -w "%{http_code}" \
  -X POST "http://localhost:8000/api/v2/kiosk/sessions/${SESSION_UUID}/close" \
  -H "Content-Type: application/json")"
if [[ "$CLOSE_STATUS" != "200" ]]; then
  err "Kiosk close failed (HTTP ${CLOSE_STATUS})"
  cat /tmp/cantik-kiosk-close.json
  exit 1
fi
ok "Kiosk session close"

step "Frontend builds"
npm run build:all >/tmp/cantik-build-all.log 2>&1 || {
  err "Build failed. See /tmp/cantik-build-all.log"
  tail -n 80 /tmp/cantik-build-all.log
  exit 1
}
ok "All frontend builds passed (pwa/admin/kiosk/desktop)"

echo
echo "=================================================="
echo "✅ Production readiness verification passed"
echo
echo "Verified:"
echo "- Backend health + core endpoints"
echo "- AI provider configuration visibility"
echo "- Auth register/login/me flow"
echo "- Kiosk session start/close flow"
echo "- Frontend build for all platforms"
