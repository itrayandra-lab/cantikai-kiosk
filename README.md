# Cantik AI - Skin Analysis System

AI-powered skin analysis monorepo with 4 runtime surfaces:
- `backend` API + database access
- `platforms/pwa` (mobile/PWA + embedded admin)
- `platforms/kiosk` (public vertical touchscreen flow)
- `platforms/desktop` (desktop web experience)

## Quick Start

```bash
npm install
npm start
```

Default `npm start` keeps existing stable flow:
- Backend API: `http://localhost:8000`
- PWA + embedded admin: `http://localhost:5173`

## Platform URLs

| Surface | URL | Notes |
|---|---|---|
| PWA | http://localhost:5173 | User app (mobile/PWA) |
| Admin (embedded) | http://localhost:5173/admin | admin/admin123 |
| Admin (standalone) | http://localhost:5174/admin | admin/admin123 |
| Kiosk | http://localhost:5175 | Public kiosk flow |
| Desktop Web | http://localhost:5176 | Desktop website |
| Backend API | http://localhost:8000 | Core API |

## NPM Scripts

```bash
npm run dev:backend
npm run dev:pwa
npm run dev:admin
npm run dev:kiosk
npm run dev:desktop
npm run dev:all

npm run build:pwa
npm run build:admin
npm run build:kiosk
npm run build:desktop
npm run build:all
npm run verify:all
```

## Database

- Active DB path: `database/scripts/cantik_ai.db`
- Init schema: `npm run db:init`
- Seed sample data (non-destructive): `npm run db:seed`
- Seed inserts missing records only (no overwrite for existing banners/products/articles).

### Kiosk Tables (separate logic, same database)

- `kiosk_sessions`
- `kiosk_analyses`

Kiosk data is isolated from PWA user/account flow. No route mixing.

## Backend Env

See `backend/.env.example`. Key additions for kiosk/production:

```bash
KIOSK_PUBLIC_BASE_URL=http://localhost:8000
KIOSK_RESULT_TOKEN_EXPIRES_DAYS=30
WHATSAPP_WEBHOOK_URL=
WHATSAPP_WEBHOOK_SECRET=
```

## Kiosk Flow (implemented)

1. Onboarding (`Mulai Analisa`)
2. Panduan scan (`/guide`) untuk kualitas capture yang benar
3. System check (`/system`) untuk operator cek backend/db/AI/storage
4. Input data diri sederhana (nama, gender, whatsapp opsional)
5. Scan wajah realtime (FaceMesh + auto capture + quality gate)
6. Backend analyze + store + generate unique result token/QR + PDF link
7. Result page with QR + auto reset to onboarding

Endpoints:
- `GET /api/v2/kiosk/system/health`
- `POST /api/v2/kiosk/sessions/start`
- `POST /api/v2/kiosk/sessions/:sessionUuid/analyze`
- `GET /api/v2/kiosk/sessions/:sessionUuid/result`
- `POST /api/v2/kiosk/sessions/:sessionUuid/close`
- `GET /api/v2/kiosk/result/:token`
- `GET /kiosk/result/:token`
- `GET /api/v2/kiosk/result/:token/pdf`

## Admin Coverage

Admin dashboard now covers:
- Users / Products / Articles / Banners CRUD
- Analyses management
- Chat Sessions management
- Kiosk Sessions management
- Design System / Settings
- Database summary & table viewer

## Notes

- `uploads/` is shared storage for media across all platforms.
- For production deployment, `uploads/` must be on persistent storage/volume.
- `.db-wal` and `.db-shm` are normal SQLite WAL files.
- Jalankan `npm run verify:all` sebelum deploy production untuk gate verifikasi backend + auth + kiosk flow + build semua platform.
- Jangan jalankan `npm run db:init` / `npm run db:reset` pada database production yang sudah berisi data user.
