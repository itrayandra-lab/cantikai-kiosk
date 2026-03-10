# 🚀 Quick Start Guide - Cantik AI

## 1. Jalankan Core

```bash
npm install
npm start
```

Core URL:
- PWA: http://localhost:5173
- Admin embedded: http://localhost:5173/admin
- Backend: http://localhost:8000

## 2. Jalankan Surface Tambahan

```bash
npm run dev:kiosk
npm run dev:desktop
npm run dev:admin
npm run verify:all
```

URL tambahan:
- Kiosk: http://localhost:5175
- Desktop web: http://localhost:5176

## 3. Database

```bash
npm run db:init
npm run db:seed
sqlitebrowser database/scripts/cantik_ai.db
```

Catatan:
- DB aktif: `database/scripts/cantik_ai.db`
- `db:seed` non-destruktif (insert missing only).

## 4. Kiosk Flow

1. Onboarding
2. Input nama/gender/WA (WA opsional)
3. Scan wajah
4. Hasil + QR + PDF link
5. Close -> reset onboarding

## 5. Endpoint Kiosk

- `GET /api/v2/kiosk/system/health`
- `POST /api/v2/kiosk/sessions/start`
- `POST /api/v2/kiosk/sessions/:sessionUuid/analyze`
- `GET /api/v2/kiosk/sessions/:sessionUuid/result`
- `POST /api/v2/kiosk/sessions/:sessionUuid/close`
- `GET /kiosk/result/:token`
- `GET /api/v2/kiosk/result/:token/pdf`

Subpage kiosk:
- `/onboard`
- `/guide`
- `/system`
- `/identity`
- `/scan`
- `/processing`
- `/analysis`

## 6. Config Penting

`backend/.env`
```bash
DATABASE_PATH=../database/scripts/cantik_ai.db
GEMINI_API_KEY=...
GOOGLE_CLIENT_ID=...
JWT_SECRET=...
KIOSK_PUBLIC_BASE_URL=http://localhost:8000
KIOSK_RESULT_TOKEN_EXPIRES_DAYS=30
WHATSAPP_WEBHOOK_URL=
WHATSAPP_WEBHOOK_SECRET=
```

`platforms/pwa/.env`
```bash
VITE_API_URL=http://localhost:8000
VITE_BACKEND_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=...
```

`platforms/kiosk/.env`
```bash
VITE_API_URL=http://localhost:8000
VITE_KIOSK_DEVICE_ID=kiosk-001
VITE_KIOSK_AUTO_CAPTURE_COUNTDOWN=3
VITE_KIOSK_AUTO_CAPTURE_STABILITY_FRAMES=18
VITE_KIOSK_ANALYZE_RETRY_LIMIT=10
VITE_KIOSK_ANALYZE_RETRY_MS=1200
VITE_KIOSK_RESULT_SYNC_RETRY_LIMIT=30
VITE_KIOSK_RESULT_SYNC_RETRY_MS=1200
VITE_KIOSK_MIN_BRIGHTNESS=35
VITE_KIOSK_MAX_BRIGHTNESS=225
VITE_KIOSK_FACE_AREA_MIN=0.1
VITE_KIOSK_FACE_AREA_MAX=0.72
VITE_KIOSK_FORCE_PORTRAIT_LAYOUT=true
```

`platforms/admin/.env`
```bash
VITE_API_URL=http://localhost:8000
```

## 7. Verifikasi Production Readiness

```bash
npm run verify:all
```
