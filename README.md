# Cantik AI - Skin Analysis System

Sistem analisis kulit berbasis AI dengan teknologi computer vision dan machine learning untuk memberikan analisis kulit yang akurat dan rekomendasi perawatan yang personal.

## 🚀 Fitur Utama

- **Analisis Kulit Real-time** - Deteksi wajah dengan MediaPipe dan analisis AI
- **Multi-Platform** - PWA, Kiosk, Desktop, dan Admin Dashboard
- **AI Analysis** - Gemini Vision + Groq untuk analisis komprehensif
- **15 Mode Analisis** - Pori, pigmentasi, kerutan, jerawat, dan lainnya
- **Database MySQL** - Penyimpanan data yang robust dan scalable
- **Token System** - Sistem kredit untuk kontrol penggunaan

## 🏗️ Arsitektur Sistem

```
cantik-ai/
├── backend/                 # API Server (Node.js + Express + MySQL)
├── platforms/
│   ├── pwa/                # Progressive Web App (React + Vite)
│   ├── kiosk/              # Kiosk Interface (Touchscreen)
│   ├── desktop/            # Desktop Web Experience
│   └── admin/              # Admin Dashboard
└── docs/                   # Dokumentasi lengkap
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL Database
- Gemini AI Vision API
- Groq AI Text API
- JWT Authentication

**Frontend:**
- React 18 + Vite
- MediaPipe Face Detection
- Progressive Web App (PWA)
- Responsive Design

## ⚡ Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd cantik-ai
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan konfigurasi database dan API keys
npm run init-db
npm run dev
```

### 3. Setup PWA
```bash
cd platforms/pwa
npm install
cp .env.example .env
# Edit .env dengan API endpoints
npm run dev
```

### 4. Akses Aplikasi
- **PWA**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin**: http://localhost:5173/admin (admin/admin123)

## 🔧 Konfigurasi Environment

### Backend (.env)
```bash
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cantik_ai

# AI APIs
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key

# JWT
JWT_SECRET=your_jwt_secret

# Server
PORT=8000
NODE_ENV=development
```

### PWA (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your_gemini_key
VITE_GROQ_API_KEY=your_groq_key
```

## 📱 Platform URLs

| Platform | URL | Deskripsi |
|----------|-----|-----------|
| PWA | http://localhost:5173 | Aplikasi mobile/web utama |
| Admin | http://localhost:5173/admin | Dashboard admin (embedded) |
| Kiosk | http://localhost:5175 | Interface kiosk touchscreen |
| Desktop | http://localhost:5176 | Website desktop |
| Backend API | http://localhost:8000 | REST API server |

## 🎯 Cara Penggunaan

### Untuk User (PWA)
1. Buka http://localhost:5173
2. Register/Login atau gunakan mode Guest
3. Pilih "Mulai Analisis"
4. Ikuti panduan positioning wajah
5. Ambil foto atau upload gambar
6. Tunggu hasil analisis AI
7. Lihat rekomendasi perawatan

### Untuk Admin
1. Buka http://localhost:5173/admin
2. Login: admin/admin123
3. Kelola users, analisis, produk, artikel
4. Monitor sistem dan database

### Untuk Kiosk
1. Buka http://localhost:5175
2. Interface touchscreen untuk public use
3. Alur mandiri tanpa login
4. Generate QR code untuk hasil

## 🔍 API Endpoints

### Authentication
- `POST /api/v2/auth/register` - Registrasi user
- `POST /api/v2/auth/login` - Login user
- `POST /api/v2/auth/guest` - Guest session

### Analysis
- `POST /api/v2/analysis/analyze` - Analisis kulit
- `GET /api/v2/analysis/history` - Riwayat analisis
- `GET /api/v2/analysis/:id` - Detail analisis

### Users
- `GET /api/v2/users/profile` - Profile user
- `PUT /api/v2/users/profile` - Update profile

## 🧪 Testing

### Test Backend
```bash
cd backend
npm test
```

### Test PWA
```bash
cd platforms/pwa
npm run test
```

### Test All Platforms
```bash
npm run test:all
```

## 📦 Build & Deploy

### Build PWA
```bash
cd platforms/pwa
npm run build
```

### Build All Platforms
```bash
npm run build:all
```

### Deploy ke Production
```bash
# Build semua platform
npm run build:all

# Verify sebelum deploy
npm run verify:all

# Deploy backend
cd backend
npm start

# Serve PWA (contoh dengan nginx/apache)
# Copy dist/ ke web server
```

## 🔧 Development Scripts

```bash
# Backend
npm run dev:backend          # Jalankan backend dev server
npm run init-db             # Initialize database
npm run seed-db             # Seed sample data

# PWA
npm run dev:pwa             # Jalankan PWA dev server
npm run build:pwa           # Build PWA untuk production

# All Platforms
npm run dev:all             # Jalankan semua platform
npm run build:all           # Build semua platform
npm run verify:all          # Verify semua sistem
```

## 🐛 Troubleshooting

### Camera Issues
- Pastikan HTTPS atau localhost untuk camera access
- Check browser permissions untuk camera
- Gunakan Chrome/Safari untuk compatibility terbaik

### MediaPipe Loading
- Check internet connection untuk CDN
- Fallback ke basic camera jika MediaPipe gagal
- Clear browser cache jika ada masalah loading

### Database Connection
- Pastikan MySQL service running
- Check credentials di .env
- Jalankan `npm run init-db` untuk setup awal

### API Keys
- Dapatkan Gemini API key dari Google AI Studio
- Dapatkan Groq API key dari Groq Console
- Pastikan keys valid dan tidak expired

## 📚 Dokumentasi Lengkap

Lihat folder `docs/` untuk dokumentasi detail:
- `docs/01-project-overview/` - Overview proyek
- `docs/02-documentation/` - Dokumentasi teknis
- `docs/03-deployment/` - Panduan deployment
- `docs/04-guides/` - Panduan penggunaan

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - lihat file LICENSE untuk detail.

## 🆘 Support

Untuk bantuan dan support:
- Buka issue di GitHub
- Check dokumentasi di folder `docs/`
- Review troubleshooting guide di atas
