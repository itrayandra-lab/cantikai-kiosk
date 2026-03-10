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
info() { echo -e "${BLUE}→${NC} $1"; }

echo "🧪 Cantik AI - Local Stack Check (Node)"
echo "======================================="
echo

command -v node >/dev/null 2>&1 && ok "Node.js: $(node --version)" || { err "Node.js not found"; exit 1; }
command -v npm >/dev/null 2>&1 && ok "npm: v$(npm --version)" || { err "npm not found"; exit 1; }
command -v curl >/dev/null 2>&1 && ok "curl installed" || { err "curl not found"; exit 1; }

[[ -d "node_modules" ]] && ok "node_modules exists" || warn "node_modules not found (run: npm install)"

echo
info "Checking env files..."
[[ -f "backend/.env" ]] && ok "backend/.env" || warn "backend/.env missing"
[[ -f "platforms/pwa/.env" ]] && ok "platforms/pwa/.env" || warn "platforms/pwa/.env missing"
[[ -f "platforms/kiosk/.env" ]] && ok "platforms/kiosk/.env" || warn "platforms/kiosk/.env missing"
[[ -f "platforms/desktop/.env" ]] && ok "platforms/desktop/.env" || warn "platforms/desktop/.env missing (optional)"
[[ -f "platforms/admin/.env" ]] && ok "platforms/admin/.env" || warn "platforms/admin/.env missing (optional)"

echo
info "Checking database and uploads..."
[[ -f "database/scripts/cantik_ai.db" ]] && ok "SQLite DB found: database/scripts/cantik_ai.db" || warn "SQLite DB missing (run: npm run db:init)"
[[ -d "uploads" ]] && ok "uploads directory exists" || warn "uploads directory missing"

echo
info "Checking running services..."
for PORT in 8000 5173 5174 5175 5176; do
  if curl -fsS "http://localhost:${PORT}" >/dev/null 2>&1; then
    ok "Port ${PORT} is reachable"
  else
    warn "Port ${PORT} is not reachable"
  fi
done

if curl -fsS "http://localhost:8000/health" >/dev/null 2>&1; then
  ok "Backend health endpoint OK"
else
  warn "Backend health endpoint not reachable (start: npm run dev:backend)"
fi

if curl -fsS "http://localhost:8000/api/v2/kiosk/system/health" >/dev/null 2>&1; then
  FLAGS="$(curl -fsS "http://localhost:8000/api/v2/kiosk/system/health" | jq -r '.services | "gemini=\(.gemini_configured) groq=\(.groq_configured) whatsapp=\(.whatsapp_configured)"')"
  ok "Kiosk system health endpoint OK (${FLAGS})"
else
  warn "Kiosk system health endpoint not reachable"
fi

echo
echo "Summary:"
echo "- Core backend + multi-platform structure detected"
echo "- For full production gate run: bash scripts/verify-stack.sh"
