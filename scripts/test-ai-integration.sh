#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_ok() { echo -e "${GREEN}✓${NC} $1"; }
print_warn() { echo -e "${YELLOW}!${NC} $1"; }
print_err() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}→${NC} $1"; }

echo "🧪 Cantik AI - AI Integration Check (Node Backend)"
echo "=================================================="
echo

if [[ -f "backend/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "backend/.env"
  set +a
  print_ok "Loaded backend/.env"
else
  print_warn "backend/.env not found (using current shell env only)"
fi

if ! command -v curl >/dev/null 2>&1; then
  print_err "curl is required"
  exit 1
fi

print_info "Checking backend health endpoint..."
if curl -fsS "http://localhost:8000/health" >/dev/null; then
  print_ok "Backend reachable at http://localhost:8000/health"
else
  print_err "Backend not reachable. Start backend first: npm run dev:backend"
  exit 1
fi

GEMINI_KEY="${GEMINI_API_KEY:-}"
GROQ_KEY="${GROQ_API_KEY:-}"

if [[ -z "$GEMINI_KEY" ]]; then
  print_err "GEMINI_API_KEY is not configured"
  exit 1
fi

print_info "Testing Gemini API (models endpoint)..."
GEMINI_STATUS="$(curl -s -o /tmp/cantik_gemini_models.json -w "%{http_code}" \
  "https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_KEY}")"
if [[ "$GEMINI_STATUS" == "200" ]]; then
  print_ok "Gemini API key valid"
else
  print_err "Gemini API failed (HTTP ${GEMINI_STATUS})"
  head -c 220 /tmp/cantik_gemini_models.json || true
  echo
  exit 1
fi

if [[ -n "$GROQ_KEY" ]]; then
  print_info "Testing Groq API (models endpoint)..."
  GROQ_STATUS="$(curl -s -o /tmp/cantik_groq_models.json -w "%{http_code}" \
    "https://api.groq.com/openai/v1/models" \
    -H "Authorization: Bearer ${GROQ_KEY}")"
  if [[ "$GROQ_STATUS" == "200" ]]; then
    print_ok "Groq API key valid"
  else
    print_warn "Groq API failed (HTTP ${GROQ_STATUS})"
    head -c 220 /tmp/cantik_groq_models.json || true
    echo
  fi
else
  print_warn "GROQ_API_KEY is empty (optional but recommended)"
fi

print_info "Checking backend-reported AI readiness..."
AI_FLAGS="$(curl -fsS "http://localhost:8000/api/v2/kiosk/system/health" | jq -r '.services | "gemini=\(.gemini_configured) groq=\(.groq_configured)"')"
echo "   ${AI_FLAGS}"

if [[ "$AI_FLAGS" != *"gemini=true"* ]]; then
  print_err "Backend reports Gemini not configured"
  exit 1
fi

print_ok "AI integration checks passed"
echo
echo "Next:"
echo "  1) npm run dev:all"
echo "  2) Test scan flow di PWA (/scan) dan Kiosk (/scan)"
echo "  3) Pantau /api/v2/kiosk/system/health untuk status layanan"
