# Scripts Reference (Node Monorepo)

Folder ini berisi script operasional untuk verifikasi lokal, integrasi AI, dan deploy.

## Script utama

### 1) `verify-stack.sh` (recommended)
Gate verifikasi production readiness end-to-end:
- cek tools (`node`, `npm`, `curl`, `jq`)
- cek env examples
- cek backend health + endpoint penting
- cek indikator konfigurasi AI (Gemini/Groq)
- smoke test auth (`register/login/me`)
- smoke test kiosk (`start/close session`)
- build semua frontend (`pwa/admin/kiosk/desktop`)

Jalankan:
```bash
bash scripts/verify-stack.sh
# atau
npm run verify:all
```

### 2) `test-local-no-python.sh`
Quick check ringan untuk environment lokal saat development:
- dependency dasar
- file env
- DB + uploads
- status port runtime (`8000/5173/5174/5175/5176`)
- kiosk system health

Jalankan:
```bash
bash scripts/test-local-no-python.sh
```

### 3) `test-ai-integration.sh`
Cek konektivitas provider AI tanpa hardcoded key.
Script akan membaca key dari `backend/.env`:
- `GEMINI_API_KEY` (required)
- `GROQ_API_KEY` (optional)

Jalankan:
```bash
bash scripts/test-ai-integration.sh
```

## Catatan penting production

- Jangan jalankan `npm run db:init` atau `npm run db:reset` pada environment production aktif.
- Pastikan `uploads/` dan `database/scripts/cantik_ai.db` berada di storage persisten.
- Untuk admin hardening disarankan:
  - `ADMIN_REQUIRE_BEARER=true`
  - `ADMIN_REQUIRE_CSRF=true`
  - `ADMIN_ENFORCE_ORIGIN=true`
