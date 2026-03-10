# ⚡ Quick Start - Cantik AI Monorepo

## Run Core (stable)

```bash
npm install
npm start
```

- Backend: http://localhost:8000
- PWA: http://localhost:5173
- Admin embedded: http://localhost:5173/admin

## Run All Platforms

```bash
npm run dev:all
npm run dev:admin
# clean old dev processes/ports first (recommended when ports are occupied)
npm run dev:fresh
```

- PWA: http://localhost:5173
- Admin standalone: http://localhost:5174/admin
- Kiosk: http://localhost:5175
- Desktop Web: http://localhost:5176

## Database

```bash
npm run db:init
npm run db:seed
```

- Active DB: `database/scripts/cantik_ai.db`
- Seed behavior: insert missing only, existing data preserved.

## Kiosk Endpoints

- `POST /api/v2/kiosk/sessions/start`
- `POST /api/v2/kiosk/sessions/:sessionUuid/analyze`
- `POST /api/v2/kiosk/sessions/:sessionUuid/close`
- `GET /kiosk/result/:token`
- `GET /api/v2/kiosk/result/:token`
- `GET /api/v2/kiosk/result/:token/pdf`

## Important Env

`backend/.env`
```bash
DATABASE_PATH=../database/scripts/cantik_ai.db
GEMINI_API_KEY=...
JWT_SECRET=...
GOOGLE_CLIENT_ID=...
KIOSK_PUBLIC_BASE_URL=http://localhost:8000
KIOSK_RESULT_TOKEN_EXPIRES_DAYS=30
WHATSAPP_WEBHOOK_URL=
WHATSAPP_WEBHOOK_SECRET=
```

`platforms/pwa/.env`
```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=...
```

`platforms/kiosk/.env` (optional)
```bash
VITE_API_URL=http://localhost:8000
VITE_KIOSK_DEVICE_ID=kiosk-001
VITE_KIOSK_IDLE_TIMEOUT_SECONDS=180
VITE_KIOSK_AUTO_RESET_SECONDS=90
```

## Troubleshooting

1. Admin kosong: hard refresh (`Ctrl+Shift+R`).
2. Cek backend health: `curl http://localhost:8000/health`.
3. Jika port bentrok: jalankan `npm run dev:stop` lalu `npm run dev:all`.
4. Jika CORS fail, pastikan origin local:
- `5173` (PWA)
- `5174` (Admin standalone)
- `5175` (Kiosk)
- `5176` (Desktop)
