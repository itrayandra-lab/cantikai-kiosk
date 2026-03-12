# 📊 Panduan Setup DBeaver untuk MySQL

## Step 1: Download & Install DBeaver

### Windows
1. Buka https://dbeaver.io/download/
2. Download **DBeaver Community Edition** (Windows Installer)
3. Jalankan installer dan ikuti langkah-langkahnya
4. Pilih **Community Edition** saat diminta

### Mac
1. Download **DBeaver Community Edition** (macOS)
2. Buka file `.dmg`
3. Drag DBeaver ke folder Applications

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install dbeaver-ce
```

---

## Step 2: Buat Koneksi MySQL

### A. Buka DBeaver
- Jalankan aplikasi DBeaver

### B. Buat Koneksi Baru
1. Di menu atas, klik **Database** → **New Database Connection**
   
   Atau:
   - Klik icon **+** di panel "Database Connections" (kiri bawah)

2. Pilih **MySQL** dari daftar database
   
   ![Pilih MySQL](https://imgur.com/xxx.png)

3. Klik **Next**

### C. Isi Konfigurasi Koneksi

**Tab: Main**
- **Server Host**: `127.0.0.1` atau `localhost`
- **Port**: `3306`
- **Database**: (kosongkan, atau isi `skin_analyzer` jika sudah ada)
- **Username**: `root`
- **Password**: (sesuai setup MySQL Anda)
  - Jika MySQL baru diinstall, biasanya kosong
  - Jika pakai Docker dengan password `root`, isi `root`
- **Save password locally**: ✓ (centang untuk kemudahan)

**Tab: Driver Properties** (opsional)
- Biarkan default

### D. Test Koneksi
1. Klik tombol **Test Connection**
2. Tunggu sampai muncul pesan:
   ```
   ✓ Connected
   ```
3. Jika error, cek:
   - MySQL server sudah running?
   - Username & password benar?
   - Port 3306 tidak terblokir?

### E. Selesaikan Setup
1. Klik **Finish**
2. Koneksi MySQL akan muncul di panel kiri

---

## Step 3: Import Database SQL

### Cara 1: Menggunakan SQL Editor (Recommended)

1. **Buka SQL Editor**
   - Klik kanan koneksi MySQL → **SQL Editor** → **New SQL Script**
   - Atau: Klik **File** → **New** → **SQL Script**

2. **Buka File SQL**
   - Klik **File** → **Open File**
   - Pilih: `database/skin_analyzer.sql`
   - File akan terbuka di editor

3. **Execute Script**
   - Klik tombol **Execute** (icon play ▶)
   - Atau tekan: **Ctrl + Enter** (Windows/Linux) atau **Cmd + Enter** (Mac)
   - Tunggu sampai selesai

4. **Verifikasi**
   - Di panel kiri, expand koneksi MySQL
   - Cari folder **Databases**
   - Seharusnya ada database `skin_analyzer`

### Cara 2: Menggunakan Tools → Execute Script

1. Klik kanan koneksi MySQL
2. Pilih **Tools** → **Execute Script**
3. Pilih file: `database/skin_analyzer.sql`
4. Klik **Execute**
5. Tunggu sampai selesai

---

## Step 4: Verifikasi Database

### Cek Database Sudah Dibuat
1. Di panel kiri, expand koneksi MySQL
2. Expand folder **Databases**
3. Seharusnya ada: `skin_analyzer`

### Cek Tabel-Tabel
1. Expand database `skin_analyzer`
2. Expand folder **Tables**
3. Seharusnya ada tabel-tabel ini:
   - `admins` - Data admin
   - `users` - Data user
   - `analyses` - Hasil analisis kulit
   - `products` - Data produk skincare
   - `articles` - Artikel skincare
   - `banners` - Banner di homepage
   - `chat_sessions` - Sesi chat
   - `chat_messages` - Pesan chat
   - `kiosk_sessions` - Sesi kiosk
   - `kiosk_analyses` - Hasil analisis kiosk
   - `app_settings` - Pengaturan aplikasi

### Lihat Data di Tabel
1. Klik kanan tabel (misal: `users`)
2. Pilih **View Data** atau **Select Rows**
3. Data akan ditampilkan di panel bawah

---

## Step 5: Konfigurasi Backend

Setelah database siap, update file `backend/.env`:

```env
# Database MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=skin_analyzer
```

Sesuaikan dengan konfigurasi koneksi DBeaver Anda.

---

## Troubleshooting

### Error: "Connection refused"
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solusi:**
- Pastikan MySQL server sudah running
- Cek port 3306 tidak terblokir firewall
- Coba gunakan `127.0.0.1` atau `localhost`

### Error: "Access denied for user 'root'"
```
Error: Access denied for user 'root'@'localhost'
```
**Solusi:**
- Cek username & password benar
- Jika MySQL baru, password mungkin kosong
- Reset password MySQL jika lupa

### Error: "Unknown database 'skin_analyzer'"
```
Error: Unknown database 'skin_analyzer'
```
**Solusi:**
- Database belum diimport
- Jalankan SQL script `database/skin_analyzer.sql`
- Verifikasi di DBeaver bahwa database sudah ada

### DBeaver Lambat/Hang
**Solusi:**
- Tutup tab yang tidak dipakai
- Restart DBeaver
- Cek koneksi MySQL stabil

---

## Tips & Tricks

### 1. Shortcut Penting
- **Execute SQL**: Ctrl + Enter (Windows/Linux) atau Cmd + Enter (Mac)
- **Format SQL**: Ctrl + Shift + F
- **Find**: Ctrl + F
- **New SQL Script**: Ctrl + Alt + N

### 2. Export Data
1. Klik kanan tabel → **Export Data**
2. Pilih format: CSV, JSON, SQL, Excel, dll
3. Klik **Export**

### 3. Backup Database
1. Klik kanan database `skin_analyzer`
2. Pilih **Tools** → **Backup**
3. Pilih lokasi penyimpanan
4. Klik **Backup**

### 4. Query Favorit
1. Buat SQL script yang sering dipakai
2. Klik **Bookmark** (icon bintang)
3. Akan tersimpan di panel **Bookmarks**

---

## Referensi

- DBeaver Docs: https://dbeaver.com/docs/
- MySQL Docs: https://dev.mysql.com/doc/
- Database File: `database/skin_analyzer.sql`

