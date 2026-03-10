# 🚀 Cantik AI - Start Here

## 1) Install + Run

```bash
npm install
npm start
```

Default (`npm start`):
- Backend: http://localhost:8000
- PWA: http://localhost:5173
- Admin embedded: http://localhost:5173/admin

## 2) Run Other Platforms

```bash
npm run dev:kiosk    # http://localhost:5175
npm run dev:desktop  # http://localhost:5176
npm run dev:admin    # http://localhost:5174/admin
npm run dev:all      # backend + pwa + kiosk + desktop
npm run dev:fresh    # clean ports dulu, lalu jalankan dev:all
npm run verify:all   # gate verifikasi production readiness
```

## 3) Admin Login

- URL: `http://localhost:5173/admin` atau `http://localhost:5174/admin`
- Username: `admin`
- Password: `admin123`

## 4) Database

- Path aktif: `database/scripts/cantik_ai.db`
- Init schema: `npm run db:init`
- Seed sample (non-destructive): `npm run db:seed`

## 5) Kiosk (Public Touchscreen)

Flow:
1. Onboarding
2. Guide scan (`/guide`)
3. System check operator (`/system`)
4. Data diri sederhana
5. Scan kamera + auto-capture
6. Hasil + QR + PDF link
7. Close -> auto reset onboarding

Kiosk subpages:
- `/onboard`
- `/guide`
- `/system`
- `/identity`
- `/scan`
- `/processing`
- `/analysis`

## 6) Required Config

`backend/.env`
```bash
JWT_SECRET=your-strong-secret
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GEMINI_API_KEY=your_gemini_key
KIOSK_PUBLIC_BASE_URL=http://localhost:8000
```

`platforms/pwa/.env`
```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

`platforms/kiosk/.env` (optional)
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

`platforms/admin/.env` (optional)
```bash
VITE_API_URL=http://localhost:8000
```

## 7) Production Gate (wajib sebelum deploy)

```bash
npm run verify:all
```

Script ini memverifikasi:
- backend health + endpoint penting
- auth flow register/login/me
- kiosk session start/close
- indikator AI config (Gemini/Groq)
- build seluruh frontend (pwa/admin/kiosk/desktop)
