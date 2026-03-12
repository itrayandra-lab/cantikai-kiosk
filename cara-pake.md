# 🚀 Cara Pakai Cantik AI Skin Analyzer

## 1. Setup Database MySQL

### Install MySQL (Jika belum ada)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install mysql-server

# Atau gunakan Docker
docker run --name mysql-cantik -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.0
```

### Setup DBeaver

#### 1. Download & Install DBeaver
- Download dari: https://dbeaver.io/download/
- Pilih Community Edition (gratis)
- Install sesuai OS Anda

#### 2. Buat Koneksi MySQL
1. Buka DBeaver
2. Klik **Database** → **New Database Connection**
3. Pilih **MySQL** → **Next**
4. Isi konfigurasi:
   - **Server Host**: `127.0.0.1` atau `localhost`
   - **Port**: `3306`
   - **Database**: (kosongkan dulu)
   - **Username**: `root`
   - **Password**: (sesuai setup MySQL Anda, atau kosong jika default)
5. Klik **Test Connection** untuk verifikasi
6. Klik **Finish**

#### 3. Import Database
1. Di DBeaver, klik kanan koneksi MySQL → **SQL Editor** → **New SQL Script**
2. Buka file: `database/skin_analyzer.sql`
3. Copy-paste isi file ke SQL Editor
4. Klik **Execute** (atau Ctrl+Enter)
5. Tunggu sampai selesai

**Atau cara lain:**
1. Klik kanan koneksi → **Tools** → **Execute Script**
2. Pilih file `database/skin_analyzer.sql`
3. Klik **Execute**

#### 4. Verifikasi Database
1. Di panel kiri, expand koneksi MySQL
2. Cari database `skin_analyzer`
3. Expand dan lihat tabel-tabel:
   - `users`
   - `analyses`
   - `products`
   - `articles`
   - `banners`
   - `chat_sessions`
   - `chat_messages`
   - `kiosk_sessions`
   - `kiosk_analyses`
   - `admins`
   - `app_settings`

### Konfigurasi Koneksi Backend
- **Host**: `127.0.0.1` atau `localhost`
- **Port**: `3306`
- **User**: `root`
- **Password**: (sesuai setup MySQL Anda)
- **Database**: `skin_analyzer`

---

## 2. Setup Backend

### Install Dependencies
```bash
cd backend
npm install
```

### Konfigurasi Environment
1. Copy `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `backend/.env`:
   ```env
   PORT=8000
   FRONTEND_URL=http://localhost:5173
   
   # Database MySQL
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=skin_analyzer
   
   # JWT & Auth
   JWT_SECRET=your-secret-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   
   # AI Services
   GEMINI_API_KEY=your-gemini-key
   GROQ_API_KEY=your-groq-key
   ```

### Jalankan Backend
```bash
npm run dev
```
✅ Backend berjalan di `http://localhost:8000`

---

## 3. Setup Frontend (PWA)

### Install Dependencies
```bash
cd platforms/pwa
npm install
```

### Konfigurasi Environment
1. Copy `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `platforms/pwa/.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

### Jalankan Frontend
```bash
npm run dev
```
✅ Frontend berjalan di `http://localhost:5173`

---

## 4. Verifikasi Aplikasi

### Test Backend
```bash
curl http://localhost:8000/api/health
```

### Test Frontend
Buka browser: `http://localhost:5173`

### Login Admin
- **Username**: `admin`
- **Password**: `admin123`
- **URL**: `http://localhost:5173/admin`

### Test User
- **Email**: `test1773219775512@example.com`
- **Password**: (sudah terdaftar di database)

---

## 5. Fitur Utama

| Fitur | URL | Deskripsi |
|-------|-----|-----------|
| **Analisis Kulit** | `/analysis` | Scan wajah dengan AI |
| **Chat AI** | `/chat` | Konsultasi skincare |
| **Produk** | `/products` | Rekomendasi produk |
| **Artikel** | `/articles` | Tips skincare |
| **Admin Panel** | `/admin` | Kelola konten |

---

## 6. Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solusi**: Pastikan MySQL service berjalan
```bash
# Linux/Mac
sudo systemctl start mysql

# Atau cek status
mysql -u root -p -e "SELECT 1"
```

### Port 8000 Sudah Dipakai
```bash
# Ganti port di .env
PORT=8001
```

### CORS Error
Pastikan `FRONTEND_URL` di backend `.env` sesuai dengan URL frontend

---

## 7. Docker (Optional)

### Build & Run dengan Docker
```bash
docker-compose up -d
```

Aplikasi akan berjalan di:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- MySQL: `localhost:3306`

---

## 📝 Catatan Penting

- **Database**: Sudah ada sample data (users, products, articles)
- **Admin**: Username `admin` / Password `admin123`
- **API Keys**: Tambahkan Gemini & Groq API keys untuk fitur AI
- **Google OAuth**: Daftarkan aplikasi di Google Cloud Console

---

## 🔗 Referensi

- Backend: `backend/src/index.js`
- Frontend: `platforms/pwa/src/`
- Database: `database/skin_analyzer.sql`
- Docs: `docs/`
- **Panduan DBeaver**: `DBEAVER_SETUP.md` ← Baca ini untuk setup database

